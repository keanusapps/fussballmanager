Fußball Manager Pro
Entwickelt von Benjamin Maccagnan  
Powered by Google Gemini AI
---
Setup
1. Backend auf Render.com deployen
Dieses Repository auf GitHub pushen
Auf render.com einloggen und "New Web Service" erstellen
Repository verbinden
Konfiguration:
Root Directory: `backend`
Build Command: `npm install`
Start Command: `node server.js`
Environment: Node
Environment Variable setzen:
`GEMINI_API_KEY` = dein Google Gemini API Key
Service deployen und die URL kopieren (z.B. `https://fussballmanager-xyz.onrender.com`)
2. Google Gemini API Key holen
Kostenlos verfügbar unter: https://aistudio.google.com
Klicke auf "Get API Key"
Key wird NUR als Environment Variable im Backend gespeichert — verlässt niemals das Backend
3. Frontend konfigurieren
Öffne `frontend/index.html`
Ändere die `BACKEND_URL` Konstante am Anfang des Scripts:
```javascript
   var BACKEND_URL = 'https://dein-service.onrender.com';
   ```
Die Datei im Browser öffnen oder auf GitHub Pages / Netlify deployen
---
Features
Mehrere Ligen: Bundesliga, 2.Bundesliga, 3.Liga, Premier League, Championship, La Liga, Serie A, Ligue 1, und viele mehr
Ligasystem: Auf- und Abstieg zwischen Ligen
Transfermarkt: Kaufen, verkaufen und leihen mit realistischen Budgets
Pokalwettbewerbe: DFB-Pokal, FA Cup, Copa del Rey etc.
Europäische Wettbewerbe: Champions League, Europa League, Conference League
Animiertes Spielgeschehen: Canvas 2D mit bewegten Spielern und Ball
Elfmeterschießen: Interaktives Penalty-System
Kaderverwaltung: Aufstellung, Taktik, Auswechslungen
Mehrsprachig: Deutsch und Englisch
---
Technologie
Frontend: Vanilla HTML/CSS/JavaScript (keine Frameworks)
Backend: Node.js + Express
KI: Google Gemini 2.0 Flash (für Spielerdaten, Ligen, Fixtures)
Hosting: Render.com (Backend) + GitHub Pages / Netlify (Frontend)
---
Version
Version 1.0 | 2026
