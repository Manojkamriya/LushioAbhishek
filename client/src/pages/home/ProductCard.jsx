import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../components/context/ShopContext";
import { FaHeart, FaHeartBroken } from "react-icons/fa";

import "./likeButton.css";

function ProductCard(props) {
  const { addToCart, addToWishlist, removeFromWishlist } = useContext(ShopContext);
  const [liked, setLiked] = useState(props.liked);
  const [isRemoving, setIsRemoving] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 
  const [size, setSelectedSize] = useState(null);

  const colorSizesByHex = {
    "#FF5733": { name: "sunsetOrange", sizes: ["S", "M", "L", "XL"] },
    "#6A0DAD": { name: "royalPurple", sizes: ["S", "M", "L"] },
    "#FFD700": { name: "goldenYellow", sizes: ["M", "L", "XL"] },
    "#00CED1": { name: "darkTurquoise", sizes: ["S", "M", "L", "XL"] },
    "#FF69B4": { name: "hotPink", sizes: ["M", "L"] },
    "#8B4513": { name: "saddleBrown", sizes: ["S", "L", "XL"] },
};

const [selectedColor, setSelectedColor] = useState(Object.keys(colorSizesByHex)[0]);

const handleChangeColor = (hex) => {
  setSelectedColor(hex);
  setSelectedSize(null);
};
  useEffect(() => {
    setLiked(props.liked);
  }, [props.liked]);

  const menuRef = useRef();

  const openMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.top = "30%";
    }
  };

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.top = "101%";
    }
  };

  // const handleChangeColor = (hex) => {
  //   setSelectedColor(colorSizesByHex[hex]);
  //   setSelectedSize(null);
  // }
  const handleAddToCart = (id) => {
   setIsLoading(true);
    setTimeout(() => {
     
      addToCart(id);
      setIsLoading(false);
      closeMenu();
   
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
    <div className="card" style={{ aspectRatio: 34 / 61 }}>
      <div className="item-image-container">
        <div className="item-image">
          <Link to="/product">
            <img src={props.image1} alt="" />
            <img src={props.image2} alt="" />
          </Link>
          <div className="productcard-top-icon-container">
            <span>
              <img
                className="cart-image"
                src="./LushioFitness/Images/icons/cart_bag.png"
                alt=""
                onClick={openMenu}
              />
            </span>
            <span>
              <p>{props.rating}</p>
              <img src="./LushioFitness/Images/icons/star.png" alt="icon" />
            </span>
          </div>
        </div>
        <div className="size-selector" ref={menuRef}>
    <p>Select Color</p>
    {Object.keys(colorSizesByHex).map((hex) => (
        <div
            key={hex}
            style={{ background: hex }}
            onClick={() => handleChangeColor(hex)}
        ></div>
    ))}
    <br />
  
   {selectedColor && (
    <>
        <br />
        <p>Selected Color: <span>{colorSizesByHex[selectedColor].name}</span></p>
        <br />
        <p>Select Size</p>
        {colorSizesByHex[selectedColor].sizes.map((sizes) => (
            <div 
                key={sizes} 
                onClick={() => setSelectedSize(sizes)}  
                className={sizes === size ? "size-selected" : "size-not-selected"}
            >
                {sizes}
            </div>
        ))}
        <br/><br/>
        <button onClick={() => handleAddToCart(props.id)} disabled={!size}>
            {isLoading ? <span className="spinner"></span> : <span>Add to Cart</span>}
        </button>
    </>
)}
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
