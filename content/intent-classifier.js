/**
 * intent-classifier.js
 * Lightweight heuristic-based comment intent classifier.
 * No model required — fast, works offline, handles most LinkedIn comment patterns.
 */

import { INTENTS } from '../utils/constants.js';

// ─── Pattern Definitions ───────────────────────────────────────────────────

const INTENT_PATTERNS = [
  {
    intent: INTENTS.QUESTION,
    score: (text) => {
      let s = 0;
      if (text.endsWith('?') || text.includes('?')) s += 3;
      if (/\b(how|what|why|when|where|who|which|could you|can you|do you|would you|is there|are there)\b/i.test(text)) s += 2;
      if (/\b(wondering|curious|want to know|interested to know|explain|clarify)\b/i.test(text)) s += 2;
      return s;
    },
  },
  {
    intent: INTENTS.APPRECIATION,
    score: (text) => {
      let s = 0;
      if (/\b(thank|thanks|great|amazing|awesome|excellent|love|loved|brilliant|fantastic|wonderful|congrats|congratulations|well done|kudos|impressed|valuable|insightful|helpful|inspiring|inspired)\b/i.test(text)) s += 3;
      if (/\b(appreciate|grateful|👏|🙌|❤️|🔥|💯|🎉|cheers)\b/i.test(text)) s += 2;
      if (!/\?/.test(text) && text.length < 100) s += 1; // Short non-question likely appreciation
      return s;
    },
  },
  {
    intent: INTENTS.CRITICISM,
    score: (text) => {
      let s = 0;
      if (/\b(disagree|wrong|incorrect|not sure about|actually|but|however|respectfully|pushback|challenge|debatable|misleading|oversimplified|not accurate)\b/i.test(text)) s += 3;
      if (/\b(problem|issue|flaw|concern|mistake|error|risk|danger)\b/i.test(text)) s += 2;
      return s;
    },
  },
  {
    intent: INTENTS.FEEDBACK,
    score: (text) => {
      let s = 0;
      if (/\b(suggest|suggestion|maybe|consider|could also|you might|have you thought|another approach|alternatively|one thing|I'd recommend|feedback|improvement)\b/i.test(text)) s += 3;
      if (/\b(would be better|could improve|might want to|I think|in my opinion|from my experience)\b/i.test(text)) s += 2;
      return s;
    },
  },
  {
    intent: INTENTS.TECHNICAL,
    score: (text) => {
      let s = 0;
      if (/\b(architecture|implementation|algorithm|framework|library|API|database|performance|scalability|latency|throughput|backend|frontend|infrastructure|code|stack|deploy|devops|ML|AI|model|training|inference|prompt|embedding|vector|RAG|LLM|microservice|kubernetes|docker|AWS|GCP|Azure|Python|JavaScript|TypeScript|React|Node|SQL|NoSQL)\b/i.test(text)) s += 3;
      if (/\b(how does|under the hood|technically|engineering|system design|built with)\b/i.test(text)) s += 2;
      return s;
    },
  },
  {
    intent: INTENTS.NETWORKING,
    score: (text) => {
      let s = 0;
      if (/\b(connect|connection|DM|message|reach out|collaborate|opportunity|work together|your experience|your background|talk more|chat|coffee chat|intro|introduction|referral|open to)\b/i.test(text)) s += 3;
      if (/\b(followed you|following|found your profile|came across|looking for|hiring|job|role|position)\b/i.test(text)) s += 2;
      return s;
    },
  },
];

// ─── Classifier ────────────────────────────────────────────────────────────

/**
 * Classify a comment's intent.
 * @param {string} text - The comment text
 * @returns {{ intent: string, confidence: number, scores: object }}
 */
export function classifyIntent(text) {
  if (!text || text.trim().length === 0) {
    return { intent: INTENTS.GENERAL, confidence: 0, scores: {} };
  }

  const normalizedText = text.trim();
  const scores = {};
  let maxScore = 0;
  let topIntent = INTENTS.GENERAL;

  for (const { intent, score } of INTENT_PATTERNS) {
    const s = score(normalizedText);
    scores[intent] = s;
    if (s > maxScore) {
      maxScore = s;
      topIntent = intent;
    }
  }

  // Confidence: how much top score dominates
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? maxScore / totalScore : 0;

  return {
    intent: maxScore > 0 ? topIntent : INTENTS.GENERAL,
    confidence: Math.round(confidence * 100) / 100,
    scores,
  };
}

/**
 * Get a human-readable label for an intent.
 */
export function intentLabel(intent) {
  const labels = {
    [INTENTS.QUESTION]:     'Question',
    [INTENTS.APPRECIATION]: 'Appreciation',
    [INTENTS.FEEDBACK]:     'Feedback',
    [INTENTS.CRITICISM]:    'Criticism',
    [INTENTS.TECHNICAL]:    'Technical',
    [INTENTS.NETWORKING]:   'Networking',
    [INTENTS.GENERAL]:      'General',
  };
  return labels[intent] || 'General';
}
