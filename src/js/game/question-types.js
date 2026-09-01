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

import { computeEraBuckets, eraLabelText } from './eras.js';
import { firstLetter, wordCount, LONG_TITLE_WORDS } from './constraints.js';

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
  }));
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
  if (wordSpecs.length) groups.push({ id: 'words', specs: wordSpecs });

  // Rarity — implemented all along, reachable from nothing until now.
  const raritySpecs = [3, 4]
    .filter((min) => answers.filter((e) => e.tier >= min).length >= MIN_TYPE_ANSWERS)
    .map((min) => ({
      type: 'rarity', minTier: min,
      text: min >= 4
        ? 'Name ' + a + ' almost nobody would think of.'
        : 'Deep cut only: name ' + a + ' off the beaten track.',
    }));
  if (raritySpecs.length) groups.push({ id: 'rarity', specs: raritySpecs });

  // Decade — a harder, more specific cut than the era thirds below, and it
  // reads differently even though both are built out of the year.
  const dated = answers.filter((e) => e.year != null);
  const decades = tally(dated, (e) => Math.floor(e.year / 10) * 10);
  const decadeSpecs = askableKeys(decades, dated.length).map((d) => ({
    type: 'decade',
    value: Number(d),
    text: 'Name ' + a + ' ' + yearVerb(cat) + ' in the ' + d + 's.',
    label: (cat.yearIs === 'debut' ? 'Broke through' : 'Released') + ' in the ' + d + 's',
  }));
  if (decadeSpecs.length) groups.push({ id: 'decade', specs: decadeSpecs });

  const buckets = computeEraBuckets(cat);
  if (buckets) {
    groups.push({
      id: 'era',
      specs: ['early', 'mid', 'late'].map((value) => eraSpec(cat, buckets, value)),
    });
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
export function assignTypes(cats, rng) {
  // 'open' starts one use in the hole, so it is only reached once a pack's
  // real questions have been. Left level with the others it wins ties early
  // and the game opens on "Name an Amitabh Bachchan movie" — the exact prompt
  // the type catalogue exists to stop being the whole game.
  const typeUse = { open: 1 };
  const specUse = {};

  return cats.map((cat) => {
    const groups = viableTypes(cat);
    let best = null;
    groups.forEach((g) => {
      // Within a type, prefer a parameter this game has not used either, so a
      // second `initial` round asks for a different letter than the first.
      const fresh = g.specs.filter((s) => !specUse[specKey(cat.id, s)]);
      const pool = fresh.length ? fresh : g.specs;
      const score = (typeUse[g.id] || 0) + rng() * 0.5;
      if (!best || score < best.score) {
        best = { score, group: g, spec: pool[Math.floor(rng() * pool.length)] };
      }
    });

    typeUse[best.group.id] = (typeUse[best.group.id] || 0) + 1;
    specUse[specKey(cat.id, best.spec)] = true;
    return best.spec;
  });
}

function specKey(catId, spec) {
  return catId + '|' + spec.type + '|' + (spec.value != null ? spec.value : spec.minTier);
}
