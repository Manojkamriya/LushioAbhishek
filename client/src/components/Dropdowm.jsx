import React from 'react'
import './dropdown.css'
function Dropdowm() {
  return (
    <div className="dropdowm-container">
    <div className='dropdown'>
      <div className="sub-menu">
        <h5>TOP PRODUCTS</h5>
        <ul>
            <li>Shirts</li>
            <li>T-Shirts</li>
            <li>Joggers</li>
            <li>Outerwear</li>
            <li>Pants</li>
            <li>Hats/Caps</li>
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
     <img className='submenu-image' src='./Images/card-image-6.webp' alt=''/>
     <h4>NEW LAUNCH FOR MEN</h4>
      </div>
    </div>
    </div>
  )
}

export default Dropdowm
