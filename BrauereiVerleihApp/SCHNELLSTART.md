# 🚀 Schnellstart-Anleitung

## Schritt 1: Backend-URL einstellen

Öffne die Datei: `src/utils/config.js`

```javascript
// WICHTIG: Ersetze diese URL mit deiner tatsächlichen Backend-URL
export const API_BASE_URL = 'http://DEINE-IP-ADRESSE:3000/api';
```

**Wie finde ich meine IP-Adresse?**

Windows:
```cmd
ipconfig
# Suche nach "IPv4-Adresse" (z.B. 192.168.1.100)
```

Linux/Mac:
```bash
ifconfig
# oder
ip addr show
```

Beispiel: Wenn deine IP `192.168.1.100` ist:
```javascript
export const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

## Schritt 2: Dependencies installieren

```bash
cd BrauereiVerleihApp
npm install
```

## Schritt 3: App testen

### Variante A: Mit Expo Go (Empfohlen für erste Tests)

1. **Installiere Expo Go auf deinem Handy**
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. **Starte die App auf deinem Rechner**
   ```bash
   npm start
   ```

3. **Verbinde dein Handy**
   - Android: Scanne den QR-Code mit der Expo Go App
   - iOS: Scanne mit der Kamera-App, öffne dann in Expo Go

4. **Wichtig:** Handy und Rechner müssen im gleichen WLAN sein!

### Variante B: Android Studio (Für echte APK-Datei)

1. **Installiere Android Studio**
   - Download: https://developer.android.com/studio

2. **Richte einen Emulator ein oder verbinde dein Handy via USB**

3. **Starte die App**
   ```bash
   npm run android
   ```

## Häufige Probleme

### Problem: "Network request failed"

**Lösung:**
1. Prüfe ob dein Backend läuft
2. Prüfe die IP-Adresse in `config.js`
3. Stelle sicher, dass Firewall Port 3000 nicht blockiert
4. Teste Backend im Browser: `http://DEINE-IP:3000/api/products`

### Problem: Expo Go findet den Server nicht

**Lösung:**
1. Stelle sicher, dass Handy und Rechner im gleichen WLAN sind
2. Versuche Tunnel-Modus: `npm start -- --tunnel`
3. Deaktiviere VPN falls aktiv

### Problem: App stürzt beim Start ab

**Lösung:**
```bash
# Cache löschen
npm start -- --reset-cache

# Oder komplett neu installieren
rm -rf node_modules
npm install
```

## Nächste Schritte

Nach erfolgreichem Test:

1. **Anpassen der Firmendetails**
   - Öffne `src/utils/config.js`
   - Passe `COMPANY_NAME` an falls gewünscht

2. **Backend API anpassen**
   - Falls deine API andere Endpunkte hat, passe `src/services/api.js` an

3. **Design anpassen**
   - Hauptfarbe ändern: Suche nach `#8B4513` in allen Style-Dateien
   - Icons ändern: Siehe https://icons.expo.fyi/

4. **Production Build erstellen**
   ```bash
   # Für Android APK
   npx eas build --platform android
   ```

## Support

Bei Fragen:
1. Schaue in die README.md für Details
2. Prüfe die Konsolen-Ausgabe für Fehlermeldungen
3. Teste Backend-Verbindung im Browser

## Checkliste vor dem ersten Start

- [ ] Node.js installiert (v16+)
- [ ] Backend läuft auf deinem Server
- [ ] Backend-URL in config.js eingetragen
- [ ] Firewall lässt Port 3000 durch
- [ ] `npm install` ausgeführt
- [ ] Expo Go App auf dem Handy installiert (für Variante A)
- [ ] Handy und Rechner im gleichen WLAN (für Variante A)

Viel Erfolg! 🍺
