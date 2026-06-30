const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.get('/api/profile', (req, res) => {
  res.json({
    fullName: 'Dige Abba Ganama',
    nickname: 'Chairman',
    level: '400L'
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'All fields are required.'
    });
  }

  db.run(
    'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: 'Could not save message.'
        });
      }

      res.json({
        success: true,
        id: this.lastID
      });
    }
  );
});

app.get('*', (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      'public',
      'index.html'
    )
  );
});

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
