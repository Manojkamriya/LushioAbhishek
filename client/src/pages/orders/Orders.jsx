import React,{useState, useEffect, useContext} from "react";
import axios from "axios";
import RatingModal from "../productDisplay/RatingModal";
import DeliveryStatus from "./Delivery";
import EmptyOrder from "./EmptyOrder";
import { UserContext } from "../../components/context/UserContext";
import "./order.css";

export default function Orders() {
  const {user}= useContext(UserContext)
  const order = [
    {
      id: "#54477622",
      products: [
        {
          productName: "Men's Grey & Blue Cargo Joggers",
          quantity: 2,
          price: 1500,
          size: "M",
          color: "blue",
          imgUrl: "/Images/assets/product_102.webp",
        },
        {
          productName: "Men's Black T-Shirt",
          quantity: 1,
          price: 800,
          size: "L",
          color: "black",
          imgUrl: "/Images/assets/product_105.webp",
        },
      ],
      shippingAddress: "73, PNT Colony, Indore, Madhya Pradesh, 452003",
      deliveryDate: "14 Jul, 2024",
      status: "Delivered",
    },
    {
      id: "#87834234",
      products: [
        {
          productName: "Women's Black Hoodie",
          quantity: 1,
          price: 1800,
          size: "L",
          color: "black",
          imgUrl: "/Images/assets/product_103.webp",
        },
        {
          productName: "Women's White T-Shirt",
          quantity: 2,
          price: 900,
          size: "S",
          color: "white",
          imgUrl: "/Images/assets/product_106.webp",
        },
      ],
      shippingAddress: "22, MG Road, Mumbai, Maharashtra, 400001",
      deliveryDate: "20 Jul, 2024",
      status: "Shipped",
    },
    {
      id: "#34211212",
      products: [
        {
          productName: "Men's White Sneakers",
          quantity: 1,
          price: 2500,
          size: "XL",
          color: "green",
          imgUrl: "/Images/assets/product_104.webp",
        }
      ],
      shippingAddress: "19, JP Nagar, Bengaluru, Karnataka, 560078",
      deliveryDate: "26 Jul, 2024",
      status: "On the Way",
    },
  ];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ hasMore: true, lastOrderId: null });
  const [error, setError] = useState(null);
const userId = "wwzOIF1KUvgqINpbDiyK8ZMaE6K2";
  const fetchOrders = async () => {
    try {
      setLoading(true);

const orderDetails = {
  uid: user.uid,
  
  
  limit: 5,
  lastOrderId: pagination.lastOrderId,
};
console.log(orderDetails);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/`, {
     params: orderDetails
      });
      console.log(response.data);
      const { orders: fetchedOrders, pagination: fetchedPagination } = response.data;

      setOrders((prevOrders) => [...prevOrders, ...fetchedOrders]);
      setPagination(fetchedPagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);
  const handleCancelProduct = (orderId, productId) => {
    console.log(`Cancelling product ${productId} in order ${orderId}`);
    // Logic to cancel the product
  };
  
  const handleRateProduct = (orderId, productId) => {
    console.log(`Rating product ${productId} in order ${orderId}`);
    // Logic to handle product rating (e.g., show a modal)
  };
  
  const handleCancelOrder = (orderId) => {
    console.log(`Cancelling order ${orderId}`);
    // Logic to cancel the entire order
  };
  
  const handleLoadMore = () => {
    if (pagination.hasMore) {
      fetchOrders();
    }
  };
if(order.length>0){
  return <EmptyOrder/>
}
  return (
    <div className="order-wrapper">
    <div className="order-title">
      <h2>My Orders</h2>
      <hr />
      {/* <DeliveryStatus/> */}
    </div>
    <div className="orders-container">
    {order.map((order) => (
  <div className="order" key={order.id}>
    <div className="orderID">
      <strong>Order ID:</strong> {order.id}
    </div>

    <div className="order-products">
      {order.products.map((product, index) => (
        <div className="product-details" key={index}>
          <img
            src={product.imgUrl}
            alt={product.productName}
            className="product-image"
          />
          <div className="product-info">
            <h3>{product.productName}</h3>
            <p>
              <strong>Quantity:</strong> {product.quantity}
            </p>
            <p>
              <strong>Price:</strong> Rs. {product.price}
            </p>
            <p>
              <strong>Size:</strong> {product.size}
            </p>
            <p className="product-color">
              <strong>Color:</strong> {product.color}
              <span
                className="color-box"
                style={{ backgroundColor: product.color }}
              ></span>
            </p>
            {/* Individual Cancel and Rate Us Buttons */}
            <div className="item-button-container">
              <button
               className="open-rating-button"
                onClick={() => handleCancelProduct(order.id, product.id)}
              >
                Cancel
              </button>
              <button
              className="open-rating-button"
                onClick={() => handleRateProduct(order.id, product.id)}
              >
                Rate Us
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="order-delivery-address">
      <strong>Shipping Address:</strong> {order.shippingAddress}
    </div>

    <div className="order-delivery">
      <img
        src="/Images/delivery.png"
        alt="Delivery icon"
        className="delivery-icon"
      />
      <span>
        <strong>Expected Delivery Date:</strong> {order.deliveryDate}
      </span>
    </div>

    <span className={`order-status ${order.status.toLowerCase()}`}>
      {order.status.toUpperCase()}
    </span>

    <div className="order-button-container">
      {/* Cancel Order Button */}
      <button
      className="open-rating-button"
        onClick={() => handleCancelOrder(order.id)}
      >
        Cancel Order
      </button>
      <button className="open-rating-button">Order Info</button>
    </div>
  </div>
))}

    </div>
  </div>
  
  );
}