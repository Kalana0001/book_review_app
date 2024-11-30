import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './BooksList.css';
import Reviews from '../Reviews/Reviews';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [newReview, setNewReview] = useState({
    book_id: '',
    user_id: '',
    rating: '',
    comment: '',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  useEffect(() => {
    if (user) {
      setNewReview((prevState) => ({
        ...prevState,
        user_id: user.id,  
      }));
    }

    axios.get('http://localhost:4000/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, [user]);

  const handleLogout = () => {
    navigate('/signin');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending review:', newReview);  
   
    if (!newReview.book_id || !newReview.rating || !newReview.comment) {
      console.error('All fields are required');
      return;
    }

    axios.post('http://localhost:4000/api/review', newReview)
      .then(response => {
        console.log('Review added:', response.data);
        setNewReview({
          book_id: '',
          user_id: user.id, 
          rating: '',
          comment: '',
        });
      })
      .catch(error => {
        console.error('Error adding review:', error.response || error);
      });
  };

  return (
    <div className="books">
      <header className="top-bar">
        {user ? (
          <>
            <span className="user-greeting">Welcome, {user.username}</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span className="user-greeting">Welcome, Guest</span>
        )}
      </header>

      <h1>Books List</h1>
      <div className="book_cards">
        {books.map(book => (
          <div className="book_card" key={book.id}>
            <span className="single-img img-one">
              <img src={book.image} alt={book.title} className="img" />
              <h3 className="book_title">{book.title}</h3>
              <div className="book_content">
                <p className="book_author">Author: {book.author}</p>
                <p className="book_genre">Genre: {book.genre}</p>
                <p className="book_date">Published Date: {book.published_date.split('T')[0]}</p>
                <p className="book_description">Description: {book.description}</p>
              </div>
            </span>
          </div>
        ))}
      </div>

      <h2>Add a New Review</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <select
          name="book_id"
          value={newReview.book_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a Book</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="user_id"
          value={newReview.user_id}
          readOnly
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={handleInputChange}
          required
          min="1"
          max="5"
        />
        <textarea
          name="comment"
          placeholder="Your Comment"
          value={newReview.comment}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="add-review-button">Add Review</button>
      </form>


        
      <Reviews />
    </div>
  );
};

export default BooksList;
