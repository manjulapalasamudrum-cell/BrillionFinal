/** Lights down: the run bar, the prompt, the clock, and the post-answer verdict. */

import { h } from './dom.js';
import { ROUND_SECONDS } from '../game/rounds.js';
import { constraintLabel } from '../game/constraints.js';

/** Below this many seconds the clock turns red and reads as urgent. */
const LOW_SECONDS = 5;

/**
 * The tier index at which an answer stops being merely good and gets a
 * celebration: a deep cut (+40) or a legendary rare (+50).
 *
 * It is defined as an INDEX rather than a points threshold because the tiers
 * are re-priced from time to time and a hard-coded "40 or more" would quietly
 * start firing on a different rung. TIERS is append-only by contract (see
 * data/tiers.js), so index 3 is stable in a way its price is not.
 */
const RARE_FROM_TIER = 3;

/** How many sparks the burst throws. Purely decorative, hence aria-hidden. */
const SPARK_COUNT = 10;

/**
 * The moment the whole scoring model exists to produce. A player who names
 * something almost nobody remembers should be told so immediately and loudly —
 * the number alone does not carry it, because +40 and +20 look alike in a
 * glance and only one of them is an achievement.
 */
function RareBurst({ tierIndex, points }) {
  const legendary = tierIndex >= 4;
  return h(
    'div',
    { className: 'rare-burst' + (legendary ? ' rare-burst--legendary' : ''), role: 'status' },
    h(
      'div',
      { className: 'rb-sparks', 'aria-hidden': 'true' },
      // Each spark is thrown at its own angle and distance, handed to CSS as
      // custom properties so one keyframe serves all ten.
      Array.from({ length: SPARK_COUNT }).map((_, i) =>
        h('i', {
          key: i,
          style: {
            '--a': (i * (360 / SPARK_COUNT)) + 'deg',
            '--d': (46 + (i % 3) * 16) + 'px',
            '--delay': (i * 18) + 'ms',
          },
        })
      )
    ),
    h('span', { className: 'rb-flame', 'aria-hidden': 'true' }, '🔥'),
    h('span', { className: 'rb-text' }, legendary ? 'Legendary rare!' : 'Rare answer!'),
    h('span', { className: 'rb-points' }, '+' + points)
  );
}

/** Shown once a round is locked in, before advancing to the next prompt. */
function Feedback({ feedback, idx, totalPrompts, onNext }) {
  const { raw, tierInfo, tierIndex, matchedLabel, correction } = feedback;
  const rare = tierIndex >= RARE_FROM_TIER;

  return h(
    'div',
    { className: 'feedback' + (rare ? ' feedback--rare' : '') },
    rare ? h(RareBurst, { tierIndex, points: tierInfo.points }) : null,
    h(
      'div',
      { className: 'fb-top' },
      h(
        'span',
        {
          className: 'fb-tier',
          // The swatch is the tier's own colour, and on this palette all five
          // rungs are LIGHT fills, so all five carry the dark ink. Only MISS —
          // which is not in TIERS and arrives as -1 — is a dark swatch and
          // needs the off-white back.
          style: {
            background: tierInfo.color,
            color: tierIndex >= 0 ? 'var(--on-gold)' : 'var(--on-red)',
          },
        },
        tierInfo.label
      ),
      h('span', { className: 'fb-points' }, '+' + tierInfo.points)
    ),
    h(
      'div',
      { className: 'fb-matched' },
      h('span', null, 'You typed'),
      ' ',
      raw && raw.trim() ? raw : h('i', null, 'nothing'),
      h('br'),
      h('span', null, 'Counted as'),
      ' ',
      matchedLabel
    ),
    correction
      ? h(
          'div',
          { className: 'fb-correction' },
          'Spelled ',
          h('b', null, correction.correct),
          ' — counted anyway.'
        )
      : null,
    h(
      'div',
      { className: 'fb-actions' },
      h('button', { className: 'btn-gold', onClick: onNext }, idx < totalPrompts - 1 ? 'Next prompt' : 'See how deep you got')
    )
  );
}

/**
 * The run bar: where you are, what you have, and what each round paid.
 *
 * It replaced a plain "Prompt 3 / 10 · Score 120" line at the top and a row of
 * grey dots at the very bottom of the card — two halves of the same fact,
 * placed as far apart as the card allowed, neither of them showing what any
 * round was actually worth.
 *
 * The bar is SEGMENTED rather than continuous, and that is the whole reason it
 * is worth the space: each segment takes the COLOUR of the tier that round
 * paid, so the bar accumulates into a picture of the run. Four grey segments
 * and a gold one says something a running total never can.
 *
 * There was briefly a continuous fill bar above the segments as well. It was
 * cut: it could only ever say "you are 3 of 10 through", which the segments
 * and the "Round 3 / 10" beside them both already said, so the card carried
 * three statements of one fact and no statement of the interesting one.
 */
function RunBar({ idx, totalPrompts, score, log, scored }) {
  return h(
    'div',
    { className: 'runbar' + (scored ? ' is-scored' : '') },
    h(
      'div',
      { className: 'runbar-head' },
      h('span', { className: 'rb-round' }, 'Round ', h('b', null, idx + 1), ' / ' + totalPrompts),
      h('span', { className: 'rb-score' }, h('i', null, 'Score'), h('b', null, score))
    ),
    h(
      'div',
      {
        className: 'runbar-pips',
        role: 'progressbar',
        'aria-label': 'Rounds completed',
        'aria-valuenow': log.length,
        'aria-valuemin': 0,
        'aria-valuemax': totalPrompts,
      },
      Array.from({ length: totalPrompts }).map((_, i) => {
        const entry = log[i];
        return h('div', {
          key: i,
          className: 'pdot' + (entry ? ' done' : '') + (i === idx ? ' now' : ''),
          // A played round is painted in what it paid; an unplayed one is left
          // as empty track.
          style: entry ? { background: entry.tier.color } : null,
        });
      })
    )
  );
}

export function GameScreen({
  idx, totalPrompts, score, timeLeft, mode, roundPlan, cat, gameLabel, log,
  inputValue, setInputValue, onSubmit, onSkip, onQuit,
  retryMsg, feedback, locked, inputRef, onNext,
}) {
  // Every mode phrases its own rounds now, the Daily Dive included. The
  // `cat.kicker` / `cat.title` fallback below is what the Dive used to run on
  // — the pack's title printed as the prompt, which is why its ten rounds all
  // read alike — and survives only for a pack too thin to plan.
  const planned = roundPlan && roundPlan.rounds[idx];
  const kicker = planned
    ? (mode === 'daily' ? gameLabel : 'Round ' + (idx + 1) + ' of ' + totalPrompts)
    : cat.kicker;
  const title = planned ? planned.text : cat.title;
  // What this round restricts answers to, if anything. Shown on its own line
  // because the pack's generic hint ("Any film where he's a lead...") directly
  // contradicts it, and a player reading "Any film" then sees a valid answer
  // turned away and reasonably concludes the game does not know the film.
  const limit = constraintLabel(planned);
  // Only a themed game returns to the same pack each round, so only there does
  // "no repeats" actually bite.
  const hint = cat.hint + (mode === 'themed' ? ' No repeats.' : '');
  const seconds = Math.max(0, timeLeft);
  const pct = (seconds / ROUND_SECONDS) * 100;
  const low = !locked && seconds <= LOW_SECONDS;

  return h(
    'div',
    { id: 'screen-game', className: 'card card--screen' },

    h(RunBar, { idx, totalPrompts, score, log, scored: !!feedback }),

    // The clock is a length of film: perforations run out as it depletes.
    h(
      'div',
      { className: 'timer' + (low ? ' timer--low' : '') },
      h(
        'div',
        {
          className: 'timer-track',
          // One perforation per second. Handing the width to CSS from the
          // constant keeps the strip countable no matter what the clock is
          // set to — it used to be hard-coded and silently wrong if changed.
          style: { '--tick': 100 / ROUND_SECONDS + '%' },
          role: 'progressbar',
          'aria-label': 'Seconds remaining',
          'aria-valuenow': seconds,
          'aria-valuemin': 0,
          'aria-valuemax': ROUND_SECONDS,
        },
        h('div', { className: 'timer-fill', style: { width: pct + '%' } })
      ),
      h('span', { className: 'timer-count' }, seconds + 's')
    ),

    // The prompt, given a surface of its own. It is the only thing on the
    // screen a player has to read, and on the previous layout it was one more
    // block of centred text between a clock and an input.
    h(
      'div',
      { className: 'prompt-card' },
      h('div', { className: 'cl-kicker' }, kicker),
      h('h2', null, title),
      limit ? h('div', { className: 'cl-limit' }, limit) : null,
      h('div', { className: 'cl-hint' }, hint)
    ),

    h(
      'div',
      { className: 'answer-row' },
      h('input', {
        id: 'answerInput',
        ref: inputRef,
        type: 'text',
        placeholder: 'Type one answer',
        /*
          Every one of these is off deliberately. Phone keyboards autocorrect
          and autocapitalise aggressively, and these titles are exactly what
          they mangle — "Baazigar", "Chhaava", "Raanjhanaa" are not words any
          dictionary knows, so the keyboard "fixes" them into something else
          between the keystroke and the submit. The game does its own matching
          and is already forgiving about spelling; it cannot be forgiving about
          a word the keyboard silently replaced.

          Passed as strings, not booleans: spellCheck={false} would make the
          renderer drop the attribute entirely, which means "default on".
        */
        autoComplete: 'off',
        autoCorrect: 'off',
        autoCapitalize: 'none',
        spellCheck: 'false',
        'aria-label': 'Your answer',
        value: inputValue,
        disabled: locked,
        onChange: (e) => setInputValue(e.target.value),
        onKeyDown: (e) => { if (e.key === 'Enter') onSubmit(); },
      }),
      h('button', { className: 'btn-primary', disabled: locked, onClick: onSubmit }, 'Dive')
    ),

    h(
      'div',
      { className: 'skip-row' },
      h('button', { className: 'linklike', type: 'button', disabled: locked, onClick: onSkip }, 'skip this prompt, score nothing')
    ),

    retryMsg ? h('div', { className: 'retry-note', role: 'status' }, retryMsg) : null,
    feedback ? h(Feedback, { feedback, idx, totalPrompts, onNext }) : null,

    h(
      'div',
      { className: 'back-row' },
      h('button', { className: 'linklike', type: 'button', onClick: onQuit }, 'quit to the menu')
    )
  );
}
