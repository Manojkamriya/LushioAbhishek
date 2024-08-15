import React, { useContext } from "react";
import "./cartitems.css";
import { ShopContext } from "../../components/context/ShopContext";
import EmptyCart from "./EmptyCart";
const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } =
    useContext(ShopContext);
    const cartHasItems = Object.values(cartItems).some(quantity => quantity > 0);

    if (!cartHasItems) {
      return <EmptyCart/> // Render empty cart message
    }
  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
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
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>{e.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[e.id]}
                </button>
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
            <div className="cartitems-total-items">
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
          <button>PROCEED TO PAYMENT</button>
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
