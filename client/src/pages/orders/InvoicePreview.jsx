import React from "react";
import "./InvoicePreview.css";

const InvoicePreview = ({ data }) => {
  const { clientName, invoiceNumber, date, items, Ship_To } = data;

  return (
    <div id="invoice-preview" className="invoice-preview">
         <div className="company-name">
    <h1>LUSHIO PRIVATE LIMITED</h1>
    {/* <p>Your Tagline or Slogan Here</p>  */}
  </div>

      {/* HEADER */}
      <header className="invoice-header">
        <div className="bill-to">
          <h3>Bill To</h3>
          <p><strong>Name: </strong> {clientName || 'N/A'}</p>
          <p><strong>Address:</strong> 123 Main Street, City, Country</p>
        </div>
        <div className="invoice-info">
          <h3>Invoice</h3>
          <p>Original for Recipient</p>
        </div>
      </header>

      {/* ORDER AND INVOICE DETAILS */}
      <section className="order-invoice-details">
        <div className="left">
          <p><strong>Order Number:</strong> 00123</p>
        </div>
        <div className="right">
          <p><strong>Invoice Number:</strong> {invoiceNumber || 'N/A'}</p>
        </div>
      </section>

      {/* SHIP TO, ORDER DATE, AND INVOICE DATE */}
      <section className="shipping-invoice-details">
        <div className="left">
          <h3>Ship To</h3>
          <p><strong>Name: </strong> {Ship_To || 'N/A'}</p>
          <p><strong>Address:</strong> 456 Another Street, City, Country</p>
        </div>
        <div className="middle">
          <p><strong>Order Date:</strong> {date || 'N/A'}</p>
        </div>
        <div className="right">
          <p><strong>Invoice Date: </strong> {date || 'N/A'}</p>
        </div>
      </section>

      {/* TABLE FOR BILL ITEMS */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Gross Amount</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.description || "N/A"}</td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>₹{(item.price * 0.1).toFixed(2)}</td> {/* Example 10% discount */}
              <td>₹{(item.quantity * item.price * 0.9).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TERMS AND CONDITIONS */}
      <section className="terms-and-conditions">
        <h3>Terms & Conditions</h3>
        <p>1. Payment is due within 30 days of receipt of invoice.</p>
        <p>2. Late payments are subject to additional fees.</p>
        <p>3. All sales are final. No refunds or exchanges.</p>
      </section>
    </div>
  );
};

export default InvoicePreview;

