/** Turning a score into the game's payoff: how far back you dove. */

import { MAX_TIER_POINTS } from '../data/tiers.js';
import { CINEMA_START_YEAR, eraLabel } from './eras.js';
import { puzzleDate } from '../lib/random.js';

/** The present-day end of the timeline you are diving back from. */
export const PRESENT_YEAR = 2026;

/** What a flawless run is worth: every prompt answered at the rarest tier. */
export function maxScore(totalPrompts) {
  return totalPrompts * MAX_TIER_POINTS;
}

/**
 * Map a score onto the 1913–present timeline: zero points leaves you in the
 * present, a perfect run of legendary answers reaches the very first film.
 */
export function depthYear(score, totalPrompts) {
  const span = PRESENT_YEAR - CINEMA_START_YEAR;
  const year = Math.round(PRESENT_YEAR - score * (span / maxScore(totalPrompts)));
  return Math.min(PRESENT_YEAR, Math.max(CINEMA_START_YEAR, year));
}

/** The Wordle-style grid players paste into chats. */
export function buildShareText({ gameName, score, year, log }) {
  const squares = log.map((r) => r.tier.sq).join('');
  // The puzzle's date, not the poster's — two people sharing the same game
  // must stamp the same day even when their own clocks disagree.
  const dateStr = puzzleDate();
  return (
    'Bollybuzz.io — ' + gameName + ' (' + dateStr + ')\n' +
    squares + '\n' +
    'Score: ' + score + ' pts → dove to ' + year + ' (' + eraLabel(year) + ')'
  );
}
