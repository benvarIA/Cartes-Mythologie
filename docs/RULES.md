# Règles — Cartes Mythologie

## Le jeu

Cartes Mythologie est un jeu de **bataille de stats** dans l'univers de la mythologie grecque. Chaque carte représente un personnage (dieu, titan, héros ou créature) avec **4 statistiques** :

| Stat | Symbole | Sens |
|------|---------|------|
| Force | ⚔ | Puissance physique, combat rapproché |
| Magie | ✨ | Pouvoirs surnaturels, sorts |
| Ruse | 🦉 | Intelligence, stratégie, savoir |
| Vélocité | 💨 | Vitesse, agilité |

## Mise en place

1. Choisir **2 à 6 joueurs** (humains ou bots).
2. Le paquet (78 personnages) est mélangé puis distribué équitablement.
3. Le paquet d'événements (23 cartes) est mélangé séparément.
4. Le **meneur** initial est le premier joueur (rotation horaire ensuite).

## Déroulement d'un pli

1. **Révélation de l'événement** : une carte Événement est retournée. Elle modifie les règles ou les stats des cartes en jeu pour ce pli uniquement.
2. **Le meneur** regarde sa carte (face cachée pour les autres) et **choisit une statistique**.
3. **Tous les joueurs** révèlent leur carte du dessus en même temps.
4. L'événement est appliqué aux stats concernées.
5. La carte avec la **stat la plus élevée** remporte le pli.

### Récompense

Le gagnant du pli marque **1 pièce d'or par carte remportée** (les siennes + celles des adversaires).

### Cas particuliers

- **Égalité** : les cartes restent au centre (cagnotte). Au pli suivant, le gagnant remporte aussi les cartes en cagnotte. Le meneur reste le même qu'avant l'égalité (rotation suspendue).
- **Catégorie éliminée** : si l'événement élimine toute une catégorie (ex. *Tartare engloutit les Créatures*), les cartes éliminées ne participent pas à la comparaison. S'il ne reste personne, on rejoue avec un nouvel événement.

### Rotation du meneur

Après chaque pli avec gagnant, le **gagnant devient meneur** au pli suivant. En cas d'égalité, le meneur ne change pas.

## Fin de partie

La partie se termine quand **tous les joueurs ont épuisé leur main**. Le joueur avec le plus de pièces d'or gagne.

## Catégories de personnages

| Catégorie | Profil typique | Stat dominante |
|-----------|----------------|----------------|
| **Dieu** | Polyvalent | Magie / Ruse |
| **Titan** | Puissance brute | Magie / Force |
| **Héros** | Mortel exceptionnel | Force / Ruse |
| **Créature** | Monstre du mythe | Force / Magie |

Voir [STATS_BALANCE.md](./STATS_BALANCE.md) pour l'analyse détaillée.

## Types d'événements

Les 23 événements actuels exploitent **6 types de mécaniques** :

| Type d'effet | Description | Exemple |
|--------------|-------------|---------|
| `stat_modifier` | Ajoute/retire des points à une stat | *Titanomachie* : -10 à toutes les stats des Titans |
| `stat_set` | Fixe une stat à une valeur | *Malédiction de Circé* : Magie des Dieux = 10 |
| `eliminate_category` | Élimine une catégorie | *Tartare* : les Créatures sont éliminées |
| `leader_debuff` | Le meneur affaiblit ses adversaires | *Caprice* : -15 à une stat au choix |
| `underdog_boost` | Booste les cartes faibles dans une stat | *Outsider* : +30 Force si Force < 50 |
| `reveal_cards` | Force la révélation préalable | *Œil d'Argos* (futur) |

Les événements peuvent avoir des **exceptions** par carte (ex. *Tartare gagne +10 dans Titanomachie*).

## Stratégie

- **Le meneur a un léger avantage** : il choisit la stat optimale pour sa carte. Mais il s'expose aussi aux événements qui ciblent sa catégorie.
- **Lire l'événement avant de choisir** : un événement pro-Magie favorise les Dieux et Titans. Un pro-Force favorise Héros et Créatures.
- **Gérer la cagnotte** : les égalités empilent les cartes — un pli "doublé" peut renverser la partie.

## Modes (v1)

- **Solo contre bots** : 1 humain + 1 à 5 bots (niveaux 1 aléatoire ou 2 optimal).
- **Pass-and-play** : 2 à 6 humains se passent un seul device. Entre chaque tour humain, un écran *"Passe le téléphone à X"* sépare les manches.

Les modes **réseau local** (WebSocket) et **online** (Supabase real-time) sont prévus en v2/v3.
