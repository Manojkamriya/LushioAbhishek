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

function Submenu({ menuRef, closeMenu, apiEndpoint, defaultMenu = "men" }) {
  const [menu, setMenu] = useState(defaultMenu);
  const [menuData, setMenuData] = useState({
    men: { items: [], imageSrc: "", description: "" },
    women: { items: [], imageSrc: "", description: "" },
    accessories: { items: [], imageSrc: "", description: "" },
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/lushio-fitness/us-central1/api/search/subcategories"); 
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
            imageSrc: "/Images/assets/product_303.webp",
            description: "New Launch",
          },
        });
      } catch (error) {
        console.error("Error fetching submenu data:", error);
      }
    };

    fetchMenuData();
  }, [apiEndpoint]);

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


// import React, { useEffect, useState } from "react";
// import "./submenu.css";
// import { Link } from "react-router-dom";
// import axios from "axios";
// function SubmenuItems({ items, category, closeMenu }) {
//   return (
//     <>
//       <ul>
//         <li onClick={closeMenu}>
//           <Link to={`/${category}`}>All</Link>
//         </li>
//         {items.map((item, index) => (
//           <li key={index} onClick={closeMenu}>
//             <Link to={`/${category}/${item.toLowerCase()}`}>{item}</Link>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

// function Submenu({ menuRef, closeMenu, apiEndpoint, defaultMenu = "men" }) {
//   const [menu, setMenu] = useState(defaultMenu);
//   const [menuData, setMenuData] = useState({ men: [], women: [], accessories: [] });

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:5001/lushio-fitness/us-central1/api/search/subcategories"); 
     
//         setMenuData(response.data);
//       } catch (error) {
//         console.error("Error fetching submenu data:", error);
//       }
//     };

//     fetchMenuData();
//   }, [apiEndpoint]);

//   if (!menuData[menu]) {
//     return <div>Loading menu...</div>;
//   }

//   return (
//     <div ref={menuRef} className="submenu">
//       <div className="responsive-navbar">
//         <img
//           className="cross-icon"
//           src="/Images/icons/cross_icon.svg"
//           alt="Close"
//           onClick={closeMenu}
//         />
//         <div className="res-navbar-headings">
//           <ul className="res-navbar-headings-list">
//             {Object.keys(menuData).map((menuKey) => (
//               <li
//                 key={menuKey}
//                 onClick={() => setMenu(menuKey)}
//                 className={menuKey === menu ? "submenu-category-selected" : ""}
//               >
//                 {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
//               </li>
//             ))}
//           </ul>
//           <div className="res-navbar-links">
//             <SubmenuItems
//               category={menu}
//               items={menuData[menu]}
//               closeMenu={closeMenu}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="overlay" onClick={closeMenu}></div>
//     </div>
//   );
// }

// export default Submenu;



// import React, { useState } from "react";
// import "./submenu.css";
// // import "./search.css";
// import { Link } from "react-router-dom";

// function SubmenuItems({ items, imageSrc, description, category, closeMenu }) {
//   return (
//     <>
//       <ul>
//         <li onClick={closeMenu}>
//           <Link to={`/${category}`}>All</Link>
//         </li>
//         {items.map((item, index) => (
//           <li key={index} onClick={closeMenu}>
//             <Link to={`/${category.toLowerCase()}/${item.label.toLowerCase()}`}>
//               {item.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <img className="res-submenu-image" src={imageSrc} alt={description} />
//       <p className="res-submenu-para">{description}</p>
//     </>
//   );
// }

// function Submenu({ menuRef, closeMenu }) {
//   const [menu, setMenu] = useState("Men");

//   const menus = {
//     Men: {
//       items: [
//         { label: "upperwear", link: "/men" },
//         { label: "Hoodie", link: "/men" },
//         { label: "Outerwear", link: "/men" },
//         { label: "Tanks", link: "/men" },
//         { label: "Jeans", link: "/men" },
//         { label: "Featured", link: "/men" },
//         { label: "Casual", link: "/men" },
//         { label: "shirt", link: "/men" },
//         { label: "trouser", link: "/men" },
//         { label: "T-shirt", link: "/men" },
//       ],
//       imageSrc: "/Images/card-image-6.webp",
//       description: "New Launch for him",
//     },
//     Women: {
//       items: [
//         { label: "upperwear", link: "/women" },
//         { label: "Bottomwear", link: "/women" },
//         { label: "Featured", link: "/women" },
//         { label: "Pants", link: "/women" },
//         { label: "Jeans", link: "/women" },
//         { label: "clothing", link: "/women" },
//         { label: "dresses", link: "/women" },
//         { label: "shirts", link: "/women" },
       
//       ],
//       imageSrc: "/Images/card-image-2.webp",
//       description: "New Launch for her",
//     },
//     Accessories: {
//       items: [
//         { label: "Wallets", link: "/accessories" },
//         { label: "Featured", link: "/accessories" },
//         { label: "belt", link: "/accessories" },
//         { label: "cap", link: "/accessories" },
//         { label: "bottles", link: "/accessories" },
//         { label: "bag", link: "/accessories" },
//         { label: "Featured", link: "/" },
      
//       ],
//       imageSrc: "/Images/assets/product_303.webp",
//       description: "New Launch",
//     },
//   };

//   return (
//     <div ref={menuRef} className="submenu">
    
//       <div className="responsive-navbar">
//         <img
//           className="cross-icon"
//           src="/Images/icons/cross_icon.svg"
//           alt=""
//           onClick={closeMenu}
//         />
//         <div className="res-navbar-headings">
//           <ul className="res-navbar-headings-list">
//             {Object.keys(menus).map((menuKey) => (
//               <li
//                 key={menuKey}
//                 onClick={() => setMenu(menuKey)}
//                 className={menuKey === menu ? "submenu-category-selected" : ""}
//               >
//                 {menuKey}
//               </li>
//             ))}
//           </ul>
//           <div className="res-navbar-links">
//             <SubmenuItems
//               category={menu}
//               items={menus[menu].items}
//               imageSrc={menus[menu].imageSrc}
//               description={menus[menu].description}
//               closeMenu={closeMenu}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="overlay"  onClick={closeMenu}></div>
//     </div>
   
  
 
//   );
// }

// export default Submenu;
