import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./cartitems.css";
import CartRow from "./CartRow";
import EmptyCart from "./EmptyCart";
import PaymentMethod from "./PaymentMethod";
import axios from "axios";
import { UserContext } from "../../components/context/UserContext";
import { useWishlist } from "../../components/context/WishlistContext";
import PriceDetails from "./PriceDetails";
import PlaceOrder from "./PlaceOrder";
import Success from "./Success";
import { useAddress } from "../../components/context/AddressContext";
const CartItems = () => {
  const navigate = useNavigate();
  const { selectedAddress } = useAddress();
  const [promoCode, setPromoCode] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('phonepe');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [useWalletPoints, setUseWalletPoints] = useState(true);
  const [walletPoints, setWalletPoints] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(true); // default all selected
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
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
     // console.log(response.data);
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
       //   console.log("Fetched user data:", response.data);
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
  // const getTotalWithWalletAndDiscount = () => {
  //   let total = getSelectedTotalAmount();
  //   if (useWalletPoints && walletPoints > 0) {
  //     total = Math.max(0, total - walletPoints); // Ensure total doesn't go below zero
  //   }
  //   const discountAmount = (total * discountPercentage) / 100; // Calculate discount
  //   return Math.max(0, total - discountAmount); // Apply discount and ensure total doesn't go below zero
  // };
  const getTotalWithWalletAndDiscount = () => {
    let total = getSelectedTotalAmount();
  
    // Apply wallet points if applicable
    if (useWalletPoints && walletPoints > 0) {
      total = Math.max(0, total - walletPoints); // Ensure total doesn't go below zero
    }
  
    // Calculate coupon discount
    const couponDiscountAmount = (total * discountPercentage) / 100; // Calculate coupon discount
    total = Math.max(0, total - couponDiscountAmount); // Apply coupon discount and ensure total doesn't go below zero
  
    // Apply additional discount for payment method
    if (selectedPaymentMethod !== "cashOnDelivery") {
      const additionalDiscount = total * 0.05; // 5% additional discount for online payment
      total = Math.max(0, total - additionalDiscount); // Apply additional discount and ensure total doesn't go below zero
    }
  
    // No additional discount for "COD"
  
    return total;
  };
  
  const handleWalletCheckboxChange = () => {
    setUseWalletPoints(!useWalletPoints);
  };
  const getSelectedProductDetails = (cartProducts) => {
    // Extract product details for selected items from cartProducts
    const selectedProductDetails = Object.keys(selectedItems)
      .filter((id) => selectedItems[id]) // Include only selected items
      .map((id) => {
        const cartProduct = cartProducts.find((product) => product.id === id);
        
        if (cartProduct) {
        
          const { productId, color, height, quantity, size, product } = cartProduct;
          const { name: name } = product; // Extract `name` and rename it to `productName`
          
          return {productId, color, height, quantity,size, name  }; // Adjust fields as needed
        }
        return null; // Handle missing products gracefully
      })
      .filter(Boolean); // Remove null values
  
    return selectedProductDetails;
  };
  const selectedProductDetails = getSelectedProductDetails(cartProducts);
 // console.log(selectedProductDetails); 
 
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
  //  console.log(cartProducts);
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
   // console.log("Selected Address:", selectedAddress);
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
  const orderDetails = {
    uid: user.uid,
    modeOfPayment: selectedPaymentMethod,
    totalAmount: getSelectedTotalAmount(),
    payableAmount: getTotalWithWalletAndDiscount(),
       discount: getSelectedTotalAmount()-getTotalWithWalletAndDiscount(),
    lushioCurrencyUsed: useWalletPoints && walletPoints,
    couponCode: "",
    address: selectedAddress,
    orderedProducts:selectedProductDetails
    // razorpay_payment_id: "pay_29QQoUBi66xm2f",
    // razorpay_order_id: "order_9A33XWu170gUtm",
    // razorpay_signature: "af0a9dc9d4b19122304de94f3d1f9ac",
  };
  
 
  const handleCreateOrder = async () => {
  if(selectedPaymentMethod==="phonepe"){
    return;
  }
   console.log(orderDetails);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/lushio-fitness/us-central1/api/orders/createOrder",
        orderDetails
      );
    
      console.log("Response:", response.data);
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 4000); 
    } catch (error) {
    console.log(error);
    }
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
    const totalAmount = getTotalWithWalletAndDiscount();
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
    <h4>Delivery Address:</h4>
    <div style={{display: "flex"}}> 
    <strong>{selectedAddress.name},</strong> <strong >{selectedAddress.pinCode} </strong>
    </div>
  
    <span>{selectedAddress.flatDetails},</span>
    <span>{selectedAddress.areaDetails},</span>
  { selectedAddress.landmark&& <span>{selectedAddress.landmark},</span>}
    <span>
      {selectedAddress.townCity}, {selectedAddress.state},
    </span>
  
  </div>: <p>No addresses found. Please add a new address.</p>
}  
<PlaceOrder/>

      </div>
    <Success successOpen={successOpen} setSuccessOpen={setSuccessOpen}/>
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
        couponApplied={couponApplied}
        setCouponApplied={setCouponApplied}
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
      <PaymentMethod
      selectedPaymentMethod={selectedPaymentMethod}
      setSelectedPaymentMethod={setSelectedPaymentMethod}
      />
      <div className="priceBlock-button-mobile">
      <button onClick={handleCreateOrder} className="proceed-to-pay-button">
        PLACE ORDER ₹{getTotalWithWalletAndDiscount()}
      </button>
      </div>
    </>
  );
};

export default CartItems;
