import React from "react";
import Coupon from "./Coupon";
import PaymentMethod from "./PaymentMethod";
const PriceDetails = ({
  couponApplied,
  setCouponApplied,
  discountPercentage,
  setDiscountPercentage,
  walletPoints,
  useWalletPoints,
  handleWalletCheckboxChange,
  getSelectedTotalAmount,
  getTotalWithWalletAndDiscount,
  renderCartMessages,
  shippingFee,
  selectedPaymentMethod, 
  setSelectedPaymentMethod,
  handleCreateOrder,
}) => {
  const totalAmount = getTotalWithWalletAndDiscount();
  return (
    <div className="priceBlock-base-wrapper">
      <div className="priceBlock-base-container">
        <div className="coupons-base-content">
          <div className="coupon-image">
            <img src="/Images/icons/coupon.svg" alt="" />
            <div className="coupons-base-label">Apply Coupons</div>
          </div>
          <Coupon
            couponApplied={couponApplied}
            setCouponApplied={setCouponApplied}
            discount={discountPercentage}
            setDiscount={setDiscountPercentage}
            cartAmount={getSelectedTotalAmount()}
          />
        </div>
      </div>

      <div className="priceBlock-base-priceHeader">PRICE DETAILS (1 Item)</div>
      <div className="priceBreakUp-base-orderSummary" id="priceBlock">
        <div className="priceDetail-base-row">
          <span>Total MRP</span>
          <span className="priceDetail-base-value">
            ₹{getSelectedTotalAmount()}
          </span>
        </div>
      
      {
        discountPercentage>0 && 
        <>
       
        <div className="priceDetail-base-row">
        <span>Coupon Discount</span>
        <span className="priceDetail-base-value priceDetail-base-action">
          -₹ {discountPercentage}
        </span>
      </div>
      <div className="coupons-base-discountMessage"><span>You saved additional </span> <span>{discountPercentage}</span>
      </div>
      </>
      }
       {
        walletPoints>0 ? <>
           <div className="priceDetail-base-row">
          <span>Use Wallet Points ({walletPoints} points)</span>
          <span className="priceDetail-base-value priceDetail-base-discount">
            <input
              type="checkbox"
              className={`checkbox ${useWalletPoints ? "checked" : ""}`}
              checked={useWalletPoints}
              onChange={handleWalletCheckboxChange}
            />
          </span>
        </div>
        {
          useWalletPoints &&   <div className="priceDetail-base-row">
          <span>Wallet Discount</span>
            <span className="priceDetail-base-value priceDetail-base-action">
            -₹ {walletPoints}
            </span>
          </div>
        }
      
        </>:<p className="coupons-base-discountMessage">No Wallet Points to use</p>
       }
     
      <div className="priceDetail-base-row">
          <span>Additional 5% OFF if pay Online</span>
          <span className="priceDetail-base-value priceDetail-base-action">
           5%
          </span>
        </div>
        <div className="priceDetail-base-row">
          <span className="priceDetail-base-value">
            <span className="priceDetail-base-striked priceDetail-base-spaceRight">
              ₹79
            </span>
            <span className="priceDetail-base-discount">{shippingFee}</span>
          </span>
          <div className="priceDetail-base-convenienceCalloutText">
            Free shipping for you
          </div>
        </div>
        <div className="priceDetail-base-total">
          <span>Total Amount</span>
          <span className="priceDetail-base-value">
            ₹ {getTotalWithWalletAndDiscount()}
          </span>
        </div>
      </div>
      {renderCartMessages(totalAmount)}
      <PaymentMethod
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />
      <div className="priceBlock-button-desktop">
        <button onClick={handleCreateOrder}>PLACE ORDER ₹{getTotalWithWalletAndDiscount()}</button>
      </div>
    
    </div>
  );
};

export default PriceDetails;
