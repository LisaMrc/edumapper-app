# Roadmap — Edumapper Program Search

## ÉTAPE 1 — Data pipeline (Nitro, critique) ✅
- [x] Parser CSV maison (pas de lib)
- [x] Déduplication sur `program_id`
- [x] Normalisation variants (`language`, `apprenticeship`)
- [x] Suppression refs parent cassées (orphelins promus en génériques)
- [x] Groupage générique → variants + join school

## ÉTAPE 2 — API endpoint ✅
- [x] `GET /api/programs?q=` → retourne generics groupés avec variants

## ÉTAPE 3 — Design tokens ✅
- [x] `app/assets/css/tokens.css` → variables CSS Edumapper

## ÉTAPE 4 — Composants ✅
- [x] `VariantBadge.vue` — axe individuel : EN, Alternance, Red Team…
- [x] `ProgramCard.vue` — générique + liste de variantes
- [x] `SearchBar.vue` — input + filtres secondaires

## ÉTAPE 5 — Page & composable ✅
- [x] `usePrograms.ts` — fetch + search réactif client-side
- [x] `pages/index.vue` — assemblage final

## ÉTAPE 6 — États invisibles ✅
- [x] Loading (skeleton animé)
- [x] Empty (no results)
- [x] Error (API fail)
