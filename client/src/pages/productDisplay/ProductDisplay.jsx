import React, { useState } from "react";
import "./product.css";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"
import './ReviewCard.css';
import Rating from '@mui/material/Rating';
import { useParams } from "react-router-dom";
import all_product from "../../components/context/assets/all_product";

const ReviewCard = ({ username, rating, review, dateTime }) => (
  <div className="review-card">
    <div className="review-header">
      <h3>{username}</h3>
      <Rating value={rating} precision={0.1} readOnly />
    </div>
    <p className="review-text">{review}</p>
    <div className="review-footer">
      <span className="review-date">{new Date(dateTime).toLocaleString()}</span>
    </div>
  </div>
);

function ProductDisplay() {
  const { productID } = useParams(); // Get the product ID from the URL
  const product = all_product.find((e) => e.id === Number(productID)); // Find the product by ID

  // Fallback if product not found
  // if (!product) {
  //   return <div>Product not found</div>;
  // }

  const [image, setImage] = useState("./LushioFitness/Images/p1_product.png");
  const [size, setSize] = useState("S");
  const [height, setHeight] = useState("");
  const [color, setColor] = useState("");
  const navigate = useNavigate();

  const sizes = ["XS", "S", "M", "L", "XL"];
  const heights = ["5.4 feet or more", "below 5.4 feet"];
  const colors = ["#00FFFF","#0091FF","#5424A0","#C44E0E","#C40E97"];
  const reviews = [
    { username: "Manoj Kamriya", rating: 4.5, review: "Great product!", dateTime: "2024-09-15T10:30:00" },
    { username: "Pranit Mandoi", rating: 4.7, review: "Excellent quality!", dateTime: "2024-09-14T12:15:00" },
  ];

  const images = [
    "./LushioFitness/Images/p1_product.png",
    "./LushioFitness/Images/p1_product_i2.png",
    "./LushioFitness/Images/p1_product_i3.png",
    "./LushioFitness/Images/p1_product_i4.png",
    "./LushioFitness/Images/p1_product_i4.png"
  ];

  return (
    <div className="productDisplay">
      <div className="productDisplay-left">
        <div className="productDisplay-img-list">
          {images.map((img, index) => (
            <img 
              key={index}
              onClick={() => setImage(img)}
              className={img === image ? "size-selected" : "size-not-selected"}
              src={img}
              alt=""
            />
          ))}
        </div>
        <div className="productDispaly-img">
          <img className="productDisplay-main-img" src={image} alt="" />
        </div>
      </div>
      <div className="productDisplay-right">
        <h1>{product.name}</h1>
        <div className="productDisplay-right-stars">
          <span>
            <p>{product.rating}</p>
            <img src="./LushioFitness/Images/icons/star.png" alt="icon" />
          </span>
          <p>(122 reviews)</p>
        </div>
        <div className="productDisplay-right-prices">
          <div className="productDisplay-right-price-new">{product.new_price}</div>
          <div className="productDisplay-right-price-old">{product.old_price}</div>
          <div className="productDisplay-right-price-discount">20% OFF</div>
        </div>
        <p className="tax-statement">Inclusive of all taxes</p>
        <div className="productDisplay-right-discription">
          A lightweight, Usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment
        </div>
        <div className="productDisplay-right-size">
          <h1>Select Height</h1>
          <div className="women-size">
            {heights.map((item) => (
              <button
                key={item}
                onClick={() => setHeight(item)}
                className={item === height ? "height-selected" : "height-not-selected"}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="productDisplay-right-size">
          <h1>Select Color</h1>
          <div className="productDisplay-right-sizes select-color">
            {colors.map((clr, i) => (
              <div
                onClick={() => setColor(clr)}
                key={i}
                className={clr === color ? "size-selected outer-color" : "size-not-selected outer-color"}
              >
                <div style={{background: clr}}></div>
              </div>
            ))}
          </div>
        </div>
        <div className="productDisplay-right-size">
          <h1>Select Size</h1>
          <div className="productDisplay-right-sizes">
            {sizes.map((item) => (
              <button
                key={item}
                onClick={() => setSize(item)}
                className={item === size ? "size-selected" : "size-not-selected"}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="button-container">
          <button>ADD TO CART</button>
          <button>WISHLIST</button>
        </div>
        <button className="buy-button" onClick={() => navigate("/place-order")}>BUY NOW</button>
        <p className="productDisplay-right-category">
          <span>Category :</span>
          Women, T-Shirt, Crop Top
        </p>
        <p className="productDisplay-right-category">
          <span>Description : </span>
          A lightweight, Usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment. Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse.
        </p>
        <img className="trust-image" src="./LushioFitness/Images/trust.png" alt=""/>
        <div className="review-container">
          <div className="review-headings">
            <h5>Product Review</h5>
            <Modal/>
          </div>
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDisplay;