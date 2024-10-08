import React, { useState } from "react";
import "./submenu.css";
// import "./search.css";
import { Link } from "react-router-dom";


function SubmenuItems({ items, imageSrc, description }) {
  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link to={item.link}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <img className="res-submenu-image" src={imageSrc} alt={description} />
      <p className="res-submenu-para">{description}</p>
    </>
  );
}

function Submenu({menuRef, closeMenu}) {
  const [menu, setMenu] = useState("Men");

 
  const menus = {
    Men: {
      items: [
        { label: "All", link: "/men" },
        { label: "Shirts", link: "/men" },
        { label: "Joggers", link: "/men" },
        { label: "Outerwear", link: "/men" },
        { label: "Pants", link: "/men" },
        { label: "Hats/Caps", link: "/men" },
        { label: "New Drop", link: "/men" },
        { label: "Coming Soon", link: "/men" },
        { label: "Restock", link: "/men" },
        { label: "Best Seller", link: "/men" },
        { label: "Sale", link: "/men" },
      ],
      imageSrc: "./LushioFitness/Images/card-image-6.webp",
      description: "New Launch for him",
    },
    Women: {
      items: [
        { label: "All", link: "/women" },
        { label: "Bras", link: "/women" },
        { label: "Tops", link: "/women" },
        { label: "Leggings", link: "/women" },
        { label: "OuterWear", link: "/women" },
        { label: "Matching Sets", link: "/women" },
        { label: "New Drop", link: "/women" },
        { label: "Coming Soon", link: "/women" },
        { label: "Restock", link: "/women" },
        { label: "Best Seller", link: "/women" },
        { label: "Sale", link: "/women" },
      ],
      imageSrc: "./LushioFitness/Images/card-image-2.webp",
      description: "New Launch for her",
    },
    Accessories: {
      items: [
        { label: "All", link: "/accessories" },
        { label: "Gloves", link: "/accessories" },
        { label: "Shakers", link: "/accessories" },
        { label: "Wrist Band", link: "/accessories" },
        { label: "Deadlift Band", link: "/accessories" },
        { label: "New Drop", link: "/accessories" },
        { label: "Coming Soon", link: "/accessories" },
        { label: "Restock", link: "/" },
        { label: "Best Seller", link: "/accessories" },
        { label: "Sale", link: "/accessories" },
      ],
      imageSrc: "./LushioFitness/Images/assets/product_303.webp",
      description: "New Launch",
    },
  };

  return (
    <div ref={menuRef} className="submenu">
    <div className="responsive-navbar">
      <img
        className="cross-icon"
        src="./LushioFitness/Images/icons/cross_icon.svg"
        alt=""
        onClick={closeMenu}
      />
    <div className="res-navbar-headings">
      <ul className="res-navbar-headings-list">
        {Object.keys(menus).map((menuKey) => (
          <li key={menuKey} onClick={() => setMenu(menuKey)} className={menuKey===menu?"submenu-category-selected":""}>
            {menuKey}
          </li>
        ))}
      </ul>
      <div className="res-navbar-links">
        <SubmenuItems
          items={menus[menu].items}
          imageSrc={menus[menu].imageSrc}
          description={menus[menu].description}
        />
      </div>
    </div>
    </div>
    </div>
  );
}

export default Submenu;
