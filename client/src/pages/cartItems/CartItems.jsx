import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cartitems.css";
import { ShopContext } from "../../components/context/ShopContext";
import { UserContext } from "../../components/context/UserContext";
import EmptyCart from "./EmptyCart";
import axios from "axios";
import { Modal, Box, Fade, Backdrop } from "@mui/material";

const CartItems = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [useWalletPoints, setUseWalletPoints] = useState(false);
  const [walletPoints, setWalletPoints] = useState(null);
  const {
    all_product,
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    addToWishlist,
  } = useContext(ShopContext);
  const cartHasItems = Object.values(cartItems).some(quantity => quantity > 0);

  
  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(true); // default all selected
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Initially, all items are selected when the cart loads
    const initialSelectedItems = {};
    all_product.forEach((e) => {
      if (cartItems[e.id] > 0) {
        initialSelectedItems[e.id] = true;
      }
    });
    setSelectedItems(initialSelectedItems);
  }, [cartItems, all_product]);



  const {user} = useContext(UserContext);
   useEffect(() => {
      if (user) {
        const fetchUserData = async () => {
          try {
      
         //  const response = await axios.get(`https://127.0.0.1:5001/lushio-fitness/us-central1/api/wallet/${user.uid}`);
           const response = await axios.get(`https://us-central1-lushio-fitness.cloudfunctions.net/api/wallet/${user.uid}`);
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
  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };
// Calculate total after applying wallet points
const getTotalWithWallet = () => {
  let total = getSelectedTotalAmount();
  if (useWalletPoints && walletPoints > 0) {
    total = Math.max(0, total - walletPoints); // Ensure total doesn't go below zero
  }
  return total;
};

const handleWalletCheckboxChange = () => {
  setUseWalletPoints(!useWalletPoints);
};
  const handleClose = () => setOpen(false);

  const handleCheckboxChange = (id) => {
    const updatedSelected = { ...selectedItems, [id]: !selectedItems[id] };
    setSelectedItems(updatedSelected);
    setIsAllSelected(Object.values(updatedSelected).every(Boolean)); // check if all are selected
  };

  const handleSelectAll = () => {
    const updatedSelections = {};
    all_product.forEach((e) => {
      if (cartItems[e.id] > 0) {
        updatedSelections[e.id] = true;
      }
    });
    setSelectedItems(updatedSelections);
    setIsAllSelected(true);
  };

  const handleDeselectAll = () => {
    const updatedSelections = {};
    all_product.forEach((e) => {
      if (cartItems[e.id] > 0) {
        updatedSelections[e.id] = false;
      }
    });
    setSelectedItems(updatedSelections);
    setIsAllSelected(false);
  };

  const getSelectedTotalAmount = () => {
    let total = 0;
    all_product.forEach((e) => {
      if (cartItems[e.id] > 0 && selectedItems[e.id]) {
        total += e.new_price * cartItems[e.id];
      }
    });
    return total;
  };

  const handleIncrement = (id) => {
    updateCartItemQuantity(id, cartItems[id] + 1);
  };

  const handleDecrement = (id) => {
    if (cartItems[id] > 1) {
      updateCartItemQuantity(id, cartItems[id] - 1);
    }
  };

  const handleAddToWishlist = (id) => {
    addToWishlist(id);
    removeFromCart(id);
    handleClose();
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    handleClose();
  };

  const handleSubmitPromoCode = () => {
    // Submit the promo code using axios or any logic
    console.log("Promo Code Submitted: ", promoCode);
  };
  if (!cartHasItems) {
    return <EmptyCart/> // Render empty cart message
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

      {all_product.map((e, i) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={i}>
              <div
                className={`cartitems-format cartitems-format-main ${
                  !e.inStock ? "sold-out" : ""
                }`}
              >
                {!e.inStock ? (
                  <button
                    className="cart-add-to-wishlist"
                    onClick={() => {
                      addToWishlist(e.id);
                      removeFromCart(e.id);
                    }}
                  >
                    Move to wishlist
                  </button>
                ) : (
                  <input
                    type="checkbox"
                    checked={selectedItems[e.id] || false}
                    onChange={() => handleCheckboxChange(e.id)}
                  />
                )}
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>{e.new_price}</p>
                <div className="quantity-controller">
                  <button
                    className="cartitems-quantity"
                    onClick={() => handleDecrement(e.id)}
                    disabled={!e.inStock}
                  >
                    &#45;
                  </button>
                  <button className="cartitems-quantity">
                    {cartItems[e.id]}
                  </button>
                  <button
                    className="cartitems-quantity"
                    onClick={() => handleIncrement(e.id)}
                    disabled={!e.inStock}
                  >
                    &#43;
                  </button>
                </div>
                <p>{e.new_price * cartItems[e.id]}</p>
                <img
                  src="/Images/icons/delete.png"
                  onClick={() => handleOpen(e)}
                  alt="Remove"
                  className="cartitems-remove-icon"
                />
              </div>
              <hr />
              <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={open}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 300,
                      bgcolor: "background.paper",
                      borderRadius: "9px",
                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <div className="remove-cart-buttons">
                      <img src={selectedProduct?.image} alt="" />
                      <p>{selectedProduct?.name}</p>
                      <p>{selectedProduct?.new_price}</p>
                      <button onClick={() => handleAddToWishlist(selectedProduct?.id)}>
                        Move to Wishlist
                      </button>
                      <button onClick={() => handleRemoveFromCart(selectedProduct?.id)}>
                        Remove from cart
                      </button>
                    </div>
                  </Box>
                </Fade>
              </Modal>
            </div>
          );
        }
        return null;
      })}
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
        <div className="cartitems-total-item">
          <h3>Total</h3>
          <h3>{getTotalWithWallet()}</h3>
        </div>
        <div className="cart-messages">{renderCartMessages()}</div>
        <button onClick={() => navigate("/place-order")}>
          PROCEED TO PAY Rs . {getTotalWithWallet()}
        </button>
      </div>

      <div className="cartitems-promocode">
        <p>If you have a promocode, enter it here</p>
        <div className="cartitems-promobox">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button onClick={()=>handleSubmitPromoCode}>Submit</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CartItems;