/**
 * The start card: the main game, what an answer is worth, today's programme.
 *
 * The per-pack picker ("Or dive one subject") was removed from here. The themed
 * mode it started still exists end to end — `pickSession('themed', packId)`,
 * `buildRoundPlan()` and the `.pack-btn` styles are all intact — it simply has
 * no entry point in the UI any more. Restoring it means putting a grid of
 * buttons back on this screen; nothing else needs to change.
 */

import { h } from './dom.js';
import { DAILY_SHOWS } from '../data/dailies.js';
import { rarityLadder } from '../data/bank.js';
import { MIXED_ROUNDS, DAILY_ROUNDS, ROUND_SECONDS } from '../game/rounds.js';

/**
 * The page's thesis, drawn from the bank itself: five films by one actor, from
 * the one everybody names to the one almost nobody does. Showing the scoring
 * with real titles argues the point far better than describing it.
 */
function RarityLadder() {
  const ladder = rarityLadder('srk');
  if (!ladder) return null;

  return h(
    'div',
    { className: 'ladder' },
    h(
      'div',
      { className: 'ladder-head' },
      h('span', { className: 'eyebrow' }, 'What an answer is worth'),
      h('span', { className: 'ladder-axis' }, 'how common')
    ),
    h(
      'ol',
      { className: 'ladder-rows' },
      ladder.rows.map(({ tier, entry }, i) =>
        h(
          'li',
          { className: 'ladder-row', key: tier.key },
          h(
            'span',
            { className: 'lr-bar' },
            h('i', {
              style: {
                width: tier.commonness + '%',
                background: tier.color,
                animationDelay: i * 90 + 'ms',
              },
            })
          ),
          h(
            'span',
            null,
            h('span', { className: 'lr-name' }, entry.name),
            h('span', { className: 'lr-tier' }, tier.label.toLowerCase())
          ),
          h('span', { className: 'lr-pts' }, '+' + tier.points)
        )
      )
    ),
    h(
      'p',
      { className: 'ladder-foot' },
      'All five are ',
      h('b', null, ladder.category.title + 's'),
      '. The spread is rarity, not difficulty.'
    )
  );
}

/**
 * The daily shows, set as a cinema's programme for the day. Each show asks a
 * different kind of question, so no two can land on the same prompt.
 */
function Programme({ onStartDaily }) {
  return h(
    'div',
    { className: 'programme' },
    h(
      'div',
      { className: 'section-label' },
      h('span', null, 'Today’s programme'),
      h('div', { className: 'line' }),
      h('span', { className: 'sl-note' }, 'same for everyone today')
    ),
    DAILY_SHOWS.map((show) =>
      h(
        'button',
        { className: 'show-btn', key: show.id, onClick: () => onStartDaily(show.id) },
        h(
          'span',
          { className: 'sb-main' },
          h('span', { className: 'sb-name' }, show.name),
          h('span', { className: 'sb-blurb' }, show.blurb)
        ),
        h('span', { className: 'sb-rounds' }, DAILY_ROUNDS + ' rounds')
      )
    )
  );
}

/**
 * The main game, top-billed. It is the first thing on the card and the only
 * button on the page at this scale, because on a hoarding the main attraction
 * is not one listing among several — it is the whole top half.
 */
function TopBill({ onStart }) {
  return h(
    'button',
    { className: 'hero-btn', onClick: onStart },
    h(
      'span',
      { className: 'hb-main' },
      h('span', { className: 'hb-rule' }, 'Start here · the main game'),
      h('span', { className: 'hb-title' }, 'Daily Dive'),
      h(
        'span',
        { className: 'hb-desc' },
        MIXED_ROUNDS + ' prompts, one from every pack — the same set for everyone today.'
      )
    ),
    h('span', { className: 'hb-go' }, 'Play')
  );
}

export function StartScreen({ onStartDaily, onStartPractice }) {
  return h(
    'div',
    { id: 'screen-start', className: 'card' },

    h(TopBill, { onStart: onStartPractice }),

    h(
      'p',
      { className: 'howto' },
      'Each prompt names a category — ',
      h('em', null, 'name a Shah Rukh Khan movie'),
      '. Type ',
      h('b', null, 'one'),
      ' answer before the ' + ROUND_SECONDS + '-second clock runs out. A wrong or repeated answer doesn’t end the round, it just costs you seconds, so keep guessing.'
    ),

    h(RarityLadder),
    h(Programme, { onStartDaily })
  );
}
