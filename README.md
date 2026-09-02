# Edumapper — Notes techniques

## Choix techniques
- **Pas de librairie CSV** : parser RFC 4180 maison pour éviter toute dépendance externe et garder le contrôle sur la gestion des données sales (doublons, champs malformés, JSON imbriqué dans les variants)
- **JSON pré-généré** : les CSV sont convertis en JSON au moment du développement et commités dans `server/data/`. Rollup les inline dans le bundle Nitro — zéro accès filesystem au runtime, compatible Vercel sans configuration particulière
- **Pas de base de données** : les données sont statiques et tiennent en mémoire (~1 200 lignes). Un cache module-level suffit ; inutile d'ajouter SQLite ou Turso pour ce volume
- **`<dialog>` natif** pour le popover : Escape, backdrop et focus trap gérés par le navigateur sans JavaScript supplémentaire.
- **Tokens CSS Edumapper** : variables extraites du site existant (gradient, surface, ombres, typographie) pour garantir la cohérence visuelle sans Tailwind ni design system externe

## Ce qui peut être ajouté
- Filtres (dropdown avec des cases à cocher, pour complémenter la recherche)
- Concept de tri par pertinence (via un compteur de mots clés par exemple)
- Meilleure centralisation du code
- Utilisation de la navbar sur le côté pour avoir deux onglets et ainsi deux façons de voir les choses : une en voyant les formations puis les écoles (actuellement) et une inverse où on voie l'école et ses formations

## Usage de Claude
Claude a été utilisé comme assistant de développement tout au long du projet : architecture initiale, écriture du parser CSV, pipeline de données, composants Vue, debug du déploiement Vercel. Des résumés des choix ont été faits régulièrement pour comprendre l'implémentation