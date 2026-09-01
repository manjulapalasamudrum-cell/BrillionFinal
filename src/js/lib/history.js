/**
 * What the player has already dived, kept in localStorage.
 *
 * This exists for the archive on the start screen: a list of past days is only
 * worth reading if it tells you which ones you have done and how you did. It
 * holds a best score per puzzle day and nothing else — no answers, no times,
 * nothing that could identify anyone. It never leaves the browser.
 *
 * Every access is wrapped, because localStorage is not merely "sometimes
 * empty": reading it *throws* in a browser set to block site data, and in
 * private windows in some versions. A game that will not start because a
 * scoreboard could not be read would be a poor trade, so failure here is
 * always silent and always falls back to "nothing played yet".
 */

const KEY = 'bollybuzz.history.v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    // Anything other than a plain object means the value was written by an
    // older or broken build; discard rather than crash reading it.
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (e) {
    return {};
  }
}

function write(all) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch (e) {
    /* Quota, private mode, or blocked storage — the game plays on regardless. */
  }
}

/** The whole record: { '2026-08-30': { score, total } }. */
export function allResults() {
  return read();
}

/** What the player scored on one day, or null if they have not played it. */
export function resultFor(key) {
  const rec = read()[key];
  return rec && typeof rec.score === 'number' ? rec : null;
}

/**
 * Record a finished dive. Keeps the best score rather than the latest: the
 * archive is a record of what you managed, and replaying a day should never
 * cost you the run you were pleased with.
 */
export function recordResult(key, score, total) {
  if (!key) return;
  const all = read();
  const prev = all[key];
  if (prev && typeof prev.score === 'number' && prev.score >= score) return;
  all[key] = { score, total };
  write(all);
}
