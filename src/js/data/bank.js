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
 * Titles for the poster wall behind the masthead.
 *
 * Round-robins across the packs rather than reading them in order, so the wall
 * is a cross-section of the whole bank instead of the first pack twice over.
 *
 * Only entries carrying a `year` are taken: that is what separates a film from
 * a person or a character, and a wall of hoardings advertising "Amrish Puri"
 * would be a different and much stranger page. Long titles are skipped because
 * a tile is about 100px wide and clamps at two lines — anything longer arrives
 * as an ellipsis, which reads as damage rather than as texture.
 *
 * Deterministic: no PRNG, so the wall is the same on every load and does not
 * flicker into a new arrangement on each re-render.
 */
export function wallTitles(count = 24) {
  const pools = CATEGORIES.map((c) =>
    c.answers.filter((a) => a.year != null && a.name.length <= 26).map((a) => a.name)
  );
  const seen = new Set();
  const out = [];
  for (let depth = 0; out.length < count; depth++) {
    let foundAny = false;
    for (const pool of pools) {
      if (depth >= pool.length) continue;
      foundAny = true;
      const name = pool[depth];
      if (seen.has(name)) continue;
      seen.add(name);
      out.push(name);
      if (out.length >= count) break;
    }
    // Every pack exhausted before the wall filled — take what there is rather
    // than spin forever on a thin bank.
    if (!foundAny) break;
  }
  return out;
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
