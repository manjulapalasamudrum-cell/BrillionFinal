/**
 * Facts read straight off the answer bank, so the start screen states real
 * numbers and real titles instead of marketing claims. Edit `categories.js`
 * and the masthead and the rarity ladder follow along.
 */

import { CATEGORIES } from './categories.js';
import { TIERS } from './tiers.js';

/** Pack count, answer count, and the span of years the bank actually covers. */
export function bankStats() {
  let answers = 0;
  let earliest = Infinity;
  let latest = -Infinity;
  for (const cat of CATEGORIES) {
    answers += cat.answers.length;
    for (const a of cat.answers) {
      if (a.year == null) continue;
      if (a.year < earliest) earliest = a.year;
      if (a.year > latest) latest = a.year;
    }
  }
  return { packs: CATEGORIES.length, answers, earliest, latest };
}

/**
 * One real answer per tier, drawn from a single pack, to demonstrate the
 * scoring on the start screen. Using one pack is the point: five films by the
 * same actor makes it obvious that the spread is rarity, not difficulty.
 *
 * Falls back to the first pack that can supply all five tiers.
 */
export function rarityLadder(preferredId = 'srk') {
  const ordered = [
    ...CATEGORIES.filter((c) => c.id === preferredId),
    ...CATEGORIES.filter((c) => c.id !== preferredId),
  ];

  for (const cat of ordered) {
    const rows = TIERS.map((tier, i) => {
      const entry = cat.answers.find((a) => a.tier === i);
      return entry ? { tier, entry } : null;
    });
    if (rows.every(Boolean)) return { category: cat, rows };
  }
  return null;
}
