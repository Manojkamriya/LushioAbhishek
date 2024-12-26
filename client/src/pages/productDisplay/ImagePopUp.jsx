import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSwipeable } from "react-swipeable";
import URLMediaRenderer from "../../components/URLMediaRenderer";
import "./ImagePopUp.css";

const ImagePopUp = ({
  images,
  isOpen,            // Passed prop for open state
  closeGallery,      // Passed prop for closing function
  openGallery        // Passed prop for opening function
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false); // For closing animation

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Swipe Handlers
  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Handle closing with animation
  const handleCloseGallery = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      closeGallery(); // Call the passed close function after animation
      setIsClosing(false); // Reset state after animation completes
    }, 200); // Match this duration to CSS animation
    document.body.classList.remove("no-scroll");
  };

  return (
    <>
      {isOpen && (
        <div className={`popup ${isClosing ? "popup-close" : "popup-open"}`} >
          <div className="popup-overlay" onClick={handleCloseGallery}></div>
          <div
            className={`popup-content ${isClosing ? "popup-slide-out" : ""}`}
          >
            <button className="close-btn" onClick={handleCloseGallery}>
              <AiOutlineArrowLeft />
            </button>
            <div className="main-image-wrapper" {...handlers}>
             
              <URLMediaRenderer
               key={currentIndex}
               src={images[currentIndex]}
               className="main-image"
              />
            </div>
            <div className="thumbnails">
              {images.map((image, index) => (
               
                <URLMediaRenderer
                key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${
                    index === currentIndex ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
               />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePopUp;
