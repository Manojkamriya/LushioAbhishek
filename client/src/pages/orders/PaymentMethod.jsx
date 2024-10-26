import React, { useState } from 'react';
import './PaymentMethod.css'; // Import your CSS file

const PaymentMethod = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  return (
    <div className="payment-method-container">
      <h2>Select a Payment Method</h2>
      <div className="payment-method-options">
        <label className={`payment-option ${selectedPaymentMethod === 'phonepe' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="payment-method"
            value="phonepe"
            checked={selectedPaymentMethod === 'phonepe'}
            onChange={handlePaymentMethodChange}
          />
          <span className="icon"><img src="/Lushiofitness/Images/icons/cod.png"/></span>
          <span>PhonePe</span>
        </label>
        <label className={`payment-option ${selectedPaymentMethod === 'razorpay' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="payment-method"
            value="razorpay"
            checked={selectedPaymentMethod === 'razorpay'}
            onChange={handlePaymentMethodChange}
          />
          <span className="icon">{/* Razorpay Icon */}</span>
          <span>Razorpay</span>
        </label>
        <label className={`payment-option ${selectedPaymentMethod === 'cod' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="payment-method"
            value="cod"
            checked={selectedPaymentMethod === 'cod'}
            onChange={handlePaymentMethodChange}
          />
          <span className="icon">{/* COD Icon */}</span>
          <span>Cash on Delivery (COD)</span>
        </label>
      </div>
      <div className="selected-method">
        {selectedPaymentMethod && <p>You have selected: <strong>{selectedPaymentMethod}</strong></p>}
      </div>
    </div>
  );
};

export default PaymentMethod;
