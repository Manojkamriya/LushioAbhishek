import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import Dropdowm from './Dropdowm';
import Dropdown1 from './Dropdown1';
import Dropdown2 from './Dropdown2';
function Navbar() {
  const [dropdown, setDropdown]  = useState(false);
  const [dropdown2, setDropdown2]  = useState(false);
  const [dropdown1, setDropdown1]  = useState(false);
  return (
    <nav id='navbar'>
      <div className="navbar">
        <div className="logo">
          <Link to='/' >
            <img  src='./Images/logo.png' alt='' /></Link>
        </div>
        <div className="list">
            <ul>
                <li
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}
                >Men <img src='./Images/dropdown.png' alt=''/>
                     {dropdown && <Dropdowm/>}
                </li>
                <li
                  onMouseEnter={() => setDropdown2(true)}
                  onMouseLeave={() => setDropdown2(false)}
                >Women <img src='./Images/dropdown.png' alt=''/>
                     {dropdown2 && <Dropdown2/>}
                </li>
                <li
                  onMouseEnter={() => setDropdown1(true)}
                  onMouseLeave={() => setDropdown1(false)}
                >Accessories <img src='./Images/dropdown.png' alt=''/>
                     {dropdown1 && <Dropdown1/>}
                </li>
              
               
            </ul>
        </div>
        <div className="search-box">
          <input type='text' name='productName' placeholder='search by product category or collection'/>
          <img src='./Images/search-icon.png' alt=''/>
        </div>
        <div className="icons">
          
            <Link to='/wishlist' >
            <img src='./Images/wishlist_3.png' alt='' /></Link>
            <Link to='/cart' >
            <img src='./Images/cart_2.png' alt='' /></Link>
            <Link to='/login' >
            <img src='./Images/profile_2.png' alt='' /></Link>
        </div>
      </div>
    

    </nav>
  )
}

export default Navbar
