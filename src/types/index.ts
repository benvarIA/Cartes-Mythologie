export type Category = 'dieu' | 'titan' | 'heros' | 'creature'
export type Stat = 'force' | 'magie' | 'ruse' | 'velocite'

export interface CardStats {
  force: number
  magie: number
  ruse: number
  velocite: number
}

export type ImageQuality = 'hq' | 'crop'

export interface Character {
  id: string
  num: number
  name: string
  category: Category
  description: string
  image: string
  imageQuality: ImageQuality
  stats: CardStats
}

export type EffectType =
  | 'stat_modifier'
  | 'stat_set'
  | 'eliminate_category'
  | 'reveal_cards'
  | 'leader_debuff'
  | 'underdog_boost'

export interface StatCondition {
  stat: Stat
  operator: '<' | '>' | '<=' | '>='
  value: number
}

export interface EventEffect {
  type: EffectType
  targets?: Category[]
  modifiers?: Partial<CardStats>
  set?: Partial<CardStats>
  fallback?: 'redraw'
  exceptions?: Array<{ card_id: string; modifiers: Partial<CardStats> }>
  stat_choices?: Stat[]
  modifier?: number
  targets_scope?: 'opponents'
  stat?: Stat
  condition?: StatCondition
}

export interface EventCard {
  id: string
  num: number
  name: string
  image: string
  rule: string
  effect: EventEffect
}

export interface Player {
  id: string
  name: string
  isBot: boolean
  deck: Character[]
  score: number
}

export type GamePhase =
  | 'setup'
  | 'deal'
  | 'reveal_event'
  | 'reveal_cards'
  | 'choose_stat'
  | 'resolve'
  | 'round_end'
  | 'handoff'      // pass-and-play : "passe le téléphone à X"
  | 'game_over'

export interface RoundResult {
  winnerId: string | null
  playedCards: Record<string, Character>
  event: EventCard
  chosenStat: Stat
  effectiveStats: Record<string, CardStats>
  cardsWon: number
}

export interface GameState {
  phase: GamePhase
  players: Player[]
  leaderIndex: number
  eventDeck: EventCard[]
  activeEvent: EventCard | null
  pendingCards: Character[]
  roundHistory: RoundResult[]
  currentRound: number
}
