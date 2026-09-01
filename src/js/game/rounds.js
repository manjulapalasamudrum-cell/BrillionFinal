/**
 * Session assembly: which packs a game draws, and the plan of rounds over them.
 *
 * The three modes and where each gets its questions:
 *   Daily Dive  every pack at most once, types spread by `assignTypes`
 *   daily show  five packs under one constraint, or `mixed` for a type each
 *   themed      one pack for five rounds, so the type is all that varies
 *
 * What a round ASKS lives in ./question-types.js; what a round ACCEPTS lives in
 * ./constraints.js. This file only chooses and orders.
 */

import { CATEGORIES } from '../data/categories.js';
import { DAILY_SHOWS, findShow } from '../data/dailies.js';
import { scheduleFor } from '../data/schedule.js';
import { computeEraBuckets } from './eras.js';
import { article, eraSpec, viableTypes, assignTypes, ROUND_FLAVORS } from './question-types.js';
import {
  mulberry32, seededShuffle, dateSeed, puzzleDate, dateFromKey, formatPuzzleKey,
} from '../lib/random.js';

/*
  MIXED_ROUNDS is the Daily Dive. The draw takes each pack at most once, so no
  question can repeat within a day - a property of the arithmetic rather than a
  check somebody has to remember.

  It was once exactly the number of packs, so every pack appeared every day.
  There are seventeen now and seven rest each day: the alternative was a
  seventeen-round game, and the length of the main game should not be decided by
  how many packs happen to exist. Which packs rest is seeded off the date, so it
  is the same for everyone and rotates on its own.
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
 * Resolve a scheduled day into rounds, dropping anything unaskable.
 *
 * A prompt naming a pack that does not exist is skipped rather than throwing.
 * That is what lets data/schedule.js record a set before every pack behind it
 * has been built: the day degrades to fewer fixed rounds instead of breaking,
 * and each new pack silently brings its prompt to life.
 */
function scheduledPrompts(dayKey) {
  const day = scheduleFor(dayKey);
  if (!day || !day.prompts) return [];

  const out = [];
  day.prompts.forEach((p) => {
    const cat = CATEGORIES.find((c) => c.id === p.pack);
    if (!cat) return;

    const spec = Object.assign({}, p.spec, { text: p.text });
    // Era buckets are a property of the pack, not something a schedule should
    // have to write out by hand — and an era spec without them rejects every
    // answer, which would be a silent, total failure of that round.
    if (spec.type === 'era' && !spec.buckets) spec.buckets = computeEraBuckets(cat);
    out.push({ cat, spec });
  });
  return out.slice(0, MIXED_ROUNDS);
}

/**
 * The Daily Dive: ten packs, ten different kinds of question.
 *
 * Seeded off the calendar date, so every player gets the same ten prompts
 * today and a different ten tomorrow — which is what makes the shared result
 * grid worth pasting into a chat. `assignTypes` spends the type catalogue
 * across the rounds so no *kind* of question repeats needlessly either.
 *
 * A day named in data/schedule.js takes its fixed prompts first, in order, and
 * fills the rest from the ordinary draw with those packs excluded — so a day
 * that specifies four rounds still plays ten, and no pack is asked twice.
 *
 * `total` comes from what was actually drawn rather than from the constant, so
 * removing a pack shortens the game instead of leaving a blank round.
 */
export function buildDivePlan(date = new Date()) {
  const rng = mulberry32(seedFor('dive', date));

  const fixed = scheduledPrompts(puzzleDate(date));
  const spoken = new Set(fixed.map((f) => f.cat.id));
  const pool = CATEGORIES.filter((c) => !spoken.has(c.id));
  const filler = seededShuffle(pool, rng).slice(0, MIXED_ROUNDS - fixed.length);

  return {
    list: fixed.map((f) => f.cat).concat(filler),
    total: fixed.length + filler.length,
    rounds: fixed.map((f) => f.spec).concat(assignTypes(filler, rng)),
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
