import React,{useState} from 'react'
import "./orderinfo.css"
//import { FaCopy, FaCheck } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
//import { AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import { FaChevronRight } from 'react-icons/fa';
import OrderedProducts from './OrderedProducts';
function OrderInfo() {
  const [copied, setCopied] = useState(false);
  const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
  const currentStep = 3; // Hardcoded current step (1-based index)
  const handleCopy = () => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      // setTimeout(() => setCopied(false), 2000);
    });
  };
  const orderId = "1234567890"
  return (
    <>
        <div className="orderId-container">
      <div className="orderId-left">
        <h4 className="orderId-heading">ORDER ID</h4>
        <p className="orderId">{orderId}</p>
        <p>Payment Mode <strong>Cash On delivery</strong></p>
      </div>
      <div className="orderId-right" onClick={handleCopy}>
  {copied ? (
    <div className="orderId-copiedContainer">
      <AiOutlineCheck className="orderId-checkIcon" />
      <p className="orderId-text">Copied</p>
    </div>
  ) : (
    <div className="orderId-copyContainer">
      <FiCopy className="orderId-copyIcon" />
      <p className="orderId-text">Copy</p>
    </div>
  )}
</div>

    </div>
    <OrderedProducts/>
 
    <div className="order-tracking-vertical-container">
      <h2 className="order-tracking-vertical-heading">Delivery Status</h2>
      <div className="order-tracking-progress-bar">
        <div
          className="order-tracking-progress"
          style={{ height: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>
      <div className="order-tracking-vertical-steps">
        {steps.map((step, index) => (
          <div
            className={`order-tracking-vertical-step ${
              index + 1 <= currentStep ? "active" : ""
            }`}
            key={index}
          >
            <div className="order-tracking-vertical-icon">
              {index  < currentStep && (
                <AiOutlineCheck className="order-tracking-check-icon" />
              )}
            </div>
            <p className="order-tracking-vertical-label">{step}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="orderId-container">
      <div className="orderId-left">
        <h4 className="orderId-heading">RETURN/EXCHANGE ORDER</h4>
        <p className="orderId">Available till 27 Nov</p>
      </div>
      <div className="orderId-right" >
      <FaChevronRight />
      </div>
    </div>
    <div className="orderId-container">
      <div className="orderId-left">
        <h4 className="orderId-heading">DOWNLOAD INVOICE</h4>
       
      </div>
      <div className="orderId-right" >
      <FaChevronRight />
      </div>
    </div>
    <div className="order-price-details-container">
      <h2 className="order-price-details-heading">Order Details</h2>
      <h4 className="order-price-details-heading">Price Details (2 Items)</h4>
      <div className="order-price-row">
        <span className="order-price-label">Total Amount</span>
        <span className="order-price-value">₹10,000</span>
      </div>
      <div className="order-price-row">
        <span className="order-price-label">Discount</span>
        <span className="order-price-value">-₹2,000</span>
      </div>
      <div className="order-price-row">
        <span className="order-price-label">Order Total</span>
        <span className="order-price-value">₹8,000</span>
      </div>
      <div className="order-price-row">
        <span className="order-price-label">Delivery Charges</span>
        <span className="order-price-value">₹100</span>
      </div>
      <div className="order-price-row order-total">
        <span className="order-price-label">Grand Total</span>
        <span className="order-price-value">₹8,100</span>
      </div>
    </div>
    <div className="order-delivery-container">
      <h2 className="order-delivery-heading">Delivery Address</h2>
      <div className="order-delivery-details">
        <p className="order-delivery-name">Manoh Kamriya</p>
        <p className="order-delivery-address">
         SGSITS , Park Road indore
          <br />
          456001
        </p>
        <p className="order-delivery-contact">+917489236022</p>
      </div>
    </div>
  
    </>
  )
}

export default OrderInfo
