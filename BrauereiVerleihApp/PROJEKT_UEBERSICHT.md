# 📱 Brauerei Kirschenholz - Mobile App Projekt

## ✅ Was wurde erstellt?

Eine vollständige React Native App für Android und iOS zur Verwaltung deines Brauerei-Verleihsystems.

## 📦 Projekt-Struktur

```
BrauereiVerleihApp/
├── 📄 App.js                           # Haupt-Einstiegspunkt
├── 📄 package.json                     # Dependencies & Scripts
├── 📄 app.json                         # Expo Konfiguration
├── 📄 README.md                        # Vollständige Dokumentation
├── 📄 QUICKSTART.md                    # Schnellstart-Anleitung
├── 📄 BACKEND_INTEGRATION.md           # Backend-Integration Guide
├── 📄 .gitignore                       # Git Ignore Rules
│
├── 📁 src/
│   ├── 📁 components/                  # Wiederverwendbare UI-Komponenten
│   │   ├── Button.js                   # Styled Button mit Varianten
│   │   ├── Card.js                     # Card Container
│   │   ├── Input.js                    # Text Input mit Validation
│   │   ├── Loading.js                  # Loading Spinner
│   │   └── StatusBadge.js              # Status Anzeige (aktiv/zurückgegeben)
│   │
│   ├── 📁 screens/                     # App Bildschirme
│   │   ├── LoginScreen.js              # Login mit JWT Auth
│   │   ├── HomeScreen.js               # Dashboard mit Statistiken
│   │   ├── CustomersScreen.js          # Kunden-Liste mit Suche
│   │   └── RentalsScreen.js            # Verleihungen mit Filtern
│   │
│   ├── 📁 navigation/                  # Navigation Setup
│   │   └── AppNavigation.js            # Stack & Tab Navigation
│   │
│   ├── 📁 services/                    # Backend-Kommunikation
│   │   └── api.js                      # Axios API Service (JWT, CRUD)
│   │
│   └── 📁 utils/                       # Hilfsfunktionen
│       ├── helpers.js                  # Formatierung (Datum, Währung, etc.)
│       └── theme.js                    # Farben, Spacing, Typography
│
└── 📁 assets/                          # Icons & Bilder (Platzhalter)
```

## 🎨 Features

### ✅ Implementiert:
- **Authentication**: JWT-basierter Login mit Token-Speicherung
- **Kunden-Verwaltung**: Liste, Suche, Anlegen, Bearbeiten, Löschen
- **Verleihungen**: Übersicht mit Status-Filter (aktiv/zurückgegeben/alle)
- **Dashboard**: Statistiken (aktive Verleihungen, Kundenanzahl)
- **Responsive Design**: Optimiert für Android & iOS
- **Offline Storage**: AsyncStorage für Token-Speicherung
- **Navigation**: Bottom-Tab Navigation (Dashboard, Verleihungen, Kunden)
- **UI-Komponenten**: Wiederverwendbare, gestylte Komponenten
- **Theme System**: Einheitliches Design mit Kirschenholz-Branding

### 🚧 Ausbaubar (für später):
- Verleihungs-Details-Screen
- Neuen Verleih-Screen mit Produkt-Auswahl
- Kunden-Details und Bearbeitung
- Quittungs-Generierung und -Anzeige (PDF)
- Produkte-Verwaltung
- Push-Benachrichtigungen (Rückgabe-Erinnerung)
- Erweiterte Offline-Funktionalität
- Barcode-Scanner für Produkte
- Foto-Upload (z.B. für Schäden)

## 🛠 Technologie-Stack

- **Framework**: React Native (0.73)
- **Build-Tool**: Expo (v50)
- **Navigation**: React Navigation 6 (Stack + Tabs)
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Authentication**: JWT Bearer Token
- **UI**: Custom Components (kein UI Framework)

## 🚀 Installation

### Schnellstart:
```bash
cd BrauereiVerleihApp
npm install
npm start
# Expo Go App öffnen und QR-Code scannen
```

### Detaillierte Anleitung:
Siehe `QUICKSTART.md` für Schritt-für-Schritt Anleitung.

## 🔌 Backend-Integration

Die App benötigt ein Backend mit folgenden Endpunkten:

### Auth:
- `POST /api/auth/login` - Login

### Kunden:
- `GET /api/customers` - Liste (mit optionaler Suche)
- `GET /api/customers/:id` - Details
- `POST /api/customers` - Neu erstellen
- `PUT /api/customers/:id` - Aktualisieren
- `DELETE /api/customers/:id` - Löschen

### Verleihungen:
- `GET /api/rentals` - Liste (mit Status-Filter)
- `GET /api/rentals/:id` - Details
- `POST /api/rentals` - Neue Verleihung
- `PUT /api/rentals/:id` - Aktualisieren
- `POST /api/rentals/:id/return` - Zurückgeben

### Statistiken:
- `GET /api/stats` - Dashboard-Daten

**Vollständige Backend-Integration**: Siehe `BACKEND_INTEGRATION.md`

## ⚙️ Konfiguration

### Backend-URL ändern:
```javascript
// src/services/api.js, Zeile 4:
const API_BASE_URL = 'https://verleih.kirschenholz.de/api';
```

### Theme anpassen:
```javascript
// src/utils/theme.js:
export const Colors = {
  primary: '#8B4513',  // Deine Farbe hier
  // ...
};
```

### App-Icon & Name:
```json
// app.json:
{
  "expo": {
    "name": "Dein App Name",
    "icon": "./assets/icon.png"
  }
}
```

## 📱 Deployment

### Android APK bauen:
```bash
npx eas build --platform android --profile preview
```

### iOS IPA bauen (nur Mac):
```bash
npx eas build --platform ios --profile production
```

## 🐛 Bekannte Probleme & Lösungen

### "Network request failed"
- ✅ Backend-URL prüfen
- ✅ Bei Android Emulator: `10.0.2.2` statt `localhost`
- ✅ CORS im Backend aktivieren

### "Unable to resolve module"
```bash
rm -rf node_modules
npm install
npx expo start -c
```

## 📝 Nächste Schritte

1. **Backend vorbereiten**: Endpunkte implementieren (siehe BACKEND_INTEGRATION.md)
2. **Testen**: Mit Expo Go auf echtem Gerät testen
3. **Erweitern**: Weitere Screens hinzufügen (Details, Formulare)
4. **Optimieren**: Performance, Error Handling, Loading States
5. **Deployment**: APK bauen und verteilen

## 💡 Tipps

- **Entwicklung**: Nutze Expo Go für schnelles Testing
- **Debugging**: Shake-Geste öffnet Entwickler-Menü
- **Hot Reload**: Änderungen werden automatisch übernommen
- **Logs**: `console.log()` erscheint im Terminal

## 📚 Ressourcen

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Axios Documentation](https://axios-http.com/)

---

**Version**: 1.0.0  
**Erstellt**: Dezember 2024  
**Entwickelt für**: Brauerei Kirschenholz, Rickling  

Viel Erfolg mit der App! 🍺
