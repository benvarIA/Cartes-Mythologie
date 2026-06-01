# TODO — CARTES MYTHOLOGIE

> Cocher les cases (`[x]`) au fur et à mesure que les tâches sont validées.
> Les tâches marquées **X** sont des suggestions à valider ou ignorer.

---

## Questions bloquantes

### Globales

- Quelle est la **cible principale** ? Famille avec enfants, joueurs adultes, les deux ? → impacte complexité des règles, ton visuel, difficulté du bot.
- **Online ou local uniquement** pour la v1 ? → L'online nécessite une infra (serveur, sync temps réel). Le local est livrable 3× plus vite.
- **App standalone ou intégrée** à l'écosystème QuizzCreator / mythologie déjà existant ? → Partage des données et des visuels ou projet séparé ?
- **Gratuit ou payant ?** → Si payant ou IAP : contraintes de build natif + stores Apple/Google (commissions, validation, délais).
- **Qui développe ?** Seul avec Claude, ou équipe ? → Détermine la complexité technologique acceptable.
- Les **règles ont-elles été testées physiquement** avec de vrais joueurs ? → Avant de coder, s'assurer que le jeu est fun en vrai.
- **Quel est le deck de jeu final ?** Toutes catégories mélangées ou decks séparés ? Les cartes perso (Pierre, Camille, Benoît, Rabelais) font partie du deck standard ou d'un deck "famille" à part ?

### Par tâche

- **Device(s) cible(s)** : Portrait ou paysage ? Si tablette + téléphone + PC, faut-il un layout responsive ou trois layouts distincts ? En local multi, se passe-t-on un seul device ou chacun a le sien ?
- **Techno** : Compétences dispo (React, Flutter, autre) ? Besoin d'une app installable (PWA ou store) ou navigateur pur suffit ? Si online plus tard, la techno choisie supporte-t-elle facilement un backend temps réel ?
- **Multijoueur** : Pass-and-play = chacun retourne l'écran quand c'est son tour. Réseau local = chacun son device, sync via WebSocket local. Online = serveur distant, comptes, latence. Laquelle pour v1, v2, v3 ?
- **Extraction cards.json** : OCR automatique sur les PNG (risque d'erreurs à corriger) ou saisie manuelle (long mais propre) ? Le fichier REFERENCE.md a déjà toutes les stats — c'est la source la plus fiable.
- **Nouvelles règles** : Les événements sont-ils toujours révélés à tous avant de choisir la stat, ou peut-on garder l'option de les masquer ? Peut-il y avoir plusieurs événements actifs en même temps ?
- **Nouveaux personnages** : On reste en mythologie grecque ou on élargit (romaine, nordique, égyptienne) ? Si on élargit, est-ce un nouveau deck ou un deck mélangé ?
- **Bot** : Niveau 1 (aléatoire) suffit pour une v1 ? Niveau 2 : choisit la stat où il est le plus fort. Niveau 3 : mémorise les cartes vues. Jusqu'où aller ?
- **Images de fond** : Générées dans le même style IA que les cartes ? Textures (marbre, parchemin) ? Illustrations vectorielles ? Budget ?
- **Animations** : CSS simple (flip 3D) ou lib dédiée (GSAP, Framer Motion, Lottie) ? Moteur de jeu (Phaser) si beaucoup d'effets. Quel niveau de polish pour v1 ?
- **Sons** : Sons génériques ou personnalisés par personnage/catégorie (tonnerre pour Zeus, rugissement pour le Lion) ? Bibliothèque libre de droits ou composition originale ?
- **Musique** : Style lyre/cordes antiques. Libre de droits (Freesound, Pixabay) ou composée ? Durée des boucles ? Stingers pour victoire/défaite ?
- **Exploitation numérique des cartes** : Les PNG sont full-card (cadre inclus). Pour l'affichage digital : afficher la carte entière comme un objet physique, ou séparer illustration + stats dans l'UI ?
- **Correction stats doublons** : Phébé et Mnémosyne avaient des stats identiques (15/75/90/16). Icare et Hercule aussi (99/13/80/40). Corrigés.

---

## Todo organisée

---

### PHASE 0 — Décisions fondatrices *(à trancher en premier — tout en dépend)*

- [x] **Choisir le(s) device(s) cible(s)** : PC, iPhone, tablette Android.
  *→ **Décision** : PC + tablette + iPhone. Layout responsive unique (React PWA).*

- [x] **Choisir la techno**.
  *→ **Décision** : React web app (PWA). Supabase pour le backend (auth + DB) — nécessaire pour les comptes joueurs et le système de scores/récompenses.*

- [x] **Décider : online ou local uniquement pour la v1 ?**
  *→ **Décision** : Pass-and-play (un seul device) + mode solo contre bot. Comptes utilisateurs avec scores et récompenses dès v1 → Supabase. Multijoueur réseau en v2.*

- [x] **Rendre les cartes exploitables numériquement** — extraire toutes les stats dans un `cards.json`.
  *→ **Fait** : 78 personnages + 13 événements encodés dans `src/data/cards.json`. Stats Mnémosyne et Icare corrigées.*

- [x] **Valider la structure de cards.json** avant de tout construire dessus.
  *→ **Fait** : structure validée et utilisée dans le moteur. Champs événements (effect_type, targets, modifiers, exceptions…) et extensions futures prévus.*

---

### PHASE 1 — Contenu & règles *(peut avancer en parallèle de la Phase 0)*

- [x] **Trancher les zones grises des règles de base**.
  *→ **Décisions** : Meneur = rotation fixe (sens des aiguilles). Égalité = rejouer le pli (cartes s'accumulent au centre). Cartes gagnées = cagnotte de score en pièces d'or (1 carte = 1 pièce d'or, flat).*

- [X] **Tester les règles physiquement** avec de vrais joueurs avant de coder.
  *Pourquoi : Évite de coder un jeu qui n'est pas fun. Repère les événements trop puissants ou trop situationnels (ex. Titanomachie si personne n'a de Titan).*

- [x] **Réfléchir à de nouvelles règles**.
  *→ **Fait** : 6 pistes documentées dans `docs/DESIGN_NOTES.md` (événements cachés, draft d'événement, événements multiples, cartes "objet", mode Panthéon avec dieu favori, pouvoirs spéciaux par carte en mode avancé). À valider pour v2.*

- [x] **Rédiger le RULES.md** complet une fois les règles stabilisées.
  *→ **Fait** : `docs/RULES.md` — mise en place, déroulement d'un pli, cas particuliers, fin de partie, types d'événements, stratégie. Sert aussi de base au tutoriel intégré.*

- [x] **Réfléchir à de nouveaux personnages**.
  *→ **Fait** : propositions dans `docs/DESIGN_NOTES.md` — combler les trous Héros (Persée, Bellérophon, Atalante, Achille), étoffer créatures (Géryon, Pégase, Cerbère), déités secondaires (Hécate, Eros, Hypnos). Extension future Rome/Norse/Égypte en decks séparés. Deck "famille" recommandé séparé pour Pierre/Camille/Benoît/Rabelais (top 5 puissants actuels).*

- [x] **Concevoir de nouvelles cartes Événement** (seulement 10 actuellement).
  *→ **Fait** : 10 nouveaux événements ajoutés (23 au total) : Olympiade, Malédiction de Circé, Chant des Sirènes, Feu de Prométhée, Labyrinthe de Dédale, Vol d'Icare, Boîte de Pandore, Travaux d'Hercule, Eaux du Styx, Danse des Muses. Couvrent les 6 types de mécaniques du moteur.*

- [x] **Décider si les descriptions des personnages deviennent de la mécanique** (pouvoirs spéciaux).
  *→ **Décision** : reportée en mode "avancé" (v2). Détails dans `docs/DESIGN_NOTES.md` — 1 pouvoir activable par carte une fois/partie (Zeus foudroie, Hermès vole de l'or, Méduse pétrifie). Activable via toggle au setup pour ne pas complexifier la v1.*

- [x] **Vérifier l'équilibrage des stats** (matrice par catégorie, repérer les outliers).
  *→ **Fait** : analyse complète dans `docs/STATS_BALANCE.md` — moyennes/écarts-types par catégorie, top 5 puissants (Typhée 357, Camille 294…), top 5 faibles (Achlys 103, Atlas 115…), stats max=100 (Chaos Ruse, Rabelais Vélocité). Recommandations de rééquilibrage documentées.*

- [x] **Corriger stats Phébé et Mnémosyne** — Mnémosyne corrigée à 10/82/88/22 (mémoire/langage → Magie et Ruse dominantes).
- [x] **Corriger stats Icare et Hercule** — Icare corrigé à 35/8/18/92 (téméraire, Vélocité max, Ruse nulle).

---

### PHASE 2 — Architecture & données *(débute quand Phase 0 est tranchée)*

- [x] **Créer la structure du projet** (repo, framework choisi, config de base, linting).
  *→ React + Vite + TypeScript + PWA (vite-plugin-pwa) + Supabase + Zustand. Structure : src/types, src/engine, src/data, src/store, src/components, src/lib.*

- [x] **Implémenter le moteur de jeu** (logique pure, sans UI) : distribuer les cartes, choisir une stat, comparer, appliquer l'événement, désigner le gagnant du pli, gérer la fin de partie.
  *Pistes : Fonctions pures en TypeScript. Entrée : état de partie + action joueur. Sortie : nouvel état. Testable unitairement.*

- [x] **Écrire les tests du moteur de jeu** : cas normaux, égalités, événements spéciaux (Tartare / Titanomachie, Destin Brisé, potions conditionnelles).
  *→ **Fait** : `src/engine/engine.test.ts` — 13 tests, 3 suites (applyEvent, resolveTrick, deck management). Lance avec `npm test`. Couvre stat_modifier, exceptions, clamp [0,100], underdog_boost, eliminate_category, leader_debuff, ties, distribution, game over.*

- [x] **Intégrer cards.json dans l'app** et générer le deck de jeu.
  *→ **Fait** : `buildAndDealDecks()` + `buildEventDeck()` dans `src/engine/index.ts`. Shuffle Fisher-Yates. Distribution `Math.floor(78 / n)` cartes par joueur.*

- [x] **Système de gestion d'état de partie** : paquet, main de chaque joueur, score, meneur actuel, événement actif, historique des plis.
  *→ **Fait** : `src/store/gameStore.ts` — Zustand. Actions : `startGame`, `chooseEvent`, `playCard`, `chooseStat`, `nextRound`, `confirmHandoff`. État : `GameState` (phase, players, leaderIndex, eventDeck, activeEvent, pendingCards, roundHistory, currentRound). Settings séparés dans `settingsStore.ts` (persisté localStorage).*

---

### PHASE 3 — Interface & UX *(débute quand le moteur fonctionne)*

- [x] **Concevoir le menu du jeu**.
  *→ **Fait** : `HomeScreen.tsx` — Nouvelle partie / Règles (disabled) / Palmarès (disabled). Typo Cinzel, fond or/noir, méandres.*

- [x] **Écran de configuration de partie** : nombre de joueurs (2-6 ?), noms, mode (pass-and-play / local / online), deck(s) utilisé(s).
  *→ **Fait** : `SetupScreen.tsx` — sélecteur 2-6 joueurs en chiffres romains, roster avec avatar en médaillon d'or + input nom + toggle Bot/Humain (badges azure/améthyste).*

- [x] **Concevoir l'interface de jeu** (table virtuelle).
  *→ **Fait** : `GameScreen.tsx` — header pli/meneur/scores, zone événement, carte meneur cliquable, rangée decks adverses. Bot auto-joue après 900ms.*

- [x] **Affichage clair des modificateurs d'événement** sur les stats.
  *→ **Fait** : la carte affiche les `effectiveStats` (après application de l'événement) en fin de pli, avec la barre/valeur de la stat choisie surlignée. Le dégradé thermique (blanc → bleu → vert → jaune → orange → rouge) rend visuellement perceptible la force absolue de chaque stat.*

- [x] **Écran de fin de pli** : récapitulatif (qui a joué quoi), qui a gagné, animation de collecte des cartes.
  *→ **Fait** : `phase: 'round_end'` — badge événement, nom du gagnant gilded, stat choisie, toutes les cartes jouées (perdants en `brightness(.55) saturate(.7)`, gagnant entouré d'un halo doré pulsant), classement avec chiffres romains. Animation de collecte simplifiée en v1 (les cartes restent affichées) — collecte visuelle à enrichir en v2.*

- [x] **Écran de fin de partie** : classement, score final (pièces d'or), option rejouer ou retour menu.
  *→ **Fait** : `phase: 'game_over'` — sous-titre grec ΤΕΛΟΣ, titre "Fin de partie" gilded animé en braise, podium avec slide-in échelonné (le 1er en bordure dorée + ombre), bouton "Retour au menu". Stinger `gameOver` joué automatiquement.*

- [x] **Réfléchir à comment jouer seul contre un bot**.
  *→ **Décision** : Bot niveau 1 (aléatoire) + niveau 2 (choisit la stat effective la plus haute). Niveau 3 (mémorisation) reporté en v2.*

- [x] **Implémenter le bot**.
  *→ **Fait** : `botChooseStat()` dans `src/engine/index.ts`. Niveaux 1 et 2 opérationnels.*

- [x] **Solution pour jouer à plusieurs** (pass-and-play).
  *→ **Fait** : phase `handoff` ajoutée au moteur. Quand le prochain meneur est humain ET qu'il y a 2+ humains, un écran "Passe le téléphone à X" s'affiche entre les plis avec sceau étoile animé et bouton "C'est moi". Multijoueur réseau toujours reporté en v2.*

- [x] **Tutoriel intégré** : première partie guidée avec bulles d'aide.
  *→ **Fait** : composant `Tutorial` — 4 étapes (Bienvenue, L'événement, Choisis ta stat, Cagnotte d'or) avec glyphes flottants, points de progression et bouton "Passer le tutoriel". Persisté dans localStorage (`tutorialSeen`).*

---

### PHASE 4 — Expérience sensorielle *(assets statiques peuvent commencer tôt)*

- [x] **Définir la direction artistique** (cohérence avec le style or/marbre/peinture antique des cartes).
  *→ **Fait** : palette or/noir profond, typo Cinzel, méandres grecs, gemme colorée par catégorie, barres de stats en dégradé thermique. Prototype validé dans `public/card-concepts.html`.*

- [x] **Direction artistique étendue à toute l'UI — "Olympus at Dusk"**.
  *→ **Fait** : fond atmosphérique multicouche (or zénithal, braises basses, ombres pourpre/wine), grain noise SVG, vignette, poussières d'or flottantes (composant `Dust`). Typo : Cinzel Decorative (display) + Cormorant Garamond (corps italique) + Cinzel (UI chrome). Boutons gilded avec shimmer animé. Méandres et étoiles décoratives. Sous-titres grecs (ΜΥΘΟΛΟΓΙΑ, ΠΡΟΠΑΡΑΣΚΕΥΗ, ΤΕΛΟΣ). Chiffres romains. Apparitions échelonnées. Avatars en médaillon d'or gravé. Halo doré sur la carte gagnante en fin de pli, perdants estompés.*

- [x] **Images de fond** par écran (menu, jeu, fin de partie).
  *→ **Fait** : pas d'images statiques mais une atmosphère générée — body global avec 4 gradients radiaux (or zénithal, braises basses, ombres pourpre + warm), grain noise SVG, vignette, dust motes animés. HomeScreen ajoute en plus une silhouette de colonnes de temple en bas + frise méandre en haut. Setup et Game héritent du fond global.*

- [x] **Adapter les images de cartes pour l'affichage digital** (crop, ratio, résolution écran).
  *→ **Fait** : image pleine hauteur (310px), dégradé bas vers stats, filtre brightness/contrast, `object-position` par personnage. Dos généré en Python PIL (`public/card-back.png`).*

- [x] **Animations** : distribution des cartes, retournement, duel, application d'un événement, transitions.
  *→ **Fait** (CSS-only, sans lib externe) : `cardFlip` (rotateY 180→0 avec brightness ease-in lors de la révélation), `eventSlide` (parchemin qui se déroule depuis le haut), `scaleIn` sur les cartes jouées en fin de pli, `ember` (pulse de braise sur les titres gilded), `shimmer` (reflet doré qui balaie les boutons), `sealRotate` (sceau étoile au handoff), apparitions échelonnées avec `animationDelay`. Halo doré pulsant sur la carte gagnante. Bot hint clignote.*

- [x] **Choisir la techno d'animation** — **CSS pure** retenu (au lieu de Framer Motion).
  *→ **Décision** : keyframes locales scopées par module CSS + `animation-delay` pour les apparitions échelonnées. Bundle gardé léger (78 kB JS gzip, pas de dépendance d'animation supplémentaire). Framer Motion réévalué en v2 si besoin d'animations interactives complexes.*

- [x] **Sons (SFX)** : carte distribuée, retournée, victoire/défaite du pli, événement déclenché, clic UI.
  *→ **Fait** : `src/lib/sfx.ts` — système entièrement synthétisé via Web Audio API (zéro asset audio). 9 effets : click, select, reveal, win (arpège C majeur), lose (descente sawtooth), tie, event (arpège mystérieux), shuffle, gameOver. Câblés dans le store sur startGame, chooseEvent, playCard, chooseStat (avec branchement win/lose/tie selon le résultat humain).*

- [x] **Musique** : thème de menu, boucle de partie, stinger victoire/défaite.
  *→ **Fait (v1 minimaliste)** : drone ambient continu (A2 + E3 en quinte parfaite, attaque 2s) géré par `startAmbient/stopAmbient` dans `lib/sfx.ts`. Démarre au premier geste utilisateur (autoplay-safe). Stingers victoire/défaite intégrés dans le SFX. Musique mélodique riche (lyre/cordes antiques) reportée en v2 avec assets externes.*

- [x] **Réglages volume** séparés musique / SFX + mode muet.
  *→ **Fait** : composant `SettingsOverlay` (engrenage ⚙ flottant top-right global) avec 2 sliders (SFX / Musique), 2 toggles (Mute / Ambient on-off). Persiste dans localStorage via `useSettings` (Zustand). Sous-titré "ΡΥΘΜΙΣΕΙΣ" (Réglages en grec).*
