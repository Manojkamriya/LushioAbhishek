import React, { useState, useContext } from "react";
import { ShopContext } from "../../components/context/ShopContext";
import EmptyWishList from "./EmptyWishList";
import ProductCard from "../home/ProductCard";
import { Pagination } from "@mui/material"; // Import Pagination

function WishList() {
  const { all_product, wishlistItems } = useContext(ShopContext);

  const [page, setPage] = useState(1); // For keeping track of the current page
  const itemsPerPage = 8; // Control the number of items per page

  const handleChange = (event, value) => {
    setPage(value);
  };

  // Filter wishlist items
  const wishlistProducts = all_product.filter((e) => wishlistItems[e.id]);

  const wishlistHasItems = wishlistProducts.length > 0;

  if (!wishlistHasItems) {
    return <EmptyWishList />;
  }

  // Calculate the items to display based on pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = wishlistProducts.slice(startIndex, endIndex);

  return (
    <>
    
   
    <h3 className="wishlist-title">Your Wishlist</h3>

    <div className="wishlist-container">
      {paginatedProducts.map((e, id) => (
        <ProductCard
          key={e.id}
          id={e.id}
          description={e.name}
          image1={e.image}
          image2={e.image}
          newPrice={e.new_price}
          oldPrice={e.old_price}
          rating={e.rating}
          liked={true}
          data={e.data || {}}
        />
      ))}

    
    </div>
      {/* Pagination Component */}
      <Pagination
        count={Math.ceil(wishlistProducts.length / itemsPerPage)} // Total pages
        page={page}
        onChange={handleChange}
        style={{ marginBlock: '20px', display: 'flex', justifyContent: 'center' }}
        siblingCount={1} // How many pagination buttons to show around the current one
        variant="outlined"
        shape="rounded"
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
