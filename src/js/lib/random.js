/** Seeded randomness — lets the Daily Dive serve everyone the same set. */

/** Small, fast, seedable PRNG. Same seed in, same sequence out. */
export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates using a supplied RNG, so shuffles are reproducible. */
export function seededShuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/*
  The puzzle day runs midnight-to-midnight in India, for every player wherever
  they are. Two things follow from that, and both are deliberate:

    - The set turns over at 00:00 IST worldwide, not at each player's own
      midnight. A player in London sees it flip at 18:30 their time. That is
      the cost of everyone being on the same puzzle at the same moment, which
      is what makes the shared result grid mean anything.
    - Taken from the UTC clock and shifted, never from the device clock, so
      changing the machine's time zone cannot serve a different puzzle.

  India observes no daylight saving, so the +5:30 offset is fixed year-round
  and needs no table.
*/
const IST_OFFSET_MINUTES = 5 * 60 + 30;

/** The calendar date in India for a given instant, as "YYYY-MM-DD". */
export function puzzleDate(d = new Date()) {
  return new Date(d.getTime() + IST_OFFSET_MINUTES * 60000).toISOString().slice(0, 10);
}

/** Hash the puzzle day down to one integer so a given day always seeds alike. */
export function dateSeed(d) {
  const s = puzzleDate(d);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
