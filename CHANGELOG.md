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

### Audit revisé

Audit initial avait manqué plusieurs fonctionnalités déjà implémentées :
- Service Worker + offline.html déjà présents et enregistrés (`public/sw.js`, App.jsx:601)
- Auto-scroll vers jour actuel déjà présent (`voyageMode`, `currentDayN`, App.jsx:564-646)
- Compte à rebours départ déjà présent
- Liens Google Maps par activité déjà présents (`mapsLink()` App.jsx:1391)

Priorités réelles restantes : ErrorBoundary (🔥), iOS modal scroll-lock, fonts, a11y, layout desktop, convertisseur JPY, météo, checklist départ, mode grand texte, contenu Golden Week.

### Lot 1 — Filet de sécurité React

- **`src/ErrorBoundary.jsx`** créé : composant classe React qui capture les erreurs du sous-arbre. Affiche un écran fallback rouge avec emoji, message rassurant, détails technique dépliables, bouton "Recharger", et bouton "Réinitialiser les données locales" (préserve le dark mode).
- **`src/main.jsx`** : `<App />` wrappé dans `<ErrorBoundary>`.
- **Fix build** : backticks dans le commentaire CSS du commit précédent cassaient le template literal JS. Remplacés par du texte brut.

Impact : en cas de crash inattendu pendant le voyage, plus d'écran blanc catastrophique. L'utilisateur voit une page lisible avec action de récupération claire, et les données localStorage (réservations, items cochés) sont préservées.

### Lot 2 — Fixes techniques rapides

- **iOS modal scroll-lock** corrigé ([App.jsx:3087](src/App.jsx)) : sur iOS Safari, `overflow:hidden` sur body ne bloque pas le scroll d'arrière-plan. Remplacé par le pattern `position:fixed` + mémorisation du scrollY + restauration à la fermeture.
- **A11y** ajoutée : `aria-expanded` + `aria-controls` sur les boutons de cartes-journées, `aria-selected` + `aria-current="page"` sur les onglets de navigation. Permet aux lecteurs d'écran (VoiceOver iOS, TalkBack Android) d'annoncer l'état plié/déplié et l'onglet actif.
- **Google Fonts preconnect** ajouté dans `index.html` : établit le handshake DNS/TLS vers fonts.googleapis.com et fonts.gstatic.com en parallèle du chargement principal au lieu de bloquer le premier rendu.

### Lot 3 — Mode grand texte (parents)

- **Toggle "A+/A−"** dans le header à côté du dark mode. Persistance localStorage (`large-text=1`).
- Quand activé : `document.documentElement.style.fontSize = "19px"` (vs 16px par défaut) → toutes les tailles en rem grandissent de +18.75%. Les inputs restent à 16px forcés (protection anti-zoom iOS conservée).
- Usage : utile sur le téléphone des parents en plein soleil ou à bout de bras, et au retour pour relire les notes.

### Lot 4 — Convertisseur JPY↔EUR

- **Déjà implémenté** — composant `ConverterCard` [App.jsx:2511](src/App.jsx) avec taux live depuis frankfurter.app (ECB), fallback cache 163¥/€, refresh max 1×/24h, input bidirectionnel, 6 prix de référence. Rien à faire.

### Lot 5 — Checklist avant départ J-7 / J-1 / Jour J

Ajout de 3 nouvelles catégories dans `CHECKLIST` (section 📋 Checklist), toutes avec items cochables et persistance :

1. **⏰ Cette semaine (J-7 → J-3)** — 9 items : vérif passeport 6 mois validité, prévenir banque, assurance voyage, commande yens cash, screenshots réservations, impressions papier, packs offline Maps/Translate, numéros d'urgence (AMDA, ambassade FR, SOS Help), Suica sur iPhone Wallet.
2. **⏰ La veille (J-1 = 26 avril)** — 6 items : check-in en ligne, recharge batteries, sac cabine, adaptateurs électriques, trajet aéroport, absence logement.
3. **🎌 Jour J (27 avril)** — 4 items critiques : passeports, adresse hôtel en japonais, yens cash, mode voyage cartes bancaires.

Chaque item a une note explicite avec contexte japonais spécifique (ex : adresse 〒111-0032 Asakusa Tobu, téléphone AMDA, tension 100V Type A).

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
