/**
 * Two different notions of "era" live here.
 *
 * `eraLabel` is the flavour text on the result screen — it names the period of
 * Hindi cinema your final score dove back to.
 *
 * `computeEraBuckets` / `eraOfYear` slice a single category into early / mid /
 * late thirds so a themed game can ask five genuinely different questions
 * instead of the same prompt five times.
 */

/** The first Indian feature film, Raja Harishchandra — the floor of the dive. */
export const CINEMA_START_YEAR = 1913;

export function eraLabel(year) {
  if (year >= 2020) return 'The Streaming & Pan-India Era';
  if (year >= 2010) return 'The Multiplex Blockbuster Era';
  if (year >= 2000) return 'The Multiplex-Romance Y2K Era';
  if (year >= 1990) return 'The 90s Family Drama Era';
  if (year >= 1980) return 'The Angry Young Man / Masala Era';
  if (year >= 1970) return 'The Golden Action-Melodrama Era';
  if (year >= 1960) return 'The Golden Age of Hindi Cinema';
  if (year >= 1950) return 'The Classic Studio Era';
  if (year >= 1931) return 'The Early Talkies Era';
  return 'The Dawn of Indian Cinema (Raja Harishchandra, 1913)';
}

/**
 * Split a category's year-tagged answers into three buckets of roughly equal
 * COUNT (not equal calendar span), so each bucket is actually answerable.
 * Returns null when there isn't enough year data to make that meaningful.
 */
export function computeEraBuckets(cat) {
  const withYear = cat.answers.filter((a) => a.year != null);
  if (withYear.length < 6) return null;
  const sorted = withYear.slice().sort((a, b) => a.year - b.year);
  const n = sorted.length;
  const i1 = Math.max(1, Math.floor(n / 3));
  const i2 = Math.min(n - 1, Math.max(i1 + 1, Math.floor((2 * n) / 3)));
  return { earlyMax: sorted[i1 - 1].year, midMax: sorted[i2 - 1].year };
}

export function eraOfYear(year, buckets) {
  if (year == null || !buckets) return null;
  if (year <= buckets.earlyMax) return 'early';
  if (year <= buckets.midMax) return 'mid';
  return 'late';
}

/** Human-readable range for a bucket, e.g. "1995–2013". */
export function eraLabelText(buckets, key) {
  if (key === 'early') return 'up to ' + buckets.earlyMax;
  if (key === 'mid') return buckets.earlyMax + 1 + '–' + buckets.midMax;
  return buckets.midMax + 1 + ' or later';
}
