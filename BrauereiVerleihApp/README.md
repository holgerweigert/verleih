# Brauerei Kirschenholz - Verleih App

Mobile App für Android und iOS zur Verwaltung des Verleihsystems der Brauerei Kirschenholz.

## Features

- ✅ Kunden verwalten (anlegen, suchen, bearbeiten)
- ✅ Produkte/Artikel durchsuchen
- ✅ Verleihvorgänge erfassen (ausleihen/zurückgeben)
- ✅ Quittungen anzeigen und generieren
- ✅ Übersicht über aktuelle Verleihungen
- ✅ Offline-Synchronisation
- ✅ Android und iOS Support

## Technischer Stack

- React Native mit Expo
- React Navigation (Bottom Tabs)
- AsyncStorage für lokale Datenhaltung
- Axios für API-Kommunikation
- Anbindung an bestehendes Node.js/PostgreSQL Backend

## Installation & Setup

### Voraussetzungen

- Node.js (v16 oder höher)
- npm oder yarn
- Expo CLI
- Für Android: Android Studio + Android SDK
- Für iOS: Xcode (nur auf Mac)

### Schritt 1: Dependencies installieren

```bash
cd BrauereiVerleihApp
npm install
```

### Schritt 2: Backend-URL konfigurieren

Öffne `src/services/api.js` und passe die Backend-URL an:

```javascript
const API_BASE_URL = 'https://verleih.kirschenholz.de/api';
```

Falls du lokal testest, verwende:
```javascript
const API_BASE_URL = 'http://deine-ip:3000/api';
```

**Wichtig:** Bei Android-Emulator `localhost` nicht verwenden, sondern `10.0.2.2` oder die IP-Adresse deines Computers!

### Schritt 3: App starten

#### Entwicklungsmodus mit Expo

```bash
npm start
```

Dies öffnet Expo Developer Tools im Browser. Von hier aus kannst du:
- QR-Code scannen mit der Expo Go App (auf echtem Gerät)
- Android Emulator starten (Taste 'a')
- iOS Simulator starten (Taste 'i', nur Mac)

#### Android App auf echtem Gerät testen

1. Installiere "Expo Go" aus dem Google Play Store
2. Scanne den QR-Code aus den Expo Developer Tools
3. App läuft auf deinem Gerät

#### Android App bauen (APK)

```bash
# Expo Account erstellen/einloggen
npx expo login

# Build starten
npx eas build --platform android --profile preview

# Oder mit lokalem Build (ohne EAS):
npx expo build:android
```

## Projektstruktur

```
BrauereiVerleihApp/
├── App.js                      # Haupt-App Einstiegspunkt
├── app.json                    # Expo Konfiguration
├── package.json                # Dependencies
├── src/
│   ├── components/             # Wiederverwendbare Komponenten
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   ├── Loading.js
│   │   └── StatusBadge.js
│   ├── navigation/             # Navigation Setup
│   │   └── AppNavigation.js
│   ├── screens/                # App Screens
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── CustomersScreen.js
│   │   └── RentalsScreen.js
│   ├── services/               # API Services
│   │   └── api.js
│   └── utils/                  # Hilfsfunktionen
│       ├── helpers.js
│       └── theme.js
└── assets/                     # Bilder, Icons, Fonts
```

## Backend API-Endpunkte

Die App benötigt folgende API-Endpunkte:

```
POST   /api/auth/login
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
GET    /api/products
GET    /api/rentals
GET    /api/rentals/:id
POST   /api/rentals
PUT    /api/rentals/:id
POST   /api/rentals/:id/return
GET    /api/stats
```

## Troubleshooting

### "Network request failed"

- Prüfe ob Backend läuft
- Bei Android Emulator: Verwende `10.0.2.2` statt `localhost`
- Prüfe CORS-Einstellungen im Backend

### "Unable to resolve module"

```bash
npm install
rm -rf node_modules
npm install
npx expo start -c
```

## Version

1.0.0 - Initial Release
