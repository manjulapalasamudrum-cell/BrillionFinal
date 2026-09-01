/** Lights down: prompt, clock, answer box, and the post-answer verdict. */

import { h } from './dom.js';
import { ROUND_SECONDS, constraintLabel } from '../game/rounds.js';

/** Below this many seconds the clock turns red and reads as urgent. */
const LOW_SECONDS = 5;

/** Shown once a round is locked in, before advancing to the next prompt. */
function Feedback({ feedback, idx, totalPrompts, onNext }) {
  const { raw, tierInfo, matchedLabel, correction } = feedback;
  return h(
    'div',
    { className: 'feedback' },
    h(
      'div',
      { className: 'fb-top' },
      h('span', { className: 'fb-tier', style: { background: tierInfo.color } }, tierInfo.label),
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

export function GameScreen({
  idx, totalPrompts, score, timeLeft, mode, roundPlan, cat, gameLabel,
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
    h(
      'div',
      { className: 'hud' },
      h('span', null, 'Prompt ', h('b', null, idx + 1), ' / ' + totalPrompts),
      h('span', null, 'Score ', h('b', null, score))
    ),

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

    h(
      'div',
      { className: 'cat-label' },
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
      { className: 'progress-dots', 'aria-hidden': 'true' },
      Array.from({ length: totalPrompts }).map((_, i) =>
        h('div', { key: i, className: 'pdot' + (i < idx ? ' done' : '') + (i === idx ? ' now' : '') })
      )
    ),
    h(
      'div',
      { className: 'back-row' },
      h('button', { className: 'linklike', type: 'button', onClick: onQuit }, 'quit to the menu')
    )
  );
}
