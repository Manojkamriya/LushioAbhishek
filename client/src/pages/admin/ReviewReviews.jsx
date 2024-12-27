import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewReviews.css"; // Importing CSS for styling
import URLMediaRenderer from "../../components/URLMediaRenderer";
const ReviewReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch all reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Handle delete review
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (confirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/reviews/delete/${id}`); // Update with your actual delete endpoint
        setReviews((prev) => prev.filter((review) => review.id !== id));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  // Handle review selection
  const handleReview = (review) => {
    setSelectedReview(review);
  };

  // Handle approval of review
  const handleApprove = async () => {
    if (selectedReview) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/reviews/approve/${selectedReview.id}`, {
          approved: true,
        });
        setReviews((prev) =>
          prev.map((review) =>
            review.id === selectedReview.id ? { ...review, approved: true } : review
          )
        );
        setSelectedReview(null); // Clear selected review after approval
      } catch (error) {
        console.error("Error approving review:", error);
      }
    }
  };

  return (
    <div className="admin-review-container">
      <div className="admin-review-list">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`admin-review-card ${review.approved ? "review-approved" : ""}`}
          >
            <p>Review ID: {review.id}</p>
            <p>Rating: {review.rating}</p>
            <button onClick={() => handleReview(review)}>Review</button>
            
          </div>
        ))}
      </div>
      <div className="admin-review-details">
        {selectedReview && (
          <div>
            <h3>Review Details</h3>
            <p><strong>Quality:</strong> {selectedReview.quality}</p>
            <p><strong>Fit:</strong> {selectedReview.fit}</p>
            <p><strong>Review:</strong> {selectedReview.review}</p>
            <p><strong>Rating:</strong> {selectedReview.rating}</p>
            <p><strong>Media:</strong></p>
            <div className="admin-review-media">
              {selectedReview.media.map((url, index) => (
                // <div key={index}>
                //   {url.endsWith('.mp4') ? (
                //     <video src={url} controls />
                //   ) : (
                //     <img src={url} alt={`media-${index}`} />
                //   )}
                // </div>
                <div key={index}>  <URLMediaRenderer  src={url} alt={`media-${index}`}/> </div>
              
              ))}
            </div>
            <button onClick={handleApprove}>Approve</button>
            <button onClick={() => handleDelete(selectedReview.id)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewReviews;
