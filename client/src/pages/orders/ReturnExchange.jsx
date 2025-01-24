import React, { useState } from "react";
import "./ReturnExchange.css";

const ReturnExchange = ({canReturn}) => {
  const [selectedOption, setSelectedOption] = useState("return"); // default selected
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [otherReason, setOtherReason] = useState("");
 

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setSelectedReason("");
    setSelectedSize("");
    setOtherReason(""); // Clear other reason when switching options
  };

  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleReturn = () => {
    if (selectedReason === "other" && otherReason) {
      alert(`Return initiated for reason: ${otherReason}`);
    } else if (selectedReason) {
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
    {/* Conditional rendering of Return option */}
    <div className="return-exchange-options">
      <label className="radio-label">
        <input
          type="radio"
          name="returnExchange"
          value="return"
          checked={selectedOption === "return"}
          onChange={handleOptionChange}
          disabled={!canReturn} // Disable the "Return" option if returns are not allowed
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
  
    {/* Display error message when returns are not allowed */}
    {canReturn && (
      <div className="return-exchange-options">
        <span className="error-message">Returns are not allowed at the moment.</span>
      </div>
    )}
  
    {/* Conditional Content for "Return" option */}
    {selectedOption === "return" && !canReturn && (
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
  
        {/* Textbox for "Other" Reason */}
        {selectedReason === "other" && (
          <div className="other-reason">
            <label htmlFor="otherReasonInput">Please specify:</label>
            <textarea
              id="otherReasonInput"
              className="other-reason-input"
              value={otherReason}
              onChange={handleOtherReasonChange}
            />
          </div>
        )}
        <button className="return-button" onClick={handleReturn}>
          Initiate Return
        </button>
      </div>
    )}
  
    {/* Conditional Content for "Exchange" option */}
    {selectedOption === "exchange" && (
      <div className="exchange-section">
        <h3>Select Size for Exchange:</h3>
        <div className="size-options">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              className={`size-button ${selectedSize === size ? "selected-size" : ""}`}
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
