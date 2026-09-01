/**
 * Rarity tiers. A tier's index is what `categories.js` stores on each answer,
 * so the order of this array is load-bearing — never reorder it, only append.
 *
 * `sq` is the emoji square used in the shareable result grid.
 * `commonness` is how wide that tier's bar is drawn on the start screen: it is
 * the same claim `tier` already makes, just stated as a number so the ladder
 * can show it rather than assert it.
 */
export const TIERS = [
  { key: 'common',    label: 'Everyone said that', points: 10, commonness: 100, color: 'var(--tier-common)',    sq: '🟦' },
  { key: 'known',     label: 'Well known',         points: 20, commonness: 62,  color: 'var(--tier-known)',     sq: '🟩' },
  { key: 'solid',     label: 'Solid pick',         points: 30, commonness: 40,  color: 'var(--tier-solid)',     sq: '🟨' },
  { key: 'deepcut',   label: 'Deep cut',           points: 40, commonness: 23,  color: 'var(--tier-deepcut)',   sq: '🟧' },
  { key: 'legendary', label: 'Legendary rare',     points: 50, commonness: 10,  color: 'var(--tier-legendary)', sq: '🟥' },
];

/**
 * Awarded on a timeout or a skip — scores nothing but still fills a grid
 * square. The label covers both cases, so it says what happened (nothing was
 * answered) rather than judging an answer that was never given.
 */
export const MISS = { key: 'miss', label: 'No answer', points: 0, color: 'var(--tier-miss)', sq: '⬛' };

/** Highest tier value, used to scale a score into a "you dove to year X" result. */
export const MAX_TIER_POINTS = TIERS[TIERS.length - 1].points;
