import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./cartitems.css";
import CartRow from "./CartRow";
import EmptyCart from "./EmptyCart";
import axios from "axios";
import { UserContext } from "../../components/context/UserContext";
import { useWishlist } from "../../components/context/WishlistContext";
import PriceDetails from "./PriceDetails";
import PlaceOrder from "../orders/PlaceOrder";
import { useAddress } from "../../components/context/AddressContext";
import { LocalShipping } from "@mui/icons-material";
const CartItems = () => {
  const navigate = useNavigate();
  const {
   selectedAddress
    
  } = useAddress();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [useWalletPoints, setUseWalletPoints] = useState(true);
  const [walletPoints, setWalletPoints] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(true); // default all selected
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const { wishlist, toggleWishlist } = useWishlist();
  const [showNotification, setShowNotification] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/${user.uid}`
      );
      setCartProducts(response.data.cartItems);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/wallet/${user.uid}`
          );
          const data = response.data;
          setWalletPoints(data.totalCredits);
          console.log("Fetched user data:", response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const initialSelectedItems = {};
    cartProducts.forEach((item) => {
      initialSelectedItems[item.id] = true; // assuming every item is selected by default
    });
    setSelectedItems(initialSelectedItems);
  }, [cartProducts]);

  const handleOpen = (e) => {
    setSelectedProduct(e.product);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  // Calculate total after applying wallet points and discount
  const getTotalWithWalletAndDiscount = () => {
    let total = getSelectedTotalAmount();
    if (useWalletPoints && walletPoints > 0) {
      total = Math.max(0, total - walletPoints); // Ensure total doesn't go below zero
    }
    const discountAmount = (total * discountPercentage) / 100; // Calculate discount
    return Math.max(0, total - discountAmount); // Apply discount and ensure total doesn't go below zero
  };

  const handleWalletCheckboxChange = () => {
    setUseWalletPoints(!useWalletPoints);
  };

  const handleCheckboxChange = (id) => {
    const updatedSelected = { ...selectedItems, [id]: !selectedItems[id] };
    setSelectedItems(updatedSelected);
    setIsAllSelected(Object.values(updatedSelected).every(Boolean)); // check if all are selected
  };

  const handleSelectAll = () => {
    const updatedSelections = {};
    cartProducts.forEach((item) => {
      updatedSelections[item.id] = true;
    });
    setSelectedItems(updatedSelections);
    setIsAllSelected(true);
  };

  const handleDeselectAll = () => {
    const updatedSelections = {};
    cartProducts.forEach((item) => {
      updatedSelections[item.id] = false;
    });
    setSelectedItems(updatedSelections);
    setIsAllSelected(false);
  };
  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000); 
      return;
    }
    console.log("Selected Address:", selectedAddress);
    // Add further logic for proceeding to payment, like API calls or navigation
  };
  const getSelectedTotalAmount = () => {
    let total = 0;
    cartProducts.forEach((item) => {
      const isHeightBased = item.height;
      const inStock = isHeightBased
        ? item.product[item.height]?.quantities?.[item.color]?.[item.size] > 0
        : item.product.quantities[item.color]?.[item.size] > 0;

      if (selectedItems[item.id] && inStock) {
        total += item.product.price * item.quantity; // Only add price for items in stock and selected
      }
    });
    return total;
  };

  const handleMoveToWishlist = async (
    wishlistItemID,
    productID,
    cartItemId
  ) => {
    console.log("Removing from cart and adding to wishlist");

    try {
      setIsActive(true);
      await toggleWishlist(wishlistItemID, productID);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }

    try {
      await handleRemoveFromCart(user.uid, cartItemId);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
    setIsActive(false);
  };

  const handleRemoveFromCart = async (uid, cartItemId) => {
    console.log(uid, cartItemId);
    setIsActive(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/delete/${cartItemId}`,
        {
          data: { uid: uid },
        }
      );
      console.log("Item removed:", response.data);
      await fetchCartItems();
      handleClose();
    } catch (error) {
      console.error(
        "Error removing item from cart:",
        error.response || error.message
      );
    }
    setIsActive(false);
  };

  if (loading)
    return (
      <div className="loader-container">
        {" "}
        <span className="loader"></span>
      </div>
    );
  if (cartProducts.length === 0) {
    return <EmptyCart />; // Render empty cart message
  }

  const renderCartMessages = () => {
    const totalAmount = getSelectedTotalAmount();
    if (totalAmount === 0) {
      return (
        <p style={{ color: "gray" }}>
          Your cart is currently empty. Add items to proceed to payment.
        </p>
      );
    }
    if (totalAmount >= 2000) {
      return (
        <>
          <p style={{ color: "green" }}>You are eligible for a 10% discount!</p>
          <p style={{ color: "blue" }}>
            Great! Your cart amount is above ₹2000. Enjoy your shopping!
          </p>
        </>
      );
    }
    if (totalAmount >= 1000) {
      return (
        <p style={{ color: "red" }}>You are eligible for a 5% discount!</p>
      );
    }
    if (totalAmount >= 500) {
      return (
        <p style={{ color: "orange" }}>
          Add ₹{1000 - totalAmount} more to be eligible for a 5% discount.
        </p>
      );
    }
    return null;
  };

  const shippingFee = "FREE";

  return (
    <>
     {showNotification && (
        <div className="cart-notification" style={{ aspectRatio: 180 / 25 }}>
           Select Address to Proceed
        </div>
      )}
      {isActive && (
        <div className="spinner-overlay">
          <div></div>
        </div>
      )}
      <div className="selected-address-container">
     
      {selectedAddress  ?
  <div className="selected-address">
    <h3>Delivery Address:</h3>
    <span>{selectedAddress.name},</span>
    <span>{selectedAddress.flatDetails},</span>
    <span>{selectedAddress.areaDetails},</span>
  { selectedAddress.landmark&& <span>{selectedAddress.landmark},</span>}
    <span>
      {selectedAddress.townCity}, {selectedAddress.state},
    </span>
    <p>Pin Code: {selectedAddress.pinCode}</p>
  </div>: <p>No addresses found. Please add a new address.</p>
}  
<PlaceOrder/>
      </div>
    
      <div className="cartitems">
        <div className="select-all-buttons">
          {isAllSelected ? (
            <button className="select-button" onClick={handleDeselectAll}>
              Deselect All
            </button>
          ) : (
            <button className="select-button" onClick={handleSelectAll}>
              Select All
            </button>
          )}
          <div className="cart-items">
            {cartProducts.map((item, i) => (
              <CartRow
                key={i}
                item={item}
                selectedItems={selectedItems}
                handleCheckboxChange={handleCheckboxChange}
               
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
                selectedProduct={selectedProduct}
                handleMoveToWishlist={handleMoveToWishlist}
                handleRemoveFromCart={handleRemoveFromCart}
              />
            ))}
          </div>
        </div>

        <PriceDetails
          discountPercentage={discountPercentage}
          setDiscountPercentage={setDiscountPercentage}
          walletPoints={walletPoints}
          useWalletPoints={useWalletPoints}
          handleWalletCheckboxChange={handleWalletCheckboxChange}
          getSelectedTotalAmount={getSelectedTotalAmount}
          getTotalWithWalletAndDiscount={getTotalWithWalletAndDiscount}
          renderCartMessages={renderCartMessages}
          shippingFee={shippingFee}
        />
      </div>
      <div className="priceBlock-button-mobile">
      <button onClick={handleProceedToPayment} className="proceed-to-pay-button">
        PROCEED TO PAY ₹{getTotalWithWalletAndDiscount()}
      </button>
      </div>
    </>
  );
};

export default CartItems;
