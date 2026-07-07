/**
 * prompt-builder.js
 * Constructs the system + user prompts for the LLM based on:
 * - User's style profile
 * - Post content
 * - Comment data
 * - Detected intent
 */

import { INTENTS } from '../utils/constants.js';

// ─── Intent-Specific Instructions ──────────────────────────────────────────

const INTENT_INSTRUCTIONS = {
  [INTENTS.QUESTION]:     `Answer the question directly. Be specific. Skip the preamble.`,
  [INTENTS.APPRECIATION]: `Acknowledge briefly, then add one genuine thought. Don't be over-the-top.`,
  [INTENTS.FEEDBACK]:     `Engage with their point — agree, push back, or add nuance. Be direct.`,
  [INTENTS.CRITICISM]:    `Respond calmly. Acknowledge what's valid, clarify if needed. Stay confident.`,
  [INTENTS.TECHNICAL]:    `Give one sharp, specific technical take. Be precise. No fluff.`,
  [INTENTS.NETWORKING]:   `Be warm and brief. One genuine sentence is enough.`,
  [INTENTS.GENERAL]:      `Say something real and direct. One or two sentences max.`,
  [INTENTS.POST_COMMENT]: `Leave a genuine top-level comment on this post. Add a specific insight, ask a sharp question, or share a relevant experience — something that shows you actually read it. Never generic praise.`,
};

// ─── System Prompt ─────────────────────────────────────────────────────────

export function buildSystemPrompt({ userName, styleContext, maxWords = 150 }) {
  // Real LinkedIn replies are short. maxWords is a hard ceiling, not a goal.
  // Target well BELOW the ceiling — aim for 20-60 words for any setting.
  let targetDesc;
  if (maxWords <= 50) {
    targetDesc = `1 sentence, around 10-${maxWords} words`;
  } else if (maxWords <= 100) {
    targetDesc = `1 to 2 sentences, around 20-50 words`;
  } else {
    targetDesc = `1 to 3 sentences, around 20-60 words`;
  }

  return `You are writing a short LinkedIn comment reply on behalf of ${userName || 'the user'}.

${styleContext}

MINDSET: Think of this as a quick, genuine reply — like what you'd type in 20 seconds scrolling LinkedIn on your phone. Not a blog post. Not an analysis. Just a direct, human thought.

RULES:
1. Output ONLY the reply text. Nothing else.
2. Length: ${targetDesc}. Hard ceiling: ${maxWords} words. Shorter is always better. Do NOT pad.
3. NEVER — under any circumstances — start with any of these openers or close variations of them:
   "Thanks for the kind words", "I appreciate the kind words", "Thank you for the kind words",
   "Thanks for sharing", "Thanks for this", "I appreciate you sharing",
   "Great post", "Great insight", "Great question",
   "Absolutely", "Totally", "Exactly", "100%",
   "I completely agree", "I totally agree", "Couldn't agree more",
   "That's a great point", "That's so true", "That's a really good point",
   "Love this", "Love it", "So true", "Well said",
   "This is spot on", "This is so important".
   DO NOT use ANY variation of "kind words", "appreciate the", or "thanks for" as your first words.
   Start directly with your actual thought or opinion.
4. NEVER restate or summarize what the commenter said — they know what they wrote.
5. NEVER add filler sentences. Every sentence must earn its place. If you can cut it without losing meaning, cut it.
6. No Markdown. No asterisks, hashes, bullet points, or backticks. Plain text only.
7. First person ("I", "me", "my"). Sound human and direct.
8. No corporate buzzwords: leverage, synergy, paradigm shift, thought leadership, circle back, deep dive.
9. No sign-off at the end.
10. Match the tone and voice of the style examples — casual or formal, emoji or not.
11. End with a complete sentence and terminal punctuation. Never cut off mid-thought.`;
}

// ─── User Prompt ───────────────────────────────────────────────────────────

export function buildUserPrompt({ postContent, comment, intent }) {
  const intentInstruction = INTENT_INSTRUCTIONS[intent] || INTENT_INSTRUCTIONS[INTENTS.GENERAL];
  const postSnippet = postContent || '(post content unavailable)';
  const commentText = comment.text || '(comment text unavailable)';

  return `POST:
"""
${postSnippet}
"""

COMMENT from ${comment.authorName || 'someone'}:
"""
${commentText}
"""

HOW TO REPLY: ${intentInstruction}

Write the reply now (short, direct, human):`;
}

// ─── Relevance Scoring (engagement queue) ───────────────────────────────────

/**
 * Build messages that ask the LLM to score a batch of feed posts for how worth
 * engaging on they are, given the user's niche topics. Returns strict JSON so
 * the caller can parse it deterministically.
 * @param {string} topics - comma-separated niche topics
 * @param {Array<{urn,authorName,text}>} posts
 */
export function buildScoringMessages({ topics, posts }) {
  const topicLine = topics?.trim()
    ? `The user's niche / topics of interest: ${topics.trim()}.`
    : `The user has not specified topics; judge general professional relevance and whether the post invites a thoughtful comment.`;

  const numbered = posts.map((p, i) =>
    `[${i}] author: ${p.authorName || 'unknown'}\n"""${(p.text || '').slice(0, 500)}"""`
  ).join('\n\n');

  const system = `You help a LinkedIn user decide which posts are worth commenting on to grow their network authentically. ${topicLine}

For each post, judge:
- relevance to the user's topics (0.0-1.0)
- whether a genuine, non-generic comment is possible

Output ONLY a JSON array, one object per post, in the same order:
[{"i":0,"relevance":0.0,"why":"<=8 words on why to engage or skip"}]
No prose, no markdown, no code fences. Just the JSON array.`;

  return [
    { role: 'system', content: system },
    { role: 'user', content: `Posts:\n\n${numbered}\n\nReturn the JSON array now.` },
  ];
}

/**
 * Parse the LLM's scoring response into [{i, relevance, why}].
 * Tolerant of code fences / stray prose around the JSON.
 */
export function parseScoringResponse(raw, count) {
  if (!raw) return [];
  let t = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = t.indexOf('[');
  const end = t.lastIndexOf(']');
  if (start === -1 || end === -1) return [];
  try {
    const arr = JSON.parse(t.slice(start, end + 1));
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(o => o && typeof o.i === 'number' && o.i >= 0 && o.i < count)
      .map(o => ({
        i: o.i,
        relevance: Math.max(0, Math.min(1, Number(o.relevance) || 0)),
        why: String(o.why || '').slice(0, 80),
      }));
  } catch {
    return [];
  }
}

// ─── Full Prompt Builder ────────────────────────────────────────────────────

/**
 * Build a complete [{role, content}] message array for the LLM.
 */
export function buildMessages({ userName, styleContext, postContent, comment, intent, maxWords = 150 }) {
  return [
    {
      role: 'system',
      content: buildSystemPrompt({ userName, styleContext, maxWords }),
    },
    {
      role: 'user',
      content: buildUserPrompt({ postContent, comment, intent }),
    },
  ];
}

/**
 * Clean up markdown formatting and surrounding quotes from LLM response.
 */
export function cleanReplyText(rawText) {
  if (!rawText) return '';
  let t = rawText.trim();

  // Strip leading/trailing quotes if matching
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }

  // Remove markdown bold/italic
  t = t.replace(/\*\*([^*]+)\*\*/g, '$1');
  t = t.replace(/\*([^*]+)\*/g, '$1');
  t = t.replace(/__([^_]+)__/g, '$1');
  t = t.replace(/_([^_]+)_/g, '$1');
  t = t.replace(/`([^`]+)`/g, '$1');

  // Remove markdown headers
  t = t.replace(/^#+\s+/gm, '');

  // Remove markdown links [text](url) -> text
  t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove leading bullet markers
  t = t.split('\n')
    .map(line => line.trim().replace(/^[-*+•]\s+/, ''))
    .join('\n');

  return t.trim();
}
