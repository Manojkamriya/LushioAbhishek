import React from "react";
// import './Review.css'; // Assuming you're using an external CSS file

const Review = () => {
  return (
    <div className="rew-wrpr">
      <div className="usr-rating">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            className="rating-star"
            src="https://images.bewakoof.com/web/ic-star-mb-filled.svg"
            alt="Rating Star"
          />
        ))}
      </div>

      <p className="review">Great product! Works as expected.</p>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <p className="usr-name">Prithvika</p>
        {/* <img
          className="thumbsIcon"
          src="https://images.bewakoof.com/web/ic-p-mb---vote.svg"
          alt="Thumbs Up"
        /> */}
      </div>

      <p className="review-time">9/15/2024, 10:30:00 AM</p>
      
    </div>
  );
};

export default Review;
