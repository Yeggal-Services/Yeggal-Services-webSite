# Yeggal Services – Site Web

Bienvenue sur le dépôt du **site web de Yeggal Services**.  
Welcome to the **Yeggal Services website** repository.

> Ce projet est un site statique (HTML + CSS) présentant les services, valeurs et informations de l’entreprise Yeggal Services.  
> This project is a static website (HTML + CSS) showcasing Yeggal Services offerings and company information.

---

## 🌐 Langages / Technologies

| Langage | Pourcentage | Rôle |
|---------|-------------|------|
| HTML    | ~70.7%      | Structure sémantique des pages |
| CSS     | ~29.3%      | Présentation, mise en page, responsive |

(Aucun JavaScript n’est détecté pour l’instant – vous pouvez en ajouter si nécessaire.)

---

## 📁 Structure proposée du projet

```
/
├─ index.html
├─ services.html
├─ about.html
├─ contact.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ images/
│  └─ fonts/ (optionnel)
└─ README.md
```

Si votre structure actuelle diffère, mettez cette section à jour pour refléter la réalité.

---

## 🚀 Démarrage rapide

### Option 1 : Ouvrir localement
1. Cloner le dépôt  
   `git clone https://github.com/Yeggal-Services/Yeggal-Services-webSite.git`
2. Ouvrir `index.html` dans votre navigateur.

### Option 2 : Extension Live Server (VS Code)
1. Ouvrir le dossier dans VS Code
2. Clic droit sur `index.html` → "Open with Live Server"

### Option 3 : Serveur simple (Python)
```
python -m http.server 8080
# Puis ouvrir http://localhost:8080
```

---

## 🧱 Bonnes pratiques HTML/CSS

- Utiliser des balises sémantiques : `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Ajouter des attributs `alt` descriptifs aux images
- Prévoir une version responsive (mobile-first, media queries)
- Minifier le CSS pour la production (ex : via `cssnano`, `postcss`)
- Ajouter un `favicon` et des balises Open Graph

---

## ♿ Accessibilité (A11Y)

Checklist rapide :
- Contrastes conformes (WCAG AA : ratio ≥ 4.5:1)
- Navigation clavier fonctionnelle (focus visible)
- Attributs `aria-label` pour les icônes seules
- Titres hiérarchisés (`h1` unique par page)
- Langue du document : `<html lang="fr">`

---

## 🔍 SEO de base

Inclure dans `<head>` :
```html
<meta name="description" content="Yeggal Services - (Brève description des services).">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:title" content="Yeggal Services">
<meta property="og:type" content="website">
<meta property="og:image" content="https://votre-domaine/logo.png">
<meta property="og:description" content="Description courte.">
<link rel="canonical" href="https://votre-domaine/">
```

---

## 🧪 Validation / Qualité

Actions recommandées :
- Valider HTML : https://validator.w3.org/
- Valider CSS : https://jigsaw.w3.org/css-validator/
- Tester performance : Lighthouse (Chrome DevTools)
- Tester responsive : Device toolbar dans navigateur

---

## 📦 Déploiement

### GitHub Pages (simple)
1. Pousser sur la branche `main`
2. Activer Pages dans Settings → Pages → Source = `main` / root
3. Accéder via : `https://yeggal-services.github.io/Yeggal-Services-webSite/`

### Alternatives
- Netlify : drag & drop du dossier
- Vercel : import GitHub
- OVH / o2switch / autre hébergeur mutualisé

---

## 🛣️ Roadmap (exemple – à adapter)

| Fonctionnalité | Statut | Priorité |
|----------------|--------|----------|
| Page Services détaillée | En cours | Haute |
| Formulaire de contact fonctionnel (back-end ou service externe) | À définir | Haute |
| Version anglaise du site | À faire | Moyenne |
| Optimisation images (WebP) | À faire | Moyenne |
| Politique de confidentialité (RGPD) | À faire | Haute |

---

## 🤝 Contribution

1. Créer une branche : `git checkout -b feature/ma-fonctionnalite`
2. Commit clair : `git commit -m "feat: ajout section services"`
3. Push : `git push origin feature/ma-fonctionnalite`
4. Ouvrir une Pull Request

Convention de commits suggérée (Angular style) :
- `feat:` nouvelle fonctionnalité
- `fix:` correction
- `docs:` documentation
- `style:` formatage (pas de logique)
- `refactor:`
- `perf:`
- `chore:`

---

## 📫 Contact

- Site : (mettre l’URL finale)
- Email : (contact@exemple.com)
- Réseaux sociaux : (LinkedIn, Facebook, etc.)

---

## 📝 Licence

Aucune licence n’est indiquée actuellement.  
Recommandation :
- Proprietary (si fermé) OU
- MIT / Apache-2.0 (si open source)

Ajoutez un fichier `LICENSE` selon la décision.

---

## 🗂️ Métadonnées recommandées

Ajouter un fichier `site.webmanifest` si vous voulez une Progressive Web App (PWA) plus tard.

Exemple minimal :
```json
{
  "name": "Yeggal Services",
  "short_name": "Yeggal",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#003366",
  "icons": [
    { "src": "assets/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/images/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## ✅ Prochaines étapes proposées

- [ ] Confirmer la structure effective du dépôt
- [ ] Ajouter le logo et images optimisées
- [ ] Choisir une licence
- [ ] Ajouter un favicon (`favicon.ico` / `favicon.svg`)
- [ ] Intégrer formulaire de contact (service : Formspree, Netlify Forms, backend custom)
- [ ] Mettre en place tests de validation automatique (GitHub Action)

---

## 🔒 Sécurité (si ajout de scripts plus tard)

- Toujours héberger scripts de confiance
- Prévoir un en-tête CSP si déployé sur serveur configuré
- Éviter inline scripts (ou utiliser `nonce`)

---

## 💬 Multilingue (optionnel)

Stratégies possibles :
- Dossiers (`/fr/`, `/en/`)
- Fichiers séparés (`index.fr.html`, `index.en.html`)
- JS dynamique (si ajouté plus tard)

---

## 🙏 Remerciements

Merci à l’équipe Yeggal Services et aux contributeurs.

---

> Mettez à jour ce README au fur et à mesure de l’évolution du site.  
> Update this README as the project grows.

---

Besoin d’aide pour automatiser un déploiement ou ajouter un workflow GitHub Actions ? Dites-le et je pourrai proposer un fichier de configuration.
