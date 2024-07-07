import React from 'react'

function Dropdown2() {
  return (
    <>
       <div className="dropdowm-container">
    <div className='dropdown'>
      <div className="sub-menu">
        <h5>TOP PRODUCTS</h5>
        <ul>
            <li>Bras</li>
            <li>Tops</li>
            <li>Leggings</li>
            <li>Jeans</li>
            <li>OuterWear</li>
            <li>Matching Sets</li>
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
     <img className='submenu-image' src='./Images/card-image-2.webp' alt=''/>
     <h4>NEW LAUNCH FOR WOMEN</h4>
      </div>
    </div>
    </div>
    </>
  )
}

export default Dropdown2
