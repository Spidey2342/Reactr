import { getPrefs } from '../state/gameStore'

/** Short synthesized sounds and vibration, gated by the Sound and Haptics toggles. No audio files. */
let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  try {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx ??= new Ctor()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.05, delay = 0) {
  if (!getPrefs().sound) return
  const c = audio()
  if (!c) return
  try {
    const t0 = c.currentTime + delay
    const osc = c.createOscillator()
    const amp = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    amp.gain.setValueAtTime(gain, t0)
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(amp).connect(c.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.02)
  } catch {
    /* audio is best effort */
  }
}

function buzz(pattern: number | number[]) {
  if (!getPrefs().haptics) return
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    /* haptics are best effort */
  }
}

export const feedback = {
  tap() {
    buzz(8)
    tone(520, 0.05, 'triangle', 0.035)
  },
  select() {
    buzz(12)
    tone(660, 0.06, 'triangle', 0.045)
  },
  lock() {
    buzz([20, 30, 40])
    tone(523, 0.09, 'triangle', 0.05)
    tone(784, 0.16, 'triangle', 0.05, 0.09)
  },
  flip() {
    buzz(15)
    tone(320, 0.1, 'sawtooth', 0.025)
  },
  tick() {
    buzz(6)
    tone(880, 0.04, 'square', 0.02)
  },
  win() {
    buzz([30, 40, 30, 40, 90])
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.05, i * 0.09))
  },
  error() {
    buzz([40, 40, 40])
    tone(180, 0.14, 'square', 0.035)
  },
}
