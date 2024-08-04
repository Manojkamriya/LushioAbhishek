import React, { useState, useRef } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import Dropdown1 from "./Dropdown1";
import Dropdown2 from "./Dropdown2";
import Submenu from "./Submenu";
// import ShopCategory from "../pages/shopCategory/ShopCategory";
// import { ShopContext } from "./context/ShopContext";
function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [dropdown1, setDropdown1] = useState(false);
  // const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const openMenu = () => {
    menuRef.current.style.left = "0";
  };
  const closeMenu = () => {
    menuRef.current.style.left = "-550px";
  };

  const searchRef = useRef();

  const openSearch = () => {
    searchRef.current.style.top = "60px";
  };
  const closeSearch = () => {
    searchRef.current.style.top = "-155px";
  };

  return (
    <nav id="navbar">
      <div className="navbar">
        <div className="logo">
          <Link to="/LushioFitness">
            <img src="./LushioFitness/Images/logo.png" alt="" />
          </Link>
        </div>
        <div className="left-icons">
          <img
            className="menu-open"
            src="./LushioFitness/Images/icons/menu_open_2.png"
            alt=""
            onClick={openMenu}
          />
          <Link to="/wallet">
            <img src="./LushioFitness/Images/icons/wallet.png" alt="" />
          </Link>
          <img
            className="search-icon"
            src="./LushioFitness/Images/icons/search-icon-2.png"
            alt=""
            onClick={openSearch}
          />
        </div>

        <div className="list">
          <ul>
            <li
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <Link to="/men">Men</Link>{" "}
              <img src="./LushioFitness/Images/icons/dropdown2.png" alt="" />
              {dropdown && <Dropdown />}
            </li>
            <li
              onMouseEnter={() => setDropdown2(true)}
              onMouseLeave={() => setDropdown2(false)}
            >
              <Link to="/women">Women</Link>{" "}
              <img src="./LushioFitness/Images/icons/dropdown2.png" alt="" />
              {dropdown2 && <Dropdown2 />}
            </li>
            <li
              onMouseEnter={() => setDropdown1(true)}
              onMouseLeave={() => setDropdown1(false)}
            >
              <Link to="/accessories">Accessories</Link>{" "}
              <img src="./LushioFitness/Images/icons/dropdown2.png" alt="" />
              {dropdown1 && <Dropdown1 />}
            </li>
          </ul>
        </div>
        <div className="search-box">
          <input
            type="text"
            name="productName"
            placeholder="search by product category or collection"
          />

          <img src="./LushioFitness/Images/icons/search-icon.png" alt="" />
        </div>
        <Link to="/LushioFitness" className="lushio-text">
          <img src="./LushioFitness/Images/lushio-text-3.png" alt="" />
        </Link>
        <div className="icons">
          <Link to="/wishlist">
            <img src="./LushioFitness/Images/icons/wishlist.png" alt="" />
          </Link>
          <Link to="/cart">
            <img src="./LushioFitness/Images/icons/cart.png" alt="" />
            {/* <span>{getTotalCartItems()}</span> */}
          </Link>
          <Link to="/wallet" className="wallet-icon">
            <img src="./LushioFitness/Images/icons/wallet.png" alt="" />
          </Link>

          <Link to="/login">
            <img src="./LushioFitness/Images/icons/profile.png" alt="" />
          </Link>
        </div>
        <div ref={menuRef} className="submenu">
          <div className="responsive-navbar">
            <img
              className="cross-icon"
              src="./LushioFitness/Images/icons/cross_icon.svg"
              alt=""
              onClick={closeMenu}
            />
            <Submenu />
          </div>
        </div>
        <div ref={searchRef} className="header-search">
          <div className="header-search-form-control">
            <img src="./LushioFitness/Images/icons/search.svg" alt="" />
            <input type="search" placeholder="SEARCH FOR..." />
            <img
              src="./LushioFitness/Images/icons/cross.png"
              alt=""
              onClick={closeSearch}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
