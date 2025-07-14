import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
const db = new sqlite3.Database('./users.db');
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Create users table if it doesn't exist
// id, email (unique), password_hash

// Run only once at server start
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
)`);

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (row) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, password_hash], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating user.' });
      }
      res.status(201).json({ message: 'User created successfully.' });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.json({ message: 'Login successful.' });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 

// DEV ONLY: List all users (do not use in production)
app.get('/users', (req, res) => {
    db.all('SELECT id, email FROM users', [], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching users.' });
      res.json(rows);
    });
  });