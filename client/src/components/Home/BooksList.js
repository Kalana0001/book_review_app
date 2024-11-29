import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BooksList.css'; // Import the CSS file

const BooksList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  return (
    <div className="books">
      <h1>Books List</h1>
      <div className="cards">
        {books.map(book => (
          <div className="card" key={book.id}>
            <span class="single-img img-one">
            <img src={book.image} alt={book.title} className="img" />
            <div className="content">
              <h3 className="title">Book Name:{book.title}</h3>
              <p className="author">Author:{book.author}</p>
              <p className="genre">Genre:{book.genre}</p>
              <p className="date">Published Date:{book.published_date.split('T')[0]}</p>
              <p className="discription">Discription:{book.description}</p>
            </div>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksList;
