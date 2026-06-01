import { useGameStore } from '../store/gameStore'
import Dust from '../components/Dust'
import styles from './HomeScreen.module.css'

export default function HomeScreen() {
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <div className={styles.home}>
      <Dust />

      {/* Temple columns silhouette at bottom */}
      <div className={styles.columns} aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className={styles.column} style={{ animationDelay: `${i * .1}s` }} />
        ))}
      </div>

      {/* Decorative top meander */}
      <div className={styles.topBorder} aria-hidden="true">
        <svg viewBox="0 0 400 14" preserveAspectRatio="none">
          <path
            d="M0,7 L4,7 4,2 18,2 18,12 10,12 10,9 14,9 14,5 10,5 10,12 M22,12 L22,2 32,2 32,7 28,7 28,5 32,5 M40,7 L44,7 44,2 58,2 58,12 50,12 50,9 54,9 54,5 50,5 50,12 M62,12 L62,2 72,2 72,7 68,7 68,5 72,5 72,12 80,12 M96,7 L100,7 100,2 114,2 114,12 106,12 106,9 110,9 110,5 106,5 106,12 M118,12 L118,2 128,2 128,7 124,7 124,5 128,5 M136,7 L140,7 140,2 154,2 154,12 146,12 146,9 150,9 150,5 146,5 146,12 M158,12 L158,2 168,2 168,7 164,7 164,5 168,5 168,12 176,12 M192,7 L196,7 196,2 210,2 210,12 202,12 202,9 206,9 206,5 202,5 202,12 M214,12 L214,2 224,2 224,7 220,7 220,5 224,5 M232,7 L236,7 236,2 250,2 250,12 242,12 242,9 246,9 246,5 242,5 242,12 M254,12 L254,2 264,2 264,7 260,7 260,5 264,5 264,12 272,12 M288,7 L292,7 292,2 306,2 306,12 298,12 298,9 302,9 302,5 298,5 298,12 M310,12 L310,2 320,2 320,7 316,7 316,5 320,5 M328,7 L332,7 332,2 346,2 346,12 338,12 338,9 342,9 342,5 338,5 338,12 M350,12 L350,2 360,2 360,7 356,7 356,5 360,5 360,12 368,12 M376,7 L380,7 380,2 394,2 394,12 386,12 386,9 390,9 390,5 386,5 386,12"
            fill="none" stroke="rgba(201,162,39,.55)" strokeWidth="1"
          />
        </svg>
      </div>

      <main className={styles.center}>
        {/* Greek subtitle (ancient) */}
        <p className={styles.greek}>· ΜΥΘΟΛΟΓΙΑ ·</p>

        {/* Main gilded title */}
        <h1 className={styles.title}>
          <span className={styles.titleLine}>Cartes</span>
          <span className={styles.titleLine}>Mythologie</span>
        </h1>

        {/* Decorative seal */}
        <div className={styles.seal} aria-hidden="true">
          <svg viewBox="0 0 80 80">
            <defs>
              <radialGradient id="sealGrad" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#f5dfa0" stopOpacity=".95"/>
                <stop offset="55%" stopColor="#c9a227" stopOpacity=".85"/>
                <stop offset="100%" stopColor="#4a3608" stopOpacity=".9"/>
              </radialGradient>
            </defs>
            {/* outer ring */}
            <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(201,162,39,.5)" strokeWidth=".6"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(201,162,39,.35)" strokeWidth=".4"/>
            {/* laurel left */}
            <path d="M14,40 Q18,28 28,22" fill="none" stroke="rgba(201,162,39,.55)" strokeWidth=".7"/>
            <path d="M14,40 Q18,52 28,58" fill="none" stroke="rgba(201,162,39,.55)" strokeWidth=".7"/>
            <ellipse cx="20" cy="30" rx="2.5" ry="1" fill="rgba(201,162,39,.55)" transform="rotate(-40 20 30)"/>
            <ellipse cx="17" cy="36" rx="2.5" ry="1" fill="rgba(201,162,39,.55)" transform="rotate(-15 17 36)"/>
            <ellipse cx="17" cy="44" rx="2.5" ry="1" fill="rgba(201,162,39,.55)" transform="rotate(15 17 44)"/>
            <ellipse cx="20" cy="50" rx="2.5" ry="1" fill="rgba(201,162,39,.55)" transform="rotate(40 20 50)"/>
            {/* laurel right */}
            <path d="M66,40 Q62,28 52,22" fill="none" stroke="rgba(201,162,39,.55)" strokeWidth=".7"/>
            <path d="M66,40 Q62,52 52,58" fill="none" stroke="rgba(201,162,39,.55)" strokeWidth=".7"/>
            <ellipse cx="60" cy="30" rx="2.5" ry="1" fill="rgba(201,162,39,.55)" transform="rotate(40 60 30)"/>
            <ellipse cx="63" cy="36" rx="2.5" ry="1" fill="rgba(201,162,39,.55)" transform="rotate(15 63 36)"/>
            <ellipse cx="63" cy="44" rx="2.5" ry="1" fill="rgba(201,162,39,.55)" transform="rotate(-15 63 44)"/>
            <ellipse cx="60" cy="50" rx="2.5" ry="1" fill="rgba(201,162,39,.55)" transform="rotate(-40 60 50)"/>
            {/* center star */}
            <polygon points="40,28 43,38 53,38 45,44 48,54 40,48 32,54 35,44 27,38 37,38"
                     fill="url(#sealGrad)" stroke="rgba(0,0,0,.5)" strokeWidth=".3"/>
          </svg>
        </div>

        <p className={styles.tagline}>
          <span className={styles.ornament}>❦</span>
          Jeu de bataille mythologique
          <span className={styles.ornament}>❦</span>
        </p>

        {/* Menu */}
        <nav className={styles.menu}>
          <button className={styles.btnPrimary} onClick={() => setScreen('setup')}>
            <span className={styles.btnGlyph}>⚡</span>
            <span className={styles.btnLabel}>Nouvelle partie</span>
            <span className={styles.btnGlyph}>⚡</span>
          </button>
          <button className={styles.btnSecondary} disabled>
            <span className={styles.btnGlyph}>📜</span>
            <span className={styles.btnLabel}>Les Règles</span>
          </button>
          <button className={styles.btnSecondary} disabled>
            <span className={styles.btnGlyph}>🏛</span>
            <span className={styles.btnLabel}>Le Panthéon</span>
          </button>
        </nav>
      </main>

      <footer className={styles.footer}>
        <span>LXXVIII personnages</span>
        <span className={styles.footerDot}>·</span>
        <span>XIII événements</span>
        <span className={styles.footerDot}>·</span>
        <span>IV catégories</span>
      </footer>
    </div>
  )
}
