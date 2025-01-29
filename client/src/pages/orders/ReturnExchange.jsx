import React, { useState,useContext } from "react";
import "./Accordion.css";
import axios from "axios"
import "./ReturnExchange.css";
import { UserContext } from "../../components/context/UserContext";
const ReturnExchange = ({ title, canReturn,identifier,orderId,product }) => {
  const [state, setState] = useState({
    isOpen: false,
    selectedOption: "exchange",
    selectedReason: "",
    selectedSize: "",
    otherReason: "",
  });
 const { user } = useContext(UserContext);
  const toggleAccordion = () => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const handleOptionChange = (e) => {
    const selectedValue = e.target.value;
    console.log(product);
    setState((prev) => ({
      ...prev,
      selectedOption: selectedValue,
      selectedSize: selectedValue === "exchange" ? "" : prev.selectedSize,
      selectedReason: selectedValue === "return" ? "" : prev.selectedReason,
      otherReason: "",
    }));
  };

  const handleReasonChange = (e) => {
    setState((prev) => ({ ...prev, selectedReason: e.target.value }));
  };

  const handleOtherReasonChange = (e) => {
    setState((prev) => ({ ...prev, otherReason: e.target.value }));
  };

  const handleSizeSelect = (size) => {
    setState((prev) => ({ ...prev, selectedSize: size }));
  };

 
  const handleReturn = async() => {
    if (state.selectedReason === "other" && !state.otherReason.trim()) {
      alert("Please specify the reason for return.");
      return;
    }
  else{
    try {
      const requestBody = {
        uid: user?.uid,
        oid: orderId,
        returnItems: {
          [product.productDetails.id]: { 
            units: product.quantity, 
            return_reason:  state.selectedReason === "other" ? state.otherReason : state.selectedReason,
          },
        },
      };
  console.log(requestBody);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/returns/create`, requestBody);
    
    } catch (error) {
      console.error("Error submitting return request:", error);
   
    }
  }
 
  
  
  };
  
  const handleExchange = () => {
    if (state.selectedSize) {
      alert(`Exchange initiated for size: ${state.selectedSize}`);
    } else {
      alert("Please select a size for exchange.");
    }
  };

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span className={`accordion-icon ${state.isOpen ? "open" : ""}`}>
          {state.isOpen ? "-" : "+"}
        </span>
      </div>
      <div className={`accordion-content ${state.isOpen ? "expanded" : ""}`}>
        <div className="return-exchange-container">
          <div className="return-exchange-options">
            <label className="radio-label">
              <input
                type="radio"
                name={`returnExchange-${identifier}`}
                value="exchange"
                checked={state.selectedOption === "exchange"}
                onChange={handleOptionChange}
              />
              Exchange
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name={`returnExchange-${identifier}`}
                value="return"
                checked={state.selectedOption === "return"}
                onChange={handleOptionChange}
              />
              Return
            </label>
          </div>

          {state.selectedOption === "return" && (
            <div className="return-section">
              {!canReturn ? (
                <span className="error-message">Returns are not allowed at the moment.</span>
              ) : (
                <>
                  <h3>Select Reason for Return:</h3>
                  <div className="return-reasons">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={`returnReason-${identifier}`}
                        value="size difference"
                        checked={state.selectedReason === "size difference"}
                        onChange={handleReasonChange}
                      />
                      Size Difference
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={`returnReason-${identifier}`}
                        value="quality issue"
                        checked={state.selectedReason === "quality issue"}
                        onChange={handleReasonChange}
                      />
                      Quality Issue
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={`returnReason-${identifier}`}
                        value="other"
                        checked={state.selectedReason === "other"}
                        onChange={handleReasonChange}
                      />
                      Other
                    </label>
                  </div>
                  {state.selectedReason === "other" && (
                    <div className="other-reason">
                      <label htmlFor={`otherReasonInput-${identifier}`}>Please specify:</label>
                      <textarea
                        id={`otherReasonInput-${identifier}`}
                        className="other-reason-input"
                        value={state.otherReason}
                        onChange={handleOtherReasonChange}
                      />
                    </div>
                  )}
                  <button className="return-button" onClick={handleReturn}>
                    Initiate Return
                  </button>
                </>
              )}
            </div>
          )}

          {state.selectedOption === "exchange" && (
            <div className="exchange-section">
              <h3>Select Size for Exchange:</h3>
              <div className="size-options">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className={`size-button ${state.selectedSize === size ? "selected-size" : ""}`}
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
      </div>
    </div>
  );
};

export default ReturnExchange;
