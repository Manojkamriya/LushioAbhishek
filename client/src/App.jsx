import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDisplay from "./pages/productDisplay/ProductDisplay";
import Cart from "./pages/cartItems/CartItems"
import WishList from "./pages/wishlist/WishList";
import FinishEmailSignUp from "./auth/FinishEmailSignUp";
import User from "./pages/userProfile/User";
import ShopCategory from "./pages/shopCategory/ShopCategory";
import EditProfile from "./pages/userProfile/EditProfile";
import Orders from "./pages/orders/Orders";
import Wallet from "./pages/wallet/Wallet";
import men_banner from "./components/context/assets/banner_mens.png";
import women_banner from "./components/context/assets/banner_women.png";
import accessories_banner from "./components/context/assets/banner_accessories.jpg";
import Footer from "./components/Footer";
import Register from "./pages/login/Register";
import Login from "./pages/login/Login";
import ReferAndEarn from "./pages/ReferAndEarn/ReferAndEarn";
import Address from "./pages/userProfile/Address";
import AdminPanel from "./pages/admin/AdminPanel";
import BackendAnalytics from "./pages/bakendAnalytics/BackendAnalytics";
import OrderInfo from "./pages/orders/OrderInfo";
import BuyNow from "./pages/BuyNow/BuyNow";
import PaymentStatus from "./pages/orders/PaymentStatus";
import CategoryPage from "./components/CategoryPage";
import PrivacyPolicy from "./pages/Policy/PrivacyPolicy"
import TermsAndConditions from "./pages/Policy/TermsAndConditions";
import RefundPolicy from "./pages/Policy/RefundPolicy";
import ShippingPolicy from "./pages/Policy/ShippingPolicy";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [backend, setBackend] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const backendDoc = await getDoc(doc(db, "controls", "backend"));
        const adminDoc = await getDoc(doc(db, "controls", "admin"));
        setBackend(backendDoc.data().engine);
        setAdmin(adminDoc.data().engine);
      } catch (error) {
        console.error("Error fetching control values:", error);
      }
    };
    fetchControls();
  }, [backend, admin]);

  if (backend === null || admin === null) {
    return <div className="loader-container"> <span className="loader"></span></div>;
  }

  if (admin) {
    if (!backend) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/backendAnalytics" element={<BackendAnalytics />} />
            <Route path="*" element={<div>Server is not responding</div>} />
          </Routes>
        </BrowserRouter>
      );
    }

    return (
      <>
        <BrowserRouter>
          <Navbar />
          <ScrollToTop/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:category/:subCategory" element={<CategoryPage />} /> 
            <Route path="/men" element={<ShopCategory banner={men_banner} category="men" />} />
            <Route path="/women" element={<ShopCategory banner={women_banner} category="women" />} />
            <Route path="/accessories" element={<ShopCategory banner={accessories_banner} category="accessories" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/finishSignIn" element={<FinishEmailSignUp />} />
            <Route path="/product/:productID" element={<ProductDisplay />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route exact path="/user/orders" element={<Orders />} />
            <Route path="/user" element={<User />} />
            <Route path="/user-editProfile" element={<EditProfile />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/orderInfo" element={<OrderInfo />} />
            <Route path="/buyNow" element={<BuyNow />} />
            <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/termAndConditions" element={<TermsAndConditions />} />
            <Route path="/refundPolicy" element={<RefundPolicy />} />
            <Route path="/shippingPolicy" element={<ShippingPolicy />} />
            <Route path="/paymentStatus" element={<PaymentStatus />} />
            <Route path="/user-address" element={<Address />} />
            <Route path="/user-referAndEarn" element={<ReferAndEarn />} />
            <Route path="/lushioGods" element={<AdminPanel />} />
            
          </Routes>
          <Footer />
        </BrowserRouter>
          
           
      </>
    );
  }
    
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lushioGods" element={<AdminPanel />} />
        <Route path="*" element={<div>Site under maintenance</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
