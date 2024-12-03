import React, { useState, useContext,useEffect } from "react";
import axios from "axios";
//import { ShopContext } from "../../components/context/ShopContext";
import { UserContext } from "../../components/context/UserContext";
import EmptyWishList from "./EmptyWishList";
import ProductCard from "../home/ProductCard";
import { Pagination } from "@mui/material"; 
import Breadcrumb from "../../components/BreadCrumb";
function WishList() {
 
  const {user} = useContext(UserContext);
  const [page, setPage] = useState(1); // For keeping track of the current page
  const itemsPerPage = 8; // Control the number of items per page
const [wishlist, setWishlist] = useState([]);
const[loading,setLoading] = useState(false);
  const handleChange = (event, value) => {
    setPage(value);
  };

useEffect(() => {
  const fetchWishlist = async () => {
    // Ensure the user is defined before proceeding
    if (!user?.uid) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/wishlist/${user.uid}`
      );
      console.log(response.data.wishlistItems);
      // Validate response format
      if (Array.isArray(response.data.wishlistItems)) {
        setWishlist(response.data.wishlistItems);
      
      } else {
        throw new Error("Unexpected data format: Expected an array of IDs.");
      }
    } catch (error) {
      console.error("Error fetching wishlist IDs:", error);
      // setError("Failed to load wishlist items."); // Uncomment if you want to handle errors in state
    }
    finally{
      setLoading(false);
    }
  };

  fetchWishlist();
}, [user]);

  
  const wishlistHasItems = wishlist.length > 0;
  if (loading) return <div className="loader-container"> <span className="loader"></span></div>;
  if (!wishlistHasItems) {
    return <EmptyWishList />;
  }

  // Calculate the items to display based on pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = wishlist.slice(startIndex, endIndex);
  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Wishlist', link: '/wishlist' },
   
  ];
  return (
    <>
   <Breadcrumb items={breadcrumbItems} />
    <div className="wishlist-container">
  {paginatedProducts.map((items, id) => (
    items.product ? ( // Check if items.product exists
      <ProductCard
        key={items.id}
        id={items.productId}
        displayName={items.product.displayName}
        image1={items.product.cardImages?.[0] || ""}
        image2={items.product.cardImages?.[1] || ""}
        rating={items.product.rating || 0}
        price={items.product.price || 0}
        description={items.product.description}
        discount={items.product.discount || 0}
        aboveHeight={items.product.aboveHeight || {}}
        belowHeight={items.product.belowHeight || {}}
        colorOptions={items.product.colorOptions || []}
        quantities={items.product.quantities || {}}
        height={items.product.height || ""}
      />
    ) : null // Render nothing if items.product is null or undefined
  ))}
</div>

      {/* Pagination Component */}
      <Pagination
        count={Math.ceil(wishlist.length / itemsPerPage)} // Total pages
        page={page}
        onChange={handleChange}
        style={{ marginBlock: '20px', display: 'flex', justifyContent: 'center' }}
        siblingCount={1} // How many pagination buttons to show around the current one
        variant="outlined"
        shape="rounded"
        className="wishlist-pagination"
        sx={{
          "& .Mui-selected": {
            backgroundColor: "#000000 !important", // Pure black background
            color: "#ffffff !important", // White text
            "&:hover": {
              backgroundColor: "#000000", // Make sure hover doesn't change the color
            },
          },
          "& .MuiPaginationItem-root": {
            backgroundColor: "#e7e7e7" ,
            color: "#6e6e6e", // Default button color
            "&:hover": {
              backgroundColor: "#e6e6e6", // Optional: Light grey hover for unselected buttons
            },
          },
        }}
      />
    </>
  );
}

export default WishList;
