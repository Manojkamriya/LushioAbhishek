// 1. Built-in/Standard Library Imports
import React, { useState, useEffect, useContext,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 2. Third-Party Library Imports
import axios from "axios";
import Rating from "@mui/material/Rating";
import { FaHeart, FaShoppingCart, FaSpinner } from "react-icons/fa";

// 3. Absolute Imports/Global Components
import { UserContext } from "../../components/context/UserContext";
import { useWishlist } from "../../components/context/WishlistContext";
import { useCart } from "../../components/context/CartContext";
import MediaRenderer from "../../components/MediaRenderer";

// 4. Relative Imports
import "./product.css";
import RatingModal from "./RatingModal";
import "./ReviewCard.css";
import ColorOptions from "./ColorOptions";
import HeightBasedSelection from "./HeightBasedSelection";
import SizeChart from "./SizeChart";

// 5. Side Effect Imports (if any additional)

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
 
 const { productID } = useParams(); // Assumes `id` comes from the route param
 const [product, setProduct] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [heightCategory, setHeightCategory] = useState(null);
 const [selectedColor, setSelectedColor] = useState(null);
 const [selectedSize, setSelectedSize] = useState(null);
 const [reviews, setReviews] = useState([]);
 const [showNotification, setShowNotification] = useState(false);
 const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
 const [isLoadingCart, setIsLoadingCart] = useState(false);
  const navigate = useNavigate();
const [showError, setShowError] = useState(false);
 const { user } = useContext(UserContext);
 const {fetchCartCount} = useCart();
 const { wishlist, toggleWishlist } = useWishlist();
 const isHeightBased = product?.height;
 const id = productID;
 const wishlistItem = wishlist.find((item) => item.productId === id); 

 useEffect(() => {
   // Fetch product when `id` changes
   const fetchProduct = async () => {
     setLoading(true);
     setError(null);

     try {
       const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`);
       if (!response.ok) throw new Error('Failed to fetch product');
       
       const data = await response.json();
       setProduct(data);
        console.log(data);
       setReviews(data.reviews);
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };

   if (id) fetchProduct();
 }, [id]); // Runs the effect when `id` changes

 const targetRef = useRef(null); // Create a reference for the target component

 const handleScroll = () => {
   // Scroll to the referenced component
   targetRef.current.scrollIntoView({ behavior: "smooth" });
 };
const handleAddToCart= (id) => {
  handleScroll();
  addToCart(id);
}
useEffect(() => {
  if (product) {
    setHeightCategory(product.height ? "aboveHeight" : null);
  //  setSelectedColor(null); // Initialize with a default color if needed
    setSelectedSize(null); // Initialize with a default size if needed
  }
}, [product]);

  const addToCart = async (id) => {
  
    if (selectedSize==null) {
     
      setShowError(true); // Show error if size is not selected
      return;
    } 
    if (!user) return; 
    const cartItem = {
      uid: user.uid,
      productId: id,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      height: heightCategory,
    };

    try {
      // Start both the API call and a 2-second timer
      setIsLoadingCart(true);
      const response = axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add`,
        cartItem
      );
      // const minimumDelay = new Promise((resolve) => setTimeout(resolve, 2000));

      // // Wait for both to complete
      // const [response] = await Promise.all([apiCall, minimumDelay]);
    
      fetchCartCount();
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000); // Show notification for 3 seconds
      
     
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } 
    finally{
      setIsLoadingCart(false);
    }
  };
 
  // const productId = id;
  const handleWishlistClick = async (itemId, id) => {
    setIsLoadingWishlist(true);
    await toggleWishlist(itemId, id); 
    setIsLoadingWishlist(false);
  };
 
  const reviewTest = [
    { username: "Manoj Kamriya", rating: 4.5, review: "Great product!", dateTime: "15-09-2024" },
    { username: "Pranit Mandloi", rating: 4.7, review: "Excellent quality!", dateTime: "14-09-2024" },
  ];

  const images = [
    "/Images/p1_product.png",
    "/Images/carousel/vedio4.mp4",
    "/Images/p1_product_i2.png",
    "/Images/p1_product_i3.png",
    "/Images/p1_product_i4.png"
  ];
 // const images = product?.allImages;
  const [image, setImage] = useState(images[0]);
  if (loading) return <div className="loader-container"> <span className="loader"></span></div>;
 if (error) return <div>Error: {error}</div>;
 if (!product) return <div>No product found</div>;
  return (
    <div className="productDisplay">
     {showNotification && (
        <div className="notification-container">
  <div className="notification" style={{ aspectRatio: 180 / 25 }}>
          Product added to cart!
        </div>
        </div>)
}
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
          <div className="productDisplay-right-stars">
          <span>
         
            {/* {product.rating > 0 ? <p>{product.rating}</p> : <p>4.5</p>} */}
            <p>{product.rating > 0 ? product.rating.toFixed(1) : "4.5"}</p>

            <img src="/Images/icons/star.png" alt="icon" />
            <p>(122)</p>
          </span>
         
        </div>
        </div>
      </div>
      <div className="productDisplay-right">
        <h1>{product.displayName}</h1>
        <div ref={targetRef}></div>
        <div className="productDisplay-right-prices">
          <div className="productDisplay-right-price-new">₹ {product.price}</div>
          <div className="productDisplay-right-price-old">₹ {product.price}</div>
          <div className="productDisplay-right-price-discount">20% OFF</div>
        </div>
        <p className="tax-statement">Inclusive of all taxes</p>
        <div className="productDisplay-right-discription">
        {product.description}
        </div>
        <p className="productDisplay-right-category">
          <span>Category :</span>
          <>
          {product.categories?.map((category, index) => (
            <span key={index}>{category}{", "}</span>
          ))}
        </>
        </p>
       
        <div className="productDisplay-right-size">
       
        {isHeightBased ? (
              <HeightBasedSelection
                data={product}
                selectedHeight={heightCategory}
                setSelectedHeight={setHeightCategory}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            ) : (
              <ColorOptions
                data={product}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            )}
         
        </div>
      
         {/* Display error message if no size is selected */}
      {showError && !selectedSize && <p className="product-display-error-message">Please select a size before adding to cart!</p>}
    <SizeChart/>
  
        <div className="button-container">
      
          <button onClick={() => toggleWishlist(wishlistItem?.id, id)}>WISHLIST</button> 
          <button onClick={()=>addToCart(product.id)}>ADD TO CART</button> 
        </div>

  <button className="buy-button" onClick={() => navigate("/place-order")}>BUY NOW</button>

       
      <div className="productDisplay-desktop">
      <img className="trust-image" src="/Images/trust.png" alt=""/>
        <div className="review-container">
          <div className="review-headings">
            <h5>Product Review</h5>
            <RatingModal/>
          </div>
          <div className="reviews-list">
            {reviewTest.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>
        </div>
      </div>
       
      </div>
      <div className="mobile-button-container">
    
        
      <button className="wishlist-button" onClick={() => handleWishlistClick(wishlistItem?.id, id)} disabled={isLoadingWishlist}>
        {isLoadingWishlist ? <FaSpinner className="spinner-icon" /> : <FaHeart />} WISHLIST
      </button>

      <button className="cart-button" onClick={() => handleAddToCart(product.id)} disabled={isLoadingCart}>
        {isLoadingCart ? <FaSpinner className="spinner-icon" /> : <FaShoppingCart />} ADD TO CART
      </button>
    </div>
    <div className="productDisplay-mobile">
      <img className="trust-image" src="/Images/trust.png" alt=""/>
        <div className="review-container">
          <div className="review-headings">
            <h5>Product Review</h5>
            <RatingModal productId={product.id}/>
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