import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "./HomeWishList.css";
import { UserContext } from "../../components/context/UserContext";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/context/CartContext";
const HomeWishlist = () => {
  const { user } = useContext(UserContext);
  const { userName } = useCart();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const fetchWishlist = async () => {
      // Ensure the user is defined before proceeding
      if (!user?.uid) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/wishlist/${user.uid}`
        );
      
        if (Array.isArray(response.data.wishlistItems)) {
          const sortedWishlist = response.data.wishlistItems.sort(
            (a, b) =>
              b.createdAt._seconds - a.createdAt._seconds ||
              b.createdAt._nanoseconds - a.createdAt._nanoseconds
          );

          //   setWishlist(sortedWishlist);
          setWishlist(sortedWishlist.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching wishlist IDs:", error);
        // setError("Failed to load wishlist items."); // Uncomment if you want to handle errors in state
      }
    };

    fetchWishlist();
  }, [user]);

  return (
    <>
      {wishlist.length > 0 && (
        <div className="home-wishlist-wrapper">
          <div className="home-wishlist-name">
          <span>{userName?.trim() ? `${userName.split(' ')[0]}'s Wishlist` : "Your's Wishlist"}</span>


            <span onClick={() => navigate("/wishlist")}>View All</span>
          </div>
          <div className="home-wishlist-container">
            {wishlist.map((items, id) =>
              items.product ? ( // Check if items.product exists
                <ProductCard
                  key={items.id}
                  id={items.productId}
                  displayName={items.product.displayName}
                  image1={items.product.cardImages?.[0] || ""}
                  image2={items.product.cardImages?.[1] || ""}
                  rating={items.product.rating || 0}
                  price={items.product.price || 0}
                  discountedPrice={items.product.discountedPrice || 0}
                  description={items.product.description}
                  discount={items.product.discount || 0}
                  aboveHeight={items.product.aboveHeight || {}}
                  belowHeight={items.product.belowHeight || {}}
                  colorOptions={items.product.colorOptions || []}
                  quantities={items.product.quantities || {}}
                  height={items.product.height || ""}
                  setWishlistHome={setWishlist}
                />
              ) : null
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeWishlist;
