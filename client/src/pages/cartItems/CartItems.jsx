import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cartitems.css";
import { ShopContext } from "../../components/context/ShopContext";
import EmptyCart from "./EmptyCart";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
const CartItems = () => {
  const navigate = useNavigate();
  const {
    all_product,
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    addToWishlist,
  } = useContext(ShopContext);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  // Retrieve checkbox states from localStorage or initialize based on cart items
  const [checkedItems, setCheckedItems] = useState(() => {
    const savedCheckedItems = localStorage.getItem("checkedItems");
    if (savedCheckedItems) {
      return JSON.parse(savedCheckedItems);
    } else {
      return Object.keys(cartItems).reduce((acc, id) => {
        const product = all_product.find((p) => p.id === Number(id));
        acc[id] = product && product.inStock;
        return acc;
      }, {});
    }
  });
  const handleAddToWishlist = (id) => {
    setTimeout(() => {
      addToWishlist(id);
      removeFromCart(id);
      handleClose();
    }, 1000);
  };
  const handleRemoveFromCart = (id) => {
    setTimeout(() => {
      removeFromCart(id);
      handleClose();
    }, 1000);
  };
  // Save checkbox states to localStorage whenever `checkedItems` is updated
  useEffect(() => {
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
  }, [checkedItems]);

  // Check if the cart has any items
  const cartHasItems = Object.values(cartItems).some(
    (quantity) => quantity > 0
  );
  if (!cartHasItems) {
    return <EmptyCart />;
  }

  // Function to calculate total for selected items only
  const getTotalCartAmount = () => {
    return all_product.reduce((total, e) => {
      if (cartItems[e.id] > 0 && checkedItems[e.id]) {
        return total + e.new_price * cartItems[e.id];
      }
      return total;
    }, 0);
  };

  // Handle checkbox change for individual items
  const handleCheckboxChange = (id) => {
    const updatedCheckedItems = {
      ...checkedItems,
      [id]: !checkedItems[id],
    };
    setCheckedItems(updatedCheckedItems);

    // Check if all in-stock items are selected
    const allInStockSelected = Object.keys(cartItems).every((id) => {
      const product = all_product.find((p) => p.id === Number(id));
      return product && (!product.inStock || updatedCheckedItems[id]);
    });
    setIsAllSelected(allInStockSelected);
  };

  // Function to select all in-stock items
  const handleSelectAll = () => {
    const newCheckedItems = {};
    Object.keys(cartItems).forEach((id) => {
      const product = all_product.find((p) => p.id === Number(id));
      if (product && product.inStock) {
        newCheckedItems[id] = true; // Select only in-stock items
      }
    });
    setCheckedItems(newCheckedItems);
    setIsAllSelected(true);
  };

  // Function to deselect all items
  const handleDeselectAll = () => {
    const newCheckedItems = {};
    Object.keys(cartItems).forEach((id) => {
      newCheckedItems[id] = false; // Deselect all items
    });
    setCheckedItems(newCheckedItems);
    setIsAllSelected(false);
  };

  const handleIncrement = (id) => {
    updateCartItemQuantity(id, cartItems[id] + 1);
  };

  const handleDecrement = (id) => {
    if (cartItems[id] > 1) {
      updateCartItemQuantity(id, cartItems[id] - 1);
    }
  };

  const renderCartMessages = () => {
    const totalAmount = getTotalCartAmount();
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
                    checked={checkedItems[e.id]}
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
                  src="./LushioFitness/Images/icons/delete.png"
                  // onClick={() => removeFromCart(e.id)}
                  onClick={handleOpen}
                  alt=""
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
                      border: ".5px solid #000",
                      borderRadius: "9px",
                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <div className="remove-cart-buttons">
                      <button onClick={() => handleAddToWishlist(e.id)}>
                        Move to Wishlist
                      </button>
                      <button onClick={() => handleRemoveFromCart(e.id)}>
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
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{getTotalCartAmount()}</h3>
            </div>
          </div>
          {renderCartMessages()}
          <button onClick={() => navigate("/place-order")}>
            PROCEED TO PAYMENT
          </button>
        </div>

        <div className="cartitems-promocode">
          <p>If you have a promocode, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
