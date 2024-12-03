// useCartCount.js
import { useState, useEffect } from "react";
import axios from "axios";

const useCartCount = (userId) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    if (!userId) return; // If no user ID, return early

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/count/${userId}`
      );
      console.log(response.data);
      setCartCount(response.data.count); // Update cart count from the response
    } catch (error) {
      console.error(error); // Optionally log error
    }
  };

  useEffect(() => {
    fetchCartCount(); // Fetch cart count when the userId changes or the component mounts
  }, [userId]);

  return { cartCount, fetchCartCount };
};

export default useCartCount;
