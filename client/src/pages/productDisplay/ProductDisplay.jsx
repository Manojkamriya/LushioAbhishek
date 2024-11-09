import React, { useState,useEffect, useContext } from "react";
import "./product.css";
import { useNavigate } from "react-router-dom";
import Modal1 from "./Modal"
import './ReviewCard.css';
import axios from "axios";
import Rating from '@mui/material/Rating';
import { useParams } from "react-router-dom";
import all_product from "../../components/context/assets/all_product";
import ColorOptions from "./ColorOptions";
import HeightBasedSelection from "./HeightBasedSelection"
import { ShopContext } from "../../components/context/ShopContext";
import { UserContext } from "../../components/context/UserContext";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import MediaRenderer from "../../components/MediaRenderer";
import SizeChart from "./SizeChart";
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
 // const { productID } = useParams(); // Get the product ID from the URL
 // const product = all_product.find((e) => e.id === Number(productID)); // Find the product by ID
 const { productID } = useParams(); // Assumes `id` comes from the route param
 const [product, setProduct] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [heightCategory, setHeightCategory] = useState(null);
 const [selectedColor, setSelectedColor] = useState(null);
 const [selectedSize, setSelectedSize] = useState(null);
 const { user } = useContext(UserContext);
const id = productID;
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
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };

   if (id) fetchProduct();
 }, [id]); // Runs the effect when `id` changes

 const isHeightBased = product?.height;
// const [isLoading, setIsLoading] = useState(false);
 
useEffect(() => {
  if (product) {
    setHeightCategory(product.height ? "aboveHeight" : null);
  //  setSelectedColor(null); // Initialize with a default color if needed
    setSelectedSize(null); // Initialize with a default size if needed
  }
}, [product]);
  const [quantity, setQuantity] = useState(0);
 
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [reviews, setReviews]=  useState(null);
//  const { addToCart, addToWishlist} = useContext(ShopContext);
 
  // useEffect(() => {
  //   if ( product.data && product.data.aboveHeight && product.data.aboveHeight.colorOptions.length > 0) {
  //     setSelectedColor(product.data.aboveHeight.colorOptions[0]);
  //   }
  // }, [product.data]);
  // const handleColorSelect = (color) => {
  //   setSelectedColor(color);
  //   setSelectedSize('');
  //   setShowError(false);
  //   setQuantity(0); // Reset when color changes
  // };
 
  // useEffect(() => {
  
  //     const fetchReviews = async () => {
      
  //       try {
  //         const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/azkEOgiSVkvByK93XYr6`);

  //         setReviews(response.data);
        
  //       } catch (error) {
  //         console.error('Error fetching reviews:', error);
  //       }
  //     };

  //    fetchReviews();
    
  // }, []);
  const addToCart = async (id) => {

    if (selectedSize==null) {
      setShowError(true); // Show error if size is not selected
      return;
    } 
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
      const apiCall = axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add`,
        cartItem
      );
      const minimumDelay = new Promise((resolve) => setTimeout(resolve, 2000));

      // Wait for both to complete
      const [response] = await Promise.all([apiCall, minimumDelay]);

     
    } catch (error) {
      console.error("Error adding item to cart:", error);
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
  if (loading) return <div className="loader-container"> <span className="loader"></span></div>;
 if (error) return <div>Error: {error}</div>;
 if (!product) return <div>No product found</div>;
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
        <h1>{product.displayName}</h1>
        <div className="productDisplay-right-stars">
          <span>
           {/* // <p>{product.rating}</p> */}
            {product.rating > 0 ? <p>{product.rating}</p> : <p>4.5</p>}
            <img src="/Images/icons/star.png" alt="icon" />
          </span>
          <p>(122 reviews)</p>
        </div>
        <div className="productDisplay-right-prices">
          <div className="productDisplay-right-price-new">₹ {product.price}</div>
          <div className="productDisplay-right-price-old">₹ {product.price}</div>
          <div className="productDisplay-right-price-discount">20% OFF</div>
        </div>
        <p className="tax-statement">Inclusive of all taxes</p>
        <div className="productDisplay-right-discription">
        {product.description}
        </div>
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

        
          <button >WISHLIST</button> 
          <button onClick={()=>addToCart(product.id)}>ADD TO CART</button> 
        </div>

  <button className="buy-button" onClick={() => navigate("/place-order")}>BUY NOW</button>

       
        <p className="productDisplay-right-category">
          <span>Category :</span>
          <>
          {product.categories?.map((category, index) => (
            <span key={index}>{category}{", "}</span>
          ))}
        </>
        </p>
        <p className="productDisplay-right-category">
          <span>Description : </span>
       {product.description}
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