# Backend Integration Guide

Diese Anleitung erklärt, wie du dein bestehendes Node.js/Express Backend für die mobile App anpassen musst.

## 1. CORS aktivieren

Die mobile App muss vom Backend zugelassen werden. Füge CORS zu deinem Backend hinzu:

```javascript
const cors = require('cors');

app.use(cors({
  origin: '*', // Für Entwicklung - in Produktion spezifische Origins angeben
  credentials: true,
}));
```

## 2. JWT Authentication

Die App verwendet JWT-Token für die Authentifizierung. Beispiel Login-Endpoint:

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // User aus DB laden
    const user = await db.query(
      'SELECT * FROM users WHERE username = $1', 
      [username]
    );
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Ungültige Credentials' });
    }
    
    // Passwort prüfen
    const validPassword = await bcrypt.compare(
      password, 
      user.rows[0].password_hash
    );
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Ungültige Credentials' });
    }
    
    // JWT Token erstellen
    const token = jwt.sign(
      { userId: user.rows[0].id, username: user.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

## 3. Auth Middleware

Erstelle Middleware zum Prüfen des JWT-Tokens:

```javascript
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Kein Token vorhanden' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Ungültiger Token' });
    }
    req.user = user;
    next();
  });
}

// Verwenden bei geschützten Routen:
app.get('/api/customers', authenticateToken, async (req, res) => {
  // ... Route Handler
});
```

## 4. Benötigte API-Endpunkte

### Kunden

```javascript
// GET /api/customers - Alle Kunden (mit optionaler Suche)
app.get('/api/customers', authenticateToken, async (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM kunden';
  let params = [];
  
  if (search) {
    query += ' WHERE vorname ILIKE $1 OR nachname ILIKE $1 OR firma ILIKE $1';
    params = [`%${search}%`];
  }
  
  query += ' ORDER BY nachname, vorname';
  
  const result = await db.query(query, params);
  res.json(result.rows);
});

// GET /api/customers/:id - Ein Kunde
app.get('/api/customers/:id', authenticateToken, async (req, res) => {
  const result = await db.query(
    'SELECT * FROM kunden WHERE id = $1',
    [req.params.id]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Kunde nicht gefunden' });
  }
  
  res.json(result.rows[0]);
});

// POST /api/customers - Neuer Kunde
app.post('/api/customers', authenticateToken, async (req, res) => {
  const { vorname, nachname, firma, strasse, plz, ort, telefon, email } = req.body;
  
  const result = await db.query(
    `INSERT INTO kunden (vorname, nachname, firma, strasse, plz, ort, telefon, email)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [vorname, nachname, firma, strasse, plz, ort, telefon, email]
  );
  
  res.status(201).json(result.rows[0]);
});

// PUT /api/customers/:id - Kunde aktualisieren
app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  const { vorname, nachname, firma, strasse, plz, ort, telefon, email } = req.body;
  
  const result = await db.query(
    `UPDATE kunden 
     SET vorname=$1, nachname=$2, firma=$3, strasse=$4, plz=$5, ort=$6, telefon=$7, email=$8
     WHERE id=$9 RETURNING *`,
    [vorname, nachname, firma, strasse, plz, ort, telefon, email, req.params.id]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Kunde nicht gefunden' });
  }
  
  res.json(result.rows[0]);
});

// DELETE /api/customers/:id - Kunde löschen
app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  await db.query('DELETE FROM kunden WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});
```

### Verleihungen

```javascript
// GET /api/rentals - Alle Verleihungen (mit Filter)
app.get('/api/rentals', authenticateToken, async (req, res) => {
  const { status } = req.query; // 'active', 'returned', 'all'
  
  let query = `
    SELECT v.*, 
           k.vorname as kunde_vorname, 
           k.nachname as kunde_nachname,
           k.firma as kunde_firma,
           COUNT(vp.id) as anzahl_artikel
    FROM verleihungen v
    JOIN kunden k ON v.kunde_id = k.id
    LEFT JOIN verleihung_produkte vp ON v.id = vp.verleihung_id
  `;
  
  if (status === 'active') {
    query += ' WHERE v.tatsaechliche_rueckgabe IS NULL';
  } else if (status === 'returned') {
    query += ' WHERE v.tatsaechliche_rueckgabe IS NOT NULL';
  }
  
  query += ' GROUP BY v.id, k.id ORDER BY v.ausleihdatum DESC';
  
  const result = await db.query(query);
  res.json(result.rows);
});

// GET /api/rentals/:id - Eine Verleihung mit Details
app.get('/api/rentals/:id', authenticateToken, async (req, res) => {
  const rental = await db.query(
    `SELECT v.*, k.*
     FROM verleihungen v
     JOIN kunden k ON v.kunde_id = k.id
     WHERE v.id = $1`,
    [req.params.id]
  );
  
  if (rental.rows.length === 0) {
    return res.status(404).json({ error: 'Verleihung nicht gefunden' });
  }
  
  // Produkte laden
  const products = await db.query(
    `SELECT vp.*, p.name as produkt_name
     FROM verleihung_produkte vp
     JOIN produkte p ON vp.produkt_id = p.id
     WHERE vp.verleihung_id = $1`,
    [req.params.id]
  );
  
  res.json({
    ...rental.rows[0],
    produkte: products.rows,
  });
});

// POST /api/rentals - Neue Verleihung
app.post('/api/rentals', authenticateToken, async (req, res) => {
  const { kunde_id, ausleihdatum, rueckgabedatum, kaution, produkte } = req.body;
  
  // Transaction starten
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    // Verleihung erstellen
    const rental = await client.query(
      `INSERT INTO verleihungen (kunde_id, ausleihdatum, rueckgabedatum, kaution, gesamtbetrag)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [kunde_id, ausleihdatum, rueckgabedatum, kaution, 0]
    );
    
    let gesamtbetrag = 0;
    
    // Produkte hinzufügen
    for (const item of produkte) {
      const betrag = item.menge * item.preis_pro_einheit;
      gesamtbetrag += betrag;
      
      await client.query(
        `INSERT INTO verleihung_produkte (verleihung_id, produkt_id, menge, preis_pro_einheit)
         VALUES ($1, $2, $3, $4)`,
        [rental.rows[0].id, item.produkt_id, item.menge, item.preis_pro_einheit]
      );
    }
    
    // Gesamtbetrag aktualisieren
    await client.query(
      'UPDATE verleihungen SET gesamtbetrag = $1 WHERE id = $2',
      [gesamtbetrag, rental.rows[0].id]
    );
    
    await client.query('COMMIT');
    res.status(201).json({ ...rental.rows[0], gesamtbetrag });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// POST /api/rentals/:id/return - Verleihung zurückgeben
app.post('/api/rentals/:id/return', authenticateToken, async (req, res) => {
  const { tatsaechliche_rueckgabe, bemerkung } = req.body;
  
  const result = await db.query(
    `UPDATE verleihungen 
     SET tatsaechliche_rueckgabe = $1, bemerkung = $2
     WHERE id = $3 RETURNING *`,
    [tatsaechliche_rueckgabe, bemerkung, req.params.id]
  );
  
  res.json(result.rows[0]);
});
```

### Statistiken

```javascript
// GET /api/stats - Dashboard-Statistiken
app.get('/api/stats', authenticateToken, async (req, res) => {
  const activeRentals = await db.query(
    'SELECT COUNT(*) FROM verleihungen WHERE tatsaechliche_rueckgabe IS NULL'
  );
  
  const totalCustomers = await db.query('SELECT COUNT(*) FROM kunden');
  
  const monthlyRevenue = await db.query(
    `SELECT COALESCE(SUM(gesamtbetrag), 0) as revenue
     FROM verleihungen 
     WHERE EXTRACT(MONTH FROM ausleihdatum) = EXTRACT(MONTH FROM CURRENT_DATE)
     AND EXTRACT(YEAR FROM ausleihdatum) = EXTRACT(YEAR FROM CURRENT_DATE)`
  );
  
  res.json({
    activeRentals: parseInt(activeRentals.rows[0].count),
    totalCustomers: parseInt(totalCustomers.rows[0].count),
    monthlyRevenue: parseFloat(monthlyRevenue.rows[0].revenue),
  });
});
```

## 5. Environment Variables

Erstelle eine `.env` Datei:

```
JWT_SECRET=dein-sehr-sicheres-geheimnis-hier
DATABASE_URL=postgresql://user:password@localhost:5432/brauerei_db
PORT=3000
```

## 6. Package.json Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1"
  }
}
```

## 7. Testen der API

Teste die Endpoints mit curl oder Postman:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Kunden abrufen (mit Token)
curl http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
