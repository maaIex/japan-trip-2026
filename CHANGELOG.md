# Changelog — Voyage Japon 2026

Journal des modifications apportées par session Claude Code. À donner en début de nouvelle session pour reprendre le contexte.

---

## Session 2 — 2026-04-15

**Contexte :** App utilisée sur desktop pour préparer le voyage (27 avril → 11 mai, Golden Week). Scroll molette non fonctionnel sur desktop. Mise en place d'une stratégie de sauvegarde pour pérenniser le travail entre sessions.

### Mises en place

- **CHANGELOG.md** créé à la racine du repo pour tracer l'historique session par session.
- **Stratégie de travail** : commits directs sur `main`, un commit par lot cohérent, push systématique → Netlify auto-déploie.

### Corrections

- **Scroll molette desktop bloqué** — `src/App.jsx`
  - Cause : `content-visibility: auto` combiné à `contain-intrinsic-size: 0 200px` sur les cartes-journées. Les journées font en réalité 1500-3000px ; le navigateur calculait mal la hauteur totale du document, ce qui faussait la barre de défilement et bloquait le scroll molette sur Chrome/Edge.
  - Fix : suppression de la règle CSS. Gain de perf marginal vs bug bloquant.
  - Impact mobile : aucun (le tactile n'était pas affecté).

### Audit en cours

Audit complet sur 4 axes (technique/perf, UX desktop+mobile, contenu Japon, fonctionnalités manquantes) présenté à l'utilisateur — en attente de validation avant implémentation.

---

## Session 1 — Avant 2026-04-15 (historique git)

Commits existants :
- `16b0150` fix: correct Shibuya Sky ticket price (3400¥/adulte, not 2000¥)
- `9b0a899` feat: Japan-specific content, live FX rate, dark mode persistence
- `d7abbbf` feat: dedicated 180x180 apple-touch-icon + user install guide
- `ee487bc` fix: decorative header circle blocked dark mode button clicks
- `10d5b57` feat: migrate to Vite + apply mobile/PWA fixes
- `4df97c5` chore: initial commit — static PWA ready for Netlify CI/CD

---

## Format des entrées

Chaque session ajoute une nouvelle entrée en haut du fichier avec :
- **Date** (format AAAA-MM-JJ)
- **Contexte** — pourquoi cette session
- **Mises en place** — nouveautés structurelles
- **Corrections** — bugs résolus, avec cause + fix + impact
- **En cours** — travail non encore validé
