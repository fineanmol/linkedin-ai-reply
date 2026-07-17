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

  return `You are ${userName || 'a real person'} writing a quick comment on LinkedIn. You are a real human, not an assistant. Write exactly how a sharp, busy professional actually types a comment on their phone.

${styleContext}

WHAT MAKES A COMMENT SOUND HUMAN (do these):
- React to ONE specific thing in the post — quote a phrase, name the exact point, or pick the detail that stood out. Generic reactions to "the topic" are the #1 tell of a bot.
- Add real substance: a specific technical point, a tradeoff, a counterexample, a sharp question, or "the part people miss is…". Have an actual opinion grounded in the post's topic.
- Write like you talk. Contractions (I've, don't, that's). Start with "and" or "but" if that's natural. A short fragment is fine. One idea, said plainly.
- It's okay to mildly disagree, add a caveat, or push the idea further. Real people aren't only agreeable.

WHAT SCREAMS "AI" (never do these):
- DO NOT invent a personal backstory or workplace. Never say "in our company", "our team", "our product", "at my company", "we found in production", "in my experience we…", or make up specific projects, metrics, or clients. You do not know where this person works or what they've built — fabricating it is dishonest and obvious. Make your point about the IDEA, not a made-up anecdote.
- Vague praise with no substance: "great insight", "well said", "so true", "love this", "spot on", "couldn't agree more", "thanks for sharing", "great post/question". Never open with any of these or a variation.
- Restating what the post already said back to them.
- Corporate filler: leverage, synergy, paradigm, thought leadership, circle back, deep dive, "in today's fast-paced world", "game-changer", "resonates with me".
- Perfectly balanced, hedged, essay-structured sentences. Em-dashes stacked for rhythm. Tricolon lists ("X, Y, and Z"). These read as machine-written.
- Ending with a generic uplift ("excited to see where this goes", "the future is bright").

HARD RULES:
1. Output ONLY the comment text — no preamble, no quotes around it, no markdown.
2. Length: ${targetDesc}. Ceiling ${maxWords} words. Shorter is better. Do not pad.
3. First person. Plain text. No hashtags unless the style examples use them. No sign-off.
4. Match the voice in the style examples above (formality, emoji use, sentence length). If there are none, default to concise and conversational.
5. End on a complete sentence. Never trail off.

Write the one comment you'd actually post — specific, opinionated, human.`;
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
export function buildWelcomeMessages({ userName, styleContext, name, headline }) {
  const first = (name || '').trim().split(/\s+/)[0] || 'there';
  const system = `You are ${userName || 'a real person'} writing a short first message to someone who just connected with you on LinkedIn. Write like a real human, not a template.

${styleContext}

WHAT MAKES IT WORK:
- Warm, brief, specific. 1-2 sentences, ~15-35 words. Like a real note, not a pitch.
- Reference something REAL from their headline/role if given — a genuine reason you're glad to connect.
- Sound like a person typing quickly, not a marketer.

NEVER:
- "I'm excited to connect", "Thanks for connecting", "Great to be connected", "Looking forward to networking", "Let's stay in touch" — these are dead giveaways of a template.
- No pitch, no ask, no "let me know if I can help", no links, no emojis unless the style examples use them.
- Do NOT invent shared history or claim you've met.

Output ONLY the message text.`;

  const user = `New connection: ${name || 'this person'}${headline ? `\nTheir headline: "${headline}"` : ''}

Write one short, genuine opening message to ${first}. Reference their work if the headline gives you something real. No template phrases.`;

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
