import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import EmptyOrder from "./EmptyOrder";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/context/UserContext";
import "./order.css";

export default function Orders() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    hasMore: true,
    lastOrderId: null,
  });
 

  const fetchOrders = async (isInitialLoad = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders`,
        {
          params: {
            uid: user.uid,
            limit: 5,
            lastOrderId: isInitialLoad ? null : pagination.lastOrderId,
          },
        }
      );

      const { orders: newOrders, pagination: newPagination } = response.data;
      setOrders((prevOrders) =>
        isInitialLoad ? newOrders : [...prevOrders, ...newOrders]
      );
      setPagination(newPagination);
    } catch (err) {
     console.log(err);
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
  if(loading && orders.length==0){
    return (
      <div className="loader-container">
        {" "}
        <span className="loader"></span>
      </div>
    );
  }
  if (orders.length === 0) {
    return <EmptyOrder />;
  }
  return (
    <div className="order-wrapper">
      <div className="order-title">
        <h2>My Orders</h2>
        <hr />
        {/* <DeliveryStatus/> */}
      </div>

      <div className="orders-container">
        {orders.map((order, index) => (
          <div className="order" key={index}>
            <div className="orderID">
              <strong>Order ID:</strong> {order.orderId}
            </div>

            <div className="order-products">
              {order.orderedProducts.map((product, index) => (
                <div className="product-details" key={index}>
                  <img
                    src={product.productDetails.cardImages[0]}
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
                        style={{ backgroundColor: product.colorCode }}
                      ></span>
                    </p>
                    {/* Individual Cancel and Rate Us Buttons */}
                    <div className="item-button-container">
                      <button
                        className="open-rating-button"
                        onClick={() =>
                          handleCancelProduct(order.id, product.id)
                        }
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
              <strong>Shipping Address:</strong>{" "}
              <strong>{order.address.pinCode}</strong>
              {", "}
              {order.address.flatDetails}
              {", "}
              {order.address.areaDetails}
              {", "}
              {order.address.townCity}
              {", "}
              {order.address.state}
              {", "}
              {order.address.country}
            </div>

            <div className="order-delivery">
              <img
                src="/Images/delivery.png"
                alt="Delivery icon"
                className="delivery-icon"
              />
              <span>
                <strong>Expected Delivery Date:</strong>
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
              <button
                className="open-rating-button"
                onClick={() => navigate(`/orderInfo/${order.orderId}`)}
              >
                Order Info
              </button>
            </div>
          </div>
        ))}
      </div>
      {pagination.hasMore && (
        <button
          onClick={() => fetchOrders(false)}
          disabled={loading}
          className="order-load-more-button"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
