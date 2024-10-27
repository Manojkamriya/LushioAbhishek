import React, { useState,useEffect, useContext } from "react";
import "./product.css";
import { useNavigate } from "react-router-dom";
import Modal1 from "./Modal"
import './ReviewCard.css';
import axios from "axios";
import Rating from '@mui/material/Rating';
import { useParams } from "react-router-dom";
import all_product from "../../components/context/assets/all_product";
import HeightBasedOptions from "./HeightBasedOptions";
import SimpleColorOptions from "./SimpleColorOptions";
import { ShopContext } from "../../components/context/ShopContext";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import MediaRenderer from "../../components/MediaRenderer";
const ReviewCard = ({ username, rating, review, dateTime }) => (
  <div className="review-card">
    <div className="review-header">
      <h3>{username}</h3>
      <Rating value={rating} precision={0.1} readOnly />
    </div>
    <p className="review-text">{review}</p>
    <div className="review-footer">
      {/* <span className="review-date">{new Date(dateTime).toLocaleString()}</span> */}
      <span className="review-date">{dateTime}</span>
    </div>
  </div>
);

function ProductDisplay() {
  const { productID } = useParams(); // Get the product ID from the URL
  const product = all_product.find((e) => e.id === Number(productID)); // Find the product by ID
  const isHeightBased = product.data && "height" in product.data;
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [heightCategory, setHeightCategory] = useState('aboveHeight');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [reviews, setReviews]=  useState(null);
  const { addToCart, addToWishlist} = useContext(ShopContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if ( product.data && product.data.aboveHeight && product.data.aboveHeight.colorOptions.length > 0) {
      setSelectedColor(product.data.aboveHeight.colorOptions[0]);
    }
  }, [product.data]);
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize('');
    setShowError(false);
    setQuantity(0); // Reset when color changes
  };
 
  useEffect(() => {
  
      const fetchReviews = async () => {
      
        try {
          const response = await axios.get("http://127.0.0.1:5001/lushio-fitness/us-central1/api/reviews/azkEOgiSVkvByK93XYr6");

          setReviews(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
         console.log("fucntion run success");
        }
      };

     fetchReviews();
    
  }, []);
  const handleAddToCart = (id) => {
    if (selectedSize === '') {
      setShowError(true); // Show error if size is not selected
    } else {
      setIsLoading(true);
      setTimeout(() => {
        addToCart(id);
        setIsLoading(false);
      }, 2000);
    }
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (product.data && product.data.quantities) {
      setQuantity(product.data.quantities[selectedColor.name][size]);
    }
  };
 

  
 
  const navigate = useNavigate();

 
  const reviewTest = [
    { username: "Manoj Kamriya", rating: 4.5, review: "Great product!", dateTime: "15-09-2024" },
    { username: "Pranit Mandloi", rating: 4.7, review: "Excellent quality!", dateTime: "14-09-2024" },
  ];

  const images = [
    "/Images/p1_product.png",
    "/Images/carousel/vedio4.mp4",
    "/Images/p1_product_i2.png",
    "/Images/p1_product_i3.png",
    // "/Images/p1_product_i4.png",
    "/Images/p1_product_i4.png"
  ];
  const [image, setImage] = useState(images[0]);
  if(isLoading && reviews){
    return <></>
  }
  return (
    <div className="productDisplay">
      <div className="productDisplay-left">
        <div className="productDisplay-img-list">
          {images.map((img, index) => (
           
            <MediaRenderer
               onClick={() => setImage(img)}
              className={img === image ? "size-selected" : "size-not-selected"}
              src={img}
            />
          ))}
        </div>
        <div className="productDisplay-img">
         
          <MediaRenderer src={image} className="productDisplay-main-img"/>
        </div>
      </div>
      <div className="productDisplay-right">
        <h1>{product.name}</h1>
        <div className="productDisplay-right-stars">
          <span>
            <p>{product.rating}</p>
            <img src="/Images/icons/star.png" alt="icon" />
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
        {
              isHeightBased?    <HeightBasedOptions
          data={product.data}
          heightCategory={heightCategory}
          setHeightCategory={setHeightCategory}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          handleColorSelect={handleColorSelect}
          setQuantity={setQuantity}
        />:product.data?<SimpleColorOptions
              data={product.data}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              quantity={quantity}
              onColorSelect={handleColorSelect}
              onSizeSelect={handleSizeSelect}
            />
                :<p>No products available</p>}
        
         
        </div>
         {/* Display error message if no size is selected */}
      {showError && !selectedSize && <p className="product-display-error-message">Please select a size before adding to cart!</p>}
      <p className="size-chart" onClick={handleOpen}>Size Chart</p>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "490px",
              bgcolor: "background.paper",
              border: ".5px solid #000",
              borderRadius: "9px",
              boxShadow: 24,
              p: 4,
            }}
          >
       <div className="chart-header">
        <p>Generalized Size chart</p>
        <img src="/Images/icons/cross.png" alt="" onClick={handleClose}/>
       </div>
<img src="/Images/size-chart.webp" alt=""/>
        <p>Disclaimer: These charts are for reference ONLY. This is intended to be a general guide, and while we do our best to ensure all our sizing is consistent, you may find that some styles vary in size. Fit may vary depending on the construction and material.</p> 
          </Box>
        </Fade>
      </Modal>
        <div className="button-container">

        
          <button onClick={()=>addToWishlist(product.id)}>WISHLIST</button> 
          <button onClick={()=>handleAddToCart(product.id)}>ADD TO CART</button> 
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
        <img className="trust-image" src="/Images/trust.png" alt=""/>
        <div className="review-container">
          <div className="review-headings">
            <h5>Product Review</h5>
            <Modal1/>
          </div>
          <div className="reviews-list">
            {reviewTest.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDisplay;