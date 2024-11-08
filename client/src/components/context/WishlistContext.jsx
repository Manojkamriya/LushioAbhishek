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
    } catch (error) {
        console.error("Failed to fetch wishlist", error);
    }
};
fetchWishlist();
 // Fetch wishlist whenever user changes
 useEffect(() => {
  if (user) {
    fetchWishlist();
    console.log("Ho there",wishlistIds);
  }
}, [user]);

  // const toggleWishlist = async (id, productId) => {
  //   const isInWishlist = wishlistIds.has(productId);
  //   let updatedWishlist;

  //   if (isInWishlist) {
  //       // Optimistically remove the item
  //    //   updatedWishlist = wishlist.filter((item) => item.productId !== productId);
  //     //  setWishlist(updatedWishlist);
  //      // setWishlistIds(new Set(updatedWishlist.map((item) => item.productId)));

  //       try {
  //           // Make the API call to remove item
  //         //  await axios.delete(`YOUR_BACKEND_URL/wishlist/${id}`);
  //         await axios.delete(`${process.env.REACT_APP_API_URL}/wishlist/delete`, {
  //                   data: { itemId: id, uid: user.uid },
  //                   headers: {
  //                     'Cache-Control': 'no-cache',
  //                     'Pragma': 'no-cache',
  //                     'Expires': '0'
  //                   }
  //                 });
  //                 console.log("removed");
  //                 return true;
  //       } catch (error) {
  //           // If error, revert to previous state
  //           console.error("Failed to remove item from wishlist", error);
  //         //  setWishlist(wishlist);
  //         //  setWishlistIds(new Set(wishlist.map((item) => item.productId)));
  //           return false;
  //       }
  //   } else {
  //       // Optimistically add the item
      
  //        // const newItem = { productId };
  //       //  updatedWishlist = [...wishlist, newItem];
  //        // setWishlist(updatedWishlist);
  //      //   setWishlistIds(new Set(updatedWishlist.map((item) => item.productId)));

  //         try {
  //             // Call API to add item to wishlist
  //             const response =  await axios.post(`${process.env.REACT_APP_API_URL}/wishlist/add`, {
  //                       productId,
  //                       uid: user.uid
  //                     });
                    
  //             const savedItem = response.data;

            
            
  //              // Update wishlist with actual ID from Firebase
  //           //    setWishlist((prevWishlist) =>
  //           //     prevWishlist.map((item) =>
  //           //         item.productId === productId ? savedItem : item
  //           //     )
  //           // );
  //           console.log("added");
  //           return true;
  //         } catch (error) {
  //             console.error("Failed to add item to wishlist", error);
  //             // Revert state if error occurs
  //            // setWishlist(wishlist);
  //            // setWishlistIds(new Set(wishlist.map((item) => item.productId)));
  //             return false;
  //         }
  //   }}
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
        console.log("removed");
        return true;
      } else {
        // Add item
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/wishlist/add`, {
          productId,
          uid: user.uid,
        });
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
  

