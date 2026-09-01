/**
 * Root component. Owns all game state and the round lifecycle; the screen
 * components below it are presentational.
 */

import { h, React, useState, useEffect, useRef, focusEl, selectEl } from './dom.js';
import { TIERS, MISS } from '../data/tiers.js';
import { normalize, matchInput } from '../lib/text-match.js';
import { playAnswer, playReject, playMiss, playResult } from '../lib/audio.js';
import { recordResult } from '../lib/history.js';
import { eraLabelText } from '../game/eras.js';
import {
  pickSession, violatesConstraint, firstLetter, wordCount,
  MIXED_ROUNDS, ROUND_SECONDS,
} from '../game/rounds.js';
import { maxScore } from '../game/scoring.js';
import { TopHeader, AboutFooter } from './Chrome.js';
import { StartScreen } from './StartScreen.js';
import { GameScreen } from './GameScreen.js';
import { ResultScreen } from './ResultScreen.js';

export function App() {
  const [screen, setScreen] = useState('start');
  const [mode, setMode] = useState(null);
  // Which show or pack this game is: a show id for 'daily', a pack id for
  // 'themed', null for practice. Kept so "Play again" can repeat the same one.
  const [gameKey, setGameKey] = useState(null);
  const [gameLabel, setGameLabel] = useState('');
  // What the shared grid calls this game. Usually the same as gameLabel, but
  // an archived dive drops the date from it — the grid stamps the date itself.
  const [shareName, setShareName] = useState('');
  // Which puzzle day this game is, for the share stamp and the archive record.
  // Only the Daily Dive sets it; a themed game belongs to no particular day.
  const [puzzleKey, setPuzzleKey] = useState(null);
  const [session, setSession] = useState([]);
  const [totalPrompts, setTotalPrompts] = useState(MIXED_ROUNDS);
  const [roundPlan, setRoundPlan] = useState(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [locked, setLocked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [retryMsg, setRetryMsg] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [copyLabel, setCopyLabel] = useState('Copy result');

  // Answers already used this game, normalized. A ref, not state: nothing
  // renders from it directly and it must be readable synchronously on submit.
  const usedRef = useRef(new Set());
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const cat = session[idx];

  function startGame(m, key) {
    const picked = pickSession(m, key);
    setMode(m);
    setGameKey(key || null);
    setGameLabel(picked.label);
    setShareName(picked.shareName || picked.label);
    setPuzzleKey(picked.puzzleKey || null);
    setSession(picked.list);
    setTotalPrompts(picked.total);
    setRoundPlan(picked.roundPlan);
    setIdx(0);
    setScore(0);
    setLog([]);
    usedRef.current = new Set();
    setFeedback(null);
    setRetryMsg('');
    setInputValue('');
    setLocked(false);
    setTimeLeft(ROUND_SECONDS);
    setScreen('game');
  }

  function goToMenu() {
    clearInterval(timerRef.current);
    setScreen('start');
  }

  // Countdown ticker: restarts whenever a new, unlocked prompt is shown.
  useEffect(() => {
    if (screen !== 'game' || locked) return;
    setTimeLeft(ROUND_SECONDS);
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [idx, screen, locked]);

  // When the clock runs out, end the round.
  useEffect(() => {
    if (screen !== 'game' || locked) return;
    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      endPrompt('timeout');
    }
  }, [timeLeft]);

  useEffect(() => {
    if (screen === 'game' && !locked) focusEl(inputRef);
  }, [idx, screen, locked]);

  /** Reject an answer without ending the round — the clock just keeps running. */
  function rejectAnswer(message) {
    playReject();
    setRetryMsg(message);
    setInputValue('');
    focusEl(inputRef);
  }

  /**
   * Turn a constraint violation into the message the player sees. The rule
   * itself lives in game/rounds.js so that this and the result screen's
   * "could have said" suggestions can never disagree about what was allowed.
   */
  function constraintFailure(spec, entry) {
    const reason = violatesConstraint(spec, entry);
    if (!reason) return null;

    if (reason === 'era') {
      return '🕰️ “' + entry.name + '” is real, but it’s from ' + entry.year +
        ' — this round wants one from ' + eraLabelText(spec.buckets, spec.value) + '. Try another!';
    }
    if (reason === 'role') {
      const wanted = spec.value === 'actor' ? 'a real actor' : 'a character name';
      return '🎭 “' + entry.name + '” is real, but that’s ' +
        (entry.role === 'actor' ? 'an actor' : 'a character') +
        ' — this round wants ' + wanted + '. Try another!';
    }
    if (reason === 'initial') {
      return '🔤 “' + entry.name + '” is real, but it starts with ' +
        firstLetter(entry.name) + ' — this round wants one starting with ' +
        spec.value + '. Try another!';
    }
    if (reason === 'words') {
      return '✂️ “' + entry.name + '” is real, but it’s ' + wordCount(entry.name) +
        (wordCount(entry.name) === 1 ? ' word' : ' words') + ' — this round wants ' +
        (spec.value === 'one' ? 'a single word' : 'four or more') + '. Try another!';
    }
    if (reason === 'decade') {
      return '📅 “' + entry.name + '” is real, but it’s ' + entry.year +
        ' — this round wants the ' + spec.value + 's. Try another!';
    }
    return '🎟️ “' + entry.name + '” is real, but at +' + TIERS[entry.tier].points +
      ' it’s too well known — this round takes deep cuts, worth +' +
      TIERS[spec.minTier].points + ' or more. Try a rarer one!';
  }

  /**
   * A wrong or off-constraint answer does NOT end the round — the player keeps
   * trying while the clock runs. Only a valid, unused answer locks it in.
   */
  function attemptSubmit() {
    if (locked) return;
    const raw = inputValue;
    if (!raw.trim()) {
      playReject();
      setRetryMsg('Type an answer, or hit “skip this prompt” to move on.');
      return;
    }

    const result = matchInput(cat, raw);
    if (result.type !== 'match') {
      rejectAnswer('❌ “' + raw.trim() + '” doesn’t match anything in this category — try another answer!');
      return;
    }

    const entry = result.entry;
    const failure = constraintFailure(roundPlan && roundPlan.rounds[idx], entry);
    if (failure) {
      rejectAnswer(failure);
      return;
    }

    const key = normalize(entry.name);
    if (usedRef.current.has(key)) {
      playReject();
      // Select rather than clear: they typed a real answer, just not a new one.
      setRetryMsg('🔁 You already used “' + entry.name + '” this game — name a different one!');
      selectEl(inputRef);
      return;
    }

    const correction = result.exact ? null : { typed: raw.trim(), correct: entry.name };
    finalizePrompt(TIERS[entry.tier], entry.name, raw, correction, key);
  }

  function endPrompt(reason) {
    if (locked) return;
    clearInterval(timerRef.current);
    const matchedLabel = reason === 'timeout' ? 'Time’s up — no answer' : 'Skipped — no answer';
    finalizePrompt(MISS, matchedLabel, '', null, null);
  }

  function finalizePrompt(tierInfo, matchedLabel, raw, correction, dedupeKey) {
    setLocked(true);
    clearInterval(timerRef.current);
    setRetryMsg('');
    // TIERS holds the real tier objects, so indexOf identifies which one this
    // is; MISS is not in that array and comes back -1.
    const tierIndex = TIERS.indexOf(tierInfo);
    if (tierIndex >= 0) playAnswer(tierIndex);
    else playMiss();
    if (dedupeKey) usedRef.current.add(dedupeKey);
    setScore((s) => s + tierInfo.points);
    // catId and spec are carried so the result screen can work out what else
    // would have counted; answerName is null on a miss, where matchedLabel is
    // a status line ("Time's up") rather than a film.
    setLog((l) => [...l, {
      category: cat.title,
      catId: cat.id,
      spec: (roundPlan && roundPlan.rounds[idx]) || null,
      answerName: tierIndex >= 0 ? matchedLabel : null,
      input: raw,
      matched: matchedLabel,
      tier: tierInfo,
    }]);
    setFeedback({ raw, tierInfo, matchedLabel, correction });
  }

  function nextPrompt() {
    const nextIdx = idx + 1;
    if (nextIdx >= totalPrompts) {
      // `score` already includes the round just finalized, so this is the total.
      playResult(score, maxScore(totalPrompts));
      // Recorded here rather than on the result screen, which re-renders: this
      // runs exactly once, when the last round closes.
      recordResult(puzzleKey, score, totalPrompts);
      setScreen('result');
      return;
    }
    setIdx(nextIdx);
    setFeedback(null);
    setRetryMsg('');
    setInputValue('');
    setLocked(false);
  }

  function flashCopied() {
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy result'), 1500);
  }

  function handleCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flashCopied).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  // navigator.clipboard is unavailable on insecure origins (plain file:// too).
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      flashCopied();
    } catch (e) {
      /* nothing more we can do — the text is on screen to copy by hand */
    }
    document.body.removeChild(ta);
  }

  return h(
    React.Fragment,
    null,
    h(TopHeader),
    screen === 'start'
      ? h(StartScreen, {
          onStartDaily: (id) => startGame('daily', id),
          onStartPractice: () => startGame('practice'),
          onStartArchived: (dayKey) => startGame('practice', dayKey),
        })
      : null,
    screen === 'game'
      ? h(GameScreen, {
          idx, totalPrompts, score, timeLeft, mode, roundPlan, cat, gameLabel,
          inputValue, setInputValue,
          onSubmit: attemptSubmit,
          onSkip: () => endPrompt('skip'),
          onQuit: goToMenu,
          retryMsg, feedback, locked, inputRef,
          onNext: nextPrompt,
        })
      : null,
    screen === 'result'
      ? h(ResultScreen, {
          mode, gameLabel, shareName, score, totalPrompts, log, puzzleKey,
          // A daily show is the same all day, so replaying it would just repeat
          // the same five questions — send them to the Daily Dive instead.
          onReplay: () => (mode === 'daily' ? startGame('practice') : startGame(mode, gameKey)),
          onBackToMenu: goToMenu,
          copyLabel,
          onCopy: handleCopy,
        })
      : null,
    h(AboutFooter)
  );
}
