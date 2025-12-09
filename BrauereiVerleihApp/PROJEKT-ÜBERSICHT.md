# 📱 Brauerei Verleihsystem - Mobile App

## ✅ Was wurde erstellt?

Eine vollständige React Native App für Android und iOS mit folgenden Features:

### Hauptfunktionen:
- 🏠 **Dashboard** mit Schnellübersicht und Statistiken
- 👥 **Kundenverwaltung** - Suchen, anzeigen, Details
- 🍺 **Produktverwaltung** - Übersicht mit Verfügbarkeit
- 📋 **Verleihverwaltung** - Neue Verleihung, Rückgabe, Verlauf
- 💰 **Kosten-Tracking** - Mietpreis und Kaution
- 📱 **Moderne UI** - Intuitiv und mobiloptimiert

### Technische Features:
- ✅ Tab-Navigation zwischen Bereichen
- ✅ Stack-Navigation für Details
- ✅ Suchfunktion für Kunden
- ✅ Filter für Produkte und Verleihungen
- ✅ Pull-to-Refresh für aktuelle Daten
- ✅ Modals für Auswahl
- ✅ Vollständige Backend-Integration

## 📁 Projektstruktur

```
BrauereiVerleihApp/
├── App.js                          # Haupt-Entry
├── package.json                    # Dependencies
├── README.md                       # Vollständige Doku
├── SCHNELLSTART.md                 # Quick-Start Guide
│
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js         # Tab + Stack Navigation
│   │
│   ├── screens/
│   │   ├── HomeScreen.js           # Dashboard
│   │   ├── CustomersScreen.js      # Kundenliste mit Suche
│   │   ├── CustomerDetailScreen.js # Kundendetails
│   │   ├── ProductsScreen.js       # Produktliste mit Filter
│   │   ├── RentalsScreen.js        # Verleihungen (aktiv/alle)
│   │   ├── RentalDetailScreen.js   # Details + Rückgabe
│   │   └── NewRentalScreen.js      # Neue Verleihung
│   │
│   ├── services/
│   │   └── api.js                  # API Service Layer
│   │                               # - customerService
│   │                               # - productService
│   │                               # - rentalService
│   │                               # - receiptService
│   │                               # - authService
│   │
│   ├── components/
│   │   └── LoadingSpinner.js       # Wiederverwendbare Komponente
│   │
│   └── utils/
│       └── config.js               # ⚙️ HIER BACKEND-URL EINSTELLEN
│
└── assets/                         # Icons, Splash Screen
```

## 🚀 So startest du die App

### 1. Backend-URL konfigurieren

**WICHTIG:** Öffne `src/utils/config.js` und trage deine Backend-URL ein:

```javascript
export const API_BASE_URL = 'http://DEINE-IP:3000/api';
```

Finde deine IP:
- Windows: `ipconfig`
- Linux/Mac: `ifconfig` oder `ip addr`

### 2. Installation

```bash
cd BrauereiVerleihApp
npm install
```

### 3. Starten

**Option A: Expo Go (Schnellste Methode)**
```bash
npm start
# Scanne QR-Code mit Expo Go App auf dem Handy
```

**Option B: Android Studio**
```bash
npm run android
```

**Option C: iOS (nur macOS)**
```bash
npm run ios
```

## 📋 Benötigte Backend-Endpunkte

Die App erwartet diese API-Endpunkte:

```
GET    /api/customers              # Alle Kunden
GET    /api/customers/:id          # Einzelner Kunde
GET    /api/customers?search=xyz   # Suche
POST   /api/customers              # Neuer Kunde
PUT    /api/customers/:id          # Update

GET    /api/products               # Alle Produkte
GET    /api/products?available=true # Verfügbare

GET    /api/rentals                # Alle Verleihungen
GET    /api/rentals?status=active  # Aktive
GET    /api/rentals?customerId=X   # Nach Kunde
POST   /api/rentals                # Neue Verleihung
PUT    /api/rentals/:id/return     # Rückgabe

GET    /api/receipts/:id           # Quittung
POST   /api/receipts               # Neue Quittung
```

## 🎨 Design & Farben

- Hauptfarbe: `#8B4513` (Braun - Kirschenholz)
- Akzentfarbe Aktiv: `#FF9800` (Orange)
- Akzentfarbe Erfolg: `#4CAF50` (Grün)
- Hintergrund: `#f5f5f5` (Hellgrau)

Farben anpassen: Suche nach Hex-Codes in den Style-Objekten.

## 📦 Installierte Packages

- `expo` - React Native Framework
- `@react-navigation/*` - Navigation
- `axios` - HTTP Requests
- `@react-native-async-storage/async-storage` - Lokale Speicherung
- `react-native-screens` - Performance
- `react-native-safe-area-context` - Sichere Bereiche

## 🔧 Anpassungen & Erweiterungen

### Firmenname ändern
`src/utils/config.js` → `APP_CONFIG.COMPANY_NAME`

### Farben ändern
Suche nach `#8B4513` in allen Dateien

### Neue Screens hinzufügen
1. Erstelle `src/screens/NeuerScreen.js`
2. Füge zu `src/navigation/AppNavigator.js` hinzu

### API-Endpunkte anpassen
`src/services/api.js` → Passe Service-Funktionen an

## 🐛 Troubleshooting

| Problem | Lösung |
|---------|--------|
| Network request failed | Backend-URL in config.js prüfen |
| Module not found | `npm install` + `npm start -- --reset-cache` |
| Expo findet Server nicht | WLAN prüfen, Tunnel-Modus: `npm start -- --tunnel` |
| App stürzt ab | Cache löschen: `rm -rf node_modules && npm install` |

## 📱 App auf dem Handy installieren

### Für Tests (Expo Go)
1. Installiere "Expo Go" aus dem Store
2. Scanne QR-Code → Fertig!

### Für Production (Standalone APK)
```bash
# EAS Build (Empfohlen)
npx eas build --platform android

# Oder lokal mit Android Studio
npx expo run:android --variant release
```

## 🎯 Nächste Schritte

Empfohlene Erweiterungen:
- [ ] Offline-Modus mit Sync
- [ ] Push-Benachrichtigungen
- [ ] PDF-Quittungen in App
- [ ] Kamera für Schaden-Dokumentation
- [ ] Statistiken & Charts
- [ ] Signatur bei Übergabe
- [ ] Barcode-Scanner

## 💡 Tipps

- **Entwicklung:** Nutze Expo Go für schnelle Iteration
- **Testing:** Verwende Android Studio Emulator
- **Production:** Erstelle signierte APK mit EAS Build
- **Backend:** Stelle sicher, dass CORS richtig konfiguriert ist

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfe README.md für Details
2. Schaue in SCHNELLSTART.md
3. Teste Backend-Verbindung im Browser

---

**Entwickelt für:** Bierbrauerei Kirschenholz, Rickling
**Technologie:** React Native (Expo), Android & iOS kompatibel
**Lizenz:** Interner Gebrauch

Viel Erfolg mit deiner App! 🍺📱
