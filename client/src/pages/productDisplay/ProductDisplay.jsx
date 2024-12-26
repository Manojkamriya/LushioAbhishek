// 1. Built-in/Standard Library Imports
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 2. Third-Party Library Imports
import axios from "axios";
import Rating from "@mui/material/Rating";
import {
  FaHeart,
  FaShoppingCart,
  FaSpinner,
  FaHeartBroken,
} from "react-icons/fa";

// 3. Absolute Imports/Global Components
import { UserContext } from "../../components/context/UserContext";
import { useWishlist } from "../../components/context/WishlistContext";
import { useCart } from "../../components/context/CartContext";
import URLMediaRenderer from "../../components/URLMediaRenderer";

// 4. Relative Imports
import "./product.css";
import RatingModal from "./RatingModal";
import "./ReviewCard.css";
import ImagePopUp from "./ImagePopUp";
import ColorOptions from "./ColorOptions";
import HeightBasedSelection from "./HeightBasedSelection";
import SizeChart from "./SizeChart";
import SingleStar from "./SingleStar";
const formatDateTime = (timestamp) => {
  if (!timestamp || !timestamp._seconds || !timestamp._nanoseconds) {
    return "Invalid date"; // Return a fallback string if the timestamp is not valid
  }

  // Convert Firebase timestamp to a JavaScript Date object
  const date = new Date(
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
  );

  // Format the date using options
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  };

  return date.toLocaleString("en-US", options); // Format the date
};

const ReviewCard = ({
  username,
  rating,
  review,
  timestamp,
  quality,
  fit,
  media,
}) => {
  const formattedDate = formatDateTime(timestamp);
  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => {
    setIsOpen(true); // Set isOpen to true to open the gallery
    document.body.classList.add("no-scroll");
  };

  const closeGallery = () => {
    setIsOpen(false); // Set isOpen to false to close the gallery
  };
  return (
    <div className="review-card">
      <div className="review-media-gallery">
        {media?.length > 0 && (
          <URLMediaRenderer
            src={media[0]}
            alt="Review Media"
            onClick={openGallery}
          />
        )}
      </div>

      <div className="review-header">
        <h3>Manoj kamriya</h3>
        <div className="review-footer">
          <span className="review-date">{formattedDate}</span>
        </div>
        <Rating value={rating} precision={0.1} readOnly />
      </div>

      <div className="review-details">
        <p>
          <strong>Review:</strong> {review}
        </p>
        <p>
          <strong>Quality:</strong> {quality}
        </p>
        <p>
          <strong>Fit:</strong> {fit}
        </p>
      </div>
      <ImagePopUp
        images={media} // Pass the images array as prop
        isOpen={isOpen} // Pass the open/close state as prop
        closeGallery={closeGallery} // Pass the close function as prop
        openGallery={openGallery} // Pass the open function as prop
      />
    </div>
  );
};

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
  const { fetchCartCount } = useCart();
  const { wishlist, wishlistIds, toggleWishlist } = useWishlist();
  const isHeightBased = product?.height;
  const [image, setImage] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const id = productID;
  const wishlistItem = wishlist.find((item) => item.productId === id);
  const [liked, setLiked] = useState(wishlistIds.has(id));
  useEffect(() => {
    // Fetch product when `id` changes
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/products/${id}`
        );

        const data = await response.json();
        setProduct(data);
        // Sort the reviews based on the length of the media array, with safeguards
        const sortedReviews = data.reviews.sort((a, b) => {
          const mediaA = Array.isArray(a.media) ? a.media.length : 0;
          const mediaB = Array.isArray(b.media) ? b.media.length : 0;
          return mediaB - mediaA;
        });
        setReviews(sortedReviews);

        // setReviews(data.reviews);
        setImage(data.allImages[0]);
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]); // Runs the effect when `id` changes

  const targetRef = useRef(null); // Create a reference for the target component
  //  const discount =  Math.ceil(((props.price - props.discountedPrice) / props.price) * 100);
  const handleScroll = () => {
    // Scroll to the referenced component
    targetRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleToggleWishlist = async (id, productId) => {
    if (!user) {
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
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const isAdded = await toggleWishlist(id, productId);
      if (!isAdded) setLiked(false); // Revert state if addition failed
    }

    setIsRemoving(false);
  };
  const handleAddToCart = (id) => {
    handleScroll();
    addToCart(id);
  };
  useEffect(() => {
    if (product) {
      setHeightCategory(product.height ? "aboveHeight" : null);
      //  setSelectedColor(null); // Initialize with a default color if needed
      setSelectedSize(null); // Initialize with a default size if needed
    }
  }, [product]);

  const addToCart = async (id) => {
    if (selectedSize == null) {
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
      await axios.post(`${process.env.REACT_APP_API_URL}/cart/add`, cartItem);

      fetchCartCount();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000); // Show notification for 3 seconds
      setSelectedSize(null);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
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
    {
      username: "Manoj Kamriya",
      rating: 4.5,
      review: "Great product!",
      dateTime: "15-09-2024",
    },
    {
      username: "Pranit Mandloi",
      rating: 4.7,
      review: "Excellent quality!",
      dateTime: "14-09-2024",
    },
  ];

  const [isOpen, setIsOpen] = useState(false); // Control the open/close state

  const openGallery = () => {
    setIsOpen(true); // Set isOpen to true to open the gallery
    document.body.classList.add("no-scroll");
  };

  const closeGallery = () => {
    setIsOpen(false); // Set isOpen to false to close the gallery
  };

  // const images = product?.allImages;
  // const [image, setImage] = useState(images[0]);
  const handleBuyNow = () => {
    // Build the query parameters
    if (selectedSize == null) {
      setShowError(true); // Show error if size is not selected
      return;
    }
    if (!user) return;
    const imageURL = product.cardImages[0];
    const name = product.displayName;
    const price = product.price;
    const productId = id;
    const queryParams = new URLSearchParams({
      heightCategory,
      selectedColor,
      selectedSize,
      name,
      price,
      productId,
      imageURL, // Passing the image URL as a query param
    }).toString();

    // Navigate to the new page with the query params
    navigate(`/buyNow?${queryParams}`);
  };
  if (loading)
    return (
      <div className="loader-container">
        {" "}
        <span className="loader"></span>
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found</div>;
  return (
    <div className="productDisplay">
      {showNotification && (
        <div className="notification-container">
          <div className="notification" style={{ aspectRatio: 180 / 25 }}>
            Product added to cart!
          </div>
        </div>
      )}
      <div className="productDisplay-left">
        <div className="productDisplay-img-list">
          {product.allImages.map((img) => (
            <URLMediaRenderer
              onClick={() => setImage(img)}
              className={img === image ? "size-selected" : "size-not-selected"}
              src={img}
            />
          ))}
        </div>
        <div className="productDisplay-img">
          <URLMediaRenderer
            key={image}
            src={image}
            className="productDisplay-main-img"
            onClick={openGallery}
          />
          <div className="productDisplay-right-stars">
            <span>
              {/* {product.rating > 0 ? <p>{product.rating}</p> : <p>4.5</p>} */}
              <strong>
                {product.rating > 0 ? product.rating.toFixed(1) : "4.5"}
              </strong>
              <SingleStar review="3.7" />
              {/* <img src="/Images/icons/star.png" alt="icon" /> */}
              <p>({product.reviews.length})</p>
            </span>
          </div>
        </div>
      </div>
      <ImagePopUp
        images={product.allImages} // Pass the images array as prop
        isOpen={isOpen} // Pass the open/close state as prop
        closeGallery={closeGallery} // Pass the close function as prop
        openGallery={openGallery} // Pass the open function as prop
      />
      <div className="productDisplay-right">
        <div ref={targetRef}></div>
        <h1>{product.displayName}</h1>

        <div className="productDisplay-right-prices">
          <div className="productDisplay-right-price-new">
            ₹{product.discountedPrice}{" "}
          </div>
          <div className="productDisplay-right-price-old">
            ₹{product.price}{" "}
          </div>
          <div className="productDisplay-right-price-discount">
            {Math.ceil(
              ((product.price - product.discountedPrice) / product.price) * 100
            )}
            % OFF
          </div>
        </div>
        <p className="tax-statement">Inclusive of all taxes</p>
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
        {showError && !selectedSize && (
          <p className="product-display-error-message">
            Please select a size to proceed!
          </p>
        )}
        <div className="productDisplay-right-discription">
          <strong>Description: </strong> {product.description.productDetails}
        </div>
        <div className="productDisplay-right-discription">
          <strong>Size & Fit: </strong> {product.description.sizeFit}
        </div>
        <div className="productDisplay-right-discription">
          <strong>MaterialCare: </strong> {product.description.MaterialCare}
        </div>
        <p className="productDisplay-right-category">
          <span>
            <strong>Category:</strong>{" "}
          </span>
          <>
            {product.categories?.map((category, index) => (
              <span key={index}>
                {category}
                {", "}
              </span>
            ))}
          </>
        </p>

        <SizeChart />

        <div className="button-container">
          <button onClick={() => toggleWishlist(wishlistItem?.id, id)}>
            WISHLIST
          </button>
          <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
        </div>

        <button className="buy-button" onClick={handleBuyNow}>
          BUY NOW
        </button>

        <div className="productDisplay-desktop">
          <img className="trust-image" src="/Images/trust.png" alt="" />
        </div>
      </div>
      <div className="mobile-button-container">
        <button
          className="wishlist-button"
          //  onClick={() => handleWishlistClick(wishlistItem?.id, id)}
          // disabled={isLoadingWishlist}
        >
          {isRemoving ? (
            <>
              {" "}
              <FaHeartBroken color="red" />
              REMOVING
            </>
          ) : (
            <>
              {" "}
              <FaHeart
                className={`wishlist-icon ${liked ? "liked" : ""}`}
                onClick={() => handleToggleWishlist(wishlistItem?.id, id)}
              />
              {liked ? <>WISHLISTED</> : <>WISHLIST</>}
            </>
          )}
        </button>

        <button
          className="cart-button"
          onClick={() => handleAddToCart(product.id)}
          disabled={isLoadingCart}
        >
          {isLoadingCart ? (
            <FaSpinner className="spinner-icon" />
          ) : (
            <FaShoppingCart />
          )}{" "}
          ADD TO CART
        </button>
      </div>
      <div className="productDisplay-mobile">
        <img className="trust-image" src="/Images/trust.png" alt="" />
        <div className="review-container">
          <div className="review-headings">
            <h5>Product Review</h5>
            <RatingModal productId={product.id} />
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
