const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "KAlana#23",
  database: "book_app",
});

async function logAction(userId, action) {
  console.log(`User ${userId ? userId : 'unknown'} performed action: ${action}`);
}

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Received signup request:', req.body);

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

    console.log('User registered successfully:', insertResult);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  console.log('Received signin request:', req.body);

  try {
    const [data] = await db.promise().query(sql, [email]);

    if (data.length > 0) {
      const user = data[0];

      console.log("User fetched from DB:", user);

      if (password !== user.password) {
        await logAction(user.id, "Login Failed");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      await logAction(user.id, "Signed in");
      res.json({ message: "Login Successful", user: { id: user.id, username: user.username, email: user.email } });
    } else {
      await logAction(null, `Login Failed for email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error during signin:", err);
    res.status(500).json({ message: "Error during sign-in" });
  }
});


app.post('/api/review', (req, res) => {
  const { book_id, user_id, rating, comment } = req.body;


  if (!book_id || !user_id || !rating || !comment) {
    return res.status(400).json({ message: 'User ID, book ID, and rating are required' });
  }


  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }


  const query = `
    INSERT INTO reviews (book_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [book_id, user_id, rating, comment], (err, result) => {
    if (err) {
      console.error('Error inserting review:', err);
      return res.status(500).json({ message: 'Error adding review' });
    }
    res.status(200).json({ message: 'Review added successfully' });
  });
});



app.get('/api/books', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM books');
    return res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching books:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/reviews', (req, res) => {
  const query = `
    SELECT reviews.id, books.title, reviews.comment, reviews.rating
    FROM reviews
    JOIN books ON reviews.book_id = books.id`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ message: 'Error fetching reviews', error: err });
    }
    res.status(200).json(results);
  });
});


db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
