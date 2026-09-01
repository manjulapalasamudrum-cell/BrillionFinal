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
 *   spec — the constraint that validates an answer, exactly as in game/rounds.js
 *          ({ type:'open' } accepts anything in the pack).
 *
 * A prompt naming a pack that does not exist is skipped rather than crashing
 * the day — see `scheduledPrompts` in game/rounds.js. That is what makes the
 * PENDING list below safe to leave here as a record of what is still needed.
 */
export const SCHEDULE = {
  '2026-09-02': {
    note: 'Requested set. Four of the ten are live; see PENDING for the rest.',
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
        pack: 'bhansali',
        text: 'Name a Bollywood movie directed by Sanjay Leela Bhansali.',
        spec: { type: 'open' },
      },
      {
        pack: 'diltitle',
        text: 'Name a Bollywood movie with the word “Dil” in its title.',
        spec: { type: 'open' },
      },
    ],
  },
};

/**
 * Requested prompts that cannot be asked yet, each with the pack it needs.
 *
 * These are not wired to any date and nothing reads this list — it is here so
 * the work is recorded next to the schedule it belongs to rather than in a
 * ticket somewhere. Every one of them needs the same thing: a list of correct
 * answers, each with a rarity tier and a year. The game cannot generate those,
 * and guessing them would be the one failure this bank is built to avoid — a
 * player told they are wrong when they are right.
 *
 *   'Name a Bollywood actress who made her debut in the 2000s.'
 *       needs a pack of actresses with `yearIs:'debut'`
 *   'Name a Bollywood movie featuring a love triangle.'
 *       needs a curated pack; membership is a judgement, so it needs a source
 *   'Name a Bollywood movie released between 2000 and 2010.'
 *       needs a pack of 2000s films, the way `nineties` covers its decade
 *   'Name a Bollywood movie featuring a famous wedding scene.'
 *       needs a curated pack
 *   'Name a Bollywood actor who has played a police officer.'
 *       needs a pack of actors, with the film that makes each one qualify
 *   'Name a Bollywood movie that has been remade in another language.'
 *       needs a curated pack; the remake claim is the part that needs checking
 */
export function scheduleFor(key) {
  return SCHEDULE[key] || null;
}
