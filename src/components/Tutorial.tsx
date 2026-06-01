import { useState } from 'react'
import { useSettings } from '../store/settingsStore'
import { play } from '../lib/sfx'
import styles from './Tutorial.module.css'

const STEPS = [
  {
    title: 'Bienvenue dans Cartes Mythologie',
    body: 'Un jeu de bataille de stats où les dieux, titans, héros et créatures s\'affrontent.',
    glyph: '⚡',
  },
  {
    title: 'L\'événement',
    body: 'Chaque pli, une carte Événement modifie les règles. Lis-la attentivement — elle peut booster ou affaiblir une catégorie.',
    glyph: '✦',
  },
  {
    title: 'Choisis ta stat',
    body: 'En tant que meneur, choisis la statistique sur laquelle s\'affrontent les cartes. La plus haute remporte le pli.',
    glyph: '🦉',
  },
  {
    title: 'Cagnotte d\'or',
    body: 'Chaque carte gagnée = 1 pièce d\'or. Le joueur avec le plus d\'or à la fin remporte la partie.',
    glyph: '🪙',
  },
]

export default function Tutorial() {
  const [step, setStep] = useState(0)
  const [closing, setClosing] = useState(false)
  const markSeen = useSettings((s) => s.markTutorialSeen)

  const next = () => {
    play('click')
    if (step < STEPS.length - 1) setStep(step + 1)
    else close()
  }

  const close = () => {
    setClosing(true)
    setTimeout(() => markSeen(), 250)
  }

  const cur = STEPS[step]

  return (
    <div className={`${styles.overlay} ${closing ? styles.closing : ''}`}>
      <div className={styles.panel}>
        <div className={styles.glyph}>{cur.glyph}</div>
        <p className={styles.greek}>· ΔΙΔΑΧΗ {step + 1}/{STEPS.length} ·</p>
        <h2 className={styles.title}>{cur.title}</h2>
        <p className={styles.body}>{cur.body}</p>

        <div className={styles.dots}>
          {STEPS.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === step ? styles.dotActive : ''}`} />
          ))}
        </div>

        <div className={styles.actions}>
          {step > 0 && (
            <button className={styles.btnSecondary} onClick={() => { play('click'); setStep(step - 1) }}>
              ← Précédent
            </button>
          )}
          <button className={styles.btnPrimary} onClick={next}>
            {step < STEPS.length - 1 ? 'Suivant →' : 'Commencer ⚡'}
          </button>
        </div>

        <button className={styles.skip} onClick={() => { play('click'); close() }}>
          Passer le tutoriel
        </button>
      </div>
    </div>
  )
}
