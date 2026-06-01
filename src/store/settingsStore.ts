import { create } from 'zustand'
import { setMuted, setVolume } from '../lib/sfx'

const STORAGE_KEY = 'cartes-mythologie-settings'

interface Settings {
  sfxVolume: number      // 0..1
  musicVolume: number    // 0..1
  muted: boolean
  ambient: boolean       // music drone on/off
  tutorialSeen: boolean
}

interface SettingsStore extends Settings {
  setSfx: (v: number) => void
  setMusic: (v: number) => void
  setMuted: (m: boolean) => void
  setAmbient: (a: boolean) => void
  markTutorialSeen: () => void
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) throw new Error()
    const s = JSON.parse(raw)
    return {
      sfxVolume:    typeof s.sfxVolume    === 'number' ? s.sfxVolume    : 0.5,
      musicVolume:  typeof s.musicVolume  === 'number' ? s.musicVolume  : 0.3,
      muted:        !!s.muted,
      ambient:      s.ambient !== false,
      tutorialSeen: !!s.tutorialSeen,
    }
  } catch {
    return { sfxVolume: 0.5, musicVolume: 0.3, muted: false, ambient: true, tutorialSeen: false }
  }
}

function persist(s: Settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

const initial = load()

// Sync initial state into the sfx module
setVolume(initial.sfxVolume)
setMuted(initial.muted)

export const useSettings = create<SettingsStore>((set, get) => ({
  ...initial,
  setSfx: (v) => { set({ sfxVolume: v }); setVolume(v); persist({ ...get(), sfxVolume: v }) },
  setMusic: (v) => { set({ musicVolume: v }); persist({ ...get(), musicVolume: v }) },
  setMuted: (m) => { set({ muted: m }); setMuted(m); persist({ ...get(), muted: m }) },
  setAmbient: (a) => { set({ ambient: a }); persist({ ...get(), ambient: a }) },
  markTutorialSeen: () => { set({ tutorialSeen: true }); persist({ ...get(), tutorialSeen: true }) },
}))
