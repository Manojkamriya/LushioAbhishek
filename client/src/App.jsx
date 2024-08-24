import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDisplay from "./pages/productDisplay/ProductDisplay";
import Cart from "./pages/cart/Cart";
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Dummy components for Backend Analytics and Lushio Gods
function BackendAnalytics() {
  return <div>Backend Analytics Dashboard</div>;
}

function AdminPanel() {
  return <div>Lushio Gods Dashboard</div>;
}

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
  }, []);

  if (backend === null || admin === null) {
    return <div>Loading...</div>;
  }

  if (backend) {
    if (!admin) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/lushioGods" element={<AdminPanel />} />
            <Route path="*" element={<div>Site under maintenance</div>} />
          </Routes>
        </BrowserRouter>
      );
    }

    return (
      <>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/LushioFitness" element={<Home />} />
            <Route path="/men" element={<ShopCategory banner={men_banner} category="men" />} />
            <Route path="/women" element={<ShopCategory banner={women_banner} category="women" />} />
            <Route path="/accessories" element={<ShopCategory banner={accessories_banner} category="accessories" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/finishSignIn" element={<FinishEmailSignUp />} />
            <Route path="/product" element={<ProductDisplay />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/user" element={<User />} />
            <Route path="/user/editProfile" element={<EditProfile />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/user/orders" element={<Orders />} />
            <Route path="/user/address" element={<Address />} />
            <Route path="/user/refer-and-earn" element={<ReferAndEarn />} />
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
        <Route path="/backendAnalytics" element={<BackendAnalytics />} />
        <Route path="*" element={<div>Server is not responding</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
