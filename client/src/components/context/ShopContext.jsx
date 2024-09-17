import React, { createContext, useState } from "react";
import all_product from "./assets/all_product";


const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < all_product.length + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};
const getDefaultWishlist = () => {
  let wishlist = {};
  for (let index = 0; index < all_product.length + 1; index++) {
    wishlist[index] = false;  // Initially, no products are in the wishlist
  }
  return wishlist;
};

export const ShopContext = createContext(null);
const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [wishlistItems, setWishlistItems] = useState(getDefaultWishlist());

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]:prev[itemId] + 1 }));
  };
  const removeFromCart = (itemId) => {
     setCartItems((prev) => ({ ...prev, [itemId]:prev[itemId] - 1 }));

  };

const getTotalCartAmount = () =>{
   let totalAmount = 0;
   for(const item in cartItems){
    if(cartItems[item]>0){
        let itemInfo = all_product.find((product)=>product.id===Number(item))
        totalAmount+=itemInfo.new_price * cartItems[item];
    }
   
   }
   return totalAmount;
}

const getTotalCartItems =() =>{
let totalItem = 0;
for(const item in cartItems){
    if(cartItems[item]>0){
        totalItem +=cartItems[item];
    }
    return totalItem;
}
}

const addToWishlist = (itemId) => {
  setWishlistItems((prev) => ({ ...prev, [itemId]: true }));
};

// Function to remove an item from the wishlist
const removeFromWishlist = (itemId) => {
  setWishlistItems((prev) => ({ ...prev, [itemId]: false }));
};

// Function to toggle an item in the wishlist
const toggleWishlistItem = (itemId) => {
  setWishlistItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
};

// Get all wishlist items
const getWishlistItems = () => {
  return all_product.filter((product) => wishlistItems[product.id]);
};

  const contextValue = { all_product, cartItems,wishlistItems, addToCart, removeFromCart , getTotalCartAmount, getTotalCartItems, addToWishlist, removeFromWishlist, getWishlistItems, toggleWishlistItem};

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;
