import React from 'react';
import './PaymentMethod.css'; // Import your CSS file

const PaymentMethod = ({selectedPaymentMethod, setSelectedPaymentMethod}) => {
 // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  }; 

  return (
    <div className="payment-method-container">
      <div className="pulse-message skeleton">
 Get 5% OFF if Pay online
</div>

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
                     <div className='payment-method-statement'>
                     <img src='/Images/payOnline.png'/>
                     <span>Pay Online</span>
                     </div>
     
        </label>
        {/* <label className={`payment-option ${selectedPaymentMethod === 'razorpay' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="payment-method"
            value="razorpay"
            checked={selectedPaymentMethod === 'razorpay'}
            onChange={handlePaymentMethodChange}
          />
         
          <span>Razorpay</span>
        </label> */}
        <label className={`payment-option ${selectedPaymentMethod === 'cashOnDelivery' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="payment-method"
            value="cashOnDelivery"
            checked={selectedPaymentMethod === 'cashOnDelivery'}
            onChange={handlePaymentMethodChange}
          />
       
           <div className='payment-method-statement'>
            <img src='/Images/cod.png'/>
            <span>Cash on Delivery (COD)</span>
            </div>
         

       
        </label>
      </div>
      <div className="selected-method">
        {selectedPaymentMethod && <p>You have selected: <strong>{selectedPaymentMethod}</strong></p>}
      </div>
    </div>
  );
};

export default PaymentMethod;
