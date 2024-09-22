import React from "react";
import { Link } from "react-router-dom";
import "./dropdown.css";

function Dropdown({ category, topProducts, featured, imageSrc, launchTitle }) {
  return (
    <div className="dropdowm-container">
      <div className="dropdown">
        <div className="sub-menu">
          <h5>TOP PRODUCTS</h5>
          <ul>
            {topProducts.map((product, index) => (
              <li key={index}>
                <Link to={`/${category}`}>{product}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sub-menu">
          <h5>FEATURED</h5>
          <ul>
            {featured.map((item, index) => (
              <li key={index}>
                <Link to={`/${category}`}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sub-menu">
          <img className="submenu-image" src={imageSrc} alt={launchTitle} />
          <h4>{launchTitle}</h4>
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
