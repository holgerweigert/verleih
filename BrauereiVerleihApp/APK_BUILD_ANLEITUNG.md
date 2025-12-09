# 📱 APK Build Anleitung - Brauerei Kirschenholz App

## Schnellster Weg zur APK (auf jedem PC mit Internet)

### Voraussetzungen
- Einen Computer mit Node.js (egal welches Betriebssystem)
- Internetverbindung
- Expo Account (kostenlos)

---

## 🚀 Schritt-für-Schritt Anleitung

### 1. Expo Account erstellen (einmalig)

Gehe zu: **https://expo.dev/signup**
- E-Mail und Passwort eingeben
- Account bestätigen

### 2. Projekt vorbereiten

```bash
# In den Projekt-Ordner wechseln
cd BrauereiVerleihApp

# Dependencies installieren
npm install

# Bei Expo einloggen
npx expo login
# Deine Expo-Zugangsdaten eingeben
```

### 3. APK bauen

```bash
# EAS CLI installieren (einmalig)
npm install -g eas-cli

# Projekt initialisieren
eas build:configure

# APK Build starten
eas build --platform android --profile preview
```

### 4. Download

Nach ca. 10-15 Minuten bekommst du einen **Download-Link** per E-Mail und im Terminal!

Die APK kannst du dann direkt auf dein Android-Handy übertragen und installieren.

---

## ⚡ Alternative: Lokaler Build (ohne Internet-Build)

Falls du die APK komplett lokal bauen willst:

### Voraussetzungen
- Android Studio installiert
- Android SDK konfiguriert
- Java JDK installiert

### Build-Befehle

```bash
# Expo Prebuild
npx expo prebuild

# In Android-Ordner wechseln
cd android

# APK bauen (Windows)
gradlew.bat assembleRelease

# APK bauen (Mac/Linux)
./gradlew assembleRelease
```

Die APK findest du dann hier:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 📦 Fertige APK installieren

### Auf dem Handy:

1. APK auf Handy übertragen (USB, E-Mail, Cloud)
2. Datei antippen
3. "Aus unbekannten Quellen installieren" erlauben
4. Installation bestätigen
5. App öffnen!

---

## 🔧 Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "No development build found"
Wähle beim Build: **Production Build** statt Development

### Build schlägt fehl
Prüfe:
- Backend-URL in `src/services/api.js` korrekt?
- Alle Dependencies installiert? (`npm install`)
- Expo Account eingeloggt? (`npx expo whoami`)

---

## 💰 Kosten

- **Expo Build Service**: Kostenlos (bis zu 30 Builds/Monat)
- **Lokaler Build**: Komplett kostenlos

---

## ⏱️ Build-Dauer

- **Online (EAS)**: 10-15 Minuten
- **Lokal**: 5-10 Minuten (nach Setup)

---

## 📝 Wichtige Hinweise

### Vor dem Build prüfen:

1. **Backend-URL**: In `src/services/api.js` muss die richtige URL stehen!
```javascript
const API_BASE_URL = 'https://verleih.kirschenholz.de/api';
```

2. **App-Name**: In `app.json` anpassen falls gewünscht

3. **Version**: Bei jedem Update die Version erhöhen in `app.json`

---

## 🎯 Schnellstart für Ungeduldige

Hast du Zugang zu einem PC mit Node.js? Dann:

```bash
cd BrauereiVerleihApp
npm install
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Warte 15 Minuten → APK per Link downloaden → Fertig!

---

## 🆘 Brauchst du Hilfe?

Ich kann dir auch eine vorkonfigurierte GitHub Actions Workflow erstellen, 
die automatisch eine APK baut, sobald du das Projekt auf GitHub hochlädst!
