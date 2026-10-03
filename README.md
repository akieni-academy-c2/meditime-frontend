# MediTime frontend

Connexion mobile React/Vite en JavaScript, avec UI kit shadcn/ui et Tailwind. Node.js 22.12+.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Ouvrir `http://localhost:5173/connexion`. Le port correspond aux origines CORS et Google autorisées. Les variables `VITE_API_URL` (préfixe `/api/v1` inclus) et `VITE_GOOGLE_CLIENT_ID` sont publiques. Aucun secret dans les variables `VITE_*`.

```sh
npm run build
npm run preview
```

Le build est dans `dist/`. Les écrans email et OTP reprennent la maquette. Les connexions email et Google redirigent vers `/accueil`. La structure patient comprend un en-tête, le contenu principal et une navigation basse Accueil / Rendez-vous / Profil. Recherche, rendez-vous et profil affichent un contenu provisoire explicite ; la déconnexion fonctionne depuis Profil. Les routes de cet espace nécessitent une session. Au-delà de 1024 px, un message invite à utiliser un téléphone ; l'interface mobile reste centrée sur tablette.

Le UI kit se consulte en développement sur `/ui-kit` : logo, champs, OTP à six cases, boutons et messages. Les composants shadcn sont dans `src/components/ui`, les adaptations MediTime dans `src/components/AuthUI.jsx` et les couleurs/espacements dans `src/styles.css`.

La session utilise un cookie HttpOnly avec `credentials: 'include'`. Le CSRF reste en mémoire et accompagne les écritures. Aucun jeton dans localStorage. Google utilise le bouton officiel Identity Services en popup, aligné au centre ; aucun callback OAuth backend.

Resend est limité à l'adresse autorisée du compte de démonstration. Google reste en mode test et nécessite une recette réelle. Un hébergement futur devra servir `index.html` pour les routes, autoriser l'origine dans CORS et Google et utiliser `Cross-Origin-Opener-Policy: same-origin-allow-popups`. Vérifier les cookies entre domaines avant déploiement.

Contribution : branche de travail avec issue et PR vers `develop`. Validation manuelle uniquement : OTP, renvoi, erreurs, restauration de session, déconnexion, popup Google, clavier, affichage mobile et message desktop, puis build. Aucun framework ni suite de tests automatisés.
