/**
 * Hand-picked prompts for particular days.
 *
 * The Daily Dive is normally *generated*: `buildDivePlan(date)` hashes the date
 * into a seed and draws ten packs, so no day is authored and every day is
 * different. This file is the exception — the one place to say "on this date,
 * ask exactly this".
 *
 * A day here does not have to specify all ten rounds. Whatever it lists is used
 * first, in order, and the rest of the day is filled from the ordinary
 * generated draw with those packs excluded, so a partly-specified day is still
 * a complete game. That is deliberate: it lets a set go in as soon as the packs
 * behind it exist, rather than waiting for all ten.
 *
 * Each prompt is:
 *   pack — the pack id the answers come from; it must exist in categories.js
 *   text — the question, verbatim. Written out rather than generated, because
 *          the point of scheduling a day is to control the wording.
 *   spec — the constraint that validates an answer, exactly as in game/constraints.js
 *          ({ type:'open' } accepts anything in the pack).
 *
 * A prompt naming a pack that does not exist is skipped rather than crashing
 * the day — see `scheduledPrompts` in game/rounds.js. That is what makes the
 * PENDING list below safe to leave here as a record of what is still needed.
 */
export const SCHEDULE = {
  '2026-09-02': {
    note: 'Requested set, all ten rounds, in the order they were given.',
    prompts: [
      {
        pack: 'nineties',
        text: 'Name a Bollywood movie released in the 1990s.',
        spec: { type: 'open' },
      },
      {
        pack: 'srk',
        text: 'Name a Bollywood movie starring Shah Rukh Khan.',
        spec: { type: 'open' },
      },
      {
        pack: 'actress',
        text: 'Name a Bollywood actress who made her debut in the 2000s.',
        spec: { type: 'open' },
      },
      {
        pack: 'triangle',
        text: 'Name a Bollywood movie featuring a love triangle.',
        spec: { type: 'open' },
      },
      {
        pack: 'bhansali',
        text: 'Name a Bollywood movie directed by Sanjay Leela Bhansali.',
        spec: { type: 'open' },
      },
      {
        pack: 'noughties',
        text: 'Name a Bollywood movie released between 2000 and 2010.',
        spec: { type: 'open' },
      },
      {
        pack: 'wedding',
        text: 'Name a Bollywood movie featuring a famous wedding scene.',
        spec: { type: 'open' },
      },
      {
        pack: 'cop',
        text: 'Name a Bollywood actor who has played a police officer.',
        spec: { type: 'open' },
      },
      {
        pack: 'diltitle',
        text: 'Name a Bollywood movie with the word “Dil” in its title.',
        spec: { type: 'open' },
      },
      {
        // Reworded from "a Bollywood movie that has been remade in another
        // language". Every answer supplied for it — Ghajini, Drishyam, Kabir
        // Singh, Singham, Wanted, Bhool Bhulaiyaa — is a Hindi film remade FROM
        // a southern original, which is the opposite direction. The prompt
        // follows the answers; the other direction is a good pack too, but a
        // different one, needing different films.
        pack: 'remake',
        text: 'Name a Bollywood movie that is a remake of a film in another language.',
        spec: { type: 'open' },
      },
    ],
  },

  /*
    Two rounds of an otherwise generated day, replaced.

    `overrides` is keyed by ROUND NUMBER as the player sees it, 1-based, and
    swaps that round only — the other eight are still drawn by the generator.
    That is the difference from `prompts` above, which authors a day from the
    front and pushes everything else back.

    Both replacements here are the same pack asked a different way, which is
    the safe shape for an override: changing the pack could collide with
    another round and put the same pack in the day twice.
  */
  '2026-09-07': {
    note: 'Generated day with rounds 1 and 3 replaced.',
    overrides: {
      // Was "a Bollywood biopic, 2016-2020" — 20 answers. The 2010s are the
      // decade this pack is deepest in, so the same pack gives half again as
      // many answers for the same question shape.
      1: {
        pack: 'biopic',
        text: 'Name a Bollywood biopic released in the 2010s.',
        spec: { type: 'decade', value: 2010 },
      },
      // Was "a Filmfare Best Film winner released in the 2020s" — SIX answers,
      // exactly the minimum a round may have. The award pack is a list of
      // annual winners, so any single recent decade is tiny by construction;
      // the early era bucket is the part of it that is actually deep.
      3: {
        pack: 'award',
        text: 'Name a Filmfare Best Film winner, up to 2001.',
        spec: { type: 'era', value: 'early' },
      },
    },
  },
};

/*
  Run a day's set again on another day.

  A scheduled day is authored, not generated, so it lives for exactly twenty-four
  hours and is then gone. Repeating one is a matter of pointing a second date at
  the same prompts rather than copying them: two copies of ten questions would
  drift the moment either was edited.

  The earlier date keeps its own entry and MUST keep it. The archive replays
  past days by rebuilding them from their date, so deleting 2026-09-02's
  schedule would make the archive serve a generated set for a day that really
  served this one — the archive would quietly lie about what was played.
*/
function repeat(from, on) {
  const source = SCHEDULE[from];
  if (!source) return;
  on.forEach((key) => {
    SCHEDULE[key] = {
      note: 'Repeat of the ' + from + ' set.',
      prompts: source.prompts,
    };
  });
}

/*
  The hand-picked set, extended a day at a time as it has been asked for.

  Listing the dates rather than expressing an open range keeps the end explicit:
  the day after the last one here, the Dive goes back to a generated day on its
  own, with nothing to remember to switch off. The cost is that extending it is
  a code change — see the note under SCHEDULE on making a set permanent, which
  is the better answer if this keeps being extended.
*/
repeat('2026-09-02', ['2026-09-03', '2026-09-04', '2026-09-05']);

export function scheduleFor(key) {
  return SCHEDULE[key] || null;
}
