import React, { useContext, useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import { ShopContext } from "../../components/context/ShopContext";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import Checker from "./Checker";
function MyProduct(props){
    const { addToCart, addToWishlist, removeFromWishlist } = useContext(ShopContext);
    const [liked, setLiked] = useState(props.liked);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    // const isHeightBased = "height" in props.data;
    const isHeightBased = props.data && "height" in props.data;
    
  
    useEffect(() => {
      setLiked(props.liked);
    }, [props.liked]);
  
    const menuRef = useRef();
  
    const openMenu = () => {
      if (menuRef.current) {
        if(isHeightBased){
            menuRef.current.style.top = "10%";
        }
       else{
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
     <div className="size-selector-outer" ref={menuRef}>
     <div className="size-selector-my" >
            <Checker data={props.data}/>
        <button 
          onClick={() => handleAddToCart(props.id)} 
         
          className="add-to-cart-button"
        >
          {isLoading ? <span className="spinner"></span> : <span>Add to Cart</span>}
        </button>
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
       
    )
}


function Test() {
    let my_array = [
        {
          id: 1,
          name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
          category: "women",
          image: "./LushioFitness/Images/assets/product_101.webp",
          subCategory: "upperwear",
          color:"black",
          new_price: 5,
          old_price: 800,
          rating: 4.6,
          inStock:true,
          productOptions: null,
      
        data: {
            height: { value: '170' },
            aboveHeight: {
              colorOptions: [
                { name: 'Crimson Blush', hex: '#DC143C' },
                { name: 'Emerald Dream', hex: '#50C878' },
                { name: 'Sapphire Mist', hex: '#082567' },
                { name: 'Sunset Orange', hex: '#FD5E53' },
                { name: 'Lavender Haze', hex: '#B57EDC' },
                { name: 'Golden Rays', hex: '#FFAA33' },
                { name: 'Turquoise Breeze', hex: '#40E0D0' },
                { name: 'Midnight Plum', hex: '#3C1361' }
              ],
              sizeOptions: {
                'Crimson Blush': ['S', 'M', 'L', 'XL'],
                'Emerald Dream': ['M', 'L', 'XL'],
                'Sapphire Mist': ['S', 'M', 'L'],
                'Sunset Orange': ['XS', 'S', 'M', 'L'],
                'Lavender Haze': ['S', 'M', 'L', 'XL'],
                'Golden Rays': ['M', 'L', 'XL'],
                'Turquoise Breeze': ['XS', 'S', 'M', 'L'],
                'Midnight Plum': ['S', 'M', 'L']
              },
              quantities: {
                'Crimson Blush': { S: 5, M: 8, L: 12, XL: 6 },
                'Emerald Dream': { M: 10, L: 15, XL: 7 },
                'Sapphire Mist': { S: 4, M: 9, L: 11 },
                'Sunset Orange': { XS: 3, S: 6, M: 8, L: 5 },
                'Lavender Haze': { S: 7, M: 13, L: 9, XL: 4 },
                'Golden Rays': { M: 11, L: 14, XL: 8 },
                'Turquoise Breeze': { XS: 2, S: 5, M: 7, L: 6 },
                'Midnight Plum': { S: 6, M: 10, L: 8 }
              }
            },
            belowHeight: {
              colorOptions: [
                { name: 'Cherry Blossom', hex: '#FFB7C5' },
                { name: 'Ocean Depths', hex: '#008080' },
                { name: 'Sunflower Fields', hex: '#FFC300' },
                { name: 'Amethyst Charm', hex: '#9966CC' },
                { name: 'Coral Reef', hex: '#FF7F50' },
                { name: 'Mint Frost', hex: '#98FF98' },
                { name: 'Dusty Rose', hex: '#DCAE96' },
                { name: 'Indigo Twilight', hex: '#4B0082' }
              ],
              sizeOptions: {
                'Cherry Blossom': ['XS', 'S', 'M'],
                'Ocean Depths': ['S', 'M', 'L'],
                'Sunflower Fields': ['XS', 'S', 'M', 'L'],
                'Amethyst Charm': ['S', 'M', 'L'],
                'Coral Reef': ['XS', 'S', 'M'],
                'Mint Frost': ['S', 'M', 'L'],
                'Dusty Rose': ['XS', 'S', 'M', 'L'],
                'Indigo Twilight': ['S', 'M', 'L']
              },
              quantities: {
                'Cherry Blossom': { XS: 3, S: 7, M: 9 },
                'Ocean Depths': { S: 6, M: 11, L: 8 },
                'Sunflower Fields': { XS: 2, S: 5, M: 8, L: 4 },
                'Amethyst Charm': { S: 7, M: 12, L: 9 },
                'Coral Reef': { XS: 4, S: 8, M: 10 },
                'Mint Frost': { S: 5, M: 9, L: 7 },
                'Dusty Rose': { XS: 3, S: 6, M: 9, L: 5 },
                'Indigo Twilight': { S: 8, M: 13, L: 10 }
              }
            }
          }
        },
        {
          id: 2,
          name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
          category: "women",
        
          image: "./LushioFitness/Images/assets/product_102.webp",
          subCategory: "upperwear",
          color:"black",
          new_price: 8,
          old_price: 1200,
          rating: 4.7,
          inStock:false,
          productOptions: null,
          data: {
            colorOptions: [
              { name: 'red', hex: '#e91616' },
              { name: 'forestGreen', hex: '#0adb34' },
              { name: 'royalBlue', hex: '#4169E1' },
              { name: 'sunflowerYellow', hex: '#FFD700' },
              { name: 'orchidPurple', hex: '#DA70D6' },
              { name: 'coralOrange', hex: '#FF7F50' },
              { name: 'tealBlue', hex: '#008080' },
              { name: 'burgundy', hex: '#800020' },
              { name: 'mintGreen', hex: '#98FF98' },
              { name: 'navyBlue', hex: '#000080' }
            ],
            sizeOptions: {
              red: ['S', 'L'],
              forestGreen: ['XL', 'L'],
              royalBlue: ['M', 'L', 'XL'],
              sunflowerYellow: ['S', 'M', 'L'],
              orchidPurple: ['XS', 'S', 'M'],
              coralOrange: ['M', 'L', 'XL'],
              tealBlue: ['S', 'M', 'L'],
              burgundy: ['S', 'M', 'L', 'XL'],
              mintGreen: ['XS', 'S', 'M'],
              navyBlue: ['M', 'L', 'XL']
            },
            quantities: {
              red: { S: 3, L: 5 },
              forestGreen: { XL: 5, L: 10 },
              royalBlue: { M: 7, L: 8, XL: 6 },
              sunflowerYellow: { S: 4, M: 6, L: 5 },
              orchidPurple: { XS: 3, S: 5, M: 4 },
              coralOrange: { M: 6, L: 7, XL: 4 },
              tealBlue: { S: 5, M: 8, L: 6 },
              burgundy: { S: 4, M: 7, L: 6, XL: 3 },
              mintGreen: { XS: 2, S: 6, M: 5 },
              navyBlue: { M: 8, L: 9, XL: 5 }
            }
          }
        },
        {
          id: 3,
          name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
          category: "women",
          image: "./LushioFitness/Images/assets/product_101.webp",
          subCategory: "upperwear",
          color:"black",
          new_price: 5,
          old_price: 800,
          rating: 4.6,
          inStock:true,
          productOptions: null,
          data:null,
        }
      ]
  return (
    <div className="wishlist-container">
        {my_array.map((e, id) => {
    return (
        <MyProduct
          // key={i}
          id={e.id}
          description={e.name}
          image1={e.image}
          image2={e.image}
          newPrice={e.new_price}
          oldPrice={e.old_price}
          discount={Math.round(
            ((e.old_price - e.new_price) / e.old_price) * 100
          )}
          rating={e.rating}
          liked={true} 
          data={e.data || {}}
        />
      )
        }
    )}
    {/* <MyProduct/> */}
    </div>
  )
}

export default Test
