import React from 'react'
import { Link } from 'react-router-dom'
import './dropdown.css'
function Dropdowm() {
  return (
    <div className="dropdowm-container">
    <div className='dropdown'>
      <div className="sub-menu">
        <h5>TOP PRODUCTS</h5>
        <ul>
            <li><Link to='/'>Shirts</Link></li>
            <li><Link to='/'>Joggers</Link></li>
            <li><Link to='/'>Outerwear</Link></li>
            <li><Link to='/'>Pants</Link></li>
            <li><Link to='/'>Hats/Caps</Link></li>

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
     <img className='submenu-image' src='./Images/card-image-6.webp' alt=''/>
     <h4>NEW LAUNCH FOR MEN</h4>
      </div>
    </div>
    </div>
  )
}

export default Dropdowm
