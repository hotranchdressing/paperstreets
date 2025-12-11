const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const Filter = require('bad-words');

const app = express();
const filter = new Filter();

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./video-platform.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create annotations table
  db.run(`
    CREATE TABLE IF NOT EXISTS annotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id TEXT NOT NULL,
      timestamp REAL NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create responses table
  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables initialized');
}

// GET all annotations grouped by video_id
app.get('/api/annotations', (req, res) => {
  db.all('SELECT * FROM annotations ORDER BY created_at ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Group by video_id
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.video_id]) {
        acc[row.video_id] = [];
      }
      acc[row.video_id].push({
        timestamp: row.timestamp,
        text: row.text,
        created: row.created_at
      });
      return acc;
    }, {});

    res.json(grouped);
  });
});

// POST new annotation
app.post('/api/annotations', (req, res) => {
  const { videoId, timestamp, text } = req.body;

  if (!videoId || timestamp === undefined || !text) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.run(
    'INSERT INTO annotations (video_id, timestamp, text) VALUES (?, ?, ?)',
    [videoId, timestamp, text],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID,
        videoId,
        timestamp,
        text
      });
    }
  );
});

// GET all responses grouped by video_id
app.get('/api/responses', (req, res) => {
  db.all('SELECT * FROM responses ORDER BY created_at ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Group by video_id
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.video_id]) {
        acc[row.video_id] = [];
      }
      acc[row.video_id].push({
        text: row.text,
        timestamp: row.created_at
      });
      return acc;
    }, {});

    res.json(grouped);
  });
});

// POST new response
app.post('/api/responses', (req, res) => {
  const { videoId, text } = req.body;

  if (!videoId || !text) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.run(
    'INSERT INTO responses (video_id, text) VALUES (?, ?)',
    [videoId, text],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID,
        videoId,
        text
      });
    }
  );
});

// POST moderate content
app.post('/api/moderate', (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ error: 'Missing text field' });
    return;
  }

  // Check if text contains profanity
  const isProfane = filter.isProfane(text);
  
  res.json({ safe: !isProfane });
});

// Optional: Get stats (useful for monitoring)
app.get('/api/stats', (req, res) => {
  db.get('SELECT COUNT(*) as total FROM annotations', [], (err, annotationCount) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.get('SELECT COUNT(*) as total FROM responses', [], (err2, responseCount) => {
      if (err2) {
        res.status(500).json({ error: err2.message });
        return;
      }

      res.json({
        totalAnnotations: annotationCount.total,
        totalResponses: responseCount.total
      });
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});