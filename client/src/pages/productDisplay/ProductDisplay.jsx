import React, { useState,useEffect, useContext } from "react";
import "./product.css";
import { useNavigate } from "react-router-dom";
import Modal1 from "./Modal"
import './ReviewCard.css';
import Rating from '@mui/material/Rating';
import { useParams } from "react-router-dom";
import all_product from "../../components/context/assets/all_product";
import HeightBasedOptions from "../home/HeightBasedOptions";
import SimpleColorOptions from "../home/SimpleColorOptions";
import { ShopContext } from "../../components/context/ShopContext";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
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
  const isHeightBased = product.data && "height" in product.data;
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [heightCategory, setHeightCategory] = useState('aboveHeight');
  const [isLoading, setIsLoading] = useState(false);
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
    setQuantity(0); // Reset when color changes
  };
  const handleAddToCart = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      addToCart(id);
      setIsLoading(false);
     
    }, 2000);
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (product.data && product.data.quantities) {
      setQuantity(product.data.quantities[selectedColor.name][size]);
    }
  };
 

  const [image, setImage] = useState("./LushioFitness/Images/p1_product.png");
  // const [size, setSize] = useState("S");
  // const [height, setHeight] = useState("");
  // const [color, setColor] = useState("");
  const navigate = useNavigate();

  // const sizes = ["XS", "S", "M", "L", "XL"];
  // const heights = ["5.4 feet or more", "below 5.4 feet"];
  // const colors = ["#00FFFF","#0091FF","#5424A0","#C44E0E","#C40E97"];
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
        <img src="./LushioFitness/Images/icons/cross.png" alt="" onClick={handleClose}/>
       </div>
<img src="./LushioFitness/Images/size-chart.webp" alt=""/>
        <p>Disclaimer: These charts are for reference ONLY. This is intended to be a general guide, and while we do our best to ensure all our sizing is consistent, you may find that some styles vary in size. Fit may vary depending on the construction and material.</p> 
          </Box>
        </Fade>
      </Modal>
        <div className="button-container">

          {
          selectedSize ?  <button 
          onClick={() => handleAddToCart(product.id)} 
          disabled={!selectedSize}
          // className="add-to-cart-button"
        >
          {isLoading ? <span className="spinner"></span> : <span>Add to Cart</span>}
        </button>:<button   >Select size to add to cart</button>
         }
          <button onClick={()=>addToWishlist(product.id)}>WISHLIST</button>
        </div>
{
  selectedSize ?  <button className="buy-button" onClick={() => navigate("/place-order")}>BUY NOW</button>:<button className="buy-button">Select size to continue</button>
}

       
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
            <Modal1/>
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