/**
 * The answer bank: 17 themed packs of Bollywood trivia, one module each under
 * `packs/`. This file is only the running order — the data lives next door.
 *
 * It was a single 1,500-line file until the bank outgrew it. Splitting it means
 * a change to one pack is a change to one small file, and the packs stopped
 * competing for the same merge.
 *
 * ## What every answer carries
 *
 * `tier` (0 = everyone says it … 4 = legendary rare) is the whole scoring
 * model — rarer answers are worth more. `year` powers the era and decade rounds
 * and the final "how deep did you dive" result, so keep it accurate. `aliases`
 * are extra spellings players actually type; fuzzy matching handles typos on
 * top of these.
 *
 * On coverage: the packs aim to be broad enough that a player naming a real,
 * obvious answer is never told they are wrong. That is a correctness property,
 * not a nice-to-have — a rejected valid answer is the worst bug this game can
 * have. The actor packs cover the full lead filmography rather than the hits.
 *
 * On aliases: fuzzy matching forgives roughly two edits on a mid-length title,
 * which is not enough for a dropped word. People habitually shorten long titles
 * ("jab tak jaan", "kabhi alvida"), so every multi-word title carries the short
 * forms people actually type. Initialisms (ddlj, k3g, znmd) go here too — they
 * are not typos and fuzzy matching will never reach them. A film's aliases must
 * be the same in every pack it appears in; check-bank.py enforces that.
 *
 * ## Optional pack-level fields
 *
 * All defaulted, so only the odd pack out declares them:
 *   `noun`       — what an answer in this pack IS, for prompts that talk about
 *                  the answer itself ("whose title begins with D"). Defaults to
 *                  'title'; the people packs set it to 'name'.
 *   `yearIs`     — what `year` MEANS here. Defaults to 'release'; the director
 *                  pack sets 'debut', because a director is not released.
 *   `shortTitle` — the pack's name with a clause hung off it. `title` is written
 *                  to stand alone, so the long descriptive ones read badly
 *                  mid-sentence: 'Bollywood movie with "Dil" in the title' +
 *                  ' whose title begins with…'. Defaults to `title`.
 *
 * ## Order
 *
 * The order below is the order packs are drawn in before shuffling, so it has
 * no effect on play. It is grouped by what the pack is about, to be read.
 */

/*
  Each pack exports a uniquely named const rather than a shared `PACK`, and is
  referenced here by that name with no `as` renaming. Both are requirements of
  the flattened build, not style: build.ps1 strips import/export and drops every
  module into one scope, where seventeen `const PACK` declarations would collide
  and an `as` alias would name something that no longer exists.
*/

// People and their filmographies.
import { PACK_SRK } from './packs/srk.js';
import { PACK_AB } from './packs/ab.js';
import { PACK_DEEPIKA } from './packs/deepika.js';
import { PACK_DIRECTOR } from './packs/director.js';
import { PACK_BHANSALI } from './packs/bhansali.js';
import { PACK_RAHMAN } from './packs/rahman.js';
import { PACK_ACTRESS } from './packs/actress.js';
import { PACK_VILLAIN } from './packs/villain.js';
import { PACK_COP } from './packs/cop.js';

// Films grouped by when they came out.
import { PACK_NINETIES } from './packs/nineties.js';
import { PACK_NOUGHTIES } from './packs/noughties.js';

// Films grouped by what they are.
import { PACK_AWARD } from './packs/award.js';
import { PACK_BIOPIC } from './packs/biopic.js';
import { PACK_DILTITLE } from './packs/diltitle.js';
import { PACK_TRIANGLE } from './packs/triangle.js';
import { PACK_WEDDING } from './packs/wedding.js';
import { PACK_REMAKE } from './packs/remake.js';

export const CATEGORIES = [
  PACK_SRK, PACK_AB, PACK_DIRECTOR, PACK_AWARD, PACK_NINETIES, PACK_DEEPIKA,
  PACK_BIOPIC, PACK_RAHMAN, PACK_VILLAIN, PACK_DILTITLE, PACK_BHANSALI,
  PACK_ACTRESS, PACK_TRIANGLE, PACK_NOUGHTIES, PACK_WEDDING, PACK_COP,
  PACK_REMAKE,
];
