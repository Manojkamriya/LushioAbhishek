import React from "react";
import Modal from "../productDisplay/Modal";
import "./order.css";

export default function Orders() {
  const orders = [
    {
      id: "#54477622",
      productName: "Men's Grey & Blue Cargo Joggers",
      quantity: 2,
      price: 1500,
      size: "M",
      color: "blue",
      shippingAddress: "73, PNT Colony, Indore, Madhya Pradesh, 452003",
      deliveryDate: "14 Jul, 2024",
      status: "Delivered", // Possible values: "Delivered", "Shipped", "On the Way"
      imgUrl: "/Images/assets/product_102.webp",
    },
    {
      id: "#87834234",
      productName: "Women's Black Hoodie",
      quantity: 1,
      price: 1800,
      size: "L",
      color: "black",
      shippingAddress: "22, MG Road, Mumbai, Maharashtra, 400001",
      deliveryDate: "20 Jul, 2024",
      status: "Shipped",
      imgUrl: "/Images/assets/product_103.webp",
    },
    {
      id: "#34211212",
      productName: "Men's White Sneakers",
      quantity: 1,
      price: 2500,
      size: "XL",
      color: "green",
      shippingAddress: "19, JP Nagar, Bengaluru, Karnataka, 560078",
      deliveryDate: "26 Jul, 2024",
      status: "On the Way",
      imgUrl: "/Images/assets/product_104.webp",
    },
  ];

  return (
    <div className="order-wrapper">
      <div className="order-title">
        <h2>My orders</h2>
        <hr />
      </div>
      <div className="orders-container">
        {orders.map((order) => (
          <div className="order" key={order.id}>
            <div className="orderID">Order ID: {order.id}</div>
            <div className="order-details">
              <img src={order.imgUrl} alt={order.productName} />
              <div className="order-details-right">
                <p>{order.productName}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Price: Rs. {order.price}</p>
                <p>Size: {order.size}</p>
                <p className="order-color">
                  Color: {order.color}
                  <span style={{ backgroundColor: order.color }}></span>
                </p>
                <div className="order-delivery-address">
                  Shipping Address: {order.shippingAddress}
                </div>
                <div className="order-delivery">
                  <img src="/Images/delivery.png" alt="Delivery icon" />{" "}
                  <span>{order.deliveryDate}</span>
                </div>
                <span>{order.status.toUpperCase()}</span>
                <div className="order-button-container">
  {/* Conditionally render buttons based on the status */}
  {order.status === "Delivered" ? (
    <>
      <button>Order Info</button>
      <Modal /> {/* Optionally display a rating modal or button */}
    </>
  ) : (
    <>
      <button>Order Info</button> {/* This will always show */}
      <Modal /> 
      <button>Cancel Order</button> {/* Cancel button when not delivered */}
    </>
  )}
</div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}