# Cartes Mythologie — Specs techniques, UI/UX & fonctionnelles

> Jeu de **bataille de statistiques** dans l'univers de la mythologie grecque. Chaque carte est un personnage (dieu, titan, héros, créature) doté de 4 stats ; des cartes Événement modifient les règles à chaque pli.

**Date de rédaction :** 2026-06-03
**Statut :** En développement (moteur de jeu fonctionnel + tests, contenu encodé)
**Stack :** React 19 + TypeScript · Vite 8 · PWA (`vite-plugin-pwa`) · Zustand 5 (state) · Supabase (auth + DB + scores) · CSS Modules

---

## 1. Concept

Inspiré du « Top Trumps » : un jeu de comparaison de stats. Le meneur choisit une statistique, tout le monde révèle sa carte, la plus forte remporte le pli. La **couche événementielle** (23 cartes) renverse régulièrement la logique et crée la profondeur stratégique.

- **78 personnages** + **23 événements** encodés dans `src/data/cards.json`.
- 4 statistiques : **Force ⚔ · Magie ✨ · Ruse 🦉 · Vélocité 💨**.
- 4 catégories : **Dieu · Titan · Héros · Créature** (profils de stats distincts — voir `docs/STATS_BALANCE.md`).

---

## 2. Architecture

```
src/
  data/cards.json        → 78 persos + 23 événements (source de vérité)
  engine/                → moteur de jeu pur (index.ts) + tests (engine.test.ts)
  store/                 → état Zustand (partie, joueurs, main, cagnotte)
  screens/               → HomeScreen, SetupScreen, GameScreen
  components/            → Card, Tutorial, SettingsOverlay, Dust (effets)
  lib/                   → Supabase client, helpers
  types/                 → types TS
docs/                    → RULES.md, DESIGN_NOTES.md, STATS_BALANCE.md
```

**Moteur découplé de l'UI** : la logique (résolution d'un pli, application des événements, rotation du meneur) vit dans `engine/` et est **couverte par des tests** (`npm test` → `tsx --test`).

**Supabase** : comptes joueurs, scores et système de récompenses (nécessaire dès la v1).

---

## 3. Modèle de données (cards.json)

### Carte personnage
`id`, `nom`, `categorie` (dieu/titan/heros/creature), `force`, `magie`, `ruse`, `velocite`, illustration (PNG full-card dans `Dieux/`, `Titans/`, `Héros/`, `Créatures/`).

### Carte événement
`id`, `nom`, `effect_type`, `targets`, `modifiers`, `exceptions`, illustration (`Event/`).

**6 types d'effet (`effect_type`) :**
| Type | Effet | Exemple |
|---|---|---|
| `stat_modifier` | ajoute/retire des points | *Titanomachie* : −10 à toutes les stats des Titans |
| `stat_set` | fixe une stat | *Malédiction de Circé* : Magie des Dieux = 10 |
| `eliminate_category` | élimine une catégorie | *Tartare* : Créatures éliminées |
| `leader_debuff` | le meneur affaiblit les adversaires | *Caprice* : −15 à une stat au choix |
| `underdog_boost` | booste les cartes faibles | *Outsider* : +30 Force si Force < 50 |
| `reveal_cards` | force la révélation préalable | *Œil d'Argos* (futur) |

Les événements peuvent avoir des **exceptions** par carte.

---

## 4. Règles du jeu (résumé — voir `docs/RULES.md`)

### Mise en place
- 2 à 6 joueurs (humains ou bots).
- 78 personnages mélangés + distribués équitablement ; 23 événements en pioche séparée.
- Meneur initial = premier joueur, **rotation horaire**.

### Déroulement d'un pli
1. **Révélation de l'événement** (modifie le pli en cours uniquement).
2. Le **meneur** regarde sa carte et **choisit une stat**.
3. Tous révèlent leur carte simultanément.
4. L'événement est appliqué.
5. La **stat la plus élevée** remporte le pli.

### Récompense & rotation
- Gagnant : **1 pièce d'or par carte remportée**.
- **Égalité** : cartes en **cagnotte** au centre, meneur inchangé, le prochain gagnant rafle la cagnotte.
- Le gagnant d'un pli **devient meneur**.

### Fin de partie
Quand toutes les mains sont épuisées → le joueur avec le plus de pièces d'or gagne.

---

## 5. Specs fonctionnelles

### 5.1 Modes de jeu (v1)
- [ ] **Solo vs bots** : 1 humain + 1 à 5 bots
- [ ] **Pass-and-play** : 2 à 6 humains sur un seul device, avec écran *« Passe le téléphone à X »* entre les tours

### 5.2 Bots (IA)
- [ ] **Niveau 1** — choix aléatoire de la stat
- [ ] **Niveau 2** — choisit la stat où sa carte est la plus forte
- [ ] (futur) Niveau 3 — mémorise les cartes vues

### 5.3 Moteur (testé)
- [ ] Résolution correcte d'un pli avec application des 6 types d'événements
- [ ] Gestion de la cagnotte en cas d'égalité
- [ ] Rotation du meneur (gagnant → meneur ; égalité → inchangé)
- [ ] Élimination de catégorie + cas « plus personne » → rejouer avec nouvel événement
- [ ] Exceptions par carte respectées

### 5.4 Comptes & récompenses (Supabase)
- [ ] Connexion / compte joueur
- [ ] Cagnotte de pièces d'or persistée comme score
- [ ] Système de récompenses (à étoffer)

### 5.5 Tutoriel intégré
- [ ] Composant `Tutorial` reprenant `RULES.md` (mise en place, pli, cas particuliers)

---

## 6. UI / UX

- **Écrans** : Home → Setup (joueurs/bots/mode) → Game.
- **Carte** (`Card.tsx`) : affichée comme un **objet physique** (cadre + illustration IA + 4 stats), avec animations (flip, effet `Dust`).
- **Direction artistique** : mythologie grecque — marbre, or, profondeur ; illustrations IA cohérentes par catégorie.
- **PWA installable** : responsive unique (PC + tablette + iPhone), jouable hors-ligne.
- **SettingsOverlay** : options (sons, musique style lyre/cordes antiques — voir DESIGN_NOTES).

---

## 7. Roadmap (voir `docs/DESIGN_NOTES.md`)

### v2 / v3
- Multijoueur **réseau local** (WebSocket) puis **online** (Supabase real-time)
- Nouveaux personnages (Persée, Bellérophon, Atalante, Achille…) et extension **Rome / Norse / Égypte** (decks séparés)
- Deck **« famille »** séparé (cartes perso Pierre/Camille/Benoît/Rabelais)
- Variantes de règles : événements cachés, draft d'événement, événements multiples, cartes « objet », mode Panthéon, pouvoirs spéciaux par carte
- Sons/musique personnalisés (tonnerre Zeus, rugissement du Lion…)

---

## 8. Commandes

```bash
npm run dev      # Vite
npm run build    # tsc -b && vite build
npm test         # tests du moteur (tsx --test src/engine/*.test.ts)
```
