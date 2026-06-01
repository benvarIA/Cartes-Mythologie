# Notes de design — pistes pour v2+

> Propositions à valider/itérer. Non implémentées par défaut.

## Nouvelles règles à explorer

### 1. Événements cachés
Garder la carte Événement face cachée jusqu'à ce que le meneur ait choisi sa stat. Force le meneur à jouer "en aveugle" → plus de bluff, moins de min-max.

**Variante** : le meneur SEUL voit l'événement avant de choisir. Avantage du meneur amplifié.

### 2. Draft d'événement
Le meneur tire 2 cartes Événement, en garde une, défausse l'autre. Donne au meneur un pouvoir tactique.

### 3. Plusieurs événements simultanés
2 événements actifs en même temps. Les effets s'additionnent (stat_modifier) ou s'annulent (si contradiction). **Risque** : combos imprévisibles, équilibrage difficile.

### 4. Cartes "objet" en main
3-5 cartes spéciales en main au début (potions, oracles, talismans). Jouables à tout moment :
- *Potion d'Hermès* : double une stat pour ce pli.
- *Oracle de Delphes* : révèle la carte d'un adversaire.
- *Bouclier d'Athéna* : annule l'effet d'un événement.

Ajoute une couche stratégique. **Coût** : complexifie l'UI et le tutoriel.

### 5. Mode "Pantheon"
Chaque joueur a un **dieu favori** (sélectionné en début de partie). Sa stat dominante est boostée de +5 en permanence.

### 6. Pouvoirs spéciaux (mode avancé)
Chaque carte gagne **1 pouvoir activable une fois par partie** :
- *Zeus* : foudroie une carte adverse (-50 toutes stats ce pli).
- *Hermès* : vole 1 pièce d'or à un adversaire.
- *Méduse* : pétrifie (Vélocité de l'adversaire = 0 ce pli).

Optionnel via toggle "mode avancé" au setup.

## Nouveaux personnages à ajouter

### Héros manquants (numérotation à trous)
- **Persée** (H10)
- **Bellérophon** (H13)
- **Atalante** (H16) — la chasseresse
- **Thésée** (H21) — déjà présent ?
- **Hercule** (H22) — déjà présent
- **Achille** (H23)

### Pistes pour étoffer
- **Plus de créatures** : Géryon, Antaios, Echidna, Cerbère (présent ?), Pégase.
- **Plus de muses et déités secondaires** : Hécate, Calliope, Eros, Hypnos, Morphée.
- **Demi-dieux et nymphes** : Daphné, Écho, Pomone (romaine).

### Extension thématique
- **Mythologie romaine** : Mars, Vénus, Junon, Mercure — quasi-équivalents grecs avec stats différentes (variation = renouveau).
- **Mythologie nordique** : Odin, Thor, Loki, Fenrir → deck mélangeable ou séparé.
- **Mythologie égyptienne** : Râ, Anubis, Bastet, Sobek.

Décision recommandée : **un seul deck Olympus** pour v1, decks séparés (Olympus / Norse / Egyptian) pour v2 — permet le crossover.

### Deck "famille"
Pierre, Camille, Benoît, Rabelais sont actuellement dans le top 5 puissants. Risque : ils écrasent les vrais personnages mythologiques.

**Recommandation** : les déplacer dans un deck "famille" séparé, activé par toggle au setup. Ou rééquilibrer leurs stats vers la moyenne globale (~200/350 max).

## Équilibrage des stats

Voir [STATS_BALANCE.md](./STATS_BALANCE.md). Points clés à corriger :
- **Chaos** (Ruse=100) et **Rabelais** (Vélocité=100) → ramener à 99 pour permettre l'égalité ou le contre.
- **Atlas** (115 total) et **Achlys** (103 total) → légère hausse des stats secondaires pour leur donner une option de repli.
- **Magie faible chez les Héros** (μ=25.9) — c'est cohérent thématiquement, mais vérifier la fréquence des événements pro-Magie pour ne pas systématiquement défavoriser cette catégorie.

## Évolutions UX

### Animations à ajouter
- **Distribution des cartes** en début de partie (volée depuis le centre vers chaque main).
- **Effet d'application d'événement** sur une carte (pulse coloré sur la stat modifiée).
- **Récupération des cartes** par le gagnant (les cartes glissent vers son tas).
- **Carte se retourne** lors de la révélation des autres joueurs (déjà animation flip côté meneur).

### Sons à enrichir
- **Tonnerre** sur Zeus, **rugissement** sur le Lion de Némée, etc. — sons par carte.
- **Stinger musical** sur les événements majeurs (Titanomachie, Apocalypse).
- **Boucle musicale** plus riche (mélodie lente sur l'ambient drone actuel).

### Backgrounds par écran
- Menu : silhouette de l'Olympe en arrière-plan (SVG ou image générée).
- Jeu : table en marbre subtile, ombres de colonnes.
- Game over : panorama d'amphithéâtre.

### Comptes et progression (Supabase)
- Profil joueur avec avatar, niveau, pièces d'or totales accumulées.
- **Récompenses** : nouvelle carte débloquée tous les X plis gagnés.
- **Quêtes** : "gagne 3 plis avec un Titan", "remporte une partie sans perdre un pli", etc.
- **Classement** mondial sur les pièces d'or accumulées.
