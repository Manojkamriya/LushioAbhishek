import React, { useRef, useState, useContext } from "react";
import HeightBasedSelection from "./HeightBasedSelection";
import ColorOptions from "./ColorOptions";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { UserContext } from "../../components/context/UserContext";
import { useWishlist } from "../../components/context/WishlistContext";
import { useCart } from "../../components/context/CartContext";
import useCartCount from "../../components/useCartCount";
import "./productCard.css";
function ProductCard(props) {
  const menuRef = useRef();
const navigate= useNavigate();
  const isHeightBased = props.height;
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [heightCategory, setHeightCategory] = useState(
    isHeightBased ? "aboveHeight" : null
  );
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { cartCount, fetchCartCount } = useCart();


  const [isRemoving, setIsRemoving] = useState(false);
  const { user } = useContext(UserContext);
 // const { fetchCartCount } = useCartCount(user?.id);
  const { wishlist, wishlistIds, toggleWishlist } = useWishlist();
  const productId = props?.id;
  const wishlistItem = wishlist.find((item) => item.productId === productId);
  
  const [liked, setLiked] = useState(wishlistIds.has(productId));
 
  const handleToggleWishlist = async (id, productId) => {
   if(!user){
    navigate("/login");
    return;
   }
  
    if (liked) {
      setIsRemoving(true);
      // Try to remove from wishlist
      const isRemoved = await toggleWishlist(id, productId); // Await toggleWishlist
      if (isRemoved) setLiked(false); // Update state based on actual result
    } else {
      // Try to add to wishlist
      setLiked(true); // Optimistically update state
      await new Promise(resolve => setTimeout(resolve, 1800));
      const isAdded = await toggleWishlist(id, productId);
      if (!isAdded) setLiked(false); // Revert state if addition failed
    }
  
    setIsRemoving(false);
  };
  const [quantity, setQuantity] = useState(null);
 const discount =  Math.ceil(((props.price - props.discountedPrice) / props.price) * 100);

  // Define the object with input data
  const requestData = {
    pid: "12345", // Replace with actual product ID
    color: "red", // Replace with actual color
    heightType: "above", // Options: "normal", "above", "below"
    size: "M", // Replace with actual size
  };

  // const fetchQuantity = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/getQty", requestData);
  //     setQuantity(response.data.quantity);
  //   } catch (err) {
  //     console.error("Error fetching quantity:", err);
    
  //   }
  // };
  const addToCart = async (id) => {
    setIsLoading(true);

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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add`,
        cartItem
      );
      // const minimumDelay = new Promise((resolve) => setTimeout(resolve, 2000));

      // // Wait for both to complete
      // const [response] = await Promise.all([apiCall, minimumDelay]);

      if (response.status === 201 || response.status===200) {
       fetchCartCount();
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000); // Show notification for 3 seconds
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsLoading(false); // End loading state only after both tasks are complete
      closeMenu(); // Close the menu after loading is complete
    }
  };

  const openMenu = () => {
    if (menuRef.current) {
      const menuHeight = menuRef.current.scrollHeight; // Capture the current content height
      menuRef.current.style.height = `${menuHeight}px`; // Set the fixed height
      menuRef.current.style.top = `calc(101% - ${menuHeight}px)`; // Position it based on height
    }
  };
 
  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.height = "auto"; // Reset the height on close
      menuRef.current.style.top = "101%";
      setHeightCategory(isHeightBased ? "aboveHeight" : null);
     
      setSelectedSize(null);
    }
  };

  return (
    <div
      className="product-card"
      style={{ aspectRatio: 34 / 61, position: "relative" }}
    >
      {showNotification && (
        <div className="notification" style={{ aspectRatio: 180 / 25 }}>
          Product added to cart!
        </div>
      )}
      <div className="item-image-container">
        <div className="item-image">
        <Link to={`/product/${props.id}`}>
        <img src={props.image1} alt="" />
        <img src={props.image2} alt="" />
        </Link>
      

          <div className="productcard-top-icon-container">
            <span onClick={openMenu}>
              <img
                className="cart-image"
                src="/Images/icons/cart_bag.png"
                alt=""
              />
            </span>
            <span>
            <p>{props.rating > 0 ? props.rating.toFixed(1) : "4.5"}</p>
              <img src="/Images/star.png" alt="icon" />
            </span>
          </div>
        </div>
        <div className="color-size-selector-wrapper" ref={menuRef}>
          <div className="color-size-selector">
            <img
              src="/Images/icons/cross.png"
              alt=""
              onClick={closeMenu}
              style={{ aspectRatio: 1 }}
            />

            {isHeightBased ? (
              <HeightBasedSelection
                data={props}
                selectedHeight={heightCategory}
                setSelectedHeight={setHeightCategory}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            ) : (
              <ColorOptions
                data={props}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            )}
            {/* <button className="add-to-cart-button">Add to Cart</button> */}
            {user ? (
              selectedSize ? (
                <button
                  onClick={() => addToCart(props.id)}
                  disabled={!selectedSize}
                  className="add-to-cart-button"
                  style={{ aspectRatio: 5 }}
                >
                  {isLoading ? (
                    <span className="spinner" style={{ aspectRatio: 1 }}></span>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>
              ) : (
                <button
                  className="add-to-cart-button"
                  style={{
                    backgroundColor: "#5f5e5e",
                    cursor: "not-allowed",
                    aspectRatio: 5,
                  }}
                >
                  Select size to add to cart
                </button>
              )
            ) : (
              <button
                className="add-to-cart-button"
                style={{
                  backgroundColor: "#5f5e5e",
                  cursor: "not-allowed",
                  aspectRatio: 5,
                }}
              >
                Please Login to add to cart
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="item-naming">
        <div className="info">
          {/* <h3>LushioFitness®</h3> */}
          <h3>{props.displayName}</h3>
          <div className="item-price">
        <span className="new-price">₹{props.discountedPrice}</span>
        <span className="old-price">₹{props.price}</span>

        <span className="discount">{discount}% OFF</span>
      </div>
        </div>
        <div className="add-wishlist">
          {isRemoving ? (
            <FaHeartBroken color="red" className="heart-icon" />
          ) : (
            <FaHeart
              className={`heart-icon ${liked ? "liked" : ""}`}
              onClick={() => handleToggleWishlist(wishlistItem?.id, productId)}
            />
          )}

        
        </div>
      </div>
     
   
    </div>
  );
}

export default ProductCard;
