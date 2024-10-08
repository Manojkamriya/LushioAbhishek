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
  const [showNotification, setShowNotification] = useState(false);
  
  const [size, setSelectedSize] = useState(null);
  const [height, setHeight] = useState("above5.6");

  // const productOptions = {
  //   "above5.6": {
  //     colors: {
  //       "#FF5733": { name: "sunsetOrange", sizes: ["M", "L", "XL"] },
  //       "#6A0DAD": { name: "royalPurple", sizes: ["M", "L"] },
  //       "#FFD700": { name: "goldenYellow", sizes: ["L", "XL"] },
  //     }
  //   },
  //   "below5.6": {
  //     colors: {
  //       "#00CED1": { name: "darkTurquoise", sizes: ["S", "M"] },
  //       "#FF69B4": { name: "hotPink", sizes: ["S", "M"] },
  //       "#8B4513": { name: "saddleBrown", sizes: ["S", "M"] },
  //     }
  //   }
  // };
  // const productOptions = {
  //   "above5.6": {
  //     colors: {
  //       "#FF5733": { 
  //         name: "sunsetOrange", 
  //         sizes: [
  //           { size: "M", quantity: 10 }, 
  //           { size: "L", quantity: 8 }, 
  //           { size: "XL", quantity: 5 }
  //         ]
  //       },
  //       "#6A0DAD": { 
  //         name: "royalPurple", 
  //         sizes: [
  //           { size: "M", quantity: 0 }, 
  //           { size: "L", quantity: 3 }
  //         ] 
  //       },
  //       "#FFD700": { 
  //         name: "goldenYellow", 
  //         sizes: [
  //           { size: "L", quantity: 12 }, 
  //           { size: "XL", quantity: 9 }
  //         ]
  //       },
  //     }
  //   },
  //   "below5.6": {
  //     colors: {
  //       "#00CED1": { 
  //         name: "darkTurquoise", 
  //         sizes: [
  //           { size: "S", quantity: 15 }, 
  //           { size: "M", quantity: 7 }
  //         ] 
  //       },
  //       "#FF69B4": { 
  //         name: "hotPink", 
  //         sizes: [
  //           { size: "S", quantity: 12 }, 
  //           { size: "M", quantity: 10 }
  //         ] 
  //       },
  //       "#8B4513": { 
  //         name: "saddleBrown", 
  //         sizes: [
  //           { size: "S", quantity: 6 }, 
  //           { size: "M", quantity: 9 }
  //         ] 
  //       },
  //     }
  //   }
  // };
  const product1Options = {
    "above5.6": {
      colors: {
        "#FF5733": { 
          name: "sunsetOrange", 
          sizes: [
            { size: "XS", quantity: 10 }, 
            { size: "S", quantity: 8 }, 
            { size: "M", quantity: 5 },
            { size: "L", quantity: 0 }, 
            { size: "XL", quantity: 8 }, 
            { size: "XXL", quantity: 5 }
          ]
        },
        "#6A0DAD": { 
          name: "royalPurple", 
          sizes: [
            { size: "M", quantity: 0 }, 
            { size: "L", quantity: 3 }
          ] 
        },
        "#FFD700": { 
          name: "goldenYellow", 
          sizes: [
            { size: "L", quantity: 12 }, 
            { size: "XL", quantity: 9 }
          ]
        },
        // New colors added below
        "#1E90FF": { 
          name: "dodgerBlue", 
          sizes: [
            { size: "M", quantity: 14 }, 
            { size: "L", quantity: 7 }
          ]
        },
        "#32CD32": { 
          name: "limeGreen", 
          sizes: [
            { size: "M", quantity: 8 }, 
            { size: "XL", quantity: 6 }
          ] 
        },
        "#FF4500": { 
          name: "orangeRed", 
          sizes: [
            { size: "M", quantity: 5 }, 
            { size: "L", quantity: 4 }, 
            { size: "XL", quantity: 2 }
          ]
        },
        "#C71585": { 
          name: "mediumVioletRed", 
          sizes: [
            { size: "M", quantity: 3 }, 
            { size: "L", quantity: 10 }
          ]
        },
        "#8A2BE2": { 
          name: "blueViolet", 
          sizes: [
            { size: "M", quantity: 12 }, 
            { size: "XL", quantity: 4 }
          ]
        }
      }
    },
    "below5.6": {
      colors: {
        "#00CED1": { 
          name: "darkTurquoise", 
          sizes: [
            { size: "S", quantity: 15 }, 
            { size: "M", quantity: 7 }
          ] 
        },
        "#FF69B4": { 
          name: "hotPink", 
          sizes: [
            { size: "S", quantity: 12 }, 
            { size: "M", quantity: 10 }
          ] 
        },
        "#8B4513": { 
          name: "saddleBrown", 
          sizes: [
            { size: "S", quantity: 6 }, 
            { size: "M", quantity: 9 }
          ] 
        },
        // New colors added below
        "#4682B4": { 
          name: "steelBlue", 
          sizes: [
            { size: "S", quantity: 10 }, 
            { size: "M", quantity: 5 }
          ] 
        },
        "#FA8072": { 
          name: "salmon", 
          sizes: [
            { size: "S", quantity: 8 }, 
            { size: "M", quantity: 3 }
          ]
        },
        "#20B2AA": { 
          name: "lightSeaGreen", 
          sizes: [
            { size: "S", quantity: 13 }, 
            { size: "M", quantity: 6 }
          ]
        },
        "#DC143C": { 
          name: "crimsonRed", 
          sizes: [
            { size: "S", quantity: 9 }, 
            { size: "M", quantity: 7 }
          ]
        },
        "#B8860B": { 
          name: "darkGoldenrod", 
          sizes: [
            { size: "S", quantity: 11 }, 
            { size: "M", quantity: 4 }
          ]
        }
      }
    }
  };
  const productOptions = props.productOptions || product1Options;
  const [selectedColor, setSelectedColor] = useState(Object.keys(productOptions[height].colors)[0]);

  useEffect(() => {
    setLiked(props.liked);
  }, [props.liked]);

  const menuRef = useRef();

  const openMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.top = "10%";
    }
  };

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.top = "101%";
    }
  };

  const handleChangeHeight = (newHeight) => {
    setHeight(newHeight);

    // Automatically select the first color available for the selected height
    const firstColor = Object.keys(productOptions[newHeight].colors)[0];
    setSelectedColor(firstColor);

    setSelectedSize(null);
  };

  const handleChangeColor = (hex) => {
    setSelectedColor(hex);
    setSelectedSize(null);
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
    <div className="card" style={{ aspectRatio: 34 / 61, position: "relative" }}>
      {showNotification && (
        <div className="notification">
          Product added to cart!
        </div>
      )}
      
      <div className="item-image-container">
        <div className="item-image">
          <Link to={`/${props.id}`}>
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
          <p>Select Height</p>
          {productOptions &&  <div className="height-selector">
            <button 
              onClick={() => handleChangeHeight("above5.6")}
              className={height === "above5.6" ? "selected" : ""}
            >
              Above 5'6"
            </button>
            <button 
              onClick={() => handleChangeHeight("below5.6")}
              className={height === "below5.6" ? "selected" : ""}
            >
              Below 5'6"
            </button>
          </div>
}
          {/* <br /> */}
          <p>Select Color</p>
       {productOptions &&    <div className="color-selector">
            {Object.keys(productOptions[height].colors).map((hex) => (
              <button
                key={hex}
                style={{ background: hex }}
                onClick={() => handleChangeColor(hex)}
                className={selectedColor === hex ? "selected" : ""}
              ></button>
            ))}
          </div>
          }
          {selectedColor && (
            <>
              {/* <br /> */}
              <p>Selected Color: <span>{productOptions[height].colors[selectedColor].name}</span></p>
              {/* <br /> */}
              <p>Select Size</p>
              {/* <div className="size-buttons">
                {productOptions[height].colors[selectedColor].sizes.map((availableSize) => (
                  <button 
                    key={availableSize.size} 
                    onClick={() => setSelectedSize(availableSize.size)}  
                    className={availableSize.size === size ? "selected" : ""}
                  >
                    
                    {availableSize.size}
                  </button>
                ))}
              </div> */}
              <div className="size-buttons">
              {productOptions[height].colors[selectedColor].sizes.map((availableSize) => (
  <React.Fragment key={availableSize.size}>
    <button
      onClick={() => setSelectedSize(availableSize.size)}
      className={`size-button ${availableSize.size === size ? "selected" : ""} ${availableSize.quantity === 0 ? "sold-out" : ""}`}
      disabled={availableSize.quantity === 0}
    >
      {availableSize.size} {availableSize.quantity === 0 && <span className="sold-out-text">(Sold Out)</span>}
    </button>
   
  </React.Fragment>
))}
</div>

         {
          size ?  <button 
          onClick={() => handleAddToCart(props.id)} 
          disabled={!size}
          className="add-to-cart-button"
        >
          {isLoading ? <span className="spinner"></span> : <span>Add to Cart</span>}
        </button>:<button   className="add-to-cart-button" style={{backgroundColor: "#8c8c8c", cursor: "not-allowed"}}>Select size to add to cart</button>
         }
            
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
