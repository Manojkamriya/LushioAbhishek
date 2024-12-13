import React from "react";
import "./ResponsivePopUp.css";

const ResponsivePopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Do not render anything if not open

  return (
    <div className="responsive-popup-overlay" onClick={onClose}>
      <div
        className="responsive-popup-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button className="responsive-close-popup-button" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default ResponsivePopup;

