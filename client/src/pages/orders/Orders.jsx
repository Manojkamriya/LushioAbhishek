import React from "react";
import "./order.css";
export default function Orders() {
  return (
    <div className="order-wrapper">
      <div className="order-title">
        <h2>My orders</h2>
        <hr />
      </div>
      <div className="orders-container">
        <div className="order">
          <div className="orderID">Order ID:  #54477622</div>
          <div className="order-details">
            <img src="./LushioFitness/Images/assets/product_102.webp" alt="" />
            <div className="order-details-right">
              <p>Pack of 2 Men's Grey & Blue Cargo Joggers</p>
              <p>size: M</p>

              <div className="order-delivery">
                <img
                  src="./LushioFitness/Images/delivery.png"
                  alt=""
                />{" "}
                <span>14 Jul, 2024</span>
              </div>
              <span>DELIVERED</span>
              <br></br>
              <button>Order Info</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
