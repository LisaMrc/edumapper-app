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
- [x] `VariantBadge.vue` — axe individuel : Cursus en Anglais, Alternance, Red Team…
- [x] `ProgramCard.vue` — générique + axes groupés + overlay hover
- [x] `SearchBar.vue` — input + clear button

## ÉTAPE 5 — Page & composable ✅
- [x] `usePrograms.ts` — fetch + search réactif client-side (debounce 250ms)
- [x] `pages/index.vue` — assemblage final

## ÉTAPE 6 — États invisibles ✅
- [x] Loading (skeleton animé, prefers-reduced-motion)
- [x] Empty (no results)
- [x] Error (API fail)
- [x] `aria-live`, `aria-busy`, `role="alert"`, focus clavier

## ÉTAPE 7 — Layout sidebar + navbar ✅
- [x] Volet vertical gauche (brand / sidebar)
- [x] Navbar sticky en haut (search bar, frosted glass)
- [x] Grille 3 colonnes, cartes même hauteur

## ÉTAPE 8 — Affichage école & localisation ✅
- [x] Résolution groupe école via `parent_school_id`
- [x] `school_group` exposé sur générique et variante
- [x] Groupage villes par groupe école sur la carte et le popover
- [x] `useLocationGroups` composable centralisé

## ÉTAPE 9 — Popover ✅
- [x] `ProgramPopover.vue` — dialog natif (Escape, backdrop, focus trap)
- [x] Toutes les cartes cliquables (avec ou sans variantes)
- [x] Animation fade + scale à l'ouverture

## ÉTAPE 10 — Architecture & centralisation ✅
- [x] `app/types/programs.ts` — types hors de `server/`
- [x] `useLocationGroups.ts` — logique dédupliquée
- [x] `useHead` — title de page

## ÉTAPE 11 — Déploiement
- [x] Push sur GitHub (repo public)
- [x] Déploiement Vercel / Netlify / Cloudflare
- [x] URL publique à partager

## ÉTAPE 12 — Notes écrites (livrable)
- [x] `NOTES.md` — 5 à 8 lignes : choix techniques, ce qui n'a pas été fait, usage de Claude
