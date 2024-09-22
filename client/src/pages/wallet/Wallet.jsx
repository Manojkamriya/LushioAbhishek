import React from "react";
import "./wallet.css";

function wallet() {
  return (
<>
    <div className="empty-wallet">
        <p>Oh no! Looks like your wallet is empty :(</p>
        <h5>Start earning credits now!</h5>
      <img src="./LushioFitness/Images/wallet.gif" alt=""/>
      <p>Invite your friends to shop on Lushio and
      </p>
      <h4>win credits worth Rs. 100 on every referral</h4>
      <button>Send Invite</button>
    </div>
    <div className="wallet-container">
    <div className="wallet-title">
      <h2>My Wallet</h2> 
      <hr/>
      </div>
      <div className="my-wallet">
        <div className="totalblock">
          <p>₹0</p>
          <p>Total wallet points</p>
        </div>
        <div className="credit-block">
      <div className="heading-row">
        <div className="heading-block">
          <img
            className="heading-icon"
            src="https://images.bewakoof.com/web/credits-1604474036.png"
            alt="Credit Icon"
          />
          <div className="heading-text">Lushio Credit</div>
        </div>
        <div className="balance-block">
          <div className="balance-text">Balance : ₹0.0</div>
          <i className="balance-icon icon-next-arrow"></i>
        </div>
      </div>
      <p className="description-block">
        Earned from referral, offers and cash-back. Limited validity. Can be redeemed on orders above ₹297
      </p>
    </div>
    <div className="cash-block">
      <div className="heading-row">
        <div className="heading-block">
          <img
            className="heading-icon"
            src="https://images.bewakoof.com/web/cash-1604473988.png"
            alt="Cash Icon"
          />
          <div className="heading-text">Lushio Cash</div>
        </div>
        <div className="balance-block">
          <div className="balance-text">Balance : ₹0.0</div>
          <i className="balance-icon icon-next-arrow"></i>
        </div>
      </div>
      <p className="description-block">
        Received from refund for orders that you have returned, cancelled and gift card.
      </p>
    </div>
      </div>

    </div>
    </>
    )
}

export default wallet;
