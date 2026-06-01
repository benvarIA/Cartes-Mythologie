/**
 * Synthesized sound effects via Web Audio API.
 * No external assets — every sound is generated on-the-fly so the bundle stays light
 * and the audio matches the theatrical atmosphere.
 */

type SfxName =
  | 'click'        // UI tap
  | 'reveal'       // card reveal (rising chime)
  | 'select'       // stat selected (gold chime)
  | 'win'          // round won (triumphant flourish)
  | 'lose'         // round lost (descending bass)
  | 'tie'          // tie (neutral plink)
  | 'event'        // event drawn (mysterious shimmer)
  | 'shuffle'      // game start
  | 'gameOver'     // end game flourish

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let volume = 0.5

function ensureCtx() {
  if (!ctx) {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = volume
    master.connect(ctx.destination)
  }
  // Resume if suspended (autoplay policy)
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

export function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v))
  if (master) master.gain.value = muted ? 0 : volume
}
export function setMuted(m: boolean) {
  muted = m
  if (master) master.gain.value = m ? 0 : volume
}
export function getVolume() { return volume }
export function isMuted() { return muted }

// ── Primitive ────────────────────────────────────────────────────────
function tone(opts: {
  freq: number
  start?: number
  duration: number
  type?: OscillatorType
  gain?: number
  attack?: number
  release?: number
  freqEnd?: number
}) {
  const c = ensureCtx()
  if (!c || !master || muted) return
  const {
    freq, start = 0, duration, type = 'sine',
    gain = 0.3, attack = 0.005, release = 0.08, freqEnd,
  } = opts
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + duration)
  }
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + attack)
  g.gain.setValueAtTime(gain, t0 + duration - release)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g).connect(master)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

function chord(freqs: number[], duration: number, type: OscillatorType = 'sine', gain = 0.2) {
  for (const f of freqs) tone({ freq: f, duration, type, gain, attack: 0.01, release: duration * 0.5 })
}

function arpeggio(freqs: number[], step: number, duration: number, type: OscillatorType = 'sine', gain = 0.25) {
  freqs.forEach((f, i) => tone({ freq: f, duration, start: i * step, type, gain, attack: 0.005, release: duration * 0.4 }))
}

// ── Library ──────────────────────────────────────────────────────────
const sfx: Record<SfxName, () => void> = {
  click: () => tone({ freq: 880, duration: 0.05, type: 'triangle', gain: 0.15 }),
  select: () => arpeggio([660, 990], 0.04, 0.12, 'triangle', 0.22),
  reveal: () => arpeggio([440, 660, 880, 990], 0.06, 0.18, 'sine', 0.18),
  win: () => {
    // C major triad ascending then full chord
    arpeggio([523, 659, 784], 0.07, 0.18, 'triangle', 0.22)
    setTimeout(() => chord([523, 659, 784, 1046], 0.5, 'triangle', 0.18), 200)
  },
  lose: () => {
    tone({ freq: 220, freqEnd: 110, duration: 0.5, type: 'sawtooth', gain: 0.16, attack: 0.02, release: 0.3 })
  },
  tie: () => arpeggio([440, 440], 0.08, 0.1, 'square', 0.15),
  event: () => {
    // Mysterious tritone shimmer
    arpeggio([392, 554, 740, 932], 0.05, 0.25, 'sine', 0.16)
  },
  shuffle: () => {
    for (let i = 0; i < 8; i++) {
      tone({ freq: 200 + Math.random() * 800, start: i * 0.03, duration: 0.04, type: 'triangle', gain: 0.1 })
    }
  },
  gameOver: () => {
    // Heroic final chord progression
    arpeggio([392, 494, 587, 740, 988], 0.1, 0.35, 'triangle', 0.22)
    setTimeout(() => chord([392, 494, 587, 740], 0.9, 'triangle', 0.2), 500)
  },
}

export function play(name: SfxName) {
  sfx[name]?.()
}

// ── Ambient pad (very soft drone) ────────────────────────────────────
let pad: { osc1: OscillatorNode; osc2: OscillatorNode; g: GainNode } | null = null

export function startAmbient() {
  const c = ensureCtx()
  if (!c || !master || pad) return
  const osc1 = c.createOscillator()
  const osc2 = c.createOscillator()
  const g = c.createGain()
  osc1.type = 'sine'
  osc2.type = 'sine'
  osc1.frequency.value = 110   // A2
  osc2.frequency.value = 165   // E3 (perfect fifth)
  g.gain.setValueAtTime(0, c.currentTime)
  g.gain.linearRampToValueAtTime(0.04, c.currentTime + 2)
  osc1.connect(g)
  osc2.connect(g)
  g.connect(master)
  osc1.start()
  osc2.start()
  pad = { osc1, osc2, g }
}

export function stopAmbient() {
  if (!pad || !ctx) return
  const t = ctx.currentTime
  pad.g.gain.cancelScheduledValues(t)
  pad.g.gain.setValueAtTime(pad.g.gain.value, t)
  pad.g.gain.linearRampToValueAtTime(0, t + 1)
  const { osc1, osc2 } = pad
  setTimeout(() => { osc1.stop(); osc2.stop() }, 1100)
  pad = null
}
