import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const { user } = useContext(UserContext);

  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/name/${user.uid}`
        );

        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserName();
  }, [user]);
  const fetchCartCount = async () => {
    if (!user?.uid) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/count/${user.uid}`
      );
      console.log(response.data.count);
      setCartCount(response.data.count);
    } catch (error) {
      console.error("Error fetching cart count", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, userName }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
