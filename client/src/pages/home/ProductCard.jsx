import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../components/context/ShopContext";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import HeightBasedOptions from "./HeightBasedOptions";
import SimpleColorOptions from "./SimpleColorOptions";
import "./likeButton.css";

function ProductCard(props) {
  const { addToCart, addToWishlist, removeFromWishlist } =
    useContext(ShopContext);
  const [liked, setLiked] = useState(props.liked);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  // const isHeightBased = "height" in props.data;
  const isHeightBased = props.data && "height" in props.data;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [heightCategory, setHeightCategory] = useState("aboveHeight");
  useEffect(() => {
    if (
      props.data &&
      props.data.aboveHeight &&
      props.data.aboveHeight.colorOptions.length > 0
    ) {
      setSelectedColor(props.data.aboveHeight.colorOptions[0]);
    }
  }, [props.data]);
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize("");
    setQuantity(0); // Reset when color changes
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (props.data && props.data.quantities) {
      setQuantity(props.data.quantities[selectedColor.name][size]);
    }
  };

  useEffect(() => {
    setLiked(props.liked);
  }, [props.liked]);

  const menuRef = useRef();

  const openMenu = () => {
    if (menuRef.current) {
      if (isHeightBased) {
        menuRef.current.style.top = "15%";
      } else {
        menuRef.current.style.top = "35%";
      }
    }
  };

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.top = "101%";
    }
  };

  const handleAddToCart = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      addToCart(id);
      setIsLoading(false);
      closeMenu();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 2000);
  };

  const toggleDisplay = (id) => {
    const newLikedState = !liked;
    setLiked(newLikedState);

    if (newLikedState) {
      addToWishlist(id);
    } else {
      setIsRemoving(true);
      setTimeout(() => {
        removeFromWishlist(id);
        setIsRemoving(false);
      }, 1500);
    }
  };

  return (
    <div
      className="card"
      style={{ aspectRatio: 34 / 61, position: "relative" }}
    >
      {showNotification && (
        <div className="notification">Product added to cart!</div>
      )}

      <div className="item-image-container">
        <div className="item-image">
          <Link to={`/${props.id}`}>
            <img src={props.image1} alt="" />
            <img src={props.image2} alt="" />
          </Link>
          <div className="productcard-top-icon-container">
            <span onClick={openMenu}>
              <img
                className="cart-image"
                src="/LushioFitness/Images/icons/cart_bag.png"
                alt=""
              />
            </span>
            <span>
              <p>{props.rating}</p>
              <img src="/LushioFitness/Images/icons/star.png" alt="icon" />
            </span>
          </div>
        </div>
        <div className="size-selector-outer" ref={menuRef}>
          <div className="size-selector-my">
            <img
              src="/LushioFitness/Images/icons/cross.png"
              alt=""
              onClick={closeMenu}
            />
            {isHeightBased ? (
              <HeightBasedOptions
                data={props.data}
                heightCategory={heightCategory}
                setHeightCategory={setHeightCategory}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                setQuantity={setQuantity}
              />
            ) : props.data ? (
              <SimpleColorOptions
                data={props.data}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                quantity={quantity}
                onColorSelect={handleColorSelect}
                onSizeSelect={handleSizeSelect}
              />
            ) : (
              <p>No products available</p>
            )}

            {selectedSize ? (
              <button
                onClick={() => handleAddToCart(props.id)}
                disabled={!selectedSize}
                className="add-to-cart-button"
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
            ) : (
              <button
                className="add-to-cart-button"
                style={{ backgroundColor: "#5f5e5e", cursor: "not-allowed" }}
              >
                Select size to add to cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="item-naming">
        <div className="info">
          <h3>LushioFitness®</h3>
          <h4>{props.description}</h4>

         
        </div>
        <div className="add-wishlist">
          <div className="heart-button-container">
            {isRemoving ? (
              <FaHeartBroken color="red" className="heart-icon" />
            ) : (
              <FaHeart
                className={`heart-icon ${liked ? "liked" : ""}`}
                onClick={() => toggleDisplay(props.id)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="item-price">
        <span className="new-price">₹ {props.newPrice}</span>
        <span className="old-price">₹ {props.oldPrice}</span>
      
        <span className="discount">{props.discount}% OFF</span>
      </div>
    </div>
  );
}

export default ProductCard;
