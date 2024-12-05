import React, { useEffect, useState } from "react";
import "./submenu.css";
import { Link } from "react-router-dom";
import axios from "axios";


function SubmenuItems({ items, category, imageSrc, description, closeMenu }) {
  return (
    <>
      <ul>
        <li onClick={closeMenu}>
          <Link to={`/${category}`}>All</Link>
        </li>
        {items.map((item, index) => (
          <li key={index} onClick={closeMenu}>
            <Link to={`/${category}/${item.toLowerCase()}`}>{item}</Link>
          </li>
        ))}
      </ul>
      <img className="res-submenu-image" src={imageSrc} alt={description} />
      <p className="res-submenu-para">{description}</p>
    </>
  );
}

function Submenu({ menuRef, closeMenu,  defaultMenu = "men" }) {
  const [menu, setMenu] = useState(defaultMenu);
  const [menuData, setMenuData] = useState({
    men: { items: [], imageSrc: "", description: "" },
    women: { items: [], imageSrc: "", description: "" },
    accessories: { items: [], imageSrc: "", description: "" },
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/subcategories`); 
     const data = response.data;
     // setMenuData(response.data);
        setMenuData({
          men: {
            items: data.men,
            imageSrc: "/Images/card-image-6.webp",
            description: "New Launch for him",
          },
          women: {
            items: data.women,
            imageSrc: "/Images/card-image-2.webp",
            description: "New Launch for her",
          },
          accessories: {
            items: data.accessories,
            imageSrc: "/Images/card-image-4.webp",
            description: "New Launch",
          },
        });
      } catch (error) {
        console.error("Error fetching submenu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  if (!menuData[menu]) {
    return <div>Loading menu...</div>;
  }

  return (
    <div ref={menuRef} className="submenu">
      <div className="responsive-navbar">
        <img
          className="cross-icon"
          src="/Images/icons/cross_icon.svg"
          alt="Close"
          onClick={closeMenu}
        />
        <div className="res-navbar-headings">
          <ul className="res-navbar-headings-list">
            {Object.keys(menuData).map((menuKey) => (
              <li
                key={menuKey}
                onClick={() => setMenu(menuKey)}
                className={menuKey === menu ? "submenu-category-selected" : ""}
              >
                {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
              </li>
            ))}
          </ul>
          <div className="res-navbar-links">
            <SubmenuItems
              category={menu}
              items={menuData[menu].items}
              imageSrc={menuData[menu].imageSrc}
              description={menuData[menu].description}
              closeMenu={closeMenu}
            />
          </div>
        </div>
      </div>
      <div className="overlay" onClick={closeMenu}></div>
    </div>
  );
}

export default Submenu;


