# Voyage Japon 2026 🗾

Application web (PWA) présentant l'itinéraire détaillé du voyage au Japon
du **27 avril au 11 mai 2026** : Tokyo, Kyoto, Osaka et escales.

## Stack

- **React 18** chargé en UMD depuis unpkg (pas de bundler)
- **PWA** — installable, fonctionne hors-ligne grâce à `sw.js`
- **Déploiement** — statique sur Netlify, CI/CD auto depuis ce repo

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Shell HTML + loader initial |
| `app.js` | Bundle React pré-compilé (IIFE) |
| `sw.js` | Service worker (cache-first) |
| `manifest.json` | Manifeste PWA |
| `offline.html` | Page affichée hors-ligne si non cachée |
| `icon-192.png` / `icon-512.png` | Icônes PWA |
| `netlify.toml` | Config Netlify (SPA fallback + cache headers) |

## Développement local

Aucun `npm install` nécessaire. Pour prévisualiser :

```bash
# Au choix, au sein du dossier du projet :
python -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déploiement

Chaque `git push` sur `main` déclenche automatiquement un build Netlify
et met le site en ligne en 1 à 2 minutes.
