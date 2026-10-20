// Reply voice: own-post vs someone-else's-post framing, regenerate variety,
// slop-free prompts, and the deterministic "unslop" post-pass in toComment.

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './helpers/load.mjs';

let pb;
before(async () => { pb = await loadModule('background/prompt-builder.js'); });

const comment = { text: 'Congrats on taking the leap!', authorName: 'Sam Lee' };
const sys = (opts) => pb.buildMessages({ userName: 'Anmol Agarwal', styleContext: '', postContent: 'Left FAANG to start a company.', comment, intent: 'appreciation', ...opts })[0].content;
const usr = (opts) => pb.buildMessages({ userName: 'Anmol Agarwal', styleContext: '', postContent: 'Left FAANG to start a company.', comment, intent: 'appreciation', ...opts })[1].content;

describe('postRelation', () => {
  test('same person (case, accents, middle name tolerated)', () => {
    assert.equal(pb.postRelation('Anmol Agarwal', 'anmol agarwal'), 'own');
    assert.equal(pb.postRelation('José García', 'Jose Garcia'), 'own');
    assert.equal(pb.postRelation('Anmol Agarwal', 'Anmol K. Agarwal'), 'own');
  });
  test('different person or unknown', () => {
    assert.equal(pb.postRelation('Anmol Agarwal', 'Jane Doe'), 'other');
    assert.equal(pb.postRelation('Anmol Agarwal', ''), 'unknown');
    assert.equal(pb.postRelation('', 'Jane Doe'), 'unknown');
    assert.equal(pb.postRelation('the user', 'Jane Doe'), 'unknown');
  });
});

describe('reply framing', () => {
  test('own post: replies as the author and does not quiz the commenter', () => {
    const s = sys({ postAuthorName: 'Anmol Agarwal' });
    assert.match(s, /You wrote the LinkedIn post below/);
    assert.match(s, /IT'S YOUR POST/);
    const u = usr({ postAuthorName: 'Anmol Agarwal' });
    assert.match(u, /YOUR POST \(you wrote this\)/);
    assert.match(u, /Thank them like a person would/);
  });
  test("someone else's post names the author", () => {
    const s = sys({ postAuthorName: 'Jane Doe' });
    assert.match(s, /replying to a comment on Jane Doe's LinkedIn post/);
    assert.doesNotMatch(s, /IT'S YOUR POST/);
    assert.doesNotMatch(usr({ postAuthorName: 'Jane Doe' }), /YOUR POST/);
  });
  test('unknown author falls back to a neutral thread framing', () => {
    assert.match(sys({}), /replying to a comment in a LinkedIn thread/);
  });
  test('top-level queue comment is never framed as own post', () => {
    const s = sys({ intent: 'post_comment', postAuthorName: 'Anmol Agarwal' });
    assert.match(s, /top-level comment on Anmol Agarwal's LinkedIn post/);
    assert.doesNotMatch(s, /IT'S YOUR POST/);
  });
  test('author name cannot inject prompt markup', () => {
    assert.doesNotMatch(sys({ postAuthorName: 'Eve <script>"x"' }), /<script>|"x"/);
  });
});

describe('regenerate variety', () => {
  test('previous draft is shown and must not be reused', () => {
    const u = usr({ vary: true, previousReply: 'Month one is the easy part.' });
    assert.match(u, /YOUR PREVIOUS DRAFT[^\n]*Month one is the easy part\./);
    assert.match(u, /different first word, a different point/);
  });
  test('no previous-draft block on a first generation', () => {
    assert.doesNotMatch(usr({}), /PREVIOUS DRAFT/);
  });
});

describe('prompts set a slop-free example', () => {
  test('reply, welcome and calendar prompts contain no em/en dashes or emoji', () => {
    const texts = [
      ...pb.buildMessages({ userName: 'A', styleContext: '', postContent: 'p', comment, intent: 'question', vary: true, postAuthorName: 'A' }),
      ...pb.buildMessages({ userName: 'A', styleContext: '', postContent: 'p', comment, intent: 'post_comment' }),
      ...pb.buildWelcomeMessages({ userName: 'A', styleContext: '', name: 'Jane', headline: 'Eng' }),
      ...pb.buildFriendAdaptMessages({ userName: 'A', styleContext: '', sourcePostText: 'idea' }),
      ...pb.buildTrendingOriginalMessages({ userName: 'A', styleContext: '' }),
    ].map((m) => m.content)
      // The welcome prompt deliberately quotes the banned characters once.
      .map((t) => t.replace('(—, –)', ''));
    for (const t of texts) {
      assert.doesNotMatch(t, /[—–]/, t.slice(0, 80));
      assert.doesNotMatch(t, /[❌✅]/u);
    }
  });
  test('reply prompt bans the stock formulas seen in real output', () => {
    const s = sys({});
    for (const re of [/It's not X, it's Y/, /easy part/, /the part people miss/, /Don't start with "Curious"/, /Thoughts\?/, /made-up statistics|make up statistics/i]) {
      assert.match(s, re);
    }
  });
});

describe('toComment unslop post-pass', () => {
  test('dashes as punctuation become commas; ranges and hyphenated words survive', () => {
    assert.equal(pb.toComment('Caching helps — until the base image moves.'), 'Caching helps, until the base image moves.');
    assert.equal(pb.toComment('Caching helps—until the base image moves.'), 'Caching helps, until the base image moves.');
    assert.equal(pb.toComment('Caching helps – until it does not.'), 'Caching helps, until it does not.');
    assert.equal(pb.toComment('Caching helps - until it does not.'), 'Caching helps, until it does not.');
    assert.equal(pb.toComment('Usually 5–10 minutes for a well-known repo.'), 'Usually 5-10 minutes for a well-known repo.');
  });
  test('curly quotes become straight', () => {
    assert.equal(pb.toComment('That’s the “fun” part of spot GPUs.'), 'That\'s the "fun" part of spot GPUs.');
  });
  test('fabricated "our X" is neutralized without breaking grammar', () => {
    assert.equal(pb.toComment('Our users hate long onboarding flows.'), 'Users hate long onboarding flows.');
    assert.equal(pb.toComment('We moved fast and our team paid for it later.'), 'We moved fast and a team paid for it later.');
    assert.doesNotMatch(pb.toComment('Our customers noticed the latency first.'), /many teams/);
  });
  test('engagement-bait endings are dropped, real questions kept', () => {
    assert.equal(pb.toComment('Digest pinning fixes most of the cache misses. Thoughts?'), 'Digest pinning fixes most of the cache misses.');
    assert.equal(pb.toComment('Strict mode is easier on day one than on day 400. What do you think?'), 'Strict mode is easier on day one than on day 400.');
    assert.equal(pb.toComment('Pinning by digest helps a lot. Curious to hear your thoughts on this.'), 'Pinning by digest helps a lot.');
    const real = 'Pinning helps. How did you split the shards, by file or by timing?';
    assert.equal(pb.toComment(real), real);
    assert.equal(pb.toComment('Thoughts?'), 'Thoughts?'); // nothing left → keep
  });
  test('AI connectives and verbs get plain swaps', () => {
    assert.equal(pb.toComment('Pin by digest. Additionally, cache the lockfile layer.'), 'Pin by digest. Also, cache the lockfile layer.');
    assert.equal(pb.toComment('Worth it to delve into the planner output first.'), 'Worth it to dig into the planner output first.');
    assert.equal(pb.toComment('Teams that utilize RLS drop a whole service.'), 'Teams that use RLS drop a whole service.');
  });
  test('clean human replies pass through unchanged', () => {
    for (const t of [
      'REST until you actually feel the pain, honestly. Most teams reach for gRPC way too early.',
      'Migrations are the one thing I would always gate, pairing or not.',
      'Two minute eviction notice is rough when a run holds 40GB of state.',
    ]) assert.equal(pb.toComment(t), t);
  });
});

describe('reply shapes (format varies per comment)', () => {
  const pick = (o) => pb.pickReplyShape({ intent: 'general', commentText: 'some words here', relation: 'other', seed: 0, ...o });
  test('same comment keeps its shape; different comments spread across shapes', () => {
    assert.equal(pick({ seed: 7 }), pick({ seed: 7 }));
    const seen = new Set(Array.from({ length: 40 }, (_, i) => pick({ seed: i * 2654435761 })));
    assert.ok(seen.size >= 3, [...seen].join(','));
  });
  test('regenerate picks a different shape than the default', () => {
    for (let seed = 0; seed < 20; seed++) {
      const base = pick({ seed });
      assert.notEqual(pick({ seed, vary: true, random: () => 0.5 }), base);
    }
  });
  test('length matching: short light comments lean quick, long ones never get a one-liner', () => {
    const short = Array.from({ length: 30 }, (_, i) => pick({ seed: i, commentText: 'Ha, so true' }));
    assert.ok(short.filter((s) => s === 'quick').length >= 10);
    const long = 'word '.repeat(60);
    for (let i = 0; i < 30; i++) assert.notEqual(pick({ seed: i, commentText: long }), 'quick');
  });
  test('questions get answered; own-post congrats get thanks, never a caveat', () => {
    for (let i = 0; i < 12; i++) {
      assert.ok(['answer', 'take'].includes(pb.pickReplyShape({ intent: 'question', commentText: 'How did you do it?', seed: i })));
      const own = pb.pickReplyShape({ intent: 'appreciation', commentText: 'Congrats!', relation: 'own', seed: i, vary: i % 2 === 1 });
      assert.ok(['thanks', 'quick', 'addon'].includes(own), own);
    }
  });
  test('shape and recent replies reach the prompt; quick shapes skip the "lead with substance" push', () => {
    const msgs = pb.buildMessages({ userName: 'A', styleContext: '', postContent: 'p', comment: { text: 'lol yes', authorName: 'B' }, intent: 'general',
      shape: 'quick', recentReplies: ['First draft here.', 'Second "quoted" one.'] });
    const u = msgs[1].content;
    assert.match(u, /SHAPE FOR THIS REPLY: A quick, natural one-liner/);
    assert.match(u, /REPLIES YOU ALREADY WROTE RECENTLY[\s\S]*- "First draft here\."[\s\S]*- "Second 'quoted' one\."/);
    assert.doesNotMatch(u, /Lead with the substance/);
    assert.match(msgs[0].content, /Follow the SHAPE in the request/);
  });
  test('own-post prompt forbids invented backstory', () => {
    assert.match(sys({ postAuthorName: 'Anmol Agarwal' }), /Don't invent personal experiences, feelings, or backstory/);
  });
});
