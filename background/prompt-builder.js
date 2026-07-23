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
  // Real LinkedIn comments are SHORT — usually one or two sentences. The single
  // biggest "sounds like AI" cause is length + essay cadence, so we cap hard and
  // low regardless of the maxWords setting.
  const wordCap = Math.min(maxWords || 45, 45);

  return `You are ${userName || 'a real person'} leaving a quick comment on someone's LinkedIn post. You're a real person typing on your phone in ten seconds, not an expert writing an analysis.

${styleContext}

THE ONE RULE THAT MATTERS: sound like a person, not an essay. Short. One thought. Plain words.

HOW REAL COMMENTS READ vs HOW AI READS — study these:

Post: "Choosing between REST and gRPC affects how your services scale."
❌ AI: "Retries without explicit idempotency keys are a massive disaster waiting to happen on non-safe methods. Without a deterministic key to deduplicate requests at the gateway, temporary network instability turns into duplicate writes and corrupted state."
✅ Human: "The gRPC tooling story is still rough outside Go though. Half my debugging time goes to just not being able to curl an endpoint."
✅ Human: "REST until you actually feel the pain, honestly. Most teams reach for gRPC way too early."

Post: "Here's how we cut onboarding time in half."
❌ AI: "This is a fantastic breakdown of a critical challenge. The emphasis on measurable impact is exactly what separates high-performing teams from the rest."
✅ Human: "Curious if the time savings held once the team scaled, or if it crept back up."
✅ Human: "The checklist part is underrated. People skip it and wonder why ramp-up is chaos."

What the human ones have in common: one point, casual, a bit of opinion or a real question, no big words, no balanced clauses, no showing off.

DON'Ts (these are the giveaways):
- No long or complex sentences. No "X turns into Y and Z" cadence. No tricolons ("A, B, and C"). No em-dashes for rhythm.
- No vague praise: "great insight", "well said", "spot on", "love this", "thanks for sharing", "fantastic breakdown". Don't open with any of these.
- No jargon flexing or buzzwords (leverage, paradigm, deterministic, robust, game-changer, "at scale" as filler).
- Do NOT invent a job, company, team, or story ("in our company", "we found in production"). Talk about the idea, not a made-up anecdote.
- No restating the post. No generic uplift ending ("excited to see where this goes").

HARD RULES:
1. Output ONLY the comment — no quotes, no preamble, no markdown.
2. ${wordCap} words MAX. One or two sentences. Almost always shorter is better.
3. First person, contractions, plain text. Match the style examples' voice/emoji if any; otherwise casual.
4. Make ONE specific point about something actually in the post, or ask ONE real question about it.

Write the single comment you'd actually thumb-type and post.`;
}

// ─── User Prompt ───────────────────────────────────────────────────────────

export function buildUserPrompt({ postContent, comment, intent, vary = false }) {
  const intentInstruction = INTENT_INSTRUCTIONS[intent] || INTENT_INSTRUCTIONS[INTENTS.GENERAL];
  const postSnippet = postContent || '(post content unavailable)';
  const commentText = comment.text || '(comment text unavailable)';

  // Different "angles" to take on a post. On regenerate we pick one at random so
  // repeated generations for the SAME post give genuinely different comments —
  // each grounded in the post's content, not reworded boilerplate.
  const ANGLES = [
    'Name a concrete technical tradeoff or edge case related to a specific point in the post (about the idea — do NOT invent a personal anecdote or workplace).',
    'Respectfully push back on or add a caveat to one specific claim in the post. Do NOT just agree.',
    'Pick the single most interesting detail in the post and extend it one step further.',
    'Ask one sharp, specific question about something the post left open.',
    'Name the part most people overlook about this topic, tied to what the post actually said.',
    'Share a short contrarian or "it depends" take on a specific point in the post.',
  ];
  const angleLine = vary
    ? `\nANGLE FOR THIS ONE (make it clearly different from a plain agreement): ${ANGLES[Math.floor(Math.random() * ANGLES.length)]}`
    : '';

  return `POST:
"""
${postSnippet}
"""

COMMENT from ${comment.authorName || 'someone'}:
"""
${commentText}
"""

HOW TO REPLY: ${intentInstruction}
Do NOT open with "I agree", "I think", "I've found", or any agreement/praise. Lead with the substance. Base the comment on what THIS post specifically says — reference a real detail from it.${angleLine}

Write the one comment you'd actually post:`;
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

// ─── Connection Welcome Message ──────────────────────────────────────────────

/**
 * Build messages for a short, human, personalized note to a NEW connection.
 * The user reviews and sends it manually — this only drafts.
 */
export function buildWelcomeMessages({ userName, styleContext, name, headline, about, recentPosts }) {
  const first = (name || '').trim().split(/\s+/)[0] || 'there';
  const system = `You are ${userName || 'a real person'} writing a short first message to someone who just connected with you on LinkedIn. Write like a real human texting a peer, not a template or a marketer.

${styleContext}

WHAT MAKES IT WORK:
- Warm, brief, specific. 1-2 sentences, ~15-35 words.
- Anchor on ONE real, specific thing about them — a topic from their About or a recent post, or their actual role. The more specific, the less it reads as AI.
- Sound like a quick, genuine note. Plain words. Contractions.

NEVER (these scream AI / template):
- "I'm excited to connect", "Thanks for connecting", "Great to be connected", "Looking forward to networking", "Let's stay in touch", "I came across your profile", "hope you're doing well".
- NO em-dashes or en-dashes (—, –). Use commas or periods. This is important.
- No "X, Y, and Z" tricolon lists. No hedged, balanced, essay cadence.
- No pitch, no ask, no "let me know if I can help", no links, no hashtags, no emojis unless the style examples use them.
- Do NOT invent shared history, a workplace, or claim you've met. Only use what's given below.

Output ONLY the message text.`;

  const ctx = [];
  if (headline) ctx.push(`Headline: "${headline}"`);
  if (about) ctx.push(`About (their words): "${about.slice(0, 400)}"`);
  if (recentPosts?.length) {
    ctx.push(`Recent post${recentPosts.length > 1 ? 's' : ''} they wrote:`);
    recentPosts.slice(0, 2).forEach((p, i) => ctx.push(`  ${i + 1}. "${p.slice(0, 240)}"`));
  }
  const contextBlock = ctx.length ? ctx.join('\n') : `(only their name is known)`;

  const user = `New connection: ${name || 'this person'}
${contextBlock}

Write one short, genuine opening message to ${first}. Reference the most interesting specific thing above (a recent post beats the headline). No template phrases, no dashes.`;

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}

// ─── Full Prompt Builder ────────────────────────────────────────────────────

/**
 * Build a complete [{role, content}] message array for the LLM.
 */
export function buildMessages({ userName, styleContext, postContent, comment, intent, maxWords = 150, vary = false }) {
  return [
    {
      role: 'system',
      content: buildSystemPrompt({ userName, styleContext, maxWords }),
    },
    {
      role: 'user',
      content: buildUserPrompt({ postContent, comment, intent, vary }),
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

/**
 * humanizeReply — a light post-pass that strips the most common robotic tells
 * that survive the prompt, WITHOUT rewriting the user's meaning. Runs on every
 * generated comment before it's shown/copied.
 */
export function humanizeReply(text) {
  if (!text) return '';
  let t = text.trim();

  // 1. Strip a generic praise/filler OPENER if the model still led with one.
  //    e.g. "Great insight! The real..." → "The real..."
  const OPENERS = [
    'great post', 'great insight', 'great question', 'great point', 'great read',
    'love this', 'love it', 'so true', 'well said', 'spot on', 'this is spot on',
    'couldn\'t agree more', 'could not agree more', 'i completely agree', 'i totally agree',
    'i agree', 'agreed', 'totally agree', 'absolutely', 'exactly this', 'exactly', '100%', 'this',
    'thanks for sharing', 'thanks for this', 'thank you for sharing', 'i appreciate you sharing',
    'this resonates', 'this really resonates', 'such a great', 'what a great',
  ];
  // Match "<opener><punct> <rest>" and drop the opener clause, keeping the rest.
  const openerRe = new RegExp(
    `^(?:${OPENERS.map(o => o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b[\\s!,.–—-]*`,
    'i'
  );
  const stripped = t.replace(openerRe, '').trimStart();
  // Only apply if it left a real sentence behind (don't gut a 3-word reply).
  if (stripped && stripped.split(/\s+/).length >= 4) {
    // Capitalize the first letter ONLY if it's a lowercase plain word — never
    // force-case an intentional term like "gRPC" or "iOS".
    const first = stripped.charAt(0);
    const looksLikeTechTerm = /[a-z][A-Z]/.test(stripped.slice(0, 4)); // e.g. gRPC, iOS
    t = (!looksLikeTechTerm && /[a-z]/.test(first))
      ? first.toUpperCase() + stripped.slice(1)
      : stripped;
  }

  // 2. Safety net for fabricated workplace claims that slip past the prompt.
  //    We can't know the user's real employer, so soften invented "we/our
  //    company/team/production" phrasing into a neutral general voice rather
  //    than let a false claim through. (Meaning is preserved; the fake
  //    first-person-plural framing is removed.)
  t = t
    .replace(/\bin our (company|team|org|organi[sz]ation|product|production|codebase|stack)\b/gi, '')
    .replace(/\bat (my|our) (company|team|org|organi[sz]ation)\b/gi, '')
    .replace(/\bwe (found|saw|learned|noticed|discovered) (in|at) (production|our .*?)\b/gi, 'a common finding is')
    .replace(/\bour (team|company|product|production|users|customers|clients)\b/gi, 'many teams');

  // 3. Only convert an em-dash to a comma when it's used as a spaced aside
  //    (the AI-cadence tell). Leave a single mid-word/tight dash alone.
  t = t.replace(/\s+—\s+/g, ', ');

  // 4. Drop a trailing generic-uplift sentence if present.
  const UPLIFT = /\s*(excited to see where this goes|the future is (bright|exciting)|great things ahead|keep up the (great|good) work)\.?$/i;
  t = t.replace(UPLIFT, '').trim();

  // 5. Kill doubled spaces introduced by the edits.
  t = t.replace(/\s{2,}/g, ' ').replace(/\s+([,.!?])/g, '$1').trim();

  // 6. If an edit left the sentence starting lowercase, capitalize it (unless
  //    it's an intentional tech term like gRPC/iOS).
  if (t && /^[a-z]/.test(t) && !/^[a-z][A-Z]/.test(t.slice(0, 4))) {
    t = t.charAt(0).toUpperCase() + t.slice(1);
  }

  return t;
}
