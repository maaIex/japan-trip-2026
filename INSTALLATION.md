# Installer l'app Voyage Japon 2026 sur le téléphone

Guide pas-à-pas pour installer l'app sur l'écran d'accueil du téléphone.
Une fois installée, elle s'ouvre comme une vraie application, plein écran,
**et fonctionne même sans internet** une fois qu'elle a été ouverte une
première fois avec du wifi.

**Adresse du site** : https://voyage-japon-famille.netlify.app/

---

## 🤖 Sur Android (Chrome) — pour Papa et Maman

1. Ouvrir **Chrome** (l'icône ronde rouge/jaune/vert/bleu).
2. Taper dans la barre d'adresse en haut :
   `voyage-japon-famille.netlify.app`
   puis appuyer sur **Entrée** (ou « Aller »).
3. Attendre que la page s'affiche (le logo rouge 🗾 apparaît quelques secondes).
4. Une **bannière bleue** apparaît en haut : *« Installer l'app »*.
   → Appuyer sur le bouton **Installer**.
   → Puis confirmer **Installer** dans la petite fenêtre qui s'ouvre.
5. ✅ L'icône **Japon 2026** apparaît maintenant sur l'écran d'accueil
   du téléphone, comme n'importe quelle autre app.

**Si la bannière bleue n'apparaît pas :**
- Appuyer sur les **3 petits points** en haut à droite de Chrome.
- Choisir **« Installer l'application »** ou **« Ajouter à l'écran d'accueil »**.
- Confirmer.

---

## 🍎 Sur iPhone (Safari) — pour moi

> ⚠️ **Important** : il faut utiliser **Safari**, pas Chrome ni Firefox.
> Sur iPhone, seul Safari permet d'installer une app web.

1. Ouvrir **Safari**.
2. Taper dans la barre d'adresse :
   `voyage-japon-famille.netlify.app`
3. Attendre le chargement complet (logo rouge 🗾).
4. Appuyer sur l'icône **Partager** en bas au centre :
   une boîte avec une flèche qui monte ⬆️.
5. Faire défiler le menu vers le bas et choisir
   **« Sur l'écran d'accueil »**.
6. Vérifier que le nom affiché est bien « Japon 2026 », puis
   appuyer sur **Ajouter** en haut à droite.
7. ✅ L'icône apparaît sur l'écran d'accueil.

---

## 🛰️ Vérifier que le mode hors-ligne marche

À faire **avant de partir au Japon**, sur chaque téléphone, une fois que
l'app est installée :

1. Ouvrir l'app **Japon 2026** depuis l'écran d'accueil (pas depuis le navigateur).
2. **Parcourir quelques journées** en les dépliant — ça force le cache à tout télécharger.
3. Fermer l'app.
4. **Activer le mode avion** (ou couper le wifi et les données mobiles).
5. Rouvrir l'app depuis l'écran d'accueil.
6. ✅ L'itinéraire doit s'afficher normalement, sans message d'erreur.

Si une page « Hors-ligne » rouge apparaît : il faut rouvrir l'app une
fois avec internet pour finir de mettre en cache les ressources
manquantes, puis retester.

---

## 🔁 Mise à jour du contenu

À chaque fois que le site est mis à jour sur Netlify, l'app récupère
automatiquement la nouvelle version **dès que le téléphone a internet
et que l'app est rouverte**. Pas besoin de désinstaller / réinstaller.

Si un problème d'affichage persiste après une mise à jour :
- **Android** : appuyer longuement sur l'icône → *Infos sur l'appli* → *Stockage* → *Vider le cache*.
- **iPhone** : supprimer l'icône de l'écran d'accueil et refaire l'installation (étapes ci-dessus).

---

## 👤 ACTION MANUELLE — à faire par le propriétaire du repo

Rien à faire côté Netlify pour les PWA : le hosting HTTPS suffit et tout
est déjà en place. Un simple `git push` sur `main` redéploie le site.

**À vérifier une fois en production** :
1. Ouvrir https://voyage-japon-famille.netlify.app/ sur un vrai iPhone.
2. Vérifier que l'icône d'accueil (après installation) n'est pas floue
   — elle doit utiliser `apple-touch-icon.png` (180×180).
3. Ouvrir les DevTools Chrome sur desktop → onglet **Application**
   → **Manifest** et **Service Workers** → tout doit être vert.
