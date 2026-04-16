# Changelog — Voyage Japon 2026

Journal des modifications apportées par session Claude Code. À donner en début de nouvelle session pour reprendre le contexte.

---

## Session 3 — 2026-04-16

**Contexte :** Refonte de la navigation et nettoyage du header.

### Navigation 2 niveaux

- **Groupe A — Destinations** (toujours visible dans la nav bar) : Tokyo, Kyoto, Osaka, Départ.
- **Groupe B — Ressources** (panneau dépliable via "●●● Plus") : Infos, Checklist, Gastro, Météo, Phrases, Calendrier.
- Bouton "●●● Plus" en fin de barre Groupe A : affiche le label de l'onglet B actif si applicable, sinon "●●● Plus / Ressources". Panneau B = grille 3×2 de boutons cards.
- `findTabForDay(dayN)` — nouveau helper global pour résoudre le tab d'un jour (gère `dayNs` explicite ET `range`). Remplace les 4 occurrences inline de `TABS.find(t => t.range...)`.
- `allDays` supporte maintenant les tabs à liste explicite (`dayNs`) en plus des tabs à plage (`range`) — capacité conservée pour usage futur.

**Revert tenté :** un onglet "Excursions" avait été créé pour regrouper J3 (Nikkō) et J6 (Hakone/Mont Fuji) hors du tab Tokyo. Revert — ces jours restent dans Tokyo (range J1–J7) car ils sont géographiquement rattachés au séjour tokyoïte (hôtel Asakusa conservé, sac léger).

### Nettoyage header

- Suppression des 6 badges statiques ("🏨 4 séjours réservés", "🎫 JR Pass ✅", "✈️ Haneda (HND)", etc.) — inutiles en situation de voyage.
- Padding header réduit : `1.75rem 1.25rem 1.5rem` → `0.9rem 1.25rem 0.75rem`.
- Conservés : titre "Itinéraire Complet", sous-titre, toggles A+/dark, barre de progression voyage (TripProgressBar).

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

### Fix scroll molette desktop — 2e tentative (vraie cause)

Le fix précédent (suppression de `content-visibility:auto`) n'a **pas** résolu le bug — l'utilisateur reportait toujours le scroll bloqué.

Vraie cause identifiée : `html, body { overflow-x: hidden; max-width: 100vw; }` à la racine du style global.

Per spec CSS ([§ overflow interaction](https://drafts.csswg.org/css-overflow/)), lorsque `overflow-x` est mis sur l'élément racine (`html`), le navigateur **force `overflow-y` à `auto`**, ce qui transforme `html` en conteneur de défilement. Résultat : la molette agit sur un élément qui n'attrape pas le focus scroll par défaut → blocage.

Fix : retirer `html` de la règle, ne garder que `body { overflow-x: hidden; max-width: 100vw; }`. Le scroll revient au viewport normal (document), où la molette fonctionne.

Même fix appliqué à la règle `html, body { -webkit-overflow-scrolling: touch; overscroll-behavior-y: none; }` → désormais seulement sur `body`.

### Lot 7 — Layout desktop (sidebar "Table des matières")

- **Nouveau composant `DesktopTOC`** ([App.jsx:1192](src/App.jsx)) — aside flottant fixe à droite du viewport, visible uniquement à partir de 1180px de largeur (masqué via CSS `display:none` en dessous).
- Liste les jours du tab courant (Tokyo / Kyoto / Osaka / Départ), numéro + titre.
- Clic → ouvre la carte-journée et scroll-to.
- IntersectionObserver surveille quel jour est visible dans la moitié haute du viewport et highlight l'entrée correspondante (bordure gauche colorée + fond léger).
- Indication "▼ déplié" sous les jours actuellement ouverts pour aider à la vue d'ensemble.
- Positionnée en `right: max(1rem, calc((100vw - 760px) / 2 - 270px))` → colle au bord quand l'écran est très large, se rapproche du contenu quand l'écran l'est moins.
- Effet : sur grand écran (PC de prépa), l'espace à droite du contenu principal sert enfin à quelque chose — navigation éclair entre les 15 jours.

### Lot 8 — Météo live 7 jours (Open-Meteo)

- **Nouveau composant `LiveWeatherCard`** ([App.jsx MeteoSection](src/App.jsx)) — placé en tête de l'onglet 🌤 Météo, avant les cartes statiques.
- **API Open-Meteo** ([open-meteo.com](https://open-meteo.com)) — gratuit, sans clé, timezone `Asia/Tokyo`, 3 requêtes en parallèle pour Tokyo (35.6762/139.6503), Kyoto (35.0116/135.7681), Osaka (34.6937/135.5023).
- **Cache localStorage** `weather-cache-v1` : affichage instantané au rechargement, refresh réseau si > 3h. Hors-ligne : on affiche le dernier cache avec mention "hors-ligne (cache)".
- **Données par ville, 7 jours** : date (jour de la semaine raccourci), emoji météo (WMO code → icône via `wmoToIcon`), T° max/min en °C, probabilité de précipitation (bleue si ≥ 50%).
- **Couverture de voyage** : le voyage est du 27/04 au 11/05, soit dans la fenêtre de 7 jours à partir de ~20/04. Pendant le voyage, on voit le réel jour par jour. Avant le voyage, on voit les tendances J-X.
- **Cohabitation avec les cartes statiques** : les cartes "Météo semaine par semaine" restent — elles décrivent la saison complète (climat normal, advice de saison) là où l'API donne le temps prévu.

### Lot 9 — Navigation clavier (desktop)

- **`useEffect` keyboard handler** sur `window` ([App.jsx:659](src/App.jsx)) — actif seulement si `(hover: none)` est faux (= vrai clavier physique, pas tactile pur).
- **←/→** (sans modifier) : navigue entre les jours du tab courant. Le "jour courant" est déterminé dynamiquement en cherchant la carte dont le `top` est le plus proche de 80px (juste sous le nav). Le jour cible est automatiquement ouvert et scroll-into-view.
- **Alt+←/→** : change d'onglet (Tokyo → Kyoto → Osaka → Départ → Infos → Checklist → Gastro → Météo → Phrasebook → Calendrier, circulaire).
- **Ignore quand l'utilisateur tape** : test sur `document.activeElement` → INPUT/TEXTAREA/contenteditable = skip. Et Ctrl/Cmd + flèche : skip (préserve les raccourcis navigateur).

### Lot 10 — Non réalisé

Le budget tracker (catégorie Lot 10 de l'audit) n'est volontairement pas implémenté — demande explicite de l'utilisateur.

### Lot 6 — Contenu Golden Week (audit + ajouts ciblés)

Après audit approfondi du contenu existant, beaucoup de points de mon audit initial étaient en réalité déjà couverts :

- ✅ Faux-pas à éviter (pourboire, baguettes, tatouages, mouchoirs, escalators Tokyo/Osaka inversés, geiko) — DoAndDont très complet
- ✅ Golden Week jour par jour avec pics de foule — section Météo/Préparation
- ✅ Apps : Safety Tips, Yurekuru Call, NHK World, Navitime — mentionnées
- ✅ Tsunami procédure — présente
- ✅ JR Pass couverture détaillée (Hikari/Kodama, PAS Nozomi/Mizuho)

**Ajout d'une nouvelle InfoCard "🇯🇵 Astuces Japon pratiques"** ([App.jsx InfoSection](src/App.jsx)) avec 5 points qui manquaient :

1. **🛍 Tax-free (détaxe immédiate)** — règle des 5 000¥ HT, passeport obligatoire, sac scellé à ne pas ouvrir avant sortie du Japon, liste des magasins (Don Quijote, BicCamera, Isetan, etc.).
2. **📅 Fermetures hebdo** — musées fermés lundi, Ghibli fermé mardi, temples ouverts 7j/7, règle "vérifier avant de s'y rendre" (d'autant plus pendant GW où les fériés décalent).
3. **🌊 Procédure séisme précise** — pendant / après / cas tsunami, en 3 sections pas-à-pas.
4. **🏥 Hôpitaux internationaux** — AMDA +81-3-6233-9266, noms d'hôpitaux anglophones Tokyo/Kyoto/Osaka, conseil de noter médicaments en DCI internationale.
5. **🚄 Shinkansen Golden Week** — urgence réservation sièges J1, EKINET/SmartEX, phrase en japonais pour le guichet, rappel JR Pass ne couvre pas Nozomi/Mizuho.

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
