import type {
  Character,
  EventCard,
  GameState,
  Player,
  Stat,
  CardStats,
  Category,
} from '../types'
import cardsData from '../data/cards.json'

// ─── Data loading ───────────────────────────────────────────────────────────

export const allCharacters: Character[] = cardsData.characters as Character[]
export const allEvents: EventCard[] = cardsData.events as EventCard[]

// ─── Utilities ───────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value))
}

// ─── Event application ───────────────────────────────────────────────────────

export function applyEvent(
  card: Character,
  event: EventCard,
  _isLeader: boolean,
  _allPlayedCards: Character[],
): CardStats {
  const stats: CardStats = { ...card.stats }
  const { effect } = event

  switch (effect.type) {
    case 'stat_modifier': {
      const isTarget = effect.targets?.includes(card.category as Category) ?? false
      if (!isTarget) break

      const exception = effect.exceptions?.find((e) => e.card_id === card.id)
      const mods = exception ? exception.modifiers : effect.modifiers ?? {}

      for (const [key, delta] of Object.entries(mods)) {
        const stat = key as keyof CardStats
        stats[stat] = clampStat(stats[stat] + (delta ?? 0))
      }
      break
    }

    case 'stat_set': {
      const isTarget = effect.targets?.includes(card.category as Category) ?? false
      if (!isTarget) break
      for (const [key, val] of Object.entries(effect.set ?? {})) {
        stats[key as keyof CardStats] = val ?? 0
      }
      break
    }

    case 'eliminate_category': {
      // Handled at round-resolve level; stats unchanged here
      break
    }

    case 'reveal_cards': {
      // No stat change — UI concern
      break
    }

    case 'leader_debuff': {
      // Applied to opponents of the leader, not to leader itself
      // If this card belongs to a non-leader player, the leader may apply -10 to a chosen stat.
      // Resolved at round-level with the leader's choice; nothing to do per-card here.
      break
    }

    case 'underdog_boost': {
      const stat = effect.stat!
      const condition = effect.condition!
      const rawValue = card.stats[stat]
      const passes =
        condition.operator === '<'
          ? rawValue < condition.value
          : condition.operator === '>'
            ? rawValue > condition.value
            : condition.operator === '<='
              ? rawValue <= condition.value
              : rawValue >= condition.value

      if (passes) {
        stats[stat] = clampStat(stats[stat] + (effect.modifier ?? 0))
      }
      break
    }
  }

  return stats
}

// ─── Round resolution ────────────────────────────────────────────────────────

export interface ResolveTrickInput {
  playedCards: Record<string, Character>
  event: EventCard
  chosenStat: Stat
  leaderPlayerId: string
  leaderDebuffStat?: Stat
}

export interface ResolveTrickOutput {
  winnerId: string | null
  effectiveStats: Record<string, CardStats>
  eliminatedPlayerIds: string[]
}

export function resolveTrick(input: ResolveTrickInput): ResolveTrickOutput {
  const { playedCards, event, chosenStat, leaderPlayerId, leaderDebuffStat } = input
  const playerIds = Object.keys(playedCards)
  const allCards = Object.values(playedCards)

  const effectiveStats: Record<string, CardStats> = {}

  // Compute effective stats for each player
  for (const playerId of playerIds) {
    const card = playedCards[playerId]
    const isLeader = playerId === leaderPlayerId
    const stats = applyEvent(card, event, isLeader, allCards)

    // leader_debuff: subtract from non-leader players on the chosen stat
    if (
      event.effect.type === 'leader_debuff' &&
      !isLeader &&
      leaderDebuffStat
    ) {
      stats[leaderDebuffStat] = clampStat(
        stats[leaderDebuffStat] + (event.effect.modifier ?? 0),
      )
    }

    effectiveStats[playerId] = stats
  }

  // eliminate_category: remove cards of the target category
  const eliminatedPlayerIds: string[] = []
  if (event.effect.type === 'eliminate_category') {
    for (const playerId of playerIds) {
      const card = playedCards[playerId]
      if (event.effect.targets?.includes(card.category as Category)) {
        eliminatedPlayerIds.push(playerId)
      }
    }
    // If everyone is eliminated → redraw (winnerId = null, signal via empty survivors)
    if (eliminatedPlayerIds.length === playerIds.length) {
      return { winnerId: null, effectiveStats, eliminatedPlayerIds }
    }
  }

  // Find highest stat among survivors
  const survivors = playerIds.filter((id) => !eliminatedPlayerIds.includes(id))
  let winnerId: string | null = null
  let best = -Infinity

  for (const playerId of survivors) {
    const val = effectiveStats[playerId][chosenStat]
    if (val > best) {
      best = val
      winnerId = playerId
    } else if (val === best) {
      // Tie → no winner yet (caller must re-run round)
      winnerId = null
    }
  }

  return { winnerId, effectiveStats, eliminatedPlayerIds }
}

// ─── Deck management ─────────────────────────────────────────────────────────

export function buildAndDealDecks(
  players: Player[],
  characterSubset?: Character[],
): Player[] {
  const chars = shuffle(characterSubset ?? allCharacters)
  const count = players.length
  const perPlayer = Math.floor(chars.length / count)

  return players.map((p, i) => ({
    ...p,
    deck: chars.slice(i * perPlayer, (i + 1) * perPlayer),
    score: 0,
  }))
}

export function buildEventDeck(): EventCard[] {
  return shuffle(allEvents)
}

// ─── Game flow helpers ───────────────────────────────────────────────────────

export function nextLeaderIndex(current: number, playerCount: number): number {
  return (current + 1) % playerCount
}

export function isGameOver(state: GameState): boolean {
  return state.players.every((p) => p.deck.length === 0)
}

export function rankings(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score)
}

// ─── Bot ─────────────────────────────────────────────────────────────────────

export type BotLevel = 1 | 2

export function botChooseStat(
  card: Character,
  event: EventCard,
  level: BotLevel,
): Stat {
  if (level === 1) {
    const stats: Stat[] = ['force', 'magie', 'ruse', 'velocite']
    return stats[Math.floor(Math.random() * stats.length)]
  }

  // Level 2: pick the stat where effective value is highest
  const effective = applyEvent(card, event, true, [card])
  const entries = Object.entries(effective) as [Stat, number][]
  return entries.reduce((best, cur) => (cur[1] > best[1] ? cur : best))[0]
}
