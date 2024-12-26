import React from "react";
import "./SingleStar.css";

const SingleStar = ({ review }) => {
  const fillPercentage = Math.min(Math.max(review / 5, 0), 1) * 100;
  return (
    <div className="single-star-container">
      <div className="single-star-background">★</div>
      <div
        className="single-star-fill"
        style={{ width: `${fillPercentage * 0.8}%` }}
      >
        ★
      </div>
    </div>
  );
};

export default SingleStar;
