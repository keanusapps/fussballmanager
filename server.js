// Fußball Manager Pro - Backend Server
// Entwickelt von Benjamin Maccagnan
// Proxy-Server für Google Gemini AI API

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

var fetch;
try {
  fetch = require('node-fetch');
} catch(e) {
  fetch = globalThis.fetch;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));

// Rate Limiting: max 30 Requests pro Minute
var limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Zu viele Anfragen. Bitte warte eine Minute.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Health-Check Endpoint
app.get('/api/health', function(req, res) {
  res.json({
    status: 'ok',
    message: 'Fußball Manager Pro Backend läuft',
    version: '1.0',
    developer: 'Benjamin Maccagnan'
  });
});

// Haupt-Proxy Endpoint für Gemini AI
app.post('/api/gemini', async function(req, res) {
  var prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Kein Prompt angegeben' });
  }

  var apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY nicht konfiguriert' });
  }

  try {
    var geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

    var response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      var errText = await response.text();
      console.error('Gemini API Fehler:', response.status, errText);
      return res.status(502).json({ error: 'Gemini API nicht erreichbar', details: response.status });
    }

    var data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      return res.status(502).json({ error: 'Keine Antwort von Gemini erhalten' });
    }

    var rawText = data.candidates[0].content.parts[0].text;

    // JSON aus der Antwort extrahieren
    var parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch(parseError) {
      // Versuche JSON aus dem Text zu extrahieren
      var jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch(e2) {
          return res.status(502).json({ error: 'Ungültiges JSON von Gemini', raw: rawText.substring(0, 500) });
        }
      } else {
        return res.status(502).json({ error: 'Kein JSON in Gemini-Antwort', raw: rawText.substring(0, 500) });
      }
    }

    res.json({ data: parsed });

  } catch(err) {
    console.error('Server Fehler:', err);
    res.status(500).json({ error: 'Interner Serverfehler', message: err.message });
  }
});

// 404 Handler
app.use(function(req, res) {
  res.status(404).json({ error: 'Endpoint nicht gefunden' });
});

app.listen(PORT, function() {
  console.log('Fußball Manager Pro Backend läuft auf Port ' + PORT);
  console.log('Entwickelt von Benjamin Maccagnan');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Konfiguriert ✓' : 'FEHLT ✗');
});
