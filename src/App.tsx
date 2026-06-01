import { useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import { useSettings } from './store/settingsStore'
import { startAmbient, stopAmbient } from './lib/sfx'
import HomeScreen from './screens/HomeScreen'
import SetupScreen from './screens/SetupScreen'
import GameScreen from './screens/GameScreen'
import SettingsOverlay from './components/SettingsOverlay'

export default function App() {
  const screen = useGameStore((s) => s.screen)
  const { ambient, muted } = useSettings()

  // Start/stop the ambient drone after the user's first interaction.
  // Browsers block AudioContext.start() until a gesture, so we attach a one-shot listener.
  useEffect(() => {
    if (!ambient || muted) {
      stopAmbient()
      return
    }
    const onFirstGesture = () => {
      startAmbient()
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
    }
    window.addEventListener('pointerdown', onFirstGesture, { once: true })
    window.addEventListener('keydown', onFirstGesture, { once: true })
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
    }
  }, [ambient, muted])

  return (
    <>
      <SettingsOverlay />
      {screen === 'home' && <HomeScreen />}
      {screen === 'setup' && <SetupScreen />}
      {screen === 'game' && <GameScreen />}
    </>
  )
}
