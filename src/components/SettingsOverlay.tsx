import { useState } from 'react'
import { useSettings } from '../store/settingsStore'
import { play, startAmbient, stopAmbient } from '../lib/sfx'
import styles from './SettingsOverlay.module.css'

export default function SettingsOverlay() {
  const [open, setOpen] = useState(false)
  const s = useSettings()

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => { play('click'); setOpen(true) }}
        aria-label="Paramètres"
      >
        ⚙
      </button>

      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <span className={styles.greek}>· ΡΥΘΜΙΣΕΙΣ ·</span>
              <h2 className={styles.title}>Paramètres</h2>
            </div>

            <div className={styles.row}>
              <label className={styles.label}>Effets sonores</label>
              <input
                type="range" min="0" max="1" step="0.05"
                className={styles.slider}
                value={s.sfxVolume}
                onChange={(e) => s.setSfx(parseFloat(e.target.value))}
              />
              <span className={styles.val}>{Math.round(s.sfxVolume * 100)}</span>
            </div>

            <div className={styles.row}>
              <label className={styles.label}>Musique</label>
              <input
                type="range" min="0" max="1" step="0.05"
                className={styles.slider}
                value={s.musicVolume}
                onChange={(e) => s.setMusic(parseFloat(e.target.value))}
              />
              <span className={styles.val}>{Math.round(s.musicVolume * 100)}</span>
            </div>

            <div className={styles.toggleRow}>
              <button
                className={`${styles.toggle} ${!s.muted ? styles.toggleOn : ''}`}
                onClick={() => { s.setMuted(!s.muted); play('click') }}
              >
                {s.muted ? '🔇 Muet' : '🔊 Son actif'}
              </button>
              <button
                className={`${styles.toggle} ${s.ambient ? styles.toggleOn : ''}`}
                onClick={() => {
                  const next = !s.ambient
                  s.setAmbient(next)
                  if (next) startAmbient(); else stopAmbient()
                  play('click')
                }}
              >
                {s.ambient ? '🎵 Ambient on' : '🎵 Ambient off'}
              </button>
            </div>

            <button className={styles.close} onClick={() => { play('click'); setOpen(false) }}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  )
}
