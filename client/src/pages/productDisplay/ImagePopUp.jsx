// import React, { useState } from "react";
// import { AiOutlineArrowLeft } from "react-icons/ai";
// import { useSwipeable } from "react-swipeable";
// import "./imagegallery.css";

// const ImagePopUp = ({ images }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isClosing, setIsClosing] = useState(false); // For closing animation

//   const openGallery = () => {
//     setIsOpen(true);
//    // setIsClosing(false);
//   };

//   const closeGallery = () => {
//    // setIsClosing(true); // Trigger closing animation
//     setTimeout(() => {
//       setIsOpen(false);
//       setIsClosing(false); // Reset state after animation completes
//     }, 300); // Match this duration to CSS animation
//   };

//   const handleThumbnailClick = (index) => {
//     setCurrentIndex(index);
//   };

//   const nextImage = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   // Swipe Handlers
//   const handlers = useSwipeable({
//     onSwipedLeft: nextImage,
//     onSwipedRight: prevImage,
//     preventScrollOnSwipe: true,
//     trackMouse: true,
//   });

//   return (
//     <>
//       <button className="open-gallery-btn" onClick={openGallery}>
//         Open Gallery
//       </button>

//       {isOpen && (
//         <div className={`popup ${isClosing ? "popup-close" : "popup-open"}`} >
//           <div className="popup-overlay" onClick={closeGallery}></div>
//           <div
//             className={`popup-content ${isClosing ? "popup-slide-out" : ""}`}
//           >
//             <button className="close-btn" onClick={closeGallery}>
//               <AiOutlineArrowLeft />
//             </button>
//             <div className="main-image-wrapper" {...handlers}>
//               <img
//                 key={currentIndex}
//                 src={images[currentIndex]}
//                 alt={`Image ${currentIndex + 1}`}
//                 className="main-image"
//               />
//             </div>
//             <div className="thumbnails">
//               {images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`Thumbnail ${index + 1}`}
//                   className={`thumbnail ${
//                     index === currentIndex ? "active" : ""
//                   }`}
//                   onClick={() => handleThumbnailClick(index)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ImagePopUp;
import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSwipeable } from "react-swipeable";
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
    }, 300); // Match this duration to CSS animation
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
              <img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="main-image"
              />
            </div>
            <div className="thumbnails">
              {images.map((image, index) => (
                <img
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
