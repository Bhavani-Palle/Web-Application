const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('./db/users.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
  // Create table if not exists
  db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            age INTEGER,
            dob DATE
          )`);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/submit', (req, res) => {
  const { name, email, age, dob } = req.body;

  // Insert data into database
  const sql = `INSERT INTO users (name, email, age, dob) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, email, age, dob], function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted with id ${this.lastID}`);
    res.redirect('/display');
  });
});

app.get('/display', (req, res) => {
  // Retrieve data from database
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
