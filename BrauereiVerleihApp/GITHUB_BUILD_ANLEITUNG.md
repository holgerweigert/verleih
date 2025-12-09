# 🤖 Automatischer APK Build mit GitHub Actions

Diese Anleitung zeigt dir, wie du **automatisch eine APK bauen** lässt, ohne selbst Node.js zu installieren!

---

## 📋 Was du brauchst

1. Einen **kostenlosen GitHub Account**: https://github.com/signup
2. Einen **kostenlosen Expo Account**: https://expo.dev/signup
3. Das Projekt (hast du schon!)

---

## 🚀 Schritt-für-Schritt Setup

### 1. Expo Access Token erstellen

1. Gehe zu: https://expo.dev/accounts/[dein-username]/settings/access-tokens
2. Klicke auf **"Create Token"**
3. Name: `GitHub Actions`
4. Kopiere den Token (wird nur einmal angezeigt!)

### 2. GitHub Repository erstellen

1. Gehe zu: https://github.com/new
2. Repository Name: `brauerei-verleih-app`
3. Visibility: **Private** (empfohlen)
4. **Create repository** klicken

### 3. Expo Token in GitHub hinterlegen

1. Gehe zu deinem Repository auf GitHub
2. Klicke auf **Settings** → **Secrets and variables** → **Actions**
3. Klicke **"New repository secret"**
4. Name: `EXPO_TOKEN`
5. Value: Dein kopierter Expo Token
6. **Add secret** klicken

### 4. Projekt hochladen

#### Option A: Mit Git (falls installiert)

```bash
cd BrauereiVerleihApp

# Git initialisieren
git init

# Remote hinzufügen (DEINE URL anpassen!)
git remote add origin https://github.com/DEIN-USERNAME/brauerei-verleih-app.git

# Dateien hinzufügen
git add .
git commit -m "Initial commit"

# Hochladen
git branch -M main
git push -u origin main
```

#### Option B: Per Web-Upload (ohne Git)

1. Gehe zu deinem GitHub Repository
2. Klicke auf **"uploading an existing file"**
3. Ziehe den kompletten `BrauereiVerleihApp` Ordner in den Browser
4. **Commit changes** klicken

### 5. Build starten

Der Build startet **automatisch** nach dem Upload!

Oder manuell starten:
1. Gehe zu **Actions** Tab in deinem Repository
2. Wähle **"Build Android APK"**
3. Klicke **"Run workflow"**
4. Warte 10-15 Minuten

### 6. APK herunterladen

1. Gehe zu **Actions** Tab
2. Klicke auf den abgeschlossenen Workflow (grüner Haken ✅)
3. Unter **Artifacts** findest du: `app-release`
4. Herunterladen und entpacken
5. APK auf dein Handy kopieren und installieren!

---

## 📱 APK auf Handy installieren

### Via USB:
```
1. Handy per USB an PC anschließen
2. APK in den Download-Ordner des Handys kopieren
3. Auf dem Handy: Datei-Manager öffnen
4. APK antippen
5. "Aus unbekannten Quellen" erlauben
6. Installieren!
```

### Via Cloud:
```
1. APK in Google Drive / Dropbox hochladen
2. Auf dem Handy herunterladen
3. Installieren
```

---

## 🔄 Updates erstellen

Wenn du Änderungen machst:

```bash
cd BrauereiVerleihApp

# Änderungen hochladen
git add .
git commit -m "Update: Neue Features"
git push

# → APK wird automatisch neu gebaut!
```

---

## 💰 Kosten

- GitHub: **Kostenlos** (2000 Minuten/Monat gratis)
- Expo: **Kostenlos** (30 Builds/Monat)
- **Total: 0 Euro!**

---

## ⚡ Vorteile dieser Methode

✅ Kein Node.js auf Windows 7 nötig
✅ Komplett automatisch
✅ Funktioniert von überall (auch Handy-Browser!)
✅ Kostenlos
✅ APK wird professionell gebaut
✅ Updates sind einfach

---

## 🐛 Troubleshooting

### Build schlägt fehl: "EXPO_TOKEN not found"
→ Expo Token als Secret in GitHub hinterlegen (Schritt 3)

### Build schlägt fehl: "Project not configured"
Füge in `app.json` hinzu:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "DEINE-PROJECT-ID"
      }
    }
  }
}
```

### Workflow startet nicht
→ Datei muss genau hier sein: `.github/workflows/build-apk.yml`

---

## 📝 Alternative: EAS CLI lokal

Falls GitHub Actions nicht funktioniert, kannst du auch auf einem **beliebigen PC mit Internet**:

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

APK-Link kommt per E-Mail!

---

## 🎯 Zusammenfassung

**Ohne eigenen PC:**
1. Projekt auf GitHub hochladen
2. Expo Token hinterlegen
3. 15 Minuten warten
4. APK downloaden
5. Auf Handy installieren
6. Fertig! 🎉

**Mit anderem PC:**
```bash
cd BrauereiVerleihApp
npm install
npm install -g eas-cli
eas login
eas build -p android
```

Beide Wege führen zur fertigen APK!
