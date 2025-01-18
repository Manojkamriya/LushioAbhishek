import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./productCard.css";
import axios from "axios";
import ProductCard from "./ProductCard";
import { UserContext } from '../../components/context/UserContext';

function ProductCards() {
  const navigate = useNavigate();
  const {user} = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/allProducts`);
        const data = response.data;
       
  
        if (Array.isArray(data.products)) {
         
          setProducts(data.products); // Access the 'products' array within the response object
        } else {
          console.error("Expected an array, but received:", data.products); // Log unexpected format
          setProducts([]); // Fallback to an empty array if the data format is unexpected
       
        }
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err); // Log fetch error
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
 useEffect(() => {
    const fetchWishlistIds = async () => {
      if (!user?.uid) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist/array/${user.uid}`);
          
        const data = response.data;
       

        // Validate response format
        if (Array.isArray(response.data)) {
          setWishlistIds(data);
         
        } 
      } catch (error) {
        console.error("Error fetching wishlist IDs:", error);
        setError("Failed to load wishlist items.");
      }
    };

    fetchWishlistIds();
  }, []);
  
  const handleWishlistToggle = (productId) => {
    if (wishlistIds.includes(productId)) {
      setWishlistIds((prevIds) => prevIds.filter(id => id !== productId));
    } else {
      setWishlistIds((prevIds) => [...prevIds, productId]);
    }
  };

  return (
    <>
   
      <div className="product-card-container">
        {products.map((item, index) => (
          <ProductCard
            key={item.id}
            id={item.id}
            displayName={item.displayName}
            image1={item.cardImages?.[0] || ""}
            image2={item.cardImages?.[1] || ""}
            rating={item.rating || 0}
            price={item.price || 0}
            discountedPrice={item.discountedPrice || 0}
            description={item.description}
            discount={item.discount || 0}
            aboveHeight={item.aboveHeight || {}}
            belowHeight={item.belowHeight || {}}
            colorOptions={item.colorOptions || []}
            quantities={item.quantities || {}}
            height={item.height || ""}
         //   isLiked={wishlistIds.includes(item.id)}
           // isLiked={wishlistIds.includes(item.id)}
           // onWishlistToggle={() => handleWishlistToggle(item.id)} 
          />
        ))}
      </div>
    </>
  );
}

export default ProductCards;
