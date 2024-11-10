import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./cartitems.css";
import CartRow from "./CartRow";
import EmptyCart from "./EmptyCart";
import axios from "axios";
//import { Modal, Box, Fade, Backdrop } from "@mui/material";
import { UserContext } from "../../components/context/UserContext";
import Coupon from "./Coupon";

const CartItems = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [useWalletPoints, setUseWalletPoints] = useState(true);
  const [walletPoints, setWalletPoints] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(true); // default all selected
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart/${user.uid}`);
        setCartProducts(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/wallet/${user.uid}`);
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

  // const getSelectedTotalAmount = () => {
  //   let total = 0;
  //   cartProducts.forEach((item) => {
  //     if (selectedItems[item.id]) {
  //       total += item.product.price * item.quantity; // Assuming quantity is stored in the item object
  //     }
  //   });
  //   return total;
  // };
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

  const handleIncrement = (id) => {
    // Increment logic here (if required)
  };

  const handleDecrement = (id) => {
    // Decrement logic here (if required)
  };

  const handleAddToWishlist = (id) => {
    // Add to wishlist logic here (if required)
  };

  const handleRemoveFromCart = (id) => {
    // Remove from cart logic here (if required)
  };

  const handleSubmitPromoCode = () => {
    // Logic to validate the promo code and set the discount percentage
    if (promoCode === "DISCOUNT10") {
      setDiscountPercentage(10);
      alert("Promo code applied: 10% discount!");
    } else if (promoCode === "DISCOUNT5") {
      setDiscountPercentage(5);
      alert("Promo code applied: 5% discount!");
    } else {
      setDiscountPercentage(0);
      alert("Invalid promo code.");
    }
  };

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
      return <p style={{ color: "red" }}>You are eligible for a 5% discount!</p>;
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

  return (
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
      </div>

      <div className="cartitems-format-main">
        <p>Select</p>
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {cartProducts.map((item, i) => (
        <CartRow
          key={i}
          item={item}
          selectedItems={selectedItems}
          handleCheckboxChange={handleCheckboxChange}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          handleOpen={handleOpen}
          handleClose={handleClose}
          open={open}
          selectedProduct={selectedProduct}
          handleAddToWishlist={handleAddToWishlist}
          handleRemoveFromCart={handleRemoveFromCart}
        />
      ))}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>{getSelectedTotalAmount()}</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          
          <div className="cartitems-total-item">
            <p>Use Wallet Points ({walletPoints} points)</p>
            <input
              type="checkbox"
              checked={useWalletPoints}
              onChange={handleWalletCheckboxChange}
            />
          </div>
          {useWalletPoints && (
            <>
              <p className="cartitems-total-item">
                Wallet Discount: -Rs {walletPoints}
              </p>
              <hr />
            </>
          )}
          {
            discountPercentage > 0 && <>
               <div className="cartitems-total-item">
   <p>Promo Code Discount</p>
   <p>{discountPercentage}%</p>
 </div>
 <hr />

            </>
          }
       
          <div className="cartitems-total-item">
            <p>Total</p>
            <p>{getTotalWithWalletAndDiscount()}</p>
          </div>
          <button onClick={() => navigate("/place-order")}>
            PROCEED TO PAY Rs. {getTotalWithWalletAndDiscount()}
           </button>
           {renderCartMessages()}
        </div>

        <div className="cartitems-promocode">
          <p>If you have a promocode,Use it here</p>
          <div className="cartitems-promobox">
           
            <Coupon discount={discountPercentage} setDiscount={setDiscountPercentage} cartAmount={getSelectedTotalAmount()}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
