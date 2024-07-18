import React from 'react'
import { Link } from 'react-router-dom'
function Dropdown2() {
  return (
    <>
       <div className="dropdowm-container">
    <div className='dropdown'>
      <div className="sub-menu">
        <h5>TOP PRODUCTS</h5>
        <ul>
           
            <li><Link to='/'>Bras</Link></li>
            <li><Link to='/'>Tops</Link></li>
            <li><Link to='/'>Leggings</Link></li>
            <li><Link to='/'>OuterWear</Link></li>
            <li><Link to='/'>Matching Sets</Link></li>
        </ul>
      </div>
      <div className="sub-menu">
      <h5>FEATURED</h5>
        <ul>
            <li><Link to='/'>New Drop</Link></li>
            <li><Link to='/'>Comming Soon</Link></li>
            <li><Link to='/'>Restock</Link></li>
            <li><Link to='/'>Best Seller</Link></li>
            <li><Link to='/'>Sale</Link></li>
       
           
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
