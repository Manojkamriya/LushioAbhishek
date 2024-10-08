import React from "react";
import './ReviewCard.css'; // Import CSS for styling
import Rating from '@mui/material/Rating';

// Review card component
const ReviewCard = ({ username, rating, review, dateTime }) => (
  <div className="review-card">
    <div className="review-header">
      <h3>{username}</h3>
      {/* Added precision for fractional ratings */}
      <Rating value={rating} precision={0.1} readOnly />
    </div>
    <p className="review-text">{review}</p>
    <div className="review-footer">
      <span className="review-date">{new Date(dateTime).toLocaleString()}</span>
    </div>
  </div>
);

// Main component rendering a list of reviews
const ReviewsList = () => {
  const reviews = [
    { username: "Manoj Kamriya", rating: 4.5, review: "Great product!", dateTime: "2024-09-15T10:30:00" },
    { username: "Pranit Mandoi", rating: 4.7, review: "Excellent quality!", dateTime: "2024-09-14T12:15:00" },
  ];

  return (
    <div className="reviews-list">
      {reviews.map((review, index) => (
        <ReviewCard key={index} {...review} />
      ))}
    </div>
  );
};

export default ReviewsList;
