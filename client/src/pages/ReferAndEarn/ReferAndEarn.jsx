import React from "react"
import "./refer-earn.css"

function ReferAndEarn() {
  return (
    <>
    <div className="refer-and-earn-container">
        <div className="refer-statements">
        <h3>Refer and Earn ₹100</h3>
        <p>When they place an order using the referral code,</p>
        <h4>they get credits worth ₹100</h4>
        <h6>1 Lushio® Credit = 1 Rupee</h6>
        </div>
    <img src="./LushioFitness/Images/referEarn.jpg" alt=""/>

    </div>
    <div className="referralBlock">
        <p>Tap To Copy Code</p>
        <div>LUSH2013</div>
    </div>
    <p className="refer-question">How Does Referrel Work?</p>
    <div className="instruction-container">
        <div className="instruction">
            <span>1</span>
            <p>Invite your friend to Lushio® with the given referral code</p>
        </div>
        <div className="instruction">
            <span>2</span>
            <p>They place their first order with your referral code & get a flat ₹100 discount</p>
        </div>
        <div className="instruction">
            <span>3</span>
            <p>Their order gets completed (delivered & crossed the return window)</p>
        </div>
        <div className="instruction">
            <span>4</span>
            <p>You get Lushio® credits worth ₹100</p>
        </div>
    </div>
    </>
  )
}

export default ReferAndEarn
