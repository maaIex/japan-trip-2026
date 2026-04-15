# Voyage Japon 2026 🗾

Application web (PWA) présentant l'itinéraire détaillé du voyage au Japon
du **27 avril au 11 mai 2026** : Tokyo, Kyoto, Osaka et escales.

Déployée sur https://voyage-japon-famille.netlify.app/

## Stack

- **React 18** via Vite (HMR en dev, build hashé en prod)
- **PWA** — installable sur iPhone et Android, fonctionne hors-ligne
- **Déploiement** — statique sur Netlify, CI/CD auto depuis ce repo

## Structure

| Chemin | Rôle |
|---|---|
| `index.html` | Shell HTML + loader initial, meta tags PWA |
| `src/main.jsx` | Entrée React |
| `src/App.jsx` | App complète (UI + données des 16 journées) |
| `public/manifest.json` | Manifeste PWA (Android/Chrome) |
| `public/sw.js` | Service worker (cache-first statique, network-first HTML) |
| `public/offline.html` | Page affichée hors-ligne si cache froid |
| `public/icon-192.png`, `icon-512.png` | Icônes PWA (manifest) |
| `public/apple-touch-icon.png` | Icône écran d'accueil iOS (180×180) |
| `vite.config.js` | Config Vite |
| `netlify.toml` | Config Netlify (SPA fallback + cache headers) |
| `INSTALLATION.md` | Guide d'installation pour les utilisateurs non-techs |

## Développement local

```bash
npm install
npm run dev       # serveur de dev Vite, HMR
npm run build     # bundle de prod dans dist/
npm run preview   # sert le bundle de prod localement
```

## Déploiement

Chaque `git push` sur `main` déclenche automatiquement un build Netlify
et met le site en ligne en 1 à 2 minutes. La config (build command,
publish dir, headers, redirects) est dans `netlify.toml`.

## Service worker — note sur les versions

À chaque modification qui change les fichiers pré-cachés, **bump
`CACHE_VERSION`** dans `public/sw.js` pour que les anciens caches soient
purgés au prochain chargement.
