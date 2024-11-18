import React from "react";
import Coupon from "./Coupon";

const PriceDetails = ({
  discountPercentage,
  setDiscountPercentage,
  walletPoints,
  useWalletPoints,
  handleWalletCheckboxChange,
  getSelectedTotalAmount,
  getTotalWithWalletAndDiscount,
  renderCartMessages,
  shippingFee,
}) => {
  return (
    <div className="priceBlock-base-wrapper">
      <div className="priceBlock-base-container">
        <div className="coupons-base-content">
          <div className="coupon-image">
            <img src="/Images/icons/coupon.svg" alt="" />
            <div className="coupons-base-label">Apply Coupons</div>
          </div>
          <Coupon
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
        {walletPoints > 0 && (
          <p className="cartitems-total-item">
            Wallet Discount: -Rs {walletPoints}
          </p>
        )}
        <div className="priceDetail-base-row">
          <span>Coupon Discount</span>
          <span className="priceDetail-base-value priceDetail-base-action">
            {discountPercentage}%
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
      {renderCartMessages()}
      <div className="priceBlock-button-desktop">
        <button>PROCEED TO PAY ₹{getTotalWithWalletAndDiscount()}</button>
      </div>
    </div>
  );
};

export default PriceDetails;
