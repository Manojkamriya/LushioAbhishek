import React from "react";
import './ReviewCard.css'; // Import CSS for styling
import Rating from '@mui/material/Rating';
// Sample review component
const ReviewCard = ({ username, rating, review, dateTime }) => {
  // Render star ratings based on the rating value
  const renderStars = () => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <>
   
    <div className="review-card">
      <div className="review-header">
        <h3>{username}</h3>
        <div className="rating">{renderStars()}</div>
      </div>
      <p className="review-text">{review}</p>
      <div className="review-footer">
        <span className="review-date">{new Date(dateTime).toLocaleString()}</span>
      </div>
    </div>
    </>
  );
};

// Main component rendering a list of reviews
const ReviewsList = () => {
    const rating = 4.8;
  const reviews = [
    {
      username: "John Doe",
      rating: 4,
      review: "Great product! Works as expected.",
      dateTime: "2024-09-15T10:30:00",
    },
    // {
    //   username: "Jane Smith",
    //   rating: 5,
    //   review: "Absolutely loved it! Highly recommend.",
    //   dateTime: "2024-09-16T14:15:00",
    // },
    // {
    //   username: "Mark Wilson",
    //   rating: 3,
    //   review: "It's okay, could be better.",
    //   dateTime: "2024-09-14T09:45:00",
    // },
  ];

  return (
    <div className="reviews-list">
      {reviews.map((review, index) => (
        <ReviewCard
          key={index}
          username={review.username}
          rating={review.rating}
          review={review.review}
          dateTime={review.dateTime}
        />
      ))}
      {/* <p>hi there</p>
      <div className="review-card">
      <div className="review-header">
        <h3>Manoj Kamriya</h3>
        <div className="rating">******</div>
      </div>
      <p className="review-text">Awesome</p>
      <div className="review-footer">
        <span className="review-date">2024-09-14T09:45:00</span>
      </div>
    </div>
     */}
     <div className="rew-wrpr">
      {/* MUI Rating component */}
      <Rating
        name="product-rating"
        value={rating}
        precision={0.1}  // Allow fractional ratings
        readOnly        // Disable user interaction if the rating is just for display
      />

      <p className="review">jjsjsjsnsn bsbsnjsjss jjsjsjs test test</p>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <p className="usr-name">Prithvika kumar</p>
        <img
          className="thumbsIcon"
          src="https://images.bewakoof.com/web/ic-up-mb---vote.svg"
          alt="Thumbs Up"
        />
      </div>

      <p className="review-time">2024-09-12</p>
    </div>
    </div>
  );
};

export default ReviewsList;
