/**
 * Round planning: what each prompt of a game asks, and what counts as a valid
 * answer for that specific prompt.
 *
 * A round plan is `{ rounds: [spec, ...] }`. Each spec carries its question
 * text plus the constraint that validates an answer:
 *   { type:'open' }                          anything in the pack
 *   { type:'era',     value, buckets }       the answer's year must be in bucket
 *   { type:'role',    value }                actor, or character
 *   { type:'rarity',  minTier }              at least this rare
 *   { type:'initial', value }                the answer starts with this letter
 *   { type:'words',   value:'one'|'many' }   a one-word answer, or four-plus
 *   { type:'decade',  value }                released in this decade
 *
 * `buckets` lives on the spec rather than the plan because a daily show uses a
 * different pack every round, and each pack has its own era boundaries.
 *
 * WHY THERE ARE SEVEN TYPES AND NOT TWO. Every prompt in this game used to be
 * "Name a <pack title>", optionally with a year clause bolted on, which meant
 * the year was the only thing that ever varied — ten rounds of the Daily Dive
 * asked the same question about ten different packs, and the daily shows
 * differed from each other by a date range and nothing else. The pack supplies
 * the subject; the type has to supply the question. The four types added here
 * (`initial`, `words` twice over, `decade`, and `rarity`, which existed but was
 * never reached) all read off fields the bank already carries, so none of them
 * needed a data migration — see `viableTypes` for what each pack can support.
 */

import { CATEGORIES } from '../data/categories.js';
import { DAILY_SHOWS, findShow } from '../data/dailies.js';
import { computeEraBuckets, eraLabelText, eraOfYear } from './eras.js';
import {
  mulberry32, seededShuffle, dateSeed, puzzleDate, dateFromKey, formatPuzzleKey,
} from '../lib/random.js';

/*
  MIXED_ROUNDS is the Daily Dive. It is set to the number of packs on purpose:
  the draw takes each pack exactly once, so no question can repeat within a
  day — that is a property of the arithmetic, not a check that could be
  forgotten. Adding an 11th pack means either raising this or accepting that
  one pack sits out each day.
*/
export const MIXED_ROUNDS = 10;
export const THEMED_ROUNDS = 5;
export const DAILY_ROUNDS = 5;
export const ROUND_SECONDS = 40;

/*
  How many past days the archive offers. Two weeks is enough that someone who
  drops the habit for a while can pick it back up, and short enough that the
  list stays a list rather than a scrolling year.

  There is no floor date and no stored history of puzzles because none is
  needed: a day's dive is a pure function of its date, so any date at all
  rebuilds exactly the game that was played then. Raising this number is the
  entire change required to offer a longer archive.
*/
export const ARCHIVE_DAYS = 14;

function article(t) {
  return /^[aeiou]/i.test(t) ? 'an' : 'a';
}

/**
 * Does this answer break the round's extra constraint? Returns the reason —
 * 'era', 'role' or 'rarity' — or null when the answer is allowed.
 *
 * Both callers need the same rule and must never drift apart: App.js turns the
 * reason into the message shown when an answer is rejected, and
 * `alternativesFor` below uses it to make sure the result screen never suggests
 * an answer the round would itself have refused.
 */
export function violatesConstraint(spec, entry) {
  if (!spec) return null;
  if (spec.type === 'era' && entry.year != null &&
      eraOfYear(entry.year, spec.buckets) !== spec.value) return 'era';
  if (spec.type === 'role' && entry.role && entry.role !== spec.value) return 'role';
  if (spec.type === 'rarity' && entry.tier < spec.minTier) return 'rarity';
  if (spec.type === 'initial' && firstLetter(entry.name) !== spec.value) return 'initial';
  if (spec.type === 'words' && !matchesWordCount(spec.value, entry.name)) return 'words';
  if (spec.type === 'decade' && entry.year != null &&
      Math.floor(entry.year / 10) * 10 !== spec.value) return 'decade';
  return null;
}

/**
 * The letter a player would file this answer under. Leading punctuation and
 * articles-as-digits are skipped so "Ra.One" files under R and a title opening
 * with a quote mark does not file under nothing.
 */
export function firstLetter(name) {
  const m = /[a-z]/i.exec(name || '');
  return m ? m[0].toUpperCase() : '';
}

export function wordCount(name) {
  return String(name || '').trim().split(/\s+/).filter(Boolean).length;
}

/** Long titles start at four words — see LONG_TITLE_WORDS for why four. */
const LONG_TITLE_WORDS = 4;

function matchesWordCount(value, name) {
  const n = wordCount(name);
  return value === 'one' ? n === 1 : n >= LONG_TITLE_WORDS;
}

/**
 * The round's restriction, stated plainly for the player, or null when the
 * round accepts anything in the pack.
 *
 * This exists because a constrained round used to show the pack's generic hint
 * — "Any film where he's a lead or major role" — directly under a prompt that
 * said "up to 1996". A valid answer from the wrong decade then looked like the
 * game had failed to recognise it, when the screen had in fact contradicted
 * itself. The restriction now gets its own line and says only this.
 */
export function constraintLabel(spec) {
  if (!spec) return null;
  // A spec may carry its own wording when the generic phrasing would be wrong
  // for its pack — the director pack's `year` is a breakthrough, not a release.
  if (spec.label) return spec.label;
  if (spec.type === 'era') return 'Released ' + eraLabelText(spec.buckets, spec.value);
  if (spec.type === 'role') {
    return spec.value === 'actor'
      ? 'An actor’s name — not a character'
      : 'A character’s name — not an actor';
  }
  if (spec.type === 'rarity') return 'Deep cuts only — worth +' + spec.minTier * 10 + ' or more';
  if (spec.type === 'initial') return 'Must begin with the letter ' + spec.value;
  if (spec.type === 'words') {
    return spec.value === 'one'
      ? 'One word only'
      : LONG_TITLE_WORDS + ' words or more';
  }
  if (spec.type === 'decade') return 'Released in the ' + spec.value + 's';
  return null;
}

/**
 * A few answers the player could have given for a round, for the result
 * screen. Deliberately spans the rarity range — the cheapest valid answer, the
 * rarest, and one in between — because the point is to show what the scoring
 * model rewards, not to list the pack.
 *
 * `exclude` is the set of names already used this game, so nothing is offered
 * back that the player already named or that a repeat check would have blocked.
 */
export function alternativesFor(catId, spec, exclude, limit) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  if (!cat) return [];

  const skip = new Set(exclude || []);
  const valid = cat.answers.filter((e) => !skip.has(e.name) && !violatesConstraint(spec, e));
  if (!valid.length) return [];

  const byTier = valid.slice().sort((a, b) => a.tier - b.tier);
  const picks = [];
  const take = (entry) => { if (entry && picks.indexOf(entry) < 0) picks.push(entry); };
  take(byTier[0]);                                 // what everyone says
  take(byTier[byTier.length - 1]);                 // the rarest still available
  take(byTier[Math.floor(byTier.length / 2)]);     // something in between

  return picks.sort((a, b) => a.tier - b.tier).slice(0, limit || 3);
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
function eraSpec(cat, buckets, value) {
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
const ROUND_FLAVORS = [
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
function assignTypes(cats, rng) {
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

/* ---------------------------------------------------------------------------
   Themed games — one pack, five rounds, each asking a different KIND of thing
--------------------------------------------------------------------------- */

/**
 * Five rounds on one pack. Because the pack never changes, the type is the
 * only thing that can make one round differ from the next — so take five
 * different types, in a fixed order rather than a seeded one: a themed game is
 * replayable on demand and should not shuffle itself between attempts.
 *
 * Falls back to ROUND_FLAVORS only for a pack so thin it supports fewer than
 * five types, where rounds can differ in tone but not in substance.
 */
export function buildRoundPlan(cat) {
  const groups = viableTypes(cat);
  if (groups.length < THEMED_ROUNDS) {
    return { rounds: ROUND_FLAVORS.map((f) => ({ type: 'open', text: f(cat.title) })) };
  }

  // 'open' is the least interesting question in the catalogue, so it goes last
  // where it reads as a breather rather than as the game failing to ask.
  const ordered = groups.filter((g) => g.id !== 'open').concat(groups.filter((g) => g.id === 'open'));
  return { rounds: ordered.slice(0, THEMED_ROUNDS).map((g) => g.specs[0]) };
}

/* ---------------------------------------------------------------------------
   Daily shows — five packs, one constraint, seeded so everyone plays the same
--------------------------------------------------------------------------- */

/** How many answers a pack must have under a constraint to be worth asking. */
const MIN_VIABLE_ANSWERS = 3;

/** Can this pack host a round under this constraint at all? */
function isEligible(constraint, cat) {
  if (constraint.type === 'era') {
    // Needs enough year-tagged answers to split into thirds meaningfully.
    return computeEraBuckets(cat) != null;
  }
  if (constraint.type === 'rarity') {
    return cat.answers.filter((a) => a.tier >= constraint.minTier).length >= MIN_VIABLE_ANSWERS;
  }
  return true;
}

/** One question, phrased for this pack under this show's constraint. */
function buildDailyRound(constraint, cat) {
  const art = article(cat.title);

  if (constraint.type === 'era') {
    return eraSpec(cat, computeEraBuckets(cat), constraint.value);
  }

  if (constraint.type === 'rarity') {
    return {
      type: 'rarity',
      minTier: constraint.minTier,
      text: 'Name ' + art + ' ' + cat.title + ' — deep cut only.',
    };
  }

  return { type: 'open', text: 'Name ' + art + ' ' + cat.title + '.' };
}

/**
 * Seed a game off the date AND its own id, so different games draw different
 * packs from one another while every player gets the same set today.
 */
function seedFor(id, date) {
  let h = dateSeed(date);
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

export function buildDailyPlan(show, date = new Date()) {
  const pool = CATEGORIES.filter((c) => isEligible(show.constraint, c));
  const rng = mulberry32(seedFor(show.id, date));
  const picked = seededShuffle(pool, rng).slice(0, DAILY_ROUNDS);
  return {
    list: picked,
    total: picked.length,
    // A 'mixed' show has no single constraint to apply — varying the type from
    // round to round is the whole of what it is, so it draws from the
    // catalogue instead. The other shows are defined by their one constraint
    // and must keep applying it to every round, which is what stops two shows
    // on the same pack from ever asking the same question.
    rounds: show.constraint.type === 'mixed'
      ? assignTypes(picked, rng)
      : picked.map((cat) => buildDailyRound(show.constraint, cat)),
  };
}

/**
 * The Daily Dive: ten packs, and now ten different kinds of question.
 *
 * Seeded off the calendar date, so every player gets the same ten prompts
 * today and a different ten tomorrow — which is what makes the shared result
 * grid worth pasting into a chat. The pack draw takes each pack exactly once
 * (MIXED_ROUNDS equals the pack count), so no question repeats within a day;
 * `assignTypes` then spends the type catalogue across those ten rounds so no
 * *kind* of question repeats needlessly either.
 *
 * `total` comes from what was actually drawn rather than from the constant, so
 * removing a pack shortens the game instead of leaving a blank round.
 */
export function buildDivePlan(date = new Date()) {
  const rng = mulberry32(seedFor('dive', date));
  const picked = seededShuffle(CATEGORIES, rng).slice(0, MIXED_ROUNDS);
  return {
    list: picked,
    total: picked.length,
    rounds: assignTypes(picked, rng),
  };
}

/* ---------------------------------------------------------------------------
   Session assembly
--------------------------------------------------------------------------- */

/**
 * Choose the packs and the round plan for one game.
 *   'daily'    — one of the programme's shows, seeded off today's date
 *   'themed'   — the same pack every round, distinguished by the round plan
 *   'practice' — the Daily Dive: every pack once, seeded off a date
 *
 * `key` is a show id for 'daily', a pack id for 'themed', and for 'practice' a
 * puzzle day from the archive ("2026-08-30") or absent for today.
 */
export function pickSession(mode, key) {
  if (mode === 'daily') {
    const show = findShow(key) || DAILY_SHOWS[0];
    const plan = buildDailyPlan(show);
    return {
      list: plan.list,
      total: plan.total,
      roundPlan: { rounds: plan.rounds },
      label: show.name,
    };
  }

  if (mode === 'themed') {
    const cat = CATEGORIES.find((c) => c.id === key);
    return {
      list: new Array(THEMED_ROUNDS).fill(cat),
      total: THEMED_ROUNDS,
      roundPlan: buildRoundPlan(cat),
      label: cat.title,
    };
  }

  /*
    The Daily Dive. `key` is a puzzle day ("2026-08-30") when the player picked
    one out of the archive, and absent for today's. Because the plan is a pure
    function of the date, a past day needs no stored puzzle — it is rebuilt
    from its own date, identical to what everyone saw that day.
  */
  const dayKey = key || puzzleDate();
  const plan = buildDivePlan(dateFromKey(dayKey));
  return {
    list: plan.list,
    total: plan.total,
    puzzleKey: dayKey,
    // This used to be null, which is what made the main game ten rounds of
    // "Name a <pack>": with no plan, GameScreen fell back to printing the
    // pack's own title as the prompt. The Dive now carries a plan like every
    // other mode.
    roundPlan: { rounds: plan.rounds },
    // 'practice' is what this mode *was* — random, unconstrained, replayable.
    // "Daily Dive" is what it is called on the hoarding: the main game. An
    // archived day says which day on screen, where there is nothing else to
    // tell you which run you are looking at...
    label: key ? 'Daily Dive · ' + formatPuzzleKey(dayKey) : 'Daily Dive',
    // ...but not in the shared grid, which stamps the puzzle's date on its own
    // line. "Daily Dive · Mon 31 Aug (2026-08-31)" says it twice.
    shareName: 'Daily Dive',
  };
}
