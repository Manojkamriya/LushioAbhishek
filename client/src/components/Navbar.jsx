import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import Dropdown1 from "./Dropdown1";
import Dropdown2 from "./Dropdown2";
// import ShopCategory from "../pages/shopCategory/ShopCategory";
// import { ShopContext } from "./context/ShopContext";
function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [dropdown1, setDropdown1] = useState(false);
  // const { getTotalCartItems } = useContext(ShopContext);
  return (
    <nav id="navbar">
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src="./Images/logo.png" alt="" />
          </Link>
        </div>
        <div className="list">
          <ul>
            <li
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <Link to="/men">Men</Link>{" "}
              <img src="./Images/icons/dropdown.png" alt="" />
              {dropdown && <Dropdown />}
            </li>
            <li
              onMouseEnter={() => setDropdown2(true)}
              onMouseLeave={() => setDropdown2(false)}
            >
              <Link to="/women">Women</Link>{" "}
              <img src="./Images/icons/dropdown.png" alt="" />
              {dropdown2 && <Dropdown2 />}
            </li>
            <li
              onMouseEnter={() => setDropdown1(true)}
              onMouseLeave={() => setDropdown1(false)}
            >
              <Link to="/accessories">Accessories</Link>{" "}
              <img src="./Images/icons/dropdown.png" alt="" />
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
        <div className="icons">
          <Link to="/wishlist">
            <img src="./LushioFitness/Images/icons/wishlist.png" alt="" />
          </Link>
          <Link to="/cart">
            <img src="./LushioFitness/Images/icons/cart.png" alt="" />
            {/* <span>{getTotalCartItems()}</span> */}
          </Link>
          <Link to="/login">
            <img src="./LushioFitness/Images/icons/profile.png" alt="" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
