import { useEffect } from 'react'
import { useGameStore, botAutoPlay } from '../store/gameStore'
import { useSettings } from '../store/settingsStore'
import { play } from '../lib/sfx'
import Card from '../components/Card'
import Dust from '../components/Dust'
import Tutorial from '../components/Tutorial'
import type { Stat } from '../types'
import styles from './GameScreen.module.css'

const STAT_LABELS: Record<Stat, string> = {
  force: 'Force', magie: 'Magie', ruse: 'Ruse', velocite: 'Vélocité',
}

function toRoman(n: number): string {
  const map: [number, string][] = [
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let out = ''
  let x = n
  for (const [v, s] of map) {
    while (x >= v) { out += s; x -= v }
  }
  return out
}

export default function GameScreen() {
  const { game, chooseStat, nextRound, playCard, setScreen, confirmHandoff } = useGameStore()
  const { tutorialSeen } = useSettings()

  useEffect(() => {
    if (!game || game.phase !== 'reveal_cards') return
    const leader = game.players[game.leaderIndex]
    const timer = setTimeout(() => playCard(leader.id), 600)
    return () => clearTimeout(timer)
  }, [game?.phase, game?.currentRound])

  useEffect(() => {
    if (!game || game.phase !== 'choose_stat') return
    const leader = game.players[game.leaderIndex]
    if (leader.isBot) {
      const timer = setTimeout(() => botAutoPlay(), 900)
      return () => clearTimeout(timer)
    }
  }, [game?.phase, game?.leaderIndex])

  if (!game) return null

  const { players, leaderIndex, activeEvent, phase, roundHistory, currentRound } = game
  const leader = players[leaderIndex]
  const lastRound = roundHistory[roundHistory.length - 1]

  // ── Handoff (pass-and-play) ────────────────────────────────────
  if (phase === 'handoff') {
    return (
      <div className={styles.handoff}>
        <Dust count={20} />
        <p className={styles.greek}>· ΔΩΣΕ ·</p>
        <h2 className={styles.handoffTitle}>
          <span className={styles.handoffSub}>Passe le téléphone à</span>
          <span className={styles.handoffName}>{leader.name}</span>
        </h2>
        <div className={styles.handoffSeal}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(201,162,39,.45)" strokeWidth=".5"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(201,162,39,.3)" strokeWidth=".4"/>
            <polygon points="50,32 56,46 70,46 59,55 64,69 50,61 36,69 41,55 30,46 44,46"
                     fill="rgba(201,162,39,.5)" stroke="rgba(201,162,39,.8)" strokeWidth=".5"/>
          </svg>
        </div>
        <button className={styles.handoffBtn} onClick={confirmHandoff}>
          <span>⚡</span><span>C'est moi</span><span>⚡</span>
        </button>
      </div>
    )
  }

  // ── Game over ──────────────────────────────────────────────────
  if (phase === 'game_over') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    return (
      <div className={styles.gameOver}>
        <Dust count={28} />
        <p className={styles.greek}>· ΤΕΛΟΣ ·</p>
        <h1 className={styles.gameOverTitle}>Fin de partie</h1>
        <div className={styles.divider}>
          <span className={styles.dividerLine}/>
          <span className={styles.dividerStar}>✦</span>
          <span className={styles.dividerLine}/>
        </div>
        <div className={styles.podium}>
          {sorted.map((p, i) => (
            <div key={p.id} className={`${styles.podiumRow} ${i === 0 ? styles.winner : ''}`}
                 style={{ animationDelay: `${i * 120}ms` }}>
              <span className={styles.rank}>{toRoman(i + 1)}</span>
              <span className={styles.playerName}>{p.name}</span>
              <span className={styles.score}>{p.score} <span className={styles.coin}>🪙</span></span>
            </div>
          ))}
        </div>
        <button className={styles.primaryBtn} onClick={() => { play('click'); setScreen('home') }}>
          <span>⚡</span><span>Retour au menu</span><span>⚡</span>
        </button>
      </div>
    )
  }

  // ── Round end ──────────────────────────────────────────────────
  if (phase === 'round_end' && lastRound) {
    const winnerPlayer = lastRound.winnerId
      ? players.find((p) => p.id === lastRound.winnerId)
      : null

    return (
      <div className={styles.roundEnd}>
        <Dust count={14} />

        {activeEvent && (
          <div className={styles.eventBadge}>
            <span className={styles.eventIcon}>✦</span>
            <span className={styles.eventBadgeName}>{activeEvent.name}</span>
            <span className={styles.eventIcon}>✦</span>
          </div>
        )}

        <h2 className={styles.roundTitle}>
          {winnerPlayer ? (
            <>
              <span className={styles.roundWinnerName}>{winnerPlayer.name}</span>
              <span className={styles.roundWinnerSub}>remporte le pli</span>
            </>
          ) : (
            <span className={styles.roundTie}>Égalité — les cartes s'accumulent</span>
          )}
        </h2>

        <p className={styles.roundStat}>
          Statistique choisie · <strong>{STAT_LABELS[lastRound.chosenStat]}</strong>
        </p>

        <div className={styles.playedCards}>
          {Object.entries(lastRound.playedCards).map(([pid, char]) => {
            const player = players.find((p) => p.id === pid)!
            const effStats = lastRound.effectiveStats[pid]
            const isWinner = pid === lastRound.winnerId
            return (
              <div key={pid} className={`${styles.playedSlot} ${isWinner ? styles.winnerSlot : ''}`}>
                {isWinner && <div className={styles.winnerHalo} aria-hidden="true"/>}
                <Card character={char} effectiveStats={effStats} activeStat={lastRound.chosenStat}/>
                <div className={styles.playerLabel}>
                  {isWinner && <span className={styles.trophy}>🏆</span>}
                  {player.name}
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.scores}>
          {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={p.id} className={`${styles.scoreRow} ${i === 0 ? styles.scoreLead : ''}`}>
              <span className={styles.scoreRank}>{toRoman(i+1)}</span>
              <span className={styles.scoreName}>{p.name}</span>
              <span className={styles.scoreVal}>{p.score} 🪙</span>
            </div>
          ))}
        </div>

        <button className={styles.primaryBtn} onClick={nextRound}>
          <span>⚡</span>
          <span>{game.players.every((p) => p.deck.length === 0) ? 'Voir les résultats' : 'Pli suivant'}</span>
          <span>⚡</span>
        </button>
      </div>
    )
  }

  // ── Main game view ─────────────────────────────────────────────
  return (
    <div className={styles.game}>
      <Dust count={10} />
      {!tutorialSeen && currentRound === 1 && phase === 'choose_stat' && <Tutorial />}

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.roundNum}>Pli {toRoman(currentRound)}</span>
          <span className={styles.leaderBadge}>
            <span className={styles.leaderBolt}>⚡</span> {leader.name}
          </span>
        </div>
        <div className={styles.headerRight}>
          {players.map((p) => (
            <div key={p.id} className={`${styles.miniScore} ${p.id === leader.id ? styles.miniLead : ''}`}>
              <span className={styles.miniName}>{p.name.slice(0, 8)}</span>
              <span className={styles.miniVal}>{p.score}</span>
            </div>
          ))}
        </div>
      </div>

      {activeEvent && (
        <div className={styles.eventZone}>
          <div className={styles.eventCard}>
            <div className={styles.eventCornerTL} aria-hidden="true">✦</div>
            <div className={styles.eventCornerTR} aria-hidden="true">✦</div>
            <div className={styles.eventCornerBL} aria-hidden="true">✦</div>
            <div className={styles.eventCornerBR} aria-hidden="true">✦</div>
            <div className={styles.eventHeader}>· Événement ·</div>
            <div className={styles.eventName}>{activeEvent.name}</div>
            <div className={styles.eventRule}>{activeEvent.rule}</div>
          </div>
        </div>
      )}

      {phase === 'reveal_cards' || phase === 'choose_stat' ? (
        <div className={styles.cardZone}>
          {leader.deck.length > 0 ? (
            <>
              <div className={styles.cardLabel}>
                <span className={styles.labelStar}>✦</span> Votre carte <span className={styles.labelStar}>✦</span>
              </div>
              <div className={`${styles.cardWrap} ${phase === 'reveal_cards' ? styles.cardFlipping : ''}`}>
                <Card
                  character={leader.deck[0]}
                  onStatClick={leader.isBot || phase !== 'choose_stat' ? undefined : chooseStat}
                />
              </div>
              {phase === 'choose_stat' && !leader.isBot && (
                <p className={styles.hint}>Touche une statistique pour jouer</p>
              )}
              {phase === 'choose_stat' && leader.isBot && (
                <p className={styles.hint}>L'oracle médite…</p>
              )}
            </>
          ) : (
            <p className={styles.hint}>Vos cartes sont épuisées</p>
          )}
        </div>
      ) : null}

      <div className={styles.deckRow}>
        {players.filter((p) => p.id !== leader.id).map((p) => (
          <div key={p.id} className={styles.deckSlot}>
            <div className={styles.deckStack}>
              <div className={styles.deckCard} style={{ transform: 'rotate(-3deg)' }}/>
              <div className={styles.deckCard} style={{ transform: 'rotate(1deg)' }}/>
              <div className={styles.deckCardTop}/>
            </div>
            <div className={styles.deckInfo}>
              <span className={styles.deckName}>{p.name}</span>
              <span className={styles.deckCount}>{p.deck.length} cartes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
