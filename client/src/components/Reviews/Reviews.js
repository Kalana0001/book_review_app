import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]); 

  useEffect(() => {
   
    axios.get("http://localhost:4000/api/reviews") 
      .then((response) => {
        setReviews(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []); 

  return (
    <div className="section__container">
      <div className="header">
        <p>TESTIMONIALS</p>
        <h1>What our clients say about us.</h1>
      </div>
      <div className="testimonials__grid">
        {reviews.map((review) => (
          <div className="card" key={review.id}>
            <span><i className="ri-double-quotes-l"></i></span>
            <p><strong>Book Name:</strong> {review.title}</p> 
            <p>{review.comment}</p>
            <hr />
            <p className="name">{review.user_name}</p>
            <p className="rating">Rating: {review.rating} / 5</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
