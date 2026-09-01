/**
 * Sound effects, synthesised with the Web Audio API rather than loaded as
 * files. The project is a folder of text with no build step and no assets to
 * fetch, and these tones are short enough that generating them costs less than
 * downloading them would.
 *
 * Pitches come from a major pentatonic — Sa Re Ga Pa Dha, the scale a great
 * many Bollywood melody hooks sit in — so the feedback belongs to the subject
 * instead of sounding like a generic arcade. The rarer your answer, the further
 * the phrase climbs that scale: the sound carries the same information the
 * colour and the points do.
 */

const STORAGE_KEY = 'bollybuzz.sound';

/** Sa Re Ga Pa Dha, from C5. Index maps directly onto a rarity tier. */
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0];

/** Low Sa, two octaves down — a drone to settle the result phrase onto. */
const DRONE = 130.81;

let ctx = null;
let muted = readStoredMute();

function readStoredMute() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off';
  } catch (e) {
    // Private mode or blocked storage: fall back to audible.
    return false;
  }
}

export function isMuted() {
  return muted;
}

export function setMuted(next) {
  muted = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'off' : 'on');
  } catch (e) {
    /* the preference just won't survive a reload */
  }
}

/**
 * Browsers only let an AudioContext start from a user gesture, so it is built
 * lazily on the first sound — by which point the player has clicked to start a
 * game. Returns null when muted or unsupported, and every caller checks.
 */
function audio() {
  if (muted) return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  try {
    if (!ctx) ctx = new Ctor();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch (e) {
    return null;
  }
}

/**
 * One struck note: fast attack, exponential fall. Gains stay low — these play
 * on every keystroke-ish action and should read as punctuation, not fanfare.
 */
function tone(ac, { freq, at = 0, dur = 0.18, type = 'triangle', gain = 0.15, glideTo }) {
  const t0 = ac.currentTime + at;
  const osc = ac.createOscillator();
  const amp = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);

  // exponentialRamp cannot touch zero, hence the near-silent floor.
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/**
 * An accepted answer. `tierIndex` 0–4: a common answer gets one flat note, a
 * legendary one opens into a four-note flourish.
 */
export function playAnswer(tierIndex) {
  const ac = audio();
  if (!ac) return;
  const root = PENTATONIC[tierIndex] || PENTATONIC[0];

  tone(ac, { freq: root, dur: 0.16, gain: 0.15 });
  if (tierIndex >= 2) tone(ac, { freq: root * 1.5, at: 0.07, dur: 0.2, gain: 0.13 });
  if (tierIndex >= 3) tone(ac, { freq: root * 2, at: 0.14, dur: 0.26, gain: 0.11 });
  if (tierIndex >= 4) tone(ac, { freq: root * 3, at: 0.21, dur: 0.34, gain: 0.09, type: 'sine' });
}

/** A rejected answer. Quiet and short — the round is still open, so this is a nudge. */
export function playReject() {
  const ac = audio();
  if (!ac) return;
  tone(ac, { freq: 196, glideTo: 138.6, dur: 0.16, type: 'square', gain: 0.06 });
}

/** A timed-out or skipped round: two notes falling away. */
export function playMiss() {
  const ac = audio();
  if (!ac) return;
  tone(ac, { freq: 329.63, dur: 0.18, gain: 0.11 });
  tone(ac, { freq: 246.94, at: 0.12, dur: 0.3, gain: 0.1 });
}

/**
 * The final score. The phrase always resolves, but the better the dive the
 * further up the scale it climbs — three notes for a poor run, seven for a
 * perfect one — over a drone that holds while it settles.
 */
export function playResult(score, max) {
  const ac = audio();
  if (!ac) return;
  const ratio = max > 0 ? Math.min(1, Math.max(0, score / max)) : 0;
  const steps = 3 + Math.round(ratio * 4);

  for (let i = 0; i < steps; i++) {
    tone(ac, {
      freq: PENTATONIC[i % PENTATONIC.length] * (i >= PENTATONIC.length ? 2 : 1),
      at: i * 0.085,
      dur: 0.3,
      gain: 0.12,
    });
  }
  tone(ac, { freq: DRONE, dur: 0.9 + ratio * 0.6, gain: 0.08, type: 'sine' });
}
