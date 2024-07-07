import React from 'react'

function Dropdown1() {
  return (
    <>
       <div className="dropdowm-container">
    <div className='dropdown'>
      <div className="sub-menu">
        <h5>TOP PRODUCTS</h5>
        <ul>
            <li>Watch</li>
            <li>Bands</li>
            <li>Headphones</li>
            <li>Earphones</li>
            <li>Wallet</li>
            <li>Purse</li>
        </ul>
      </div>
      <div className="sub-menu">
      <h5>FEATURED</h5>
        <ul>
            <li>New Drop</li>
            <li>Coming Soon</li>
            <li>Restock</li>
            <li>Best Seller</li>
            <li>SALE</li>
           
        </ul>
      </div>
      <div className="sub-menu">
     <img className='submenu-image' src='./Images/shopping.webp' alt=''/>
     <h4>NEW LAUNCH</h4>
      </div>
    </div>
    </div>
    </>
  )
}

export default Dropdown1
