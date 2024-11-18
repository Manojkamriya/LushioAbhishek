import React, { useState, useRef, useEffect,useContext } from "react";
//import { ShopContext } from "./context/ShopContext";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import axios from "axios";
import Submenu from "./Submenu";
import { useWishlist } from "./context/WishlistContext";
import Search from "./Search";
import { UserContext } from "./context/UserContext";

function Navbar() {
  
  const [activeDropdown, setActiveDropdown] = useState(null);
const [wishlistCount, setWishlistCount] = useState(0);
const [cartCount, setCartCount] = useState(0);
const { wishlist} = useWishlist();
  const handleMouseEnter = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  const menuRef = useRef();
  const { user } = useContext(UserContext);
  const openMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.left = "0";
      document.body.classList.add('no-scroll');
      console.log(user);
    }
  };

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.left = "-1148px";
      document.body.classList.remove('no-scroll');
    }
  };


  useEffect(() => {
    const fetchWishlistCount = async () => {
      // Ensure the user is defined before proceeding
      if (!user?.uid) return;
  
      try {
     
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/wishlist/count/${user.uid}`
        );
        console.log(response.data.count);
        // Validate response format
      setWishlistCount(response.data.count);
      } catch (error) {
        console.error("Error fetching wishlist Count", error);
        // setError("Failed to load wishlist items."); // Uncomment if you want to handle errors in state
      }
      
    };
  
    fetchWishlistCount();
  }, [user,wishlist]);
  useEffect(() => {
    const cartCount = async () => {
      // Ensure the user is defined before proceeding
      if (!user?.uid) return;
  
      try {
     
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cart/count/${user.uid}`
        );
        console.log(response.data.count);
        // Validate response format
      setCartCount(response.data.count);
      } catch (error) {
        console.error("Error fetching wishlist Count", error);
        // setError("Failed to load wishlist items."); // Uncomment if you want to handle errors in state
      }
      
    };
  
    cartCount();
  }, [user]);
  // Cleanup function to ensure scrolling is re-enabled if the component unmounts while the menu is open
  useEffect(() => {
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);
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
          <Link to="/">
            <img src="/Images/logo.png" alt="" />
          </Link>
        </div>
        <div className="left-icons">
          <img
            className="menu-open"
            src="/Images/icons/menu_open_2-bg.png"
            alt=""
            onClick={openMenu}
          />
          <Link to={user ? "/wallet" : "/login"}>
            <img src="/Images/icons/wallet.png" alt="" />
          </Link>
          <img
            className="search-icon"
            src="/Images/icons/search-icon-2.png"
            alt=""
            onClick={openSearch}
          />
        </div>

        <div className="list">
      <ul>
        <li
          onMouseEnter={() => handleMouseEnter("men")}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/men">Men</Link>{" "}
          <img src="/Images/icons/dropdown2.png" alt="" />
          {activeDropdown === "men" && (
            <Dropdown
            setActiveDropdown={setActiveDropdown}
              category="men"
              topProducts={["Upperwear", "Hoodie", "Outerwear", "Jeans", "Tanks"]}
              featured={["New Drop", "Coming Soon", "Restock", "Best Seller", "Sale"]}
              imageSrc="/Images/card-image-6.webp"
              launchTitle="NEW LAUNCH FOR MEN"
            />
          )}
        </li>
        <li
          onMouseEnter={() => handleMouseEnter("women")}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/women">Women</Link>{" "}
          <img src="/Images/icons/dropdown2.png" alt="" />
          {activeDropdown === "women" && (
            <Dropdown
            setActiveDropdown={setActiveDropdown}
              category="women"
              topProducts={["Upperwear", "Tops", "Leggings", "Outerwear", "Matching Sets"]}
              featured={["New Drop", "Coming Soon", "Restock", "Best Seller", "Sale"]}
              imageSrc="/Images/card-image-2.webp"
              launchTitle="NEW LAUNCH FOR WOMEN"
            />
          )}
        </li>
        <li
          onMouseEnter={() => handleMouseEnter("accessories")}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/accessories">Accessories</Link>{" "}
          <img src="/Images/icons/dropdown2.png" alt="" />
          {activeDropdown === "accessories" && (
            <Dropdown
            setActiveDropdown={setActiveDropdown}
              category="accessories"
              topProducts={["Gloves", "Shakers", "Wrist Band", "Deadlift Band"]}
              featured={["New Drop", "Coming Soon", "Restock", "Best Seller", "Sale"]}
              imageSrc="/Images/shopping.webp"
              launchTitle="NEW LAUNCH"
            />
          )}
        </li>
      </ul>
    </div>
        <div className="new-search">
<input  type="text"
    name="productName"
    placeholder="search by product category or collection" />
      <img src="/Images/icons/search-icon.png" alt="" />
    </div>
        <Link to="/" className="lushio-text">
          <img src="/Images/icons/lushio-text-3-bg.png" alt="" />
        </Link>
        <div className="icons">
          
          <Link  to={user ? "/wishlist" : "/login"}>
            <img src="/Images/icons/wishlist.png" alt="" />
            { user && wishlistCount > 0 &&  <span>{wishlistCount}</span>}
          </Link>
          <Link  to={user ? "/cart" : "/login"}>
            <img src="/Images/icons/cart.png" alt="" />
          { user && cartCount> 0 &&  <span>{cartCount}</span>}
          </Link>
          <Link className="wallet-icon" to={user ? "/wallet" : "/login"}>
            <img src="/Images/icons/wallet.png" alt="" />
          </Link>

          <Link to={user ? "/user" : "/login"}>
  <img src="/Images/icons/profile.png" alt="Profile" />
</Link>
        </div>
       
            <Submenu menuRef={menuRef} closeMenu={closeMenu}/>
        
      
        <Search searchRef={searchRef} closeSearch={closeSearch}/>
      </div>
    </nav>
  );
}

export default Navbar;
