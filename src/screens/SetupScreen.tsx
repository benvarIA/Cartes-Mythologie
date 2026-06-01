import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { Player } from '../types'
import Dust from '../components/Dust'
import styles from './SetupScreen.module.css'

const AVATARS = ['⚡', '🌊', '🔥', '🌙', '⚔', '🦅']

function makePlayer(index: number, name: string, isBot: boolean): Player {
  return {
    id: `player-${index}`,
    name: name.trim() || (isBot ? `Bot ${index}` : `Joueur ${index}`),
    isBot,
    deck: [],
    score: 0,
  }
}

export default function SetupScreen() {
  const { setScreen, startGame } = useGameStore()
  const [playerCount, setPlayerCount] = useState(2)
  const [names, setNames] = useState(['Vous', 'Bot I', 'Bot II', 'Bot III', 'Bot IV', 'Bot V'])
  const [botFlags, setBotFlags] = useState([false, true, true, true, true, true])

  const updateName = (i: number, v: string) =>
    setNames((prev) => prev.map((n, j) => (j === i ? v : n)))
  const toggleBot = (i: number) =>
    setBotFlags((prev) => prev.map((b, j) => (j === i ? !b : b)))

  const handleStart = () => {
    const players = Array.from({ length: playerCount }, (_, i) =>
      makePlayer(i + 1, names[i], botFlags[i])
    )
    startGame(players)
  }

  return (
    <div className={styles.setup}>
      <Dust count={12} />

      <header className={styles.header}>
        <button className={styles.back} onClick={() => setScreen('home')}>
          <span>←</span> Retour
        </button>
        <p className={styles.greek}>· ΠΡΟΠΑΡΑΣΚΕΥΗ ·</p>
        <h1 className={styles.title}>Nouvelle Partie</h1>
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerStar}>✦</span>
          <span className={styles.dividerLine} />
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionOrnament}>❦</span>
          Joueurs
          <span className={styles.sectionOrnament}>❦</span>
        </h2>
        <div className={styles.countRow}>
          {[2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              className={`${styles.countBtn} ${playerCount === n ? styles.selected : ''}`}
              onClick={() => setPlayerCount(n)}
              aria-label={`${n} joueurs`}
            >
              {['II','III','IV','V','VI'][n-2]}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionOrnament}>❦</span>
          Roster
          <span className={styles.sectionOrnament}>❦</span>
        </h2>
        <div className={styles.playerList}>
          {Array.from({ length: playerCount }, (_, i) => (
            <div
              key={i}
              className={styles.playerRow}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={styles.avatar}>
                <span className={styles.avatarIcon}>{AVATARS[i]}</span>
              </div>
              <input
                className={styles.nameInput}
                value={names[i]}
                onChange={(e) => updateName(i, e.target.value)}
                placeholder={`Joueur ${i + 1}`}
                maxLength={16}
              />
              <button
                className={`${styles.botToggle} ${botFlags[i] ? styles.isBot : styles.isHuman}`}
                onClick={() => toggleBot(i)}
                aria-label={botFlags[i] ? 'Changer pour humain' : 'Changer pour bot'}
              >
                {botFlags[i] ? '⚙ Bot' : '👤 Humain'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <button className={styles.startBtn} onClick={handleStart}>
        <span className={styles.startGlyph}>⚡</span>
        <span className={styles.startLabel}>Lancer la partie</span>
        <span className={styles.startGlyph}>⚡</span>
      </button>
    </div>
  )
}
