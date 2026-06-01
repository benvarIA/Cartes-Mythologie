/**
 * Engine unit tests — runnable via `node --import tsx --test src/engine/engine.test.ts`
 *
 * These tests exercise the pure functions of the game engine without any UI dependencies.
 * They cover: deck distribution, event application, trick resolution, ties, eliminations,
 * leader-debuff, underdog boosts, and game-over detection.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import type { Character, EventCard, Player } from '../types'
import {
  applyEvent,
  buildAndDealDecks,
  isGameOver,
  nextLeaderIndex,
  resolveTrick,
} from './index'

// ── Fixtures ─────────────────────────────────────────────────────────
const zeus: Character = {
  id: 'zeus', num: 1, name: 'Zeus', category: 'dieu', description: '',
  image: '', imageQuality: 'hq',
  stats: { force: 71, magie: 99, ruse: 64, velocite: 33 },
}
const hercule: Character = {
  id: 'hercule', num: 2, name: 'Hercule', category: 'heros', description: '',
  image: '', imageQuality: 'hq',
  stats: { force: 99, magie: 13, ruse: 80, velocite: 40 },
}
const cronos: Character = {
  id: 'cronos', num: 3, name: 'Cronos', category: 'titan', description: '',
  image: '', imageQuality: 'hq',
  stats: { force: 80, magie: 70, ruse: 50, velocite: 30 },
}
const tartare: Character = {
  id: 'tartare', num: 4, name: 'Tartare', category: 'titan', description: '',
  image: '', imageQuality: 'hq',
  stats: { force: 60, magie: 70, ruse: 50, velocite: 20 },
}

const eventNeutral: EventCard = {
  id: 'neutral', num: 0, name: 'Neutre', image: '',
  rule: 'Aucun effet.',
  effect: { type: 'stat_modifier', targets: [], modifiers: {} },
}

const titanomachie: EventCard = {
  id: 'titanomachie', num: 1, name: 'Titanomachie', image: '',
  rule: 'Les Titans perdent 10 en toutes stats. Tartare gagne +10.',
  effect: {
    type: 'stat_modifier', targets: ['titan'],
    modifiers: { force: -10, magie: -10, ruse: -10, velocite: -10 },
    exceptions: [{ card_id: 'tartare', modifiers: { force: 10, magie: 10, ruse: 10, velocite: 10 } }],
  },
}

const eliminate: EventCard = {
  id: 'eliminate', num: 2, name: 'Élimination', image: '',
  rule: 'Les Créatures sont éliminées.',
  effect: { type: 'eliminate_category', targets: ['creature'] },
}

const leaderDebuff: EventCard = {
  id: 'lead', num: 3, name: 'Caprice du meneur', image: '',
  rule: 'Le meneur réduit une stat de -15 chez les adversaires.',
  effect: { type: 'leader_debuff', targets_scope: 'opponents', modifier: -15 },
}

const underdog: EventCard = {
  id: 'underdog', num: 4, name: 'Outsider', image: '',
  rule: 'Cartes ayant Force < 50 : +30 en Force.',
  effect: {
    type: 'underdog_boost',
    targets: ['dieu','titan','heros','creature'],
    stat: 'force',
    condition: { stat: 'force', operator: '<', value: 50 },
    modifier: 30,
  },
}

// ── Tests ────────────────────────────────────────────────────────────
describe('applyEvent', () => {
  it('returns unchanged stats with a neutral event', () => {
    const stats = applyEvent(zeus, eventNeutral, true, [zeus])
    assert.deepEqual(stats, zeus.stats)
  })
  it('applies stat_modifier only to targeted category', () => {
    const titan = applyEvent(cronos, titanomachie, false, [cronos])
    assert.equal(titan.force, 70)
    assert.equal(titan.magie, 60)
    const dieu = applyEvent(zeus, titanomachie, false, [zeus])
    assert.deepEqual(dieu, zeus.stats)
  })
  it('applies exceptions over generic modifier', () => {
    const t = applyEvent(tartare, titanomachie, false, [tartare])
    assert.equal(t.force, 70) // 60 + 10
    assert.equal(t.magie, 80) // 70 + 10
  })
  it('clamps to [0,100]', () => {
    const high: Character = { ...zeus, stats: { force: 99, magie: 99, ruse: 99, velocite: 99 } }
    const r = applyEvent(high, { ...titanomachie, effect: { type: 'stat_modifier', targets: ['dieu'], modifiers: { force: 50 } } }, false, [high])
    assert.equal(r.force, 100)
  })
  it('underdog_boost only fires when condition passes', () => {
    const weakF: Character = { ...zeus, stats: { ...zeus.stats, force: 30 } }
    const strong: Character = { ...zeus, stats: { ...zeus.stats, force: 90 } }
    const r1 = applyEvent(weakF, underdog, false, [weakF])
    assert.equal(r1.force, 60) // 30 + 30
    const r2 = applyEvent(strong, underdog, false, [strong])
    assert.equal(r2.force, 90) // unchanged
  })
})

describe('resolveTrick', () => {
  it('returns the highest-stat player as winner', () => {
    const out = resolveTrick({
      playedCards: { p1: zeus, p2: hercule },
      event: eventNeutral, chosenStat: 'force', leaderPlayerId: 'p1',
    })
    assert.equal(out.winnerId, 'p2') // Hercule 99 > Zeus 71
  })
  it('returns null winner on tie', () => {
    const a: Character = { ...zeus, stats: { ...zeus.stats, force: 50 } }
    const b: Character = { ...hercule, stats: { ...hercule.stats, force: 50 } }
    const out = resolveTrick({
      playedCards: { p1: a, p2: b },
      event: eventNeutral, chosenStat: 'force', leaderPlayerId: 'p1',
    })
    assert.equal(out.winnerId, null)
  })
  it('eliminates targeted categories', () => {
    const creature: Character = { id: 'sphinx', num: 5, name: 'Sphinx', category: 'creature', description: '', image: '', imageQuality: 'hq', stats: { force: 60, magie: 80, ruse: 99, velocite: 30 } }
    const out = resolveTrick({
      playedCards: { p1: zeus, p2: creature },
      event: eliminate, chosenStat: 'ruse', leaderPlayerId: 'p1',
    })
    assert.equal(out.eliminatedPlayerIds.length, 1)
    assert.equal(out.eliminatedPlayerIds[0], 'p2')
    assert.equal(out.winnerId, 'p1') // zeus survives
  })
  it('returns null winner when everyone is eliminated', () => {
    const creature1: Character = { id: 'c1', num: 5, name: 'C1', category: 'creature', description: '', image: '', imageQuality: 'hq', stats: { force: 60, magie: 80, ruse: 99, velocite: 30 } }
    const creature2: Character = { ...creature1, id: 'c2', name: 'C2' }
    const out = resolveTrick({
      playedCards: { p1: creature1, p2: creature2 },
      event: eliminate, chosenStat: 'force', leaderPlayerId: 'p1',
    })
    assert.equal(out.winnerId, null)
    assert.equal(out.eliminatedPlayerIds.length, 2)
  })
  it('leader_debuff lowers non-leader stat', () => {
    const out = resolveTrick({
      playedCards: { leader: zeus, other: hercule },
      event: leaderDebuff, chosenStat: 'force',
      leaderPlayerId: 'leader', leaderDebuffStat: 'force',
    })
    assert.equal(out.effectiveStats.other.force, 84) // 99 - 15
    assert.equal(out.effectiveStats.leader.force, 71) // unchanged
  })
})

describe('deck management', () => {
  it('deals equally to each player', () => {
    const players: Player[] = [
      { id: 'a', name: 'A', isBot: false, deck: [], score: 0 },
      { id: 'b', name: 'B', isBot: true, deck: [], score: 0 },
    ]
    const dealt = buildAndDealDecks(players, [zeus, hercule, cronos, tartare])
    assert.equal(dealt[0].deck.length, 2)
    assert.equal(dealt[1].deck.length, 2)
    // No card is in both decks
    const allIds = [...dealt[0].deck, ...dealt[1].deck].map((c) => c.id)
    assert.equal(new Set(allIds).size, 4)
  })
  it('nextLeaderIndex cycles correctly', () => {
    assert.equal(nextLeaderIndex(0, 3), 1)
    assert.equal(nextLeaderIndex(2, 3), 0)
  })
  it('isGameOver when all decks are empty', () => {
    const state: any = { players: [{ deck: [] }, { deck: [] }] }
    assert.equal(isGameOver(state), true)
    const partial: any = { players: [{ deck: [zeus] }, { deck: [] }] }
    assert.equal(isGameOver(partial), false)
  })
})
