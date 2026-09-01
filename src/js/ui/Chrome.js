/** The persistent frame around every screen: masthead and footer. */

import { h, useState } from './dom.js';
import { TIERS, MAX_TIER_POINTS } from '../data/tiers.js';
import { bankStats } from '../data/bank.js';
import { isMuted, setMuted } from '../lib/audio.js';
import { CINEMA_START_YEAR } from '../game/eras.js';

/**
 * Mute control. Sounds fire on every answer, so this has to be reachable at any
 * point in a game, not buried in a settings screen. The choice is remembered.
 */
function SoundToggle() {
  const [on, setOn] = useState(!isMuted());

  return h(
    'button',
    {
      className: 'sound-toggle',
      type: 'button',
      'aria-pressed': on ? 'true' : 'false',
      title: on ? 'Sound is on — click to mute' : 'Sound is off — click to unmute',
      onClick: () => { setMuted(on); setOn(!on); },
    },
    h(
      'svg',
      { viewBox: '0 0 16 16', 'aria-hidden': 'true' },
      h('path', { d: 'M2 6h2.5L8 3v10L4.5 10H2z' }),
      on
        ? h('path', { d: 'M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6 6 0 0 1 0 9' })
        : h('path', { d: 'M10.5 6l4 4M14.5 6l-4 4' })
    ),
    h('span', { className: 'st-label' }, on ? 'Sound on' : 'Sound off')
  );
}

export function TopHeader() {
  const { packs, answers } = bankStats();

  return h(
    'header',
    { className: 'top' },
    h(SoundToggle),
    // The lit rail across the top of the frontage.
    h('div', { className: 'bulbs', 'aria-hidden': 'true' }),
    // Real numbers off the bank, plus the year you are trying to reach.
    h('div', { className: 'kicker' }, `${packs} packs · ${answers} answers · dive to ${CINEMA_START_YEAR}`),
    // Printed three times, each pass slightly out of register — a screen
    // print that missed its marks.
    h(
      'h1',
      { className: 'wordmark' },
      h('span', { className: 'wm-ghost wm-ghost--peacock', 'aria-hidden': 'true' }, 'Bollybuzz.io'),
      h('span', { className: 'wm-ghost wm-ghost--magenta', 'aria-hidden': 'true' }, 'Bollybuzz.io'),
      h('span', { className: 'wm-main' }, 'Bollybuzz.io')
    ),
    /*
      The scoring rule stated outright, then anchored with the two numbers that
      bound it. Leading with the rule matters: a player who reads only the
      first line still knows the whole game, which the old wording — two
      example scores and no stated principle — left them to infer.

      The numbers are read from TIERS rather than written here, so re-pricing a
      tier cannot leave this sentence quietly lying about the scoring.
    */
    h(
      'p',
      { className: 'tagline' },
      'Name one answer per prompt. ',
      h('b', null, 'The rarest answers get the most points, the easy ones get the least'),
      ' — the film everyone names first is worth ',
      h('b', null, '+' + TIERS[0].points),
      ', the one almost nobody remembers is worth ',
      h('b', null, '+' + MAX_TIER_POINTS),
      '.'
    )
  );
}

export function AboutFooter() {
  return h(
    'footer',
    { className: 'about' },
    'Answers are matched loosely — misspell a title and it still counts. Type something the bank doesn’t know and the round stays open, so keep guessing until the clock runs out.'
  );
}
