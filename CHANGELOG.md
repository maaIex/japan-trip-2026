# Changelog — Voyage Japon 2026

Journal des modifications apportées par session Claude Code. À donner en début de nouvelle session pour reprendre le contexte.

---

## Session 7 — 2026-04-19

### Fallback taux JPY → 186

- `ConverterCard` fallback passe de 163 → 186 (taux réel d'avril 2026). Utilisé uniquement si localStorage vide ET première visite offline. Les visites en ligne écrasent toujours via `api.frankfurter.app`.

---

## Session 7 — 2026-04-19 (restyle)

**Contexte :** Après la Session 6 (masthead + listing jours éditoriaux), le contenu *à l'intérieur* d'un jour restait en vieux style (cartes arrondies, pills, période en bandeau coloré), et les six onglets Ressources (Infos, Checklist, Gastro, Météo, Phrases, Calendrier) conservaient des en-têtes en gradient + cartes rondes. Objectif : harmoniser ces zones avec la DA Indigo Ukiyo-e (Fraunces italique, filets ink, "§ N", mono tabular, drapeau vermillon).

### Détail d'un jour — timeline éditoriale

- `SectionBlock` (App.jsx:2307) : fini le bandeau `[── MATIN ──]` coloré par période. En-tête devient **"§ 1" Fraunces 1.9rem italic weight 900 vermillon** + label période en sans 0.22em uppercase, simple filet `--border-light` en dessous.
- `ActivityItem` (App.jsx:2368) : plus de cartes arrondies empilées. Layout timeline à deux colonnes :
  - **Colonne heure** (3.4rem, flex column centered) : heure extraite du titre via regex `/^(.*?)(\d{1,2}h\d{0,2})\s*[—–-]\s*(.*)$/`, rendue en JetBrains Mono tabular-nums 0.7rem. Pastille colorée par statut (`ok`→success, `book`→gold, `note`→info, `opt`→kyoto, défaut→muted) avec double ring (2px bg-page + 1px shadow couleur). Fil vertical `--border-light` reliant les pastilles jusqu'à l'item suivant.
  - **Colonne contenu** : titre nettoyé en Fraunces 1rem weight 700 italique si `s==="ok"`, sous-titre Inter Tight 0.82rem, badge de statut applati (pas de border-radius, uppercase 0.18em). Boutons "Fait" / "Maps" en flat border 1px uppercase 0.1em.

### Six onglets Ressources — refonte DA

Délégué à un agent (restyle massif ~3000 lignes, fonctionnalités préservées). Touches :

- **ChecklistSection** : en-tête pill warning → titre Fraunces italic "§ Checklist des Réservations" + filet ink. Barre de progression : 5px radius gradient → 3px flat `--accent` sur `--border-light`. Catégories en labels uppercase trackés 0.18em. Checkboxes carrées (pas de radius). Dates en mono tabular-nums, notes italique accent.
- **GastroSection** : bandeau "Top 10" gradient → titre "§ 10" Fraunces italic. Cercles rangs → chiffres italiques sans chrome. Filtres ville en boutons flat uppercase. Accordéons catégories applatis, titres Fraunces italic. Badges prio/difficulté en rectangles flat.
- **MeteoSection** : alerte Golden Week → filets top/bottom + titre italic. Cartes météo applaties, stats en mono tabular-nums avec séparateurs verticaux, notes italique.
- **CalendrierSection** : intro carte applatie avec "§", dates en mono. Pills filtres flat uppercase. Timeline fêtes applatie, titres italic serif, tips en quotes italiques avec bordure gauche, overlays festivals en blocs border-left accent.
- **PhrasebookSection** : intro applatie "§", search box flat 1px. Accordéons applatis, titres italic. JP en Shippori Mincho (`--font-kanji`), romaji en Fraunces italic display. Boutons difficulté + actions en rectangles flat uppercase.
- **InfoSection** : le shell partagé `InfoCard` (utilisé aussi par Météo/Phrases/Infos internes) perd sa carte arrondie à gradient et devient filets top/bottom + titre "§ …" Fraunces italic + sous-titre sans tracked. Listes internes (Transports, Boissons, Astuces, Codes culturels) avec labels uppercase + filets fins.

### Préservé (intouchés)

- `DayCard`, `TimelineView`, `SectionBlock` day detail (fait dans cette session), masthead, onglets nav, barre de recherche.
- Composants imbriqués spécifiques (`ConverterCard`, `TranslateShortcuts`, `KonbiniHub`, `DoAndDont`, `DepartureChecklist`, `ShareSection`, `NotificationsSection`, `SpotCard`, `LiveWeatherCard`) : héritent du nouveau shell `InfoCard` mais leur micro-styling interne reste — à voir si besoin d'un passage dédié plus tard.
- Tous les bindings données, handlers, aria, localStorage intacts.

### Vérifications

- HMR Vite passe cleanly sur toutes les edits (pas d'erreur parse).
- Dev server réexposé avec `--host` pour test mobile sur `http://192.168.0.19:5173`.

---

## Session 6 — 2026-04-19

**Contexte :** Les couleurs Ukiyo-e sont en place (Session 5), mais la *disposition* de l'en-tête, des bannières de réservation et du listing des jours ne correspondait pas encore au prototype `voyage-japon/project/Voyage Japon.html`. L'objectif de cette session : aligner la mise en page pixel-près sur le mock éditorial.

### Masthead éditorial sur papier

- **Remplacement du bandeau dégradé prussien** par un masthead sur fond `--bg-page` (papier kozo) comme dans le prototype Indigo.
- **Rail supérieur** : filet ink 22 px + « Vol. 01 · Printemps » en sans 0.22em uppercase, « 2026 » en JetBrains Mono à droite. Les boutons A+ et mode nuit sont devenus des toggles ink discrets au lieu de pills sombres.
- **Titre géant** : « Japon '26 » en Fraunces clamp(3.4rem, 16vw, 4.25rem), weight 500 puis 900 italic vermillon. `opsz 144` activé.
- **Sous-titre + kanji 旅** : « Carnet d'itinéraire · 16 jours, 3 villes. » en Fraunces italic, dates micro-label dessous, 旅 à 3.4rem opacité 0.38 light / 0.5 dark.
- **Bloc à filets horizontaux** : `DÉPART DANS J-N` (Fraunces 2.65rem italic weight 900 vermillon) à gauche, `RÉSERVÉS X/Y` (Fraunces 1.35rem italic, X en vermillon, /Y en ink-muted) à droite — cliquable pour sauter vers la Checklist. Barre de progression éditoriale 3 px juste en-dessous, alimentée par `reservationsDone / reservationsTotal` (compte *tous* les items `status: "book"` du `CHECKLIST`, pas seulement les urgents).
- **`TripProgressBar` repensé** pour le fond papier : plus de `rgba(255,255,255,*)` codé en dur, tokens ink partout, dots rectangulaires 4 px (10 px pour le jour courant), marqueur `— Itinéraire / J1 → J15` en accent vermillon + mono.

### Suppression de la bannière urgente redondante

- L'ancien bandeau « Réservations urgentes : X/Y » est absorbé dans le bloc RÉSERVÉS du masthead. La composante `UrgentReservationsBanner` et son helper `getUrgentBookItems` sont supprimés (dead code après refonte).

### Barre de recherche éditoriale

- **Plus de pill arrondie grise** : filet ink 1 px, label `CHERCHEZ` en sans uppercase, placeholder « lieu · activité · restaurant » en Fraunces italique, compteur de matches en JetBrains Mono. Vire l'icône 🔍 émoji pour un rendu texte 100 % éditorial.

### Jours — section marker + cartes éditoriales

- **Nouveau marker par ville** au-dessus du listing : kanji accent 1.6rem + label ville en Fraunces italic + `N jours` en mono aligné à droite, séparé par un filet ink 1 px — exactement comme le prototype.
- **`DayCard` refondu** : plus de carte arrondie avec ombre + bordure gauche 4 px. Les jours partagent maintenant un filet `--border-light` comme séparateur, fond transparent (ou `--bg-card` quand ouvert), padding vertical accru. La colonne de droite n'affiche plus le chevron : juste le kanji de ville (vertical-rl, 1.35rem). Une pastille vermillon `● Réservé` apparaît si le jour contient des items `ok` ou `book`.

### Build & vérifications

- `npm run build` OK (845 ms, 35 modules, ~456 kB).
- Diff App.jsx : 237 lignes supprimées, 214 ajoutées — refactor net.

### Intention design

> Le lecteur ouvre le carnet, le papier est à nu. Avant la table des matières, trois blocs : le volume de l'année, le titre, le compte à rebours. Rien d'autre — pas de panneau d'alerte rouge, pas de gradient tape-à-l'œil. L'encre fait le travail.

### Addendum — finitions

- **Motif seigaiha en dark mode** : les cercles passaient au stroke `#0D1B3F` (prussien ink), invisibles sur le fond `#0B1428` de nuit. Le `backgroundImage` devient conditionnel `dark ? kozo(#E8E3D6) : prussien(#0D1B3F)` pour que la vague reste lisible dans les deux modes.
- **Onglet Ressources — disclosure persistant** :
  - Le bouton gardait l'ancien comportement « swap du label vers l'onglet B actif » — ambigu (lien direct ? toggle ?). Le label est maintenant **toujours** « Ressources » avec sub `PRATIQUES`, clairement un disclosure.
  - Le panneau B se refermait dès qu'on sélectionnait une tuile (`setShowMore(false)` dans le `onClick`). Retiré : on peut maintenant switcher entre Budget, Transport, Checklist, Gastro, Essentiels sans recliquer sur « Ressources » à chaque fois. Le panneau ne se ferme que si on change de **destination** (groupe A) ou qu'on retappe le bouton « Ressources ».
- **TimelineView — collision resolution + typographie lisible** :
  - Deux activités proches (ex. 8h30 / 9h, 26 px d'écart) ou simultanées (ex. 14h / 14h) se chevauchaient totalement car chaque bloc fait 52 px de haut en position absolue. Les textes s'empilaient en charabia illisible (« Sagano Sanoto (R... Way) [嵯峨野/トロッコ] d'acteur »).
  - Nouveau passage de *cluster detection + column assignment* dans `TimelineView` (App.jsx:2082-2113) : après le tri par heure, les items dont les fenêtres de 52 px se chevauchent forment un cluster, chacun reçoit un `col` + `colsCount`. Le rendu calcule `left: col/colsCount %` et `right: (1 - (col+1)/colsCount) %` → deux items simultanés passent côte-à-côte en demi-largeur au lieu de se superposer.
  - Quand un bloc est déplié, il reprend toute la largeur (`left:4px right:4px z-index:10`) pour que le détail reste lisible sans écraser les voisins.
  - Remplacement de la troncature sauvage `.slice(0, 50)` par un `-webkit-line-clamp: 2` + `word-break: break-word` : fini les mots coupés en plein milieu, le titre se tronque proprement sur 2 lignes et s'ouvre entier au clic.

---

## Session 5 — 2026-04-18

**Contexte :** Application complète et uniforme du design **Indigo Ukiyo-e** (handoff Claude Design `voyage-japon`). L'objectif : typographie éditoriale (Fraunces + Inter Tight + Shippori Mincho) partout, plus aucune couleur codée en dur, light + dark tuned automatiquement via les variables CSS, sans régression fonctionnelle.

### Système de tokens — CSS variables d'abord

- **`:root` (light)** et **`:root[data-theme="dark"]`** sont maintenant le *seul* endroit où une couleur Ukiyo-e est déclarée littéralement. Papiers kozo, ink prussien, vermillon hanko, or, cinq teintes de ville (Tokyo bleu, Kyoto prune, Osaka kaki, transit pierre, départ rouge foncé), quatre périodes (matin doré, après-midi indigo, soir prune, nuit encre), cinq statuses (OK / book / free / note / opt), cinq semantic levels (success/warning/danger/info/accent) — chacun avec variantes `-soft`, `-bdr`, `-wash`.
- **Nouveaux tokens ajoutés** cette session pour étendre la palette sans casser les appels existants : `--accent-wash`, `--accent-bdr`, `--gold-bdr`.
- **Accessoires JS** (`cssv(name)`, `t(name)`, `v(key)`) conservent leurs signatures historiques mais renvoient désormais *tous* un `var(--…)`. La bascule light/dark se fait 100 % en CSS, zéro branch JS à l'exécution — un atout perf et une suppression brutale de logique dupliquée.

### Typographie éditoriale partout

- **Fraunces (serif)** appliqué aux titres de cartes, bannières et sections : `InfoCard`, `EmergencyFAB` (Mode urgence, Phrases vitales, Consulats, Hôpitaux, Mes infos), `CalendrierSection` (intro + titre d'événement), Checklist, Gastro Top-10 hero. Weight 600, letter-spacing -0.01em pour le rendu affiche-voyage.
- **Inter Tight (sans)** pour le corps, les micro-labels et les boutons.
- **Shippori Mincho** pour les glyphes kanji (numéro de jour, bandeau Vol. 01).

### Migration section par section

Chaque commit couvre un groupe cohérent (cf. `git log`) :

- **[f57ff43]** Checklist + UrgentReservationsBanner : catégories re-mappées sur `--city-*` / `--accent` ; badges de priorité sur `--gold-*` / `--accent-*` ; statuts « Réservé / À faire / Optionnel » via les tokens `st-*`.
- **[d8ffe33]** Gastro + Top-10 éditorial : difficulté, priorité, TOP10 hero, filtres rapides, ville active, spot épinglé — tout en tokens. `SpotCard` simplifié, `DIFF_BADGE` extrait en constante globale.
- **[71d2b8d]** Converter (or), Checklist de départ (success), LiveWeatherCard (info/warning/danger), MeteoSection (wash de ville pour les cartes semaine, catégories valise).
- **[55b5449]** PhrasebookSection + InfoSection : badges difficulté DIFF, confirmations « Copié », KonbiniHub, DoAndDont, Transports & JR Pass, Boissons, Astuces Japon, Codes Culturels — plus un seul hex.
- **[a248371]** OfflineBanner, InstallBanner (iOS tutoriel + Android prompt), EmergencyFAB (bulle flottante + modal plein écran, numéros, consulats, hôpitaux, phrases vitales). Le bouton 🚨 porte désormais le vermillon hanko officiel (`--accent` → `--accent-deep`).
- **[dd5180f]** CalendrierSection : `IMPACT` et `TYPE_COLOR` convertis en vars sémantiques, timeline rail réécrit en gradient de 5 tokens, titre événement en Fraunces.

### Corrections techniques liées

- **Signature `t()` modernisée** — renvoie toujours `{light: cssv, dark: cssv}` (même var). Les ~10 derniers appels au pattern *legacy* `t("#HEX","#HEX")` produisaient des `var(--#HEX)` invalides ; tous corrigés.
- **Accès `obj[dark?"dark":"light"]`** éliminés / simplifiés (ex. `ST[...].bg.light` ou accès direct au var string).
- **`InfoCard`** accepte désormais `headerBg` comme string CSS-var. Fallback legacy `{light,dark}` conservé pour compat.
- **`SpotCard`** : `DIFF_BADGE` extrait en const module-level, plus de re-création par render.

### Build & vérifications

- `npm run build` : 35 modules, ~455 kB (~160 kB gzip) — inchangé vs Session 4.
- Ramassage des hex résiduels : les seuls hex restants dans `App.jsx` sont intentionnels — déclaration des vars (`:root`), la meta `theme-color` device-chrome, et les couleurs du QR code (noir/blanc obligatoires pour la lisibilité scanner).

### Intention design

> Un voyageur ouvre l'app dans un café parisien avant le vol : papier kozo crème, ink prussien, tampons vermillon. Dans le Shinkansen de nuit vers Kyoto (dark mode), même hiérarchie visuelle, les accents passent en teintes néon atténuées sur fond d'encre. **Aucune section ne doit trahir sa filiation avec l'estampe.**

---

## Session 4 — 2026-04-17

**Contexte :** Audit qualité / perf / fiabilité avant voyage. Extraction d'utilitaires testables, optimisation des chemins chauds, versioning SW automatique, et amélioration UX de la recherche. Budget tracker et galerie photo explicitement écartés (inutiles pour l'usage voyage).

### Extraction d'utilitaires testables

- **`src/utils/search.js`** créé — `matchesQuery()`, `countMatches()`, `countItemMatches()` déplacées hors de `App.jsx`. JSDoc complète sur chaque fonction.
- **`src/utils/highlight.jsx`** créé — le wrapper `<mark>` de mise en valeur de la recherche, avec JSDoc.
- **`src/utils/weather.js`** créé — `wmoToIcon()` (code météo WMO → emoji/label) + nouvelle `formatAge()` pour formater "il y a Xmin/Xh/Xj". JSDoc.
- **`App.jsx`** : imports depuis `./utils/*`, duplicata supprimés. Gain : ~40 lignes de logique pure hors du monolithe, testable sans monter React.

### Tests — Vitest

- **`vitest` + `@testing-library/react` + `jsdom`** ajoutés en `devDependencies`.
- **`src/utils/__tests__/search.test.js`** — 15 tests couvrant : empty query, title match, case-insensitive, subtitle match (régression possible si on recasse search), city name, date, day-of-week, tips, null day.
- **`src/utils/__tests__/weather.test.js`** — 11 tests : `wmoToIcon` (sunny/cloudy/rain/storm/fallback) + `formatAge` (now-ref fixe pour déterminisme).
- **`src/utils/__tests__/highlight.test.jsx`** — 5 tests : empty, no-match, wrap, preserve case, dark-mode color.
- **Scripts npm** : `npm test` (single run), `npm run test:watch` (dev).
- Résultat : **36 tests ✓ / 3 fichiers**.

### Recherche améliorée

- **Nouveaux champs matchables** dans `matchesQuery` :
  - Nom de ville (`tokyo`, `kyoto`, `osaka`, `transit`, `depart`) — taper "kyoto" ouvre automatiquement les jours du tab Kyoto.
  - Date humaine (`27 avr`, `28 avr`…) — pour rejoindre un jour précis.
  - Jour de la semaine (`Lun`, `Mar`…).
- **Compteur par jour** : lorsque la recherche est active, chaque carte-journée affiche un badge 🔍 N indiquant le nombre d'activités correspondantes (hover : tooltip détaillée). Permet de voir en un coup d'œil *où* se concentrent les résultats plutôt que de devoir déplier chaque jour.

### Performance — mémoïsation

- **`useMemo`** sur `tab`, `allDays`, `days`, `totalMatches`, `itemMatchesByDay` ([App.jsx:666](src/App.jsx)) — évite de recalculer le filtrage/comptage à chaque render déclenché par un état non lié (ex: toggle d'un note d'un autre jour).
- **`useCallback`** sur `toggleDay` — handler stable, évite des re-renders en cascade dans `DayCard`.
- Impact mesurable : taper dans la recherche ne re-scanne plus les 16 jours × N items à chaque frappe.

### Météo — indicateur de cache obsolète

- [LiveWeatherCard](src/App.jsx) : nouveau bandeau d'avertissement jaune "⚠️ Cache ancien (il y a Xj) — reconnectez-vous pour rafraîchir" quand la dernière mise à jour est > 24h ET que le dernier fetch a échoué.
- Utilise la nouvelle utilitaire `formatAge()` (remplace la fonction closure locale).
- Comportement existant préservé : on continue d'afficher le cache tant qu'il existe, jamais d'écran blanc même hors-ligne prolongé.

### Service Worker — versioning automatique

- **Fini le bump manuel de `CACHE_VERSION`** à chaque déploiement.
- **`vite.config.js`** : nouveau plugin `sw-version-stamp` + `define` injectent un timestamp UTC (format `YYYYMMDDHHmm`) à chaque build.
- **`public/sw.js`** : `CACHE_VERSION` vaut `japon-2026-__BUILD_VERSION__`. Vite remplace le placeholder lors de `closeBundle` dans `dist/sw.js`.
- En dev (Vite dev server), le placeholder reste littéral — non bloquant, le SW n'est pas actif en dev.
- Vérifié après build : `dist/sw.js` contient bien `const CACHE_VERSION = 'japon-2026-202604170213';`.

### Écartés explicitement

- **Budget tracker** — demande utilisateur : inutile pour le voyage.
- **Galerie photo locale** — demande utilisateur : inutile.
- **Extraction complète du monolithe `App.jsx` (4972 lignes)** en composants séparés — risque élevé de régression vs gain modéré (sections déjà conditionnellement rendues via `activeTab==="xxx" && <Section />`). Reporté.
- **Code splitting via `React.lazy`** — même raison : exigerait d'extraire toutes les sections en fichiers séparés pour générer des chunks distincts. Le SW cache aggressivement, le bundle est déjà ~157 kB gzip.

### Build & vérifications

- `npm run build` : 35 modules, 442 kB (157 kB gzip). Même ordre de grandeur qu'avant.
- `npm test` : 36 ✓.
- Aucune dépendance runtime ajoutée (React reste seule).

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
