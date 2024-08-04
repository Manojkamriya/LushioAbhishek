import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDisplay from "./pages/productDisplay/ProductDisplay";
import Cart from "./pages/cart/Cart";
import WishList from "./pages/wishlist/WishList";
import FinishEmailSignUp from './auth/FinishEmailSignUp';
import User from "./pages/userProfile/User";
import ShopCategory from "./pages/shopCategory/ShopCategory";
import EditProfile from "./pages/userProfile/EditProfile";
import men_banner from "./components/context/assets/banner_mens.png"
import women_banner from "./components/context/assets/banner_women.png"
import kids_banner from "./components/context/assets/banner_kids.png"
import Footer from "./components/Footer";
import Register from "./pages/login/Register";
import Login from "./pages/login/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/LushioFitness" element={<Home />} />
          <Route path="/men" element={<ShopCategory banner={men_banner} category='men'/>} />
          <Route path="/women" element={<ShopCategory banner={women_banner} category='women'/>} />
          <Route path="/accessories" element={<ShopCategory banner={kids_banner} category='kid'/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/finishSignIn" element={<FinishEmailSignUp />} />
          <Route path="/product" element={<ProductDisplay/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path="/wishlist" element={<WishList/>}/>
          <Route path='/user'     element={<User/>}/>
          <Route path='/user/profile'     element={<EditProfile/>}/>
        
          
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
