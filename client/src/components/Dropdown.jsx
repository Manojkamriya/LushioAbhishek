import React from "react";
import { Link } from "react-router-dom";
import "./dropdown.css";

function Dropdown({
  category,
  topProducts,
  imageSrc,
  launchTitle,
  setActiveDropdown,
}) {
  return (
    <div className="dropdowm-container">
      <div className="dropdown">
        <div className="sub-menu-categories">
          <h5>TOP PRODUCTS</h5>
          <ul>
            {topProducts.slice(0, 35).map((product, index) => (
              <li key={index} onClick={() => setActiveDropdown(null)}>
                <Link to={`/${category}/${product.toLowerCase()}`}>
                  {product}
                </Link>
              </li>
            ))}
            <ul></ul>
          </ul>
        </div>
        <div className="sub-menu-image">
          <img className="submenu-image" src={imageSrc} alt={launchTitle} />
          <h4>{launchTitle}</h4>
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
