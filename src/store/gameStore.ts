import { create } from 'zustand'
import type { GameState, Player, Stat, Character } from '../types'
import {
  buildAndDealDecks,
  buildEventDeck,
  resolveTrick,
  nextLeaderIndex,
  isGameOver,
  botChooseStat,
} from '../engine'
import { play } from '../lib/sfx'

export type Screen = 'home' | 'setup' | 'game' | 'results'

interface AppStore {
  screen: Screen
  setScreen: (s: Screen) => void

  game: GameState | null
  previousLeaderIndex: number | null  // for handoff detection

  startGame: (players: Player[]) => void

  chooseEvent: () => void
  playCard: (playerId: string) => void
  chooseStat: (stat: Stat, leaderDebuffStat?: Stat) => void
  nextRound: () => void
  confirmHandoff: () => void  // dismiss the "pass the phone" overlay
}

function makeInitialState(players: Player[]): GameState {
  const dealt = buildAndDealDecks(players)
  return {
    phase: 'reveal_event',
    players: dealt,
    leaderIndex: 0,
    eventDeck: buildEventDeck(),
    activeEvent: null,
    pendingCards: [],
    roundHistory: [],
    currentRound: 1,
  }
}

/** Are there 2+ human players in the game? */
function hasMultipleHumans(players: Player[]): boolean {
  return players.filter((p) => !p.isBot).length >= 2
}

export const useGameStore = create<AppStore>((set, get) => ({
  screen: 'home',
  setScreen: (s) => set({ screen: s }),
  game: null,
  previousLeaderIndex: null,

  startGame: (players) => {
    play('shuffle')
    set({
      game: makeInitialState(players),
      screen: 'game',
      previousLeaderIndex: null,
    })
    // If first leader is human and there are multiple humans, show handoff first
    if (!players[0].isBot && hasMultipleHumans(players)) {
      const game = get().game!
      set({ game: { ...game, phase: 'handoff' } })
    } else {
      get().chooseEvent()
    }
  },

  chooseEvent: () => {
    const { game } = get()
    if (!game) return
    const [event, ...rest] = game.eventDeck.length
      ? game.eventDeck
      : [buildEventDeck()[0]]
    play('event')
    set({
      game: {
        ...game,
        eventDeck: rest,
        activeEvent: event,
        phase: 'reveal_cards',
      },
    })
  },

  playCard: (_playerId) => {
    const { game } = get()
    if (!game) return
    play('reveal')
    set({ game: { ...game, phase: 'choose_stat' } })
  },

  chooseStat: (stat, leaderDebuffStat) => {
    const { game } = get()
    if (!game) return
    const { players, leaderIndex, activeEvent, pendingCards } = game
    if (!activeEvent) return

    play('select')

    const playedCards: Record<string, Character> = {}
    const updatedPlayers = players.map((p) => {
      if (p.deck.length === 0) return p
      const [top, ...rest] = p.deck
      playedCards[p.id] = top
      return { ...p, deck: rest }
    })

    const leaderId = players[leaderIndex].id
    const result = resolveTrick({
      playedCards,
      event: activeEvent,
      chosenStat: stat,
      leaderPlayerId: leaderId,
      leaderDebuffStat,
    })

    const cardsInPlay = Object.values(playedCards)
    const newPending = result.winnerId === null
      ? [...pendingCards, ...cardsInPlay]
      : []

    const winner = result.winnerId
      ? updatedPlayers.find((p) => p.id === result.winnerId)!
      : null

    const scoredPlayers = updatedPlayers.map((p) => {
      if (!winner || p.id !== winner.id) return p
      const won = cardsInPlay.length + pendingCards.length
      return { ...p, score: p.score + won }
    })

    const roundResult = {
      winnerId: result.winnerId,
      playedCards,
      event: activeEvent,
      chosenStat: stat,
      effectiveStats: result.effectiveStats,
      cardsWon: cardsInPlay.length + (result.winnerId ? pendingCards.length : 0),
    }

    const nextLeader = result.winnerId
      ? scoredPlayers.findIndex((p) => p.id === result.winnerId)
      : nextLeaderIndex(leaderIndex, players.length)

    const newState: GameState = {
      ...game,
      players: scoredPlayers,
      leaderIndex: nextLeader,
      pendingCards: newPending,
      roundHistory: [...game.roundHistory, roundResult],
      currentRound: game.currentRound + 1,
      phase: 'round_end',
    }

    set({ game: newState, previousLeaderIndex: leaderIndex })

    // SFX: win / lose / tie based on result for human player
    const humanIndex = players.findIndex((p) => !p.isBot)
    setTimeout(() => {
      if (result.winnerId === null) play('tie')
      else if (humanIndex !== -1 && players[humanIndex].id === result.winnerId) play('win')
      else play('lose')
    }, 150)

    if (isGameOver(newState)) {
      setTimeout(() => play('gameOver'), 600)
      set({ game: { ...newState, phase: 'game_over' } })
    }
  },

  nextRound: () => {
    const { game } = get()
    if (!game) return
    if (isGameOver(game)) {
      play('gameOver')
      set({ game: { ...game, phase: 'game_over' } })
      return
    }
    const nextLeader = game.players[game.leaderIndex]
    // If next leader is human and there are 2+ humans, show handoff
    if (!nextLeader.isBot && hasMultipleHumans(game.players)) {
      set({ game: { ...game, phase: 'handoff' } })
    } else {
      get().chooseEvent()
    }
  },

  confirmHandoff: () => {
    play('click')
    get().chooseEvent()
  },
}))

export function botAutoPlay(stat?: Stat) {
  const { game, chooseStat } = useGameStore.getState()
  if (!game || !game.activeEvent) return
  const leader = game.players[game.leaderIndex]
  if (!leader.isBot || leader.deck.length === 0) return
  const card = leader.deck[0]
  const chosen = stat ?? botChooseStat(card, game.activeEvent, 2)
  chooseStat(chosen)
}
