/**
 * style-profiler.js
 * Manages the user's writing style profile.
 * Extracts fingerprint characteristics from samples and builds
 * the style context string injected into LLM prompts.
 */

import { getStyleProfile, saveStyleProfile, addStyleSample } from '../utils/storage.js';
import logger from '../utils/logger.js';

// ─── Fingerprint Extraction ─────────────────────────────────────────────────

/**
 * Analyze an array of text samples and compute style characteristics.
 */
export function computeFingerprint(samples) {
  if (!samples || samples.length === 0) {
    return {
      avgWordsPerSentence: 15,
      usesEmoji: false,
      formality: 'professional-casual',
      commonPhrases: [],
      signature: null,
    };
  }

  const texts = samples.map(s => (typeof s === 'string' ? s : s.text)).filter(Boolean);

  // Average words per sentence
  let totalWords = 0;
  let totalSentences = 0;
  for (const text of texts) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 2);
    const words = text.split(/\s+/).filter(Boolean);
    totalWords += words.length;
    totalSentences += sentences.length || 1;
  }
  const avgWordsPerSentence = Math.round(totalWords / Math.max(totalSentences, 1));

  // Emoji usage
  const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
  const emojiCount = texts.join(' ').match(emojiRegex)?.length || 0;
  const usesEmoji = emojiCount / texts.length > 0.3;

  // Formality heuristic
  const informalWords = ['hey', 'yeah', 'nope', 'cool', 'awesome', 'totally', 'gonna', 'wanna'];
  const formalWords = ['therefore', 'however', 'furthermore', 'consequently', 'regarding'];
  const allText = texts.join(' ').toLowerCase();
  const informalScore = informalWords.filter(w => allText.includes(w)).length;
  const formalScore = formalWords.filter(w => allText.includes(w)).length;
  let formality = 'professional-casual';
  if (informalScore > formalScore + 2) formality = 'casual';
  if (formalScore > informalScore + 2) formality = 'formal';

  // Common phrases (bigrams that appear more than once)
  const phraseCounts = {};
  for (const text of texts) {
    const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
    }
  }
  const commonPhrases = Object.entries(phraseCounts)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase]) => phrase);

  return {
    avgWordsPerSentence,
    usesEmoji,
    formality,
    commonPhrases,
    signature: null,
  };
}

// ─── Style Context Builder ──────────────────────────────────────────────────

/**
 * Build a human-readable style description string for the prompt.
 * @param {object} profile - The full style profile from storage
 * @returns {string}
 */
export function buildStyleContext(profile) {
  const { samples, fingerprint, manualExamples } = profile;
  const parts = [];

  // Fingerprint description
  parts.push(`Writing style characteristics:`);
  parts.push(`- Average sentence length: ~${fingerprint.avgWordsPerSentence} words`);
  parts.push(`- Emoji usage: ${fingerprint.usesEmoji ? 'occasional emojis' : 'no emojis'}`);
  parts.push(`- Tone: ${fingerprint.formality}`);
  if (fingerprint.commonPhrases?.length > 0) {
    parts.push(`- Common phrases: "${fingerprint.commonPhrases.slice(0, 5).join('", "')}"`);
  }
  if (fingerprint.signature) {
    parts.push(`- Typical sign-off: "${fingerprint.signature}"`);
  }

  // Manual examples (highest priority — user-curated)
  if (manualExamples?.trim()) {
    parts.push(`\nYour writing examples (manually provided):`);
    parts.push(manualExamples.trim());
  }

  // Banned opener prefixes — samples that start with these are poisoned
  // (caused by the old cache bug generating the same opener every time).
  // Exclude them so the LLM doesn't learn to mimic them.
  const BANNED_OPENERS = [
    'thanks for the kind', 'thank you for the kind', 'i appreciate the kind',
    'thanks for sharing', 'i appreciate you sharing', 'great post', 'great insight',
    'absolutely', 'totally agree', 'i completely agree', 'couldn\'t agree more',
    'that\'s a great', 'love this', 'so true', 'well said', 'this is spot on',
  ];
  const isBanned = (text) => {
    const lower = text.slice(0, 60).toLowerCase().trim();
    return BANNED_OPENERS.some(b => lower.startsWith(b));
  };

  // Learned samples — filter banned, deduplicate, show max 3.
  const learnedSamples = samples.filter(s => s.source !== 'manual' && !isBanned(s.text));
  const seenPrefixes = new Set();
  const uniqueSamples = [];
  for (const s of learnedSamples) {
    const prefix = s.text.slice(0, 60).toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seenPrefixes.has(prefix)) {
      seenPrefixes.add(prefix);
      uniqueSamples.push(s);
    }
    if (uniqueSamples.length >= 3) break;
  }

  if (uniqueSamples.length > 0) {
    parts.push(`\nYour recent reply examples (for tone/voice reference only — do NOT copy these openings or repeat them verbatim):`);
    for (const s of uniqueSamples) {
      parts.push(`- "${s.text}"`);
    }
  }

  return parts.join('\n');
}

// ─── Profile Management ─────────────────────────────────────────────────────

/**
 * Add an approved reply as a style sample and recompute the fingerprint.
 */
export async function learnFromApprovedReply({ text, intent }) {
  try {
    const profile = await getStyleProfile();

    // Deduplicate: skip if an existing sample starts with the same 80 chars
    // (catches re-approving the same AI-generated reply multiple times)
    const prefix = text.slice(0, 80).toLowerCase().replace(/\s+/g, ' ').trim();
    const isDuplicate = profile.samples.some(s => {
      const existingPrefix = s.text.slice(0, 80).toLowerCase().replace(/\s+/g, ' ').trim();
      return existingPrefix === prefix;
    });

    if (isDuplicate) {
      logger.log('StyleProfiler: skipping duplicate style sample (same text already stored)');
      return;
    }

    await addStyleSample({ text, intent, source: 'approved' });

    // Recompute fingerprint from all samples
    const updatedProfile = await getStyleProfile();
    updatedProfile.fingerprint = computeFingerprint(updatedProfile.samples);
    await saveStyleProfile(updatedProfile);

    logger.log('StyleProfiler: learned from approved reply, total samples:', updatedProfile.samples.length);
  } catch (e) {
    logger.error('StyleProfiler.learnFromApprovedReply failed:', e);
  }
}

/**
 * Save manual examples from options page and recompute fingerprint.
 */
export async function saveManualExamples(text) {
  const profile = await getStyleProfile();
  profile.manualExamples = text;

  // Parse manual examples as individual lines/paragraphs and add to samples
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 20);
  for (const line of lines) {
    // Only add if not already present
    const exists = profile.samples.some(s => s.text === line && s.source === 'manual');
    if (!exists) {
      profile.samples.unshift({
        id: crypto.randomUUID(),
        text: line,
        intent: 'general',
        timestamp: Date.now(),
        source: 'manual',
      });
    }
  }

  profile.samples = profile.samples.slice(0, profile.maxSamples);
  profile.fingerprint = computeFingerprint(profile.samples);
  await saveStyleProfile(profile);
  logger.log('StyleProfiler: saved manual examples');
}

/**
 * Get a fully hydrated style profile with computed context string.
 */
export async function getProfileWithContext() {
  const profile = await getStyleProfile();
  const styleContext = buildStyleContext(profile);
  return { profile, styleContext };
}
