/**
 * Answer matching. Players type film titles from memory, so the bar for
 * "correct" is deliberately forgiving: casing, punctuation, accents, leading
 * articles, romanisation differences and small misspellings all still count.
 */

/** Fold an answer down to a comparable key: lowercase, unaccented, article-less. */
export function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/^(the|a|an)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A second, deliberately blunter key that folds away the ways Hindi and Urdu
 * get romanised differently by different people. There is no single correct
 * spelling of these titles in Latin script — "Jaan"/"Jan", "Do"/"Doh",
 * "Rukh"/"Ruk", "Zindagi"/"Jindagi" are all things real players type — and
 * edit distance alone treats each of those as a mistake to be paid for.
 *
 * Both sides of a comparison get the same fold, so the rules only need to be
 * consistent, not linguistically correct.
 *
 * "dil dhankne doh" and "dil dhadakne do" are 3 edits apart raw, which the
 * length-scaled threshold refuses. Folded, they are 2 apart and match.
 */
export function looseKey(s) {
  return normalize(s)
    // A trailing h after a vowel is decoration: "doh" -> "do", "rukh" -> "ruk".
    // An h after a consonant is a real digraph (dh, kh, gh, bh, ch, sh) and stays.
    .replace(/([aeiou])h(?=\s|$)/g, '$1')
    // Doubled letters carry no distinction here: "jaan" -> "jan", "mastaani" -> "mastani".
    .replace(/(.)\1+/g, '$1')
    // Interchangeable in practice.
    .replace(/w/g, 'v')
    .replace(/z/g, 'j')
    .replace(/ck/g, 'k')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Edit distance, used only after an exact match has failed.
 *
 * This is the Damerau variant (optimal string alignment): swapping two
 * neighbouring letters costs ONE edit, not two. That matters because
 * transposition is what fingers actually do — "pahtaan" for "Pathaan",
 * "dagnal" for "Dangal", "shoaly" for "Sholay". Plain Levenshtein charges two
 * for those, which pushes a single slip past the threshold on a short title
 * and rejects an answer the player plainly knew.
 */
export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      // Adjacent transposition: "ht" typed where "th" was wanted.
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[m][n];
}

/**
 * How many typos to forgive at a given length. Short titles get no slack —
 * at four characters, one edit is usually a genuinely different answer.
 */
export function typoThreshold(len) {
  if (len <= 4) return 0;
  if (len <= 7) return 1;
  if (len <= 14) return 2;
  return Math.min(5, Math.round(len * 0.15));
}

/** Every string an entry can be reached by, under a given folding function. */
function keysFor(entry, fold) {
  return [entry.name, ...(entry.aliases || [])].map(fold);
}

/** Closest entry within the length-scaled threshold, or null. */
function closest(answers, typed, fold) {
  let best = null;
  let bestDist = Infinity;
  for (const entry of answers) {
    for (const candidate of keysFor(entry, fold)) {
      const threshold = typoThreshold(Math.max(candidate.length, typed.length));
      if (threshold === 0) continue;
      // Cheap length guard before paying for the full distance matrix.
      if (Math.abs(candidate.length - typed.length) > threshold + 2) continue;
      const dist = levenshtein(candidate, typed);
      if (dist <= threshold && dist < bestDist) {
        bestDist = dist;
        best = entry;
      }
    }
  }
  return best;
}

/**
 * Four passes, strongest evidence first:
 *   1. exact on the normalized key      — typed it right
 *   2. exact on the folded key          — right title, different romanisation
 *   3. closest within threshold, normalized
 *   4. closest within threshold, folded — the forgiving one
 *
 * Returns `{type:'empty'}`, `{type:'unmatched'}`, or
 * `{type:'match', entry, exact}` — `exact:false` means the spelling was
 * corrected and the UI should show the player the real one.
 */
export function matchInput(category, raw) {
  const norm = normalize(raw);
  if (!norm) return { type: 'empty' };

  for (const entry of category.answers) {
    if (keysFor(entry, normalize).includes(norm)) return { type: 'match', entry, exact: true };
  }

  const loose = looseKey(raw);
  for (const entry of category.answers) {
    if (keysFor(entry, looseKey).includes(loose)) return { type: 'match', entry, exact: false };
  }

  const near = closest(category.answers, norm, normalize) ||
               closest(category.answers, loose, looseKey);
  if (near) return { type: 'match', entry: near, exact: false };

  return { type: 'unmatched' };
}
