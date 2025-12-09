# 🚀 Schnellstart-Anleitung

Diese Anleitung hilft dir, die App schnell zum Laufen zu bringen.

## Option 1: Schnelltest mit Expo Go (Empfohlen für den Anfang)

### Schritt 1: Projekt vorbereiten
```bash
cd BrauereiVerleihApp
npm install
```

### Schritt 2: Backend-URL anpassen
Öffne `src/services/api.js` und ändere die URL:
```javascript
const API_BASE_URL = 'https://verleih.kirschenholz.de/api';
```

### Schritt 3: App starten
```bash
npm start
```

### Schritt 4: Auf dem Handy testen
1. Installiere "Expo Go" aus dem Play Store
2. Scanne den QR-Code aus dem Terminal
3. App öffnet sich automatisch!

## Option 2: Mit Android Emulator

### Voraussetzungen
- Android Studio installiert
- Android SDK eingerichtet
- AVD (Android Virtual Device) erstellt

### Starten
```bash
npm start
# Drücke dann 'a' um den Android Emulator zu öffnen
```

## Option 3: APK bauen für echtes Gerät

### Einmalig: Expo Account erstellen
```bash
npx expo login
```

### APK erstellen
```bash
npx eas build --platform android --profile preview
```

Die APK wird in der Cloud gebaut und du bekommst einen Download-Link!

## Backend-Vorbereitung

Dein Backend muss diese Endpunkte bereitstellen:

### Minimal-Setup (zum Testen):
```
POST /api/auth/login        - Login mit { username, password }
GET  /api/customers         - Liste aller Kunden
GET  /api/rentals           - Liste aller Verleihungen
GET  /api/stats             - Statistiken für Dashboard
```

Siehe `BACKEND_INTEGRATION.md` für Details.

## Troubleshooting

### Problem: "Network request failed"
**Lösung:** 
- Backend läuft nicht → Backend starten
- Falsche URL → URL in `api.js` prüfen
- Android Emulator nutzt `10.0.2.2` statt `localhost`!

### Problem: "Unable to resolve module"
**Lösung:**
```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Problem: App zeigt leere Seite
**Lösung:**
- JavaScript-Fehler im Terminal prüfen
- Shake-Geste auf Handy → "Reload" drücken

## Erste Schritte nach Installation

1. **Backend testen**: Öffne im Browser `https://verleih.kirschenholz.de/api/customers`
2. **Login-Daten erstellen**: Erstelle einen Test-User in deiner Datenbank
3. **App öffnen**: Starte die App und logge dich ein
4. **Testdaten anlegen**: Erstelle einen Testkunden und eine Testverleihung

## Nächste Schritte

- [ ] Icons und Splash Screen anpassen (siehe `app.json`)
- [ ] Weitere Screens hinzufügen (z.B. Kundendetails)
- [ ] Offline-Funktionalität erweitern
- [ ] Push-Benachrichtigungen einbauen
- [ ] Produktions-Build erstellen

## Häufige Fragen

**F: Kann ich die App ohne Backend testen?**
A: Theoretisch ja, aber du müsstest Mock-Daten erstellen. Einfacher ist es, das Backend lokal laufen zu lassen.

**F: Funktioniert die App offline?**
A: Teilweise - Daten werden in AsyncStorage gespeichert, aber API-Calls benötigen Internet.

**F: Wie viel kostet der App Store Deployment?**
A: Google Play: Einmalig ~25€, Apple App Store: ~99€/Jahr

**F: Kann ich die App ohne Expo Go nutzen?**
A: Ja, baue eine APK/IPA und installiere sie direkt.

## Support

- 📚 Expo Docs: https://docs.expo.dev/
- 📚 React Native Docs: https://reactnative.dev/
- 💬 React Native Community: https://github.com/react-native-community

Viel Erfolg! 🍺
