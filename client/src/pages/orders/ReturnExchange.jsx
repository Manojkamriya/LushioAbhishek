import React, { useState } from "react";
import "./ReturnExchange.css"
const ReturnExchange = () => {
  const [selectedOption, setSelectedOption] = useState("return"); // default selected
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setSelectedReason("");
    setSelectedSize("");
  };

  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleReturn = () => {
    if (selectedReason) {
      alert(`Return initiated for reason: ${selectedReason}`);
    } else {
      alert("Please select a reason for return.");
    }
  };

  const handleExchange = () => {
    if (selectedSize) {
      alert(`Exchange initiated for size: ${selectedSize}`);
    } else {
      alert("Please select a size for exchange.");
    }
  };

  return (
    <div className="return-exchange-container">


      {/* Radio Buttons for Return and Exchange */}
      <div className="return-exchange-options">
        <label className="radio-label">
          <input
            type="radio"
            name="returnExchange"
            value="return"
            checked={selectedOption === "return"}
            onChange={handleOptionChange}
          />
          Return
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="returnExchange"
            value="exchange"
            checked={selectedOption === "exchange"}
            onChange={handleOptionChange}
          />
          Exchange
        </label>
      </div>

      {/* Conditional Content */}
      {selectedOption === "return" && (
        <div className="return-section">
          <h3>Select Reason for Return:</h3>
          <div className="return-reasons">
            <label className="radio-label">
              <input
                type="radio"
                name="returnReason"
                value="size difference"
                onChange={handleReasonChange}
              />
              Size Difference
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="returnReason"
                value="quality issue"
                onChange={handleReasonChange}
              />
              Quality Issue
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="returnReason"
                value="other"
                onChange={handleReasonChange}
              />
              Other
            </label>
          </div>
          <button className="return-button" onClick={handleReturn}>
            Initiate Return
          </button>
        </div>
      )}

      {selectedOption === "exchange" && (
        <div className="exchange-section">
          <h3>Select Size for Exchange:</h3>
          <div className="size-options">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={`size-button ${
                  selectedSize === size ? "selected-size" : ""
                }`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <button className="exchange-button" onClick={handleExchange}>
            Generate Exchange
          </button>
        </div>
      )}
    </div>
  );
};

export default ReturnExchange;
