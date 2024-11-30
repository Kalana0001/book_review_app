const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "KAlana#23",
  database: "book_app",
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1); 
  }
  console.log('Connected to database.');
});

async function logAction(userId, action) {
  console.log(`User ${userId ? userId : 'unknown'} performed action: ${action}`);
}

// User signup API
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const [insertResult] = await db.promise().query(query, [username, email, password]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User signin API
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [data] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (data.length === 0) {
      await logAction(null, `Login failed for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = data[0];
    if (password !== user.password) {
      await logAction(user.id, 'Login failed');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await logAction(user.id, 'Signed in');
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Error during signin:', err);
    res.status(500).json({ message: 'Error during sign-in' });
  }
});

// Add a book API
app.post('/api/review', async (req, res) => {
  const { book_id, user_id, rating, comment } = req.body;

  if (!book_id || !user_id || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const query = 'INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
    await db.promise().query(query, [book_id, user_id, rating, comment]);
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all API
app.get('/api/books', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM books');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all reviews with book titles API
app.get('/api/reviews', async (req, res) => {
  const query = `
    SELECT reviews.id, books.title AS book_title, reviews.comment, reviews.rating
    FROM reviews
    JOIN books ON reviews.book_id = books.id
  `;

  try {
    const [results] = await db.promise().query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
