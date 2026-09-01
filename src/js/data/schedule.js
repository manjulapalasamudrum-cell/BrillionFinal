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
};

export function scheduleFor(key) {
  return SCHEDULE[key] || null;
}
