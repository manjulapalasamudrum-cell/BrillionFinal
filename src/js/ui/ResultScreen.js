/** The souvenir: how far back you dove, round by round, ready to share. */

import { h } from './dom.js';
import { CATEGORIES } from '../data/categories.js';
import { TIERS } from '../data/tiers.js';
import { alternativesFor } from '../game/rounds.js';
import { CINEMA_START_YEAR, eraLabel } from '../game/eras.js';
import { depthYear, maxScore, buildShareText, PRESENT_YEAR } from '../game/scoring.js';

/** Decade markers on the rail. The 1913 end is labelled, because it is the point. */
const TICKS = [
  { year: PRESENT_YEAR, label: String(PRESENT_YEAR) },
  { year: 2000, label: '2000' },
  { year: 1975, label: '1975' },
  { year: 1950, label: '1950' },
  { year: CINEMA_START_YEAR, label: '1913' },
];

/** Distance down the rail, as a percentage, for a given year. */
function railPosition(year) {
  const span = PRESENT_YEAR - CINEMA_START_YEAR;
  return ((PRESENT_YEAR - year) / span) * 100;
}

/**
 * The signature element. A score is an abstraction; a year on the timeline of
 * Hindi cinema is not — so the result is staged as a descent down 113 years,
 * with the distance you covered drawn as a strip of film.
 */
function DepthGauge({ year }) {
  const pos = railPosition(year);
  return h(
    'div',
    { className: 'gauge' },
    h(
      'div',
      { className: 'gauge-rail', style: { minHeight: '230px' }, 'aria-hidden': 'true' },
      h('div', { className: 'gauge-travelled', style: { height: pos + '%' } }),
      TICKS.map((t) =>
        h('div', { className: 'gauge-tick', key: t.year, style: { top: railPosition(t.year) + '%' } }, t.label)
      ),
      h('div', { className: 'gauge-marker', style: { top: pos + '%' } })
    ),
    h(
      'div',
      { className: 'gauge-readout' },
      h('div', { className: 'eyebrow' }, 'You dove to'),
      h('div', { className: 'depth-year' }, year),
      h('div', { className: 'depth-era' }, eraLabel(year)),
      h(
        'div',
        { className: 'depth-note' },
        year === CINEMA_START_YEAR
          ? 'The floor. Nothing in Hindi cinema is older.'
          : year - CINEMA_START_YEAR + ' years short of the first Indian feature.'
      )
    )
  );
}

export function ResultScreen({
  mode, gameLabel, shareName, score, totalPrompts, log, puzzleKey,
  onReplay, onBackToMenu, copyLabel, onCopy,
}) {
  const year = depthYear(score, totalPrompts);
  const shareText = buildShareText({
    gameName: shareName || gameLabel, score, year, log, puzzleKey,
  });

  return h(
    'div',
    { id: 'screen-result', className: 'card' },
    h(
      'div',
      { className: 'result-head' },
      h('div', { className: 'rh-game' }, gameLabel)
    ),

    h(DepthGauge, { year }),

    // The total, set like the total line on a printed ticket: ruled off top and
    // bottom, big enough to be the second thing you read after the year.
    h(
      'div',
      { className: 'score-band' },
      h('span', { className: 'eyebrow' }, 'Final score'),
      h('span', { className: 'score-max' }, 'of a possible ' + maxScore(totalPrompts)),
      h(
        'span',
        { className: 'score-value' },
        score,
        h('span', { className: 'score-unit' }, 'pts')
      )
    ),

    h(
      'div',
      { className: 'section-label' },
      h('span', null, 'Round by round'),
      h('div', { className: 'line' })
    ),

    h(
      'div',
      { className: 'breakdown' },
      log.map((row, i) => {
        /*
          What else would have counted. Everything already named this game is
          excluded, so nothing is offered back that the player used or that the
          no-repeats rule would have blocked — and alternativesFor applies the
          round's own constraint, so a suggestion is never something the round
          would itself have refused.
        */
        const used = log.map((r) => r.answerName).filter(Boolean);
        const alts = row.catId ? alternativesFor(row.catId, row.spec, used, 3) : [];

        return h(
          'div',
          { className: 'bd-row', key: i },
          h('div', { className: 'bd-sq', style: { background: row.tier.color } }),
          h(
            'div',
            { className: 'bd-main' },
            // In a themed game every row shares one category, so naming it five
            // times says nothing — the tier is what actually varied. On a miss
            // the tier label is "No answer", which the line below already says,
            // so it is dropped rather than printed twice.
            h(
              'div',
              { className: 'bd-cat' },
              mode === 'themed' ? (row.answerName ? row.tier.label.toLowerCase() : '') : row.category
            ),
            h('div', { className: 'bd-ans' }, row.matched),
            alts.length
              ? h(
                  'div',
                  { className: 'bd-alts' },
                  h('span', { className: 'bd-alts-label' }, row.answerName ? 'also counted' : 'would have counted'),
                  alts.map((a) =>
                    h(
                      'span',
                      { className: 'bd-alt', key: a.name },
                      h('i', { style: { background: TIERS[a.tier].color } }),
                      a.name,
                      h('b', null, '+' + TIERS[a.tier].points)
                    )
                  )
                )
              : null
          ),
          h('div', { className: 'bd-pts' }, '+' + row.tier.points)
        );
      })
    ),

    h('div', { className: 'share-box' }, shareText),

    h(
      'div',
      { className: 'actions' },
      h('button', { className: 'btn-gold', onClick: () => onCopy(shareText) }, copyLabel),
      h('button', { className: 'btn-ghost', onClick: onReplay }, mode === 'daily' ? 'Daily Dive' : 'Play again')
    ),
    h(
      'div',
      { className: 'back-row' },
      h(
        'button',
        { className: 'linklike', type: 'button', onClick: onBackToMenu },
        mode === 'daily' ? 'back to today’s programme' : 'back to all ' + CATEGORIES.length + ' packs'
      )
    )
  );
}
