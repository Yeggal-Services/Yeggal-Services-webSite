# 🔗 Guide Complet du Deep Linking - Yëggal Services

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Configuration complète](#configuration-complète)
4. [Déploiement](#déploiement)
5. [Tests](#tests)
6. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

Yëggal Services utilise **l'approche standard de l'industrie** pour le deep linking, identique à WhatsApp, Instagram, et Twitter :

### Principe de fonctionnement

1. **Utilisateur partage** : L'app génère un lien HTTPS : `https://yeggalservices.app/profile/userId123`
2. **Quelqu'un clique** sur le lien depuis WhatsApp/SMS/Email
3. **Le site web détecte** : Mobile ou Desktop ?
4. **Si mobile** :
   - Android : Utilise **Android Intent** pour ouvrir l'app ou rediriger vers Play Store
   - iOS : Utilise **Universal Link** pour ouvrir l'app ou rediriger vers App Store
5. **Si l'app est installée** : Elle s'ouvre directement sur la ressource
6. **Sinon** : Le site invite à télécharger l'app

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PARTAGE DEPUIS L'APP                      │
│  Flutter génère: https://yeggalservices.app/profile/123     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               CLIC SUR LE LIEN (WhatsApp, SMS)              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  SITE WEB (yeggalservices.app)              │
│                                                               │
│  1. Détecte la plateforme (Android/iOS/Desktop)             │
│  2. Affiche la page avec bouton "Ouvrir l'app"              │
│  3. Auto-redirection après 1.5s sur mobile                  │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
┌───────────────┐                  ┌───────────────┐
│    ANDROID    │                  │      iOS      │
│               │                  │               │
│ Intent URL    │                  │Universal Link │
│ Ouvre l'app   │                  │ Ouvre l'app   │
│ OU Play Store │                  │ OU App Store  │
└───────────────┘                  └───────────────┘
        │                                  │
        └────────────────┬─────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                APP FLUTTER OUVERTE                           │
│                                                               │
│  1. DeepLinkService reçoit le lien                          │
│  2. Parse: profile/123                                       │
│  3. Navigate vers ProfilePage(userId: 123)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration complète

### 1. Site Web (yeggalservices.app)

#### Fichiers principaux

```
Yeggal-Services-webSite/
├── .well-known/
│   ├── assetlinks.json           # Configuration Android App Links
│   └── apple-app-site-association # Configuration iOS Universal Links
├── profile/
│   └── index.html                 # Page de deep link profil
├── local/
│   └── index.html                 # Page de deep link logement
```

#### `.well-known/assetlinks.json` (Android)

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "com.devall.yeggal",
      "sha256_cert_fingerprints": [
        "77:57:41:5B:14:40:5F:77:35:BD:42:89:CD:6D:6E:EE:29:0D:6D:3A:EB:3A:05:99:F4:A1:ED:AA:B3:70:CF:D0"
      ]
    }
  }
]
```

**IMPORTANT** : Remplacez `sha256_cert_fingerprints` par votre propre empreinte :

```bash
# Pour la clé de signature Release
keytool -list -v -keystore /path/to/your/release.keystore -alias yourAlias
```

#### `.well-known/apple-app-site-association` (iOS)

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "XMB855Z353.com.devall.yeggal",
        "paths": [
          "/profile/*",
          "/local/*"
        ]
      }
    ]
  }
}
```

**IMPORTANT** : Remplacez `XMB855Z353` par votre Team ID iOS (trouvez-le dans Apple Developer Console).

---

### 2. Configuration Android

#### AndroidManifest.xml

Les intent filters sont déjà configurés :

```xml
<!-- App Links (HTTPS) avec vérification -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="https" android:host="yeggalservices.app" android:pathPrefix="/profile" />
    <data android:scheme="https" android:host="yeggalservices.app" android:pathPrefix="/local" />
</intent-filter>
```

#### Vérification de la configuration

Après avoir déployé le site web ET installé l'app :

```bash
# Vérifier que les App Links sont bien configurés
adb shell pm get-app-links com.devall.yeggal

# Doit afficher:
# com.devall.yeggal:
#   ID: ...
#   Signatures: [...]
#   Domain verification state:
#     yeggalservices.app: verified
```

---

### 3. Configuration iOS

#### Configuration Xcode

1. Ouvrez `ios/Runner.xcworkspace`
2. Sélectionnez le target **Runner**
3. Allez dans **Signing & Capabilities**
4. Ajoutez **Associated Domains** :
   - `applinks:yeggalservices.app`

#### Info.plist

Vérifiez que `CFBundleURLTypes` est configuré :

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>yeggal</string>
        </array>
    </dict>
</array>
```

---

## 🚀 Déploiement

### Étape 1 : Déployer le site web

1. **Uploadez TOUS les fichiers** vers `https://yeggalservices.app` :
   ```bash
   scp -r Yeggal-Services-webSite/* user@server:/var/www/yeggalservices.app/
   ```

2. **Vérifiez que `.well-known` est accessible** :
   - Android : https://yeggalservices.app/.well-known/assetlinks.json
   - iOS : https://yeggalservices.app/.well-known/apple-app-site-association

   **CRITICAL** : Ces fichiers DOIVENT être servis en HTTPS sans redirection, avec le bon content-type !

3. **Configuration Nginx** (exemple) :

```nginx
server {
    listen 443 ssl http2;
    server_name yeggalservices.app;

    ssl_certificate /etc/letsencrypt/live/yeggalservices.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yeggalservices.app/privkey.pem;

    root /var/www/yeggalservices.app;
    index index.html;

    # Configuration pour .well-known
    location /.well-known/ {
        default_type application/json;
        add_header Content-Type application/json;
        add_header Access-Control-Allow-Origin *;
    }

    # Redirection des routes dynamiques
    location ~ ^/(profile|local)/(.*)$ {
        try_files /$1/index.html =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Étape 2 : Construire et déployer l'app

1. **Android** :
   ```bash
   flutter build appbundle --release
   # Uploadez sur Play Store
   ```

2. **iOS** :
   ```bash
   flutter build ipa --release
   # Uploadez sur App Store Connect
   ```

### Étape 3 : Vérification

1. **Testez les URLs de vérification** :
   - https://yeggalservices.app/.well-known/assetlinks.json (DOIT retourner le JSON)
   - https://yeggalservices.app/.well-known/apple-app-site-association (DOIT retourner le JSON)

2. **Testez un lien** :
   - https://yeggalservices.app/profile/TEST123
   - Doit afficher la page avec le bouton "Ouvrir dans l'application"

---

## 🧪 Tests

### Test 1 : Site web seul

1. Ouvrez https://yeggalservices.app/profile/TEST123 dans le navigateur mobile
2. Vérifiez que :
   - ✅ La page s'affiche correctement
   - ✅ Le bouton "Ouvrir l'app" est visible
   - ✅ Les liens Play Store/App Store fonctionnent

### Test 2 : App fermée → Lien cliqué

1. **Fermez complètement** l'app Yëggal Services
2. **Partagez un profil** depuis l'app d'un autre utilisateur
3. **Cliquez sur le lien** depuis WhatsApp
4. **Résultat attendu** :
   - ✅ Le site web s'affiche brièvement
   - ✅ L'app s'ouvre automatiquement
   - ✅ Navigation vers le profil partagé

### Test 3 : App en arrière-plan → Lien cliqué

1. **Ouvrez** l'app et mettez-la en arrière-plan
2. **Cliquez sur un lien** partagé
3. **Résultat attendu** :
   - ✅ L'app revient au premier plan
   - ✅ Navigation vers la ressource

### Test 4 : App non installée

1. **Désinstallez** l'app
2. **Cliquez sur un lien** partagé
3. **Résultat attendu** :
   - ✅ Le site web s'affiche
   - ✅ Bouton de téléchargement visible
   - ✅ Redirection vers Play Store/App Store fonctionne

---

## 🔧 Dépannage

### Problème : L'app ne s'ouvre pas automatiquement

**Causes possibles** :

1. **Les fichiers `.well-known` ne sont pas accessibles**
   ```bash
   curl -I https://yeggalservices.app/.well-known/assetlinks.json
   # Doit retourner 200 OK avec Content-Type: application/json
   ```

2. **Mauvaise empreinte SHA-256 dans `assetlinks.json`**
   ```bash
   # Récupérez la bonne empreinte :
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   # Ou pour la release key :
   keytool -list -v -keystore /path/to/release.keystore
   ```

3. **Android n'a pas vérifié les App Links**
   ```bash
   # Forcer la vérification :
   adb shell pm set-app-links --package com.devall.yeggal 0 yeggalservices.app
   adb shell pm verify-app-links --re-verify com.devall.yeggal
   ```

### Problème : Passage par NotFoundScreen

**Solution** : C'est normal maintenant ! Le système n'utilise plus le code Flutter précédent. Le site web gère la redirection.

### Problème : "App fermée → va juste à home"

**Ce problème est résolu** avec la nouvelle architecture. Mais si ça persiste :

1. Vérifiez les logs :
   ```bash
   # Android
   adb logcat | grep -i "DeepLink"

   # iOS
   # Dans Xcode : View → Debug Area → Activate Console
   ```

2. Assurez-vous que `DeepLinkNavigator.handlePendingDeepLink()` est bien appelé après l'authentification.

---

## 📱 Comment partager correctement

### Dans le code Flutter

```dart
import 'package:yeggal/services/deep_linking/deep_link_share_service.dart';

// Partager un profil
await ShareService.shareProfile(user);

// Partager une publication
await ShareService.sharePublication(publication);
```

Ces méthodes génèrent automatiquement le bon lien HTTPS :
- `https://yeggalservices.app/profile/userId123`
- `https://yeggalservices.app/local/pubId456`

---

## ✅ Checklist de déploiement

### Site Web
- [ ] Fichiers uploadés sur le serveur
- [ ] `.well-known/assetlinks.json` accessible en HTTPS
- [ ] `.well-known/apple-app-site-association` accessible en HTTPS
- [ ] Test : `https://yeggalservices.app/profile/TEST` affiche la page

### Android
- [ ] AndroidManifest.xml configuré avec App Links
- [ ] SHA-256 fingerprint correct dans `assetlinks.json`
- [ ] App installée depuis Play Store (ou via build release signée)
- [ ] Vérification : `adb shell pm get-app-links com.devall.yeggal`

### iOS
- [ ] Associated Domains configuré dans Xcode
- [ ] Team ID correct dans `apple-app-site-association`
- [ ] App installée depuis App Store (ou TestFlight)

### Tests
- [ ] App fermée → Clic lien → App s'ouvre sur la bonne page
- [ ] App en arrière-plan → Clic lien → App revient sur la bonne page
- [ ] App non installée → Clic lien → Redirection vers Store

---

## 🆘 Support

En cas de problème :

1. **Vérifiez les logs** : Recherchez `[DeepLink]` dans les sorties
2. **Testez les URLs** : Assurez-vous que `.well-known/` est accessible
3. **Vérifiez les certificats** : SHA-256 pour Android, Team ID pour iOS
4. **Réinstallez l'app** : Parfois nécessaire après un changement de configuration

---

**📅 Dernière mise à jour** : 16 février 2026
**🔗 Version du système** : v2.0 (HTTPS App Links)
