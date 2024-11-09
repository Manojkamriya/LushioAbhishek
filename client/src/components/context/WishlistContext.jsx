import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext"; // Import UserContext

// Create the WishlistContext
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
 
  const { user } = useContext(UserContext); // Get user from UserContext


  const fetchWishlist = async () => {
    if (!user) return; 
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist/array/${user.uid}`); // Replace with your backend URL
        const wishlistData = response.data;
        setWishlist(wishlistData);
        setWishlistIds(new Set(wishlistData.map((item) => item.productId)));
        console.log(wishlist);
    } catch (error) {
        console.error("Failed to fetch wishlist", error);
    }
};
//fetchWishlist();
 // Fetch wishlist whenever user changes
 useEffect(() => {
  if (user) {
    fetchWishlist();
    console.log("Ho there",wishlistIds);
  }
}, [user]);


  const toggleWishlist = async (id, productId) => {
    const isInWishlist = wishlistIds.has(productId);
  
    try {
      if (isInWishlist) {
        // Remove item
       
        await axios.delete(`${process.env.REACT_APP_API_URL}/wishlist/delete`, {
          data: { itemId: id, uid: user.uid },
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        setWishlist((prev) => prev.filter((item) => item.productId !== productId));
        setWishlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        console.log("removed");
        return true;
      } else {
        // Add item
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/wishlist/add`, {
          productId,
          uid: user.uid,
        });
        setWishlist((prev) => [...prev, response.data]);
        setWishlistIds((prev) => new Set(prev).add(productId));
        console.log("added");
        return true;
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
      return false; // Return false on error
    }
  };



  return (
    <WishlistContext.Provider value={{  wishlist, wishlistIds, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook for using WishlistContext
export const useWishlist = () =>  useContext(WishlistContext);
  

