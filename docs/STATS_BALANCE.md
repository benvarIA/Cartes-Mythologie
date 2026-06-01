# Équilibrage des stats — analyse

> Analyse générée à partir de `src/data/cards.json` (78 personnages, 4 catégories).

## Moyennes par catégorie

| Catégorie | Cartes | Force μ±σ | Magie μ±σ | Ruse μ±σ | Vélocité μ±σ |
|-----------|--------|-----------|-----------|----------|--------------|
| Créature  | 21 | 52.7 ± 28.5 | 47.2 ± 23.1 | 33.0 ± 26.0 | 40.7 ± 19.6 |
| Dieu      | 18 | 44.8 ± 31.6 | 57.1 ± 26.1 | 59.5 ± 27.6 | 47.1 ± 29.4 |
| Héros     | 20 | 58.0 ± 26.0 | 25.9 ± 27.2 | 70.2 ± 22.4 | 53.5 ± 26.2 |
| Titan     | 19 | 33.8 ± 31.7 | 66.8 ± 28.3 | 48.0 ± 33.0 | 41.7 ± 29.2 |

**Lecture :** chaque catégorie a une stat dominante claire (Dieu = Ruse, Héros = Ruse + Force, Titan = Magie, Créature = Force). C'est cohérent avec l'archétype et donne des choix de stat différenciants selon la carte.

## Profils dominants

- **Dieux** : polyvalents (toutes stats > 44). Ruse et Magie leurs forces.
- **Héros** : combatifs (Force + Ruse). **Magie très faible** (μ=25.9) → mauvais choix contre événements pro-magie.
- **Titans** : puissance brute en Magie. Force assez faible (33.8) → vulnérables aux Héros.
- **Créatures** : Force et Magie corrects, **Ruse faible** (33.0) → cibles faciles pour les Héros.

## Outliers

### Top 5 puissants (somme stats)
1. **Typhée** [titan] — total 357 (F88 M96 R79 V94) — quasi imbattable
2. **Camille** [héros] — 294 (F61 M68 R94 V71)
3. **Benoît** [héros] — 285 (F84 M30 R94 V77)
4. **Pierre** [héros] — 276 (F84 M16 R95 V81)
5. **Artémis** [dieu] — 273 (F24 M85 R71 V93)

### Top 5 faibles
1. **Achlys** [titan] — 103 (F7 M79 R10 V7) — uniquement Magie
2. **Atlas** [titan] — 115 (F97 M15 R2 V1) — uniquement Force
3. **Charybde** [créature] — 129
4. **Œdipe** [héros] — 132
5. **Dédale** [héros] — 142 — Ruse 89 mais reste faible

**Constat :** L'écart entre Typhée (357) et Achlys (103) est de **3.5×**. Cela crée des plis "perdus d'avance" quand un faible affronte un fort sans événement protecteur.

### Stats max=100
- **Chaos** [titan] — Ruse 100 → imbattable en Ruse
- **Rabelais** [héros] — Vélocité 100 → imbattable en Vélocité

Suggestion : les ramener à 99 pour permettre l'égalité ou la victoire par +1 d'un autre.

### Cartes parfaitement neutres
- **Némésis** [dieu] — 50/50/50/50 — volontaire (déesse de la justice), conserve.

## Recommandations

1. **Équilibrer le bas du tableau** : Achlys et Atlas sont trop spécialisés (1 seule stat exploitable). Légèrement remonter les stats secondaires (~5-10 pts) pour donner une option de repli.
2. **Plafonner à 99** Chaos/Ruse et Rabelais/Vélocité.
3. **Cartes "famille"** (Pierre, Camille, Benoît) sont dans le top 4 puissants → envisager un deck "famille" séparé pour ne pas déséquilibrer le deck mythologique principal.
4. **Magie faible chez les Héros** : c'est cohérent thématiquement, mais certains événements (Magie ×2) peuvent défavoriser systématiquement les Héros. Vérifier la distribution des événements.

## Recommandations cardonomies par événement

| Catégorie favorisée par événements | Cartes à booster |
|-------------------------------------|-------------------|
| Pro-Force | Dieux (faiblesse moyenne en F) |
| Pro-Magie | Héros (forte faiblesse) |
| Pro-Ruse | Créatures (faiblesse) |
| Pro-Vélocité | Titans / Créatures |

Un design d'événements équilibré devrait toucher chaque catégorie à peu près également.
