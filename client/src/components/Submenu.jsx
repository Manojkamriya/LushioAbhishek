import React, { useState } from "react";
import "./submenu.css";
import "./search.css";
import { Link } from "react-router-dom";
function MenSubmenu() {
  return (
    <>
      <ul>
        <li>
          <Link to="/">Shirts</Link>
        </li>
        <li>
          <Link to="/">Joggers</Link>
        </li>
        <li>
          <Link to="/">Outerwear</Link>
        </li>
        <li>
          <Link to="/">Pants</Link>
        </li>
        <li>
          <Link to="/">Hats/Caps</Link>
        </li>
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
      <img
        className="res-submenu-image"
        src="./LushioFitness/Images/card-image-6.webp"
        alt=""
      />
      <p className="res-submenu-para">New Launch for him</p>
    </>
  );
}
function WomenSubmenu() {
  return (
    <>
      <ul>
        <li>
          <Link to="/">Bras</Link>
        </li>
        <li>
          <Link to="/">Tops</Link>
        </li>
        <li>
          <Link to="/">Leggings</Link>
        </li>
        <li>
          <Link to="/">OuterWear</Link>
        </li>
        <li>
          <Link to="/">Matching Sets</Link>
        </li>
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
      <img
        className="res-submenu-image"
        src="./LushioFitness/Images/card-image-2.webp"
        alt=""
      />
      <p className="res-submenu-para">New Launch for her</p>
    </>
  );
}
function AccesoriesSubmenu() {
  return (
    <>
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
      <img
        className="res-submenu-image"
        src="./LushioFitness/Images/assets/product_303.webp"
        alt=""
      />
      <p className="res-submenu-para">New Launch</p>
    </>
  );
}

function Submenu() {
  const [menu, setMenu] = useState("Men");
  return (
    <div className="res-navbar-headings">
      <ul className="res-navbar-headings-list">
        <li onClick={() => setMenu("Men")}>
          <Link to="/men">Men</Link>
        </li>
        <li onClick={() => setMenu("Women")}>
          <Link to="/women">Women</Link>
        </li>
        <li onClick={() => setMenu("Accessories")}>
          <Link to="/accessories">Accessories</Link>
        </li>
      </ul>
      <div className="res-navbar-links">
        {menu === "Men" && <MenSubmenu />}
        {menu === "Women" && <WomenSubmenu />}
        {menu === "Accessories" && <AccesoriesSubmenu />}
      </div>
    </div>
  );
}

export default Submenu;
