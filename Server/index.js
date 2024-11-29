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

  // API to get all books
  app.get('/api/books', (req, res) => {
    
    db.query('SELECT * FROM books', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      return res.status(200).json(results); 
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