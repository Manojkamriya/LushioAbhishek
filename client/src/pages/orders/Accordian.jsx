import React, { useState } from "react";
import "./Accordion.css"; // Include the CSS file for styling
import ReturnExchange from "./ReturnExchange";
const Accordion = ({ title, canReturn }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span className={`accordion-icon ${isOpen ? "open" : ""}`}>
          {isOpen ? "-" : "+"}
        </span>
      </div>
      <div
        className={`accordion-content ${isOpen ? "expanded" : ""}`}
        style={{ maxHeight: isOpen ? "1000px" : "0" }}
      >
     
        <ReturnExchange canReturn={canReturn}/>
      </div>
    </div>
  );
};

export default Accordion;
