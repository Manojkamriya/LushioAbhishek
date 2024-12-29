import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../../components/context/UserContext";
import "./orderinfo.css";
import InvoicePreview from "./InvoicePreview";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

//import { FaCopy, FaCheck } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
//import { AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";
import OrderedProducts from "./OrderedProducts";
function OrderInfo() {
  const [copied, setCopied] = useState(false);
  const { orderId } = useParams();
  const { user } = useContext(UserContext);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
  const currentStep = 3; // Hardcoded current step (1-based index)
  const handleCopy = () => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      // setTimeout(() => setCopied(false), 2000);
    });
  };
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    const uid = user.uid;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}?uid=${uid}`
      );
      console.log(response.data);

      setOrderDetails(response.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };
 
  
  const [invoiceData, setInvoiceData] = useState({
    clientName: "Manoj",
    invoiceNumber: "123456779669",
    date: "23/12/24",
    items:  [
      { description: "hi there", quantity: 1, price: 1200 },
      { description: "item two", quantity: 2, price: 800 },
      { description: "item three", quantity: 3, price: 1500 },
      { description: "item four", quantity: 1, price: 500 },
      { description: "item five", quantity: 4, price: 2000 },
    ],
    totalAmount: 1200,
  });

 
  const downloadPDF = async () => {
    const invoiceElement = document.getElementById("invoice-preview");
  
    // Generate canvas
    const canvas = await html2canvas(invoiceElement, { scale: 2 });
  
    // Convert canvas to image data with reduced quality
    const imgData = canvas.toDataURL("image/jpeg", 1.5); // Use JPEG with a quality setting (0.85 = 85% quality)
  
    // Initialize jsPDF
    const pdf = new jsPDF("p", "mm", "a4");
  
    // Calculate the dimensions of the A4 page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
  
    // Scale the image proportionally to fit A4 dimensions
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2; // Center the image horizontally
    const imgY = 0; // Start at the top of the page
  
    // Add the image to the PDF
    pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth * ratio, imgHeight * ratio, undefined, "FAST");
  
    // Save the PDF with compression
    pdf.save(`invoice-${invoiceData.invoiceNumber || "preview"}.pdf`);
  };
  if (loading)
    return (
      <div className="loader-container">
        {" "}
        <span className="loader"></span>
      </div>
    );
  return (
    <>
      <div className="orderId-container">
        <div className="orderId-left">
          <h4 className="orderId-heading">ORDER ID</h4>
          <p className="orderId">{orderId}</p>
          <p>
            Payment Mode <strong>Cash On delivery</strong>
          </p>
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
      {/* <h1>Download Invoice</h1> */}
      {/* <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} /> */}
      <InvoicePreview data={invoiceData} />
     
    
      <OrderedProducts orderedProducts={orderDetails?.orderedProducts || []} />

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
                {index < currentStep && (
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
        <div className="orderId-right">
          <FaChevronRight />
        </div>
      </div>
      <div className="orderId-container downloadInvoicePdf" onClick={downloadPDF}>
        <div className="orderId-left" >
          <h4 className="orderId-heading">DOWNLOAD INVOICE</h4>
        </div>
        <div className="orderId-right">
          <FaChevronRight />
        </div>
      </div>
      <div className="order-price-details-container">
        <h2 className="order-price-details-heading">Order Details</h2>
        <h4 className="order-price-details-heading">Price Details ({orderDetails?.orderedProducts.length || 0} Items)</h4>
        <div className="order-price-row">
          <span className="order-price-label">Total Amount</span>
          <span className="order-price-value">₹{orderDetails?.totalAmount}</span>
        </div>
        <div className="order-price-row">
          <span className="order-price-label">Order Total</span>
          <span className="order-price-value">₹{orderDetails?.payableAmount}</span>
        </div>
        {orderDetails?.lushioCurrencyUsed > 0 && (
  <div className="order-price-row">
    <span className="order-price-label">Wallet Discount</span>
    <span className="order-price-value">-₹{orderDetails.lushioCurrencyUsed}</span>
  </div>
)}
{orderDetails?.discount > 0 && (
  <div className="order-price-row">
    <span className="order-price-label">Coupon Discount</span>
    <span className="order-price-value">-₹{orderDetails.discount}</span>
  </div>
)}

     
        <div className="order-price-row">
          <span className="order-price-label">Delivery Charges</span>
          <span className="order-price-value">₹100</span>
        </div>
        <div className="order-price-row order-total">
          <span className="order-price-label">Grand Total</span>
          <span className="order-price-value">₹{orderDetails?.payableAmount}</span>
        </div>
      </div>
      <div className="order-delivery-container">
        <h2 className="order-delivery-heading">Delivery Address</h2>
        <div className="order-delivery-details">
          <p className="order-delivery-name">Manoj Kamriya</p>
          <p className="order-delivery-address">
            SGSITS , Park Road indore
            <br />
            456001
          </p>
          <p className="order-delivery-contact">+917489236022</p>
        </div>
      </div>
    </>
  );
}

export default OrderInfo;
