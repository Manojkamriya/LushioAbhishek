import React from "react";
import "./wallet.css";

function wallet() {
  return (

    <div className="empty-wallet">
        <p>Oh no! Looks like your wallet is empty :(</p>
        <h5>Start earning credits now!</h5>
      <img src="./LushioFitness/Images/wallet.gif" alt=""/>
      <p>Invite your friends to shop on Lushio and
      </p>
      <h4>win credits worth Rs. 100 on every referral</h4>
      <button>Send Invite</button>
    </div>
    )
}

export default wallet;
