/**
 * The question-type catalogue: what a round can ask, and how it is phrased.
 *
 * WHY THERE ARE SEVEN TYPES AND NOT TWO. Every prompt in this game used to be
 * "Name a <pack title>", optionally with a year clause bolted on, which meant
 * the year was the only thing that ever varied - ten rounds of the Daily Dive
 * asked the same question about ten different packs, and the daily shows
 * differed from each other by a date range and nothing else. The pack supplies
 * the subject; the type has to supply the question.
 *
 * Every type reads a field the bank already carries (`name`, `tier`, `year`,
 * `role`), so none of them needed a data migration.
 */

import { computeEraBuckets, eraLabelText, PROMPT_FLOOR_YEAR } from './eras.js';
import { TIERS } from '../data/tiers.js';
import {
  firstLetter, wordCount, LONG_TITLE_WORDS, violatesConstraint,
} from './constraints.js';

/** How many of a pack's answers a finished spec would actually accept. */
function countSatisfying(answers, spec) {
  return answers.filter((e) => !violatesConstraint(spec, e)).length;
}

export function article(t) {
  return /^[aeiou]/i.test(t) ? 'an' : 'a';
}

/**
 * Phrase an era-constrained prompt. The range is attached with a comma rather
 * than "from", because several pack titles already contain one — "a Bollywood
 * movie from the 1990s from up to 1994" is not a sentence.
 *
 * A pack whose `year` is a debut takes a clause instead: "a Bollywood
 * director, 2013 or later" leaves the player guessing what 2013 refers to.
 */
function eraQuestion(cat, buckets, value) {
  const range = eraLabelText(buckets, value);
  if (cat.yearIs === 'debut') {
    const t = clauseTitle(cat);
    return 'Name ' + article(t) + ' ' + t + ' who broke through ' + range + '.';
  }
  return 'Name ' + article(cat.title) + ' ' + cat.title + ', ' + range + '.';
}

/** One era round, with the wording for both the prompt and its constraint chip. */
export function eraSpec(cat, buckets, value) {
  return {
    type: 'era', value, buckets,
    text: eraQuestion(cat, buckets, value),
    label: (cat.yearIs === 'debut' ? 'Broke through ' : 'Released ') + eraLabelText(buckets, value),
  };
}

/**
 * Generic wording, used only when a pack lacks the year data needed to build
 * era buckets. Rounds then differ in tone rather than in constraint.
 */
export const ROUND_FLAVORS = [
  (t) => 'Name ' + article(t) + ' ' + t + '.',
  (t) => 'Name another ' + t + ' — a different one!',
  (t) => 'Dig deeper: name ' + article(t) + ' lesser-known ' + t + '.',
  (t) => 'Keep going — one more ' + t + '.',
  (t) => 'Final dive: your rarest ' + t + ' yet.',
];

/* ---------------------------------------------------------------------------
   The question-type catalogue

   `viableTypes` answers one question per pack: which of the seven types can
   this pack host, and with what parameter? A type is only offered when the
   pack has enough answers satisfying it AND the constraint actually narrows
   the pack — see NARROWING_SHARE. Everything is read off `name`, `tier`,
   `year` and `role`, which every entry already carries.
--------------------------------------------------------------------------- */

/**
 * How many answers must satisfy a constraint before a round may ask for it.
 * A round with three valid answers is not a question, it is a guess: the
 * clock is 40 seconds and the player cannot see the bank.
 */
const MIN_TYPE_ANSWERS = 6;

/**
 * A constraint that admits more than this share of the pack is not asking
 * anything. This is the rule — rather than a list of exceptions — that stops
 * "a Dil movie whose title begins with D" (48 of 53 answers) and "a 1990s
 * movie released in the 1990s" (all 147) from ever being generated.
 */
const NARROWING_SHARE = 0.75;

/**
 * How many different point values a round must be able to pay out.
 *
 * MIN_TYPE_ANSWERS asks whether a round has enough answers. It does not ask
 * whether those answers can be told APART, and that is a separate failure:
 * "Name an Amitabh Bachchan movie almost nobody would think of" offered 29
 * valid answers of which every single one scored +50. Nobody could do better or
 * worse than anybody else, so the round took a wild guess and reported it as a
 * perfect answer — the scoring model, which is the whole game, silently
 * switched off for a tenth of the day.
 *
 * Two is the right floor rather than "must include a common answer". A
 * deep-cuts round excludes common answers BY DESIGN, so demanding one would
 * delete the rarity type entirely; what it must still do is separate a +30 from
 * a +50. Any round that can pay two different amounts is doing its job.
 */
const MIN_DISTINCT_SCORES = 2;

/**
 * Can this round tell its answers apart, or does everything pay the same?
 * Checked by every type before it offers itself.
 */
function scoresSpread(answers, spec) {
  const seen = new Set();
  answers.forEach((e) => {
    if (!violatesConstraint(spec, e)) seen.add(TIERS[e.tier].points);
  });
  return seen.size >= MIN_DISTINCT_SCORES;
}

/** A spec is worth asking only if enough answers satisfy it AND it can score. */
function isAskable(answers, spec) {
  return countSatisfying(answers, spec) >= MIN_TYPE_ANSWERS && scoresSpread(answers, spec);
}

/** What the answers in this pack ARE: films have titles, people have names. */
function nounFor(cat) {
  return cat.noun || 'title';
}

/**
 * The pack's name as it reads mid-sentence with a clause hung off it.
 *
 * `title` is written to stand alone after "Name one…", so several are a whole
 * descriptive phrase — 'Bollywood movie with "Dil" in the title'. Appending to
 * that gives "a Bollywood movie with "Dil" in the title with four or more
 * words in its title". The era prompts get away with the long form because
 * they attach with a comma; the types that append a "whose…" or "with…" clause
 * cannot, so they use this.
 */
function clauseTitle(cat) {
  return cat.shortTitle || cat.title;
}

/**
 * How to speak about a pack's `year`. For film packs it is the release; for
 * the director pack it is the year that director broke through, so "released
 * in the 1990s" would be plainly wrong there.
 */
function yearVerb(cat) {
  return cat.yearIs === 'debut' ? 'who broke through' : 'released';
}

function tally(list, keyOf) {
  const counts = {};
  list.forEach((item) => {
    const key = keyOf(item);
    if (key !== '' && key != null) counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

/** The keys of `counts` that are common enough to ask for, rarest first. */
function askableKeys(counts, total) {
  return Object.keys(counts)
    .filter((k) => counts[k] >= MIN_TYPE_ANSWERS && counts[k] <= total * NARROWING_SHARE)
    .sort((a, b) => counts[a] - counts[b]);
}

/**
 * Every question this pack can be asked, as ready-to-use round specs grouped
 * by base type. The Daily Dive spends this catalogue across its ten rounds;
 * a themed game spends one pack's worth across five.
 *
 * Grouping by base type is what lets the assignment below spread the *kinds*
 * of question evenly — two `initial` rounds on different letters are far more
 * alike than an `initial` round and a `decade` round, so the spread has to be
 * counted per type, not per spec.
 */
export function viableTypes(cat) {
  const full = cat.title;
  const t = clauseTitle(cat);
  const a = article(t) + ' ' + t;
  const noun = nounFor(cat);
  const answers = cat.answers;
  const groups = [];

  // The only prompt with nothing hung off it, so it can afford the long form.
  groups.push({
    id: 'open',
    specs: [{ type: 'open', text: 'Name ' + article(full) + ' ' + full + '.' }],
  });

  // Initial letter — the strongest non-year axis, and the one that most
  // changes how a player searches their own memory.
  const letters = tally(answers, (e) => firstLetter(e.name));
  const letterSpecs = askableKeys(letters, answers.length).map((L) => ({
    type: 'initial',
    value: L,
    text: 'Name ' + a + ' whose ' + noun + ' begins with “' + L + '”.',
  })).filter((s) => scoresSpread(answers, s));
  if (letterSpecs.length) groups.push({ id: 'initial', specs: letterSpecs });

  // Shape of the answer itself: one word, or a long one.
  const wordSpecs = [];
  const oneWord = answers.filter((e) => wordCount(e.name) === 1).length;
  const longName = answers.filter((e) => wordCount(e.name) >= LONG_TITLE_WORDS).length;
  if (oneWord >= MIN_TYPE_ANSWERS && oneWord <= answers.length * NARROWING_SHARE) {
    wordSpecs.push({
      type: 'words', value: 'one',
      text: 'Name ' + a + ' with a one-word ' + noun + '.',
    });
  }
  if (longName >= MIN_TYPE_ANSWERS && longName <= answers.length * NARROWING_SHARE) {
    wordSpecs.push({
      type: 'words', value: 'many',
      text: 'Name ' + a + ' whose ' + noun + ' runs to four words or more.',
    });
  }
  const spreadWordSpecs = wordSpecs.filter((s) => scoresSpread(answers, s));
  if (spreadWordSpecs.length) groups.push({ id: 'words', specs: spreadWordSpecs });

  /*
    Rarity. `minTier: 4` is the round that broke: it admits exactly one tier, so
    every answer pays +50 and the round cannot score. isAskable now rejects it
    on every pack, which leaves `minTier: 3` — two rungs, +40 and +50, which is
    a deep-cuts round that still separates a good answer from a lucky one.
  */
  const raritySpecs = [3, 4]
    .map((min) => ({
      type: 'rarity', minTier: min,
      text: min >= 4
        ? 'Name ' + a + ' almost nobody would think of.'
        : 'Deep cut only: name ' + a + ' off the beaten track.',
    }))
    .filter((s) => isAskable(answers, s));
  if (raritySpecs.length) groups.push({ id: 'rarity', specs: raritySpecs });

  // Decade — a harder, more specific cut than the era thirds below, and it
  // reads differently even though both are built out of the year.
  const dated = answers.filter((e) => e.year != null);
  const decades = tally(dated, (e) => Math.floor(e.year / 10) * 10);
  /*
    A pack that already names a period in its own title gets no decade round.
    `noughties` covers 2000-2010, so the 2010 films are a small enough slice to
    pass the narrowing rule and it generated "Name a 2000s Bollywood movie
    released in the 2010s" — a prompt that contradicts itself. The pack IS the
    decade; asking for a decade within it can only confuse.
  */
  const decadeSpecs = (cat.yearWindow ? [] : askableKeys(decades, dated.length))
    // No prompt is built around a decade before the floor — see eras.js. The
    // films themselves stay in the bank and stay answerable; it is the question
    // "name one from the 1970s" that is gone.
    .filter((d) => Number(d) >= PROMPT_FLOOR_YEAR)
    .map((d) => ({
    type: 'decade',
    value: Number(d),
    text: 'Name ' + a + ' ' + yearVerb(cat) + ' in the ' + d + 's.',
    label: (cat.yearIs === 'debut' ? 'Broke through' : 'Released') + ' in the ' + d + 's',
  })).filter((s) => scoresSpread(answers, s));
  if (decadeSpecs.length) groups.push({ id: 'decade', specs: decadeSpecs });

  /*
    Era is the one type that could slip past MIN_TYPE_ANSWERS. Every other type
    counts the answers that satisfy it before offering itself; era only asked
    whether the pack had enough dated answers to CUT into thirds, and then
    offered all three thirds however small they came out. A ten-answer pack
    yields buckets of three, which is a guess rather than a question — exactly
    what the minimum exists to prevent. Each bucket now has to earn its place
    on the same terms as everything else.
  */
  const buckets = computeEraBuckets(cat);
  if (buckets) {
    const eraSpecs = ['early', 'mid', 'late']
      .map((value) => eraSpec(cat, buckets, value))
      .filter((spec) => isAskable(answers, spec));
    if (eraSpecs.length) groups.push({ id: 'era', specs: eraSpecs });
  }

  // Only the villain pack tags role, so only it can ask this.
  if (answers.some((a) => a.role)) {
    groups.push({
      id: 'role',
      specs: [
        { type: 'role', value: 'actor',
          text: 'Name a real actor known for playing Bollywood villains.' },
        { type: 'role', value: 'character',
          text: 'Name a Bollywood villain CHARACTER — not the actor’s real name.' },
      ],
    });
  }

  return groups;
}

/**
 * Hand each pack a question type, keeping the kinds of question as spread out
 * across the game as the packs allow.
 *
 * Greedy and deliberately so: walk the packs in the order they were drawn and
 * give each one the type it can host that has been used least so far, so a
 * pack with only four options is not left picking over what the flexible packs
 * already took. Ties are broken by the seeded rng, which is what makes two
 * players on the same day get the same questions and not merely the same packs.
 */
/** Small stable hash, so each pack rotates on its own phase. */
function packPhase(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Hand each pack a question, spreading the KINDS across the day and rotating
 * the choice with the date so consecutive days do not ask the same thing.
 *
 * `turn` is the day number. It replaces the seeded rng in both choices that
 * used to be random — which type, and which parameter within it — because
 * random is exactly the wrong tool here: a coin flip is free to land the same
 * way two days running, and it did. Rotation cannot. A pack drawn on
 * consecutive days advances one step through its own list of questions, so it
 * is asked something different by construction rather than by luck.
 *
 * This also keeps the plan a PURE function of the date. The first attempt at
 * this compared against yesterday's plan, which sounds equivalent and is not:
 * building yesterday's plan needs the day before it, so the comparison ran
 * against a differently-built plan than the one players were served, and
 * silently missed most repeats.
 */
export function assignTypes(cats, rng, turn, avoid) {
  // 'open' starts one use in the hole, so it is only reached once a pack's
  // real questions have been. Left level with the others it wins ties early
  // and the game opens on "Name an Amitabh Bachchan movie" — the exact prompt
  // the type catalogue exists to stop being the whole game.
  const typeUse = { open: 1 };
  const specUse = {};
  const day = turn || 0;
  // Questions a hand-picked day asked yesterday. Rotation cannot see those,
  // because they never went through it.
  const stale = avoid || new Set();

  return cats.map((cat) => {
    const groups = viableTypes(cat);
    const phase = day + packPhase(cat.id);
    let best = null;
    groups.forEach((g, gi) => {
      // Within a type, prefer a parameter this game has not used, so a second
      // `initial` round asks for a different letter than the first; then one
      // yesterday's schedule did not pin.
      const unused = g.specs.filter((s) => !specUse[specKey(cat.id, s)]);
      const candidates = unused.length ? unused : g.specs;
      const novel = candidates.filter((s) => !stale.has(specKey(cat.id, s)));
      const pool = novel.length ? novel : candidates;

      // A type with nothing left to ask that yesterday did not already ask is
      // a worse choice than one that has something — but only a preference, so
      // a pack whose every question is stale can still be asked rather than
      // dropping out of the game.
      const repeatPenalty = novel.length ? 0 : 1;

      // Spread the kinds across today, then rotate to break the tie. The
      // rotation term is always < 1 so it can only order equally-used types,
      // never override the spread or the penalty.
      const score = (typeUse[g.id] || 0) + repeatPenalty +
        ((phase + gi) % groups.length) / groups.length;
      if (!best || score < best.score) {
        best = { score, group: g, spec: pool[phase % pool.length] };
      }
    });

    typeUse[best.group.id] = (typeUse[best.group.id] || 0) + 1;
    specUse[specKey(cat.id, best.spec)] = true;
    return best.spec;
  });
}

/**
 * Identifies one question: which pack, asked which way, with which parameter.
 *
 * Exported because rounds.js builds the same key for yesterday's questions so
 * today can avoid repeating one. It must be the ONE definition — a second copy
 * that formatted an absent parameter as '' rather than 'undefined' would agree
 * on every other type and silently disagree on `open`, which is precisely the
 * type the thin packs fall back to.
 */
export function specKey(catId, spec) {
  return catId + '|' + spec.type + '|' + (spec.value != null ? spec.value : spec.minTier);
}
