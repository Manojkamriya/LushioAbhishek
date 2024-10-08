import React, { createContext, useState, useEffect } from "react";
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
    wishlist[index] = false;
  }
  return wishlist;
};

// Utility function to load state from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() =>
    loadFromLocalStorage("cartItems", getDefaultCart())
  );
  const [wishlistItems, setWishlistItems] = useState(() =>
    loadFromLocalStorage("wishlistItems", getDefaultWishlist())
  );

  // Save to localStorage whenever cartItems or wishlistItems change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (prev[itemId] > 0) {
        return { ...prev, [itemId]: prev[itemId] - 1 };
      }
      return prev;
    });
  };

  const updateCartItemQuantity = (itemId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: quantity > 0 ? quantity : 0,
    }));
  };
  // Function to return the total number of items in the cart
  const getCartItemCount = () => {
    let totalCartItemCount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalCartItemCount += cartItems[item];
      }
    }
    return totalCartItemCount;
  };

  // Function to return the total number of items in the wishlist
  const getWishlistItemCount = () => {
    let totalWishlistCount = 0;
    for (const item in wishlistItems) {
      if (wishlistItems[item]) {
        totalWishlistCount++;
      }
    }
    return totalWishlistCount;
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };
  const clearAllData = () => {
    // Clear state
    setCartItems(getDefaultCart());
    setWishlistItems(getDefaultWishlist());

    // Clear localStorage
    localStorage.removeItem("cartItems");
    localStorage.removeItem("wishlistItems");
  };
  const addToWishlist = (itemId) => {
    setWishlistItems((prev) => ({ ...prev, [itemId]: true }));
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prev) => ({ ...prev, [itemId]: false }));
  };

  const toggleWishlistItem = (itemId) => {
    setWishlistItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const getWishlistItems = () => {
    return all_product.filter((product) => wishlistItems[product.id]);
  };

  const contextValue = {
    all_product,
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getTotalCartAmount,
    getTotalCartItems,
    getWishlistItemCount,
    getCartItemCount,
    addToWishlist,
    removeFromWishlist,
    getWishlistItems,
    toggleWishlistItem,
    clearAllData,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
