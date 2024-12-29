import React from "react";
import "./HomeWishList.css";
import { FaArrowRight } from "react-icons/fa";

const HomeWishlist = () => {
  const items = Array.from({ length: 10 }, (_, index) => `Item ${index + 1}`);
  const handleShowMore = () => {
    alert("Show more clicked! Implement further navigation or functionality.");
  };
  return (
    <div className="home-wishlist-wrapper">
         <div className="home-wishlist-name">User's Wishlist</div>
    <div className="home-wishlist-container">
       
      {items.map((item, index) => (
        <div key={index} className="wishlist-item">
          {item}
        </div>
      ))}
       <div className="show-more" onClick={handleShowMore}>
        <span className="show-more-text">Show More</span>
        <FaArrowRight className="arrow-icon" />
      </div>
    </div>
    </div>
  );
};

export default HomeWishlist;
