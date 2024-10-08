import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cartitems.css";
import { ShopContext } from "../../components/context/ShopContext";
import EmptyCart from "./EmptyCart";


const CartItems = () => {
  const navigate = useNavigate();
  const { all_product, cartItems, removeFromCart, updateCartItemQuantity , addToWishlist} =
    useContext(ShopContext);
const [isAllSelected, setISAllSelected] = useState(false);
  // State to store whether an item is selected (checked) or not
  const [checkedItems, setCheckedItems] = useState(
    Object.keys(cartItems).reduce((acc, id) => {
      const product = all_product.find((p) => p.id === Number(id));
      // acc[id] = true; // By default, all checkboxes are checked
      acc[id] = product && product.inStock; // Uncheck sold-out items
      return acc;
    }, {})
  );

  // Check if there are any items in the cart
  const cartHasItems = Object.values(cartItems).some(
    (quantity) => quantity > 0
  );

  if (!cartHasItems) {
    return <EmptyCart />; // Render empty cart message
  }

  // Function to calculate the total for selected (checked) items only
  const getTotalCartAmount = () => {
    return all_product.reduce((total, e) => {
      if (cartItems[e.id] > 0 && checkedItems[e.id]) {
        return total + e.new_price * cartItems[e.id];
      }
      return total;
    }, 0);
  };

  // Handle change for checkbox toggle
  const handleCheckboxChange = (id) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [id]: !prevCheckedItems[id],
    }));
  };
// Function to select all items
const handleSelectAll = () => {
  const newCheckedItems = {};
  setISAllSelected(false);
  Object.keys(cartItems).forEach((id) => {
    const product = all_product.find((p) => p.id === Number(id));
    if (product && product.inStock) {
      newCheckedItems[id] = true; // Only select in-stock items
    }
  });
  setCheckedItems(newCheckedItems);
};

// Function to deselect all items
const handleDeselectAll = () => {
  const newCheckedItems = {};
  setISAllSelected(true);
  Object.keys(cartItems).forEach((id) => {
    const product = all_product.find((p) => p.id === Number(id));
    if (product) {
      newCheckedItems[id] = false; // Deselect all items
    }
  });
  setCheckedItems(newCheckedItems);
};

  // Increment quantity
  const handleIncrement = (id) => {
    updateCartItemQuantity(id, cartItems[id] + 1); // Assuming updateCartItemQuantity is a function from ShopContext
  };

  // Decrement quantity
  const handleDecrement = (id) => {
    if (cartItems[id] > 1) {
      updateCartItemQuantity(id, cartItems[id] - 1);
    }
  };
  const renderCartMessages = () => {
    const totalAmount = getTotalCartAmount();
    if (totalAmount === 0) {
      return <p style={{ color: "gray" }}>Your cart is currently empty. Add items to proceed to payment.</p>;
    }
  
    if (totalAmount >= 2000) {
      return (
        <>
          <p style={{ color: "green" }}>You are eligible for a 10% discount! </p>
          <p style={{ color: "blue" }}>Great! Your cart amount is above ₹2000. Enjoy your shopping!</p>
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
  
    return null; // No messages for amounts below 500
  };
  
  return (
    <div className="cartitems">
       <div className="select-all-buttons">
        {
          isAllSelected ?   <button className="select-button" onClick={handleSelectAll}>Select All</button>:   <button className="select-button" onClick={handleDeselectAll}>Deselect All</button>
        }
    
   
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
              <div className={`cartitems-format cartitems-format-main ${!e.inStock ? 'sold-out' : ''}`}>
               {/* Checkbox to select item */}
{!e.inStock ? (
  // <p className="sold-out-indicator">Sold Out</p>
  <button className="cart-add-to-wishlist" onClick={()=>{addToWishlist(e.id); removeFromCart(e.id)}}>Move to wishlist</button>
) : (
  <input
    type="checkbox"
    checked={checkedItems[e.id]}
    onChange={() => handleCheckboxChange(e.id)}
    disabled={!e.inStock} // Disable checkbox if sold out
  />
)}

               
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>{e.new_price}</p>
                <div className="quantity-controller">
                
               
                  <button
                    className="cartitems-quantity"
                    onClick={() => handleDecrement(e.id)}
                    disabled={!e.inStock} // Disable if sold out
                  >
                    &#45;
                  </button>
                  <button className="cartitems-quantity">
                    {cartItems[e.id]}
                  </button>
                  <button
                    className="cartitems-quantity"
                    onClick={() => handleIncrement(e.id)}
                    disabled={!e.inStock} // Disable if sold out
                  >
                    &#43;
                  </button>
                </div>
                <p>{e.new_price * cartItems[e.id]}</p>
                <img
                  src="./LushioFitness/Images/icons/delete.png"
                  onClick={() => {
                    removeFromCart(e.id);
                  }}
                  alt=""
                  className="cartitems-remove-icon"
                />
               
              </div>
              <hr />
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
          {/* {getTotalCartAmount() >= 500 && getTotalCartAmount()<1000 && <p style={{color: "orange"}}>Add {1000  - getTotalCartAmount()} more to be eligible for 5% discount </p>}
          {getTotalCartAmount() >= 1000 && <p style={{color: "red"}}>You are eligible for 5% discount</p>} */}

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
