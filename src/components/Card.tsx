import type { Character, Stat, CardStats } from '../types'
import styles from './Card.module.css'

// ── Heat color scale ────────────────────────────────────────────────
const STOPS: [number, [number, number, number]][] = [
  [0,   [255, 255, 255]],
  [12,  [160, 200, 255]],
  [25,  [ 50, 110, 255]],
  [42,  [  0, 210, 140]],
  [58,  [ 50, 210,  50]],
  [72,  [240, 230,   0]],
  [85,  [255, 120,   0]],
  [100, [255,   0,   0]],
]

function heatRGB(pct: number): [number, number, number] {
  for (let i = 1; i < STOPS.length; i++) {
    const [p0, c0] = STOPS[i - 1]
    const [p1, c1] = STOPS[i]
    if (pct <= p1) {
      const t = (pct - p0) / (p1 - p0)
      return [
        Math.round(c0[0] + t * (c1[0] - c0[0])),
        Math.round(c0[1] + t * (c1[1] - c0[1])),
        Math.round(c0[2] + t * (c1[2] - c0[2])),
      ]
    }
  }
  return STOPS[STOPS.length - 1][1]
}

function heatColor(pct: number, alpha = 1): string {
  const [r, g, b] = heatRGB(pct)
  return `rgba(${r},${g},${b},${alpha})`
}

// ── Category config ────────────────────────────────────────────────
const CAT_CONFIG = {
  dieu:     { glow: 'rgba(90,174,255,.4)',   gemFill: ['#e8f6ff','#6dc0f5','#1a6abf','#061e45'], gemStroke: '#a0d0ff' },
  titan:    { glow: 'rgba(74,207,122,.4)',   gemFill: ['#dffff0','#50d880','#1a8040','#052212'], gemStroke: '#80e0a0' },
  heros:    { glow: 'rgba(176,122,239,.4)',  gemFill: ['#f0e0ff','#b060f0','#6020b0','#1a0540'], gemStroke: '#c080ff' },
  creature: { glow: 'rgba(224,80,80,.4)',    gemFill: ['#ffe0d8','#e83030','#9a0f0f','#280404'], gemStroke: '#ff7060' },
} as const

const STAT_LABELS: Record<Stat, string> = {
  force: 'Force', magie: 'Magie', ruse: 'Ruse', velocite: 'Vélocité',
}
const STAT_ICONS: Record<Stat, string> = {
  force: '⚔️', magie: '✨', ruse: '🦉', velocite: '💨',
}
const STAT_ORDER: Stat[] = ['force', 'magie', 'ruse', 'velocite']

// ── Gem SVG ────────────────────────────────────────────────────────
function GemCircle({ category }: { category: keyof typeof CAT_CONFIG }) {
  const { gemFill, gemStroke } = CAT_CONFIG[category]
  const id = `gem-${category}-${Math.random().toString(36).slice(2,6)}`
  return (
    <svg width="16" height="16" viewBox="0 0 28 28">
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="62%">
          <stop offset="0%"   stopColor={gemFill[0]}/>
          <stop offset="28%"  stopColor={gemFill[1]}/>
          <stop offset="65%"  stopColor={gemFill[2]}/>
          <stop offset="100%" stopColor={gemFill[3]}/>
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill={`url(#${id})`}/>
      <polygon points="14,7 19.2,10.5 19.2,17.5 14,21 8.8,17.5 8.8,10.5"
               fill="none" stroke={`${gemStroke}80`} strokeWidth=".7"/>
      <line x1="14" y1="7"    x2="14" y2="2"    stroke={`${gemStroke}60`} strokeWidth=".6"/>
      <line x1="19.2" y1="10.5" x2="24" y2="8"  stroke={`${gemStroke}60`} strokeWidth=".6"/>
      <line x1="19.2" y1="17.5" x2="24" y2="20" stroke={`${gemStroke}40`} strokeWidth=".6"/>
      <line x1="14" y1="21"   x2="14" y2="26"   stroke={`${gemStroke}40`} strokeWidth=".6"/>
      <line x1="8.8" y1="17.5" x2="4"  y2="20"  stroke={`${gemStroke}35`} strokeWidth=".6"/>
      <line x1="8.8" y1="10.5" x2="4"  y2="8"   stroke={`${gemStroke}50`} strokeWidth=".6"/>
      <ellipse cx="10.5" cy="9.5" rx="3.5" ry="2.2"
               fill="rgba(255,255,255,.42)" transform="rotate(-30,10.5,9.5)"/>
    </svg>
  )
}

// ── Meander SVG path ───────────────────────────────────────────────
function MeanderStrip({ children }: { category: keyof typeof CAT_CONFIG; children?: React.ReactNode }) {
  return (
    <div className={styles.cardStrip}>
      <svg viewBox="0 0 272 14" className={styles.meander}>
        <path
          d="M0,7 L4,7 4,2 18,2 18,12 10,12 10,9 14,9 14,5 10,5 10,12
             M22,12 L22,2 32,2 32,7 28,7 28,5 32,5
             M40,7 L44,7 44,2 58,2 58,12 50,12 50,9 54,9 54,5 50,5 50,12
             M62,12 L62,2 72,2 72,7 68,7 68,5 72,5 72,12 80,12
             M96,7 L100,7 100,2 114,2 114,12 106,12 106,9 110,9 110,5 106,5 106,12
             M118,12 L118,2 128,2 128,7 124,7 124,5 128,5
             M136,7 L140,7 140,2 154,2 154,12 146,12 146,9 150,9 150,5 146,5 146,12
             M158,12 L158,2 168,2 168,7 164,7 164,5 168,5 168,12 176,12
             M192,7 L196,7 196,2 210,2 210,12 202,12 202,9 206,9 206,5 202,5 202,12
             M214,12 L214,2 224,2 224,7 220,7 220,5 224,5
             M232,7 L236,7 236,2 250,2 250,12 242,12 242,9 246,9 246,5 242,5 242,12
             M254,12 L254,2 264,2 264,7 260,7 260,5 264,5 264,12 272,12"
          fill="none" stroke="rgba(201,162,39,0.7)" strokeWidth="1.1" strokeLinecap="square"
        />
      </svg>
      {children}
    </div>
  )
}

// ── Main Card component ────────────────────────────────────────────
interface CardProps {
  character: Character
  /** Stats après application de l'événement (si null → stats brutes) */
  effectiveStats?: CardStats
  /** Stat sélectionnée pour highlight */
  activeStat?: Stat | null
  /** Carte face cachée */
  faceDown?: boolean
  /** Callback sélection de stat */
  onStatClick?: (stat: Stat) => void
  /** Mode compact (petite carte dans le deck) */
  compact?: boolean
}

export default function Card({
  character,
  effectiveStats,
  activeStat,
  faceDown = false,
  onStatClick,
  compact = false,
}: CardProps) {
  const cat = character.category as keyof typeof CAT_CONFIG
  const { glow } = CAT_CONFIG[cat]
  const stats = effectiveStats ?? character.stats

  // Find peak stat
  const peakStat = STAT_ORDER.reduce((best, s) =>
    stats[s] > stats[best] ? s : best, STAT_ORDER[0])

  const imgUrl = `/ref/illus/${character.id}.png`
  const isCrop = character.imageQuality === 'crop'

  if (faceDown) {
    return (
      <div className={`${styles.cardBack} ${compact ? styles.compact : ''}`}>
        <img src="/card-back.png" alt="dos" className={styles.backImg}/>
      </div>
    )
  }

  return (
    <div
      className={`${styles.card} ${compact ? styles.compact : ''}`}
      style={{ '--glow': glow } as React.CSSProperties}
      data-cat={cat}
    >
      {/* Frise haute + gemme */}
      <MeanderStrip category={cat}>
        <div className={styles.gemOverlay} style={{ boxShadow: `0 0 0 1.5px rgba(201,162,39,.9), 0 0 0 3px rgba(0,0,0,.7), 0 0 12px ${glow}` }}>
          <GemCircle category={cat}/>
        </div>
      </MeanderStrip>

      {/* Portrait */}
      <div className={styles.portraitBlock}>
        <div
          className={styles.portraitBackdrop}
          style={{ backgroundImage: `url('${imgUrl}')` }}
        />
        <div
          className={styles.portraitImg}
          data-q={isCrop ? 'crop' : undefined}
          style={{ backgroundImage: `url('${imgUrl}')` }}
        />
        <div className={styles.nameBand}>
          <div className={styles.cardName}>{character.name}</div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsBlock}>
        {STAT_ORDER.map((stat) => {
          const val = stats[stat]
          const isPeak = stat === peakStat
          const isActive = stat === activeStat
          const bar = heatColor(val, 1)
          const barFade = heatColor(val, 0.5)
          const heat = heatColor(val, 0.45)

          return (
            <div
              key={stat}
              className={`${styles.statRow} ${isPeak ? styles.peak : ''} ${isActive ? styles.active : ''} ${onStatClick ? styles.clickable : ''}`}
              onClick={() => onStatClick?.(stat)}
              style={{ '--heat': heat } as React.CSSProperties}
            >
              <div className={styles.statIcon}>{STAT_ICONS[stat]}</div>
              <div className={styles.statBarWrap}>
                <div className={styles.statLabel}>{STAT_LABELS[stat]}</div>
                <div className={styles.statTrack}>
                  <div
                    className={styles.statFill}
                    style={{
                      width: `${val}%`,
                      background: `linear-gradient(90deg, ${barFade} 0%, ${bar} 100%)`,
                    }}
                  />
                </div>
              </div>
              <div className={styles.statVal} style={{ color: bar, textShadow: `0 0 10px ${heatColor(val, 0.4)}, 0 1px 3px rgba(0,0,0,.9)` }}>
                {val}
              </div>
            </div>
          )
        })}
      </div>

      {/* Frise basse */}
      <div className={`${styles.cardStrip} ${styles.bot}`}>
        <svg viewBox="0 0 272 14" className={styles.meander}>
          <path
            d="M0,7 L4,7 4,2 18,2 18,12 10,12 10,9 14,9 14,5 10,5 10,12
               M22,12 L22,2 32,2 32,7 28,7 28,5 32,5
               M40,7 L44,7 44,2 58,2 58,12 50,12 50,9 54,9 54,5 50,5 50,12
               M62,12 L62,2 72,2 72,7 68,7 68,5 72,5 72,12 80,12
               M96,7 L100,7 100,2 114,2 114,12 106,12 106,9 110,9 110,5 106,5 106,12
               M118,12 L118,2 128,2 128,7 124,7 124,5 128,5
               M136,7 L140,7 140,2 154,2 154,12 146,12 146,9 150,9 150,5 146,5 146,12
               M158,12 L158,2 168,2 168,7 164,7 164,5 168,5 168,12 176,12
               M192,7 L196,7 196,2 210,2 210,12 202,12 202,9 206,9 206,5 202,5 202,12
               M214,12 L214,2 224,2 224,7 220,7 220,5 224,5
               M232,7 L236,7 236,2 250,2 250,12 242,12 242,9 246,9 246,5 242,5 242,12
               M254,12 L254,2 264,2 264,7 260,7 260,5 264,5 264,12 272,12"
            fill="none" stroke="rgba(201,162,39,0.7)" strokeWidth="1.1" strokeLinecap="square"
          />
        </svg>
      </div>
    </div>
  )
}
