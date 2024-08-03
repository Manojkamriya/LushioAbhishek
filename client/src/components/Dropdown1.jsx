import React from "react";
import { Link } from "react-router-dom";
function Dropdown1() {
  return (
    <div className="dropdowm-container">
      <div className="dropdown">
        <div className="sub-menu">
          <h5>TOP PRODUCTS</h5>
          <ul>
            <li>
              <Link to="/">Gloves</Link>
            </li>
            <li>
              <Link to="/">Shakers</Link>
            </li>
            <li>
              <Link to="/">Wrist Band</Link>
            </li>
            <li>
              <Link to="/">Deadlift Band</Link>
            </li>
          </ul>
        </div>
        <div className="sub-menu">
          <h5>FEATURED</h5>
          <ul>
            <li>
              <Link to="/">New Drop</Link>
            </li>
            <li>
              <Link to="/">Comming Soon</Link>
            </li>
            <li>
              <Link to="/">Restock</Link>
            </li>
            <li>
              <Link to="/">Best Seller</Link>
            </li>
            <li>
              <Link to="/">Sale</Link>
            </li>
          </ul>
        </div>
        <div className="sub-menu">
          <img
            className="submenu-image"
            src="./LushioFitness/Images/shopping.webp"
            alt=""
          />
          <h4>NEW LAUNCH</h4>
        </div>
      </div>
    </div>
  );
}

export default Dropdown1;
