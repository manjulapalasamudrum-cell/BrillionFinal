/**
 * What counts as a valid answer for a round, and how that rule is worded.
 *
 * A round spec carries its question text plus one constraint:
 *   { type:'open' }                          anything in the pack
 *   { type:'era',     value, buckets }       the answer's year must be in bucket
 *   { type:'role',    value }                actor, or character
 *   { type:'rarity',  minTier }              at least this rare
 *   { type:'initial', value }                the answer starts with this letter
 *   { type:'words',   value:'one'|'many' }   a one-word answer, or four-plus
 *   { type:'decade',  value }                released in this decade
 *
 * `buckets` lives on the spec rather than the plan because a daily show uses a
 * different pack every round, and each pack has its own era boundaries.
 *
 * This module is the single definition of each rule. It is split out from
 * round-building precisely so the two cannot drift: App.js turns a violation
 * into the message a player sees, GameScreen prints the restriction, and
 * `alternativesFor` uses the same test to make sure the result screen never
 * suggests an answer the round would itself have refused. Three readers, one
 * rule.
 */

import { CATEGORIES } from '../data/categories.js';
import { eraLabelText, eraOfYear } from './eras.js';

/**
 * Does this answer break the round's extra constraint? Returns the reason —
 * 'era', 'role' or 'rarity' — or null when the answer is allowed.
 *
 * Both callers need the same rule and must never drift apart: App.js turns the
 * reason into the message shown when an answer is rejected, and
 * `alternativesFor` below uses it to make sure the result screen never suggests
 * an answer the round would itself have refused.
 */
export function violatesConstraint(spec, entry) {
  if (!spec) return null;
  if (spec.type === 'era' && entry.year != null &&
      eraOfYear(entry.year, spec.buckets) !== spec.value) return 'era';
  if (spec.type === 'role' && entry.role && entry.role !== spec.value) return 'role';
  if (spec.type === 'rarity' && entry.tier < spec.minTier) return 'rarity';
  if (spec.type === 'initial' && firstLetter(entry.name) !== spec.value) return 'initial';
  if (spec.type === 'words' && !matchesWordCount(spec.value, entry.name)) return 'words';
  if (spec.type === 'decade' && entry.year != null &&
      Math.floor(entry.year / 10) * 10 !== spec.value) return 'decade';
  return null;
}

/**
 * The letter a player would file this answer under. Leading punctuation and
 * articles-as-digits are skipped so "Ra.One" files under R and a title opening
 * with a quote mark does not file under nothing.
 */
export function firstLetter(name) {
  const m = /[a-z]/i.exec(name || '');
  return m ? m[0].toUpperCase() : '';
}

export function wordCount(name) {
  return String(name || '').trim().split(/\s+/).filter(Boolean).length;
}

/** Long titles start at four words — see LONG_TITLE_WORDS for why four. */
export const LONG_TITLE_WORDS = 4;

function matchesWordCount(value, name) {
  const n = wordCount(name);
  return value === 'one' ? n === 1 : n >= LONG_TITLE_WORDS;
}

/**
 * The round's restriction, stated plainly for the player, or null when the
 * round accepts anything in the pack.
 *
 * This exists because a constrained round used to show the pack's generic hint
 * — "Any film where he's a lead or major role" — directly under a prompt that
 * said "up to 1996". A valid answer from the wrong decade then looked like the
 * game had failed to recognise it, when the screen had in fact contradicted
 * itself. The restriction now gets its own line and says only this.
 */
export function constraintLabel(spec) {
  if (!spec) return null;
  // A spec may carry its own wording when the generic phrasing would be wrong
  // for its pack — the director pack's `year` is a breakthrough, not a release.
  if (spec.label) return spec.label;
  if (spec.type === 'era') return 'Released ' + eraLabelText(spec.buckets, spec.value);
  if (spec.type === 'role') {
    return spec.value === 'actor'
      ? 'An actor’s name — not a character'
      : 'A character’s name — not an actor';
  }
  if (spec.type === 'rarity') return 'Deep cuts only — worth +' + spec.minTier * 10 + ' or more';
  if (spec.type === 'initial') return 'Must begin with the letter ' + spec.value;
  if (spec.type === 'words') {
    return spec.value === 'one'
      ? 'One word only'
      : LONG_TITLE_WORDS + ' words or more';
  }
  if (spec.type === 'decade') return 'Released in the ' + spec.value + 's';
  return null;
}

/**
 * A few answers the player could have given for a round, for the result
 * screen. Deliberately spans the rarity range — the cheapest valid answer, the
 * rarest, and one in between — because the point is to show what the scoring
 * model rewards, not to list the pack.
 *
 * `exclude` is the set of names already used this game, so nothing is offered
 * back that the player already named or that a repeat check would have blocked.
 */
export function alternativesFor(catId, spec, exclude, limit) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  if (!cat) return [];

  const skip = new Set(exclude || []);
  const valid = cat.answers.filter((e) => !skip.has(e.name) && !violatesConstraint(spec, e));
  if (!valid.length) return [];

  const byTier = valid.slice().sort((a, b) => a.tier - b.tier);
  const picks = [];
  const take = (entry) => { if (entry && picks.indexOf(entry) < 0) picks.push(entry); };
  take(byTier[0]);                                 // what everyone says
  take(byTier[byTier.length - 1]);                 // the rarest still available
  take(byTier[Math.floor(byTier.length / 2)]);     // something in between

  return picks.sort((a, b) => a.tier - b.tier).slice(0, limit || 3);
}
