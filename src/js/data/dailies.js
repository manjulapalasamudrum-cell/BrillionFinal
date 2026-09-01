/**
 * The daily programme: today's shows, every one asking a different KIND of
 * question.
 *
 * That is what keeps them distinct. Each show carries its own constraint, so
 * even when two shows land on the same pack, the questions cannot collide —
 * "a Shah Rukh Khan movie from up to 2000" and "a Shah Rukh Khan movie from
 * 2006 or later" are different questions with different answers.
 *
 * Constraints:
 *   era    — the answer's year must sit in that third of the pack
 *   mixed  — no single constraint: every round draws a different KIND of
 *            question from the catalogue in game/rounds.js (a letter, a title
 *            shape, a decade, a rarity floor). Varying the question is the
 *            show's identity, the way a date range is the era shows'.
 *   open   — anything in the pack counts. Nothing on the programme uses this
 *            now: five unconstrained rounds is five times the same question,
 *            which is exactly what `mixed` exists to fix.
 *   rarity — the answer must be at least `minTier` (0 = common … 4 = legendary).
 *            Supported end to end but not currently on the programme; adding
 *            `{ type:'rarity', minTier: 3 }` here is all it takes to bring a
 *            deep-cuts-only show back.
 *
 * Order matters: the shows read as a schedule running from the oldest cinema
 * to the newest, then the two wildcards.
 */
export const DAILY_SHOWS = [
  {
    id: 'early',
    name: 'The Early Show',
    blurb: 'The oldest third of every pack.',
    constraint: { type: 'era', value: 'early' },
  },
  {
    id: 'matinee',
    name: 'The Matinee',
    blurb: 'The middle years — the ones you half remember.',
    constraint: { type: 'era', value: 'mid' },
  },
  {
    id: 'late',
    name: 'The Late Show',
    blurb: 'The newest third of every pack.',
    constraint: { type: 'era', value: 'late' },
  },
  {
    id: 'double',
    name: 'The Double Bill',
    blurb: 'Five packs, five different kinds of question.',
    constraint: { type: 'mixed' },
  },
];

export function findShow(id) {
  return DAILY_SHOWS.find((s) => s.id === id);
}
