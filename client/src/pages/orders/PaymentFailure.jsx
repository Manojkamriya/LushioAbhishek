import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi"; // For failure icon
import "./PaymentFailed.css";

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate("/payment"); // Replace with your payment route
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="payment-failed-container">
      <div className="payment-failed-card">
        <div className="icon-container">
          <FiAlertCircle className="failure-icon" />
        </div>
        <h1 className="payment-failed-title">Payment Failed</h1>
        <p className="payment-failed-message">
          Oops! Something went wrong with your payment. Please try again.
        </p>
        <div className="button-container">
          <button
            className="payment-failed-btn try-again-btn"
            onClick={handleTryAgain}
          >
            Try Again
          </button>
          <button
            className="payment-failed-btn home-btn"
            onClick={handleGoHome}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
