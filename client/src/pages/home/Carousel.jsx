import { useEffect, useState, useRef, useCallback } from "react";
import "./Home.css";
function Carousel({ images }) {
  const [current, setCurrent] = useState(0);
  const timeOutRef = useRef(null);

  const slideRight = useCallback(() => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // useEffect to handle the timeout
  useEffect(() => {
    timeOutRef.current = setTimeout(slideRight, 9000);

    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, [slideRight]);

  const slideLeft = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  return (
    <div className="carousel">
      <div className="carousel_wrapper">
        {images.map((image, index) => {
          return (
            <div
              key={index}
              className={
                index === current
                  ? "carousel_card carousel_card-active"
                  : "carousel_card"
              }
            >
              <img className="card_image" src={image.image} alt="" />
            </div>
          );
        })}
        <div className="carousel_arrow_left" onClick={slideLeft}>
          <p>&lsaquo;</p>
        </div>
        {/* <button className="carousel-button">SHOP NOW</button> */}
        <div className="carousel_arrow_right" onClick={slideRight}>
          <p>&rsaquo;</p>
        </div>
        <div className="carousel_pagination">
          {images.map((_, index) => {
            return (
              <div
                key={index}
                className={
                  index === current
                    ? "pagination_dot pagination_dot-active"
                    : "pagination_dot"
                }
                onClick={() => setCurrent(index)}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Carousel;
