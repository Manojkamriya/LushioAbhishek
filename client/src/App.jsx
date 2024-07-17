import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDisplay from "./pages/productDisplay/ProductDisplay";
import Cart from "./pages/cart/Cart";
import WishList from "./pages/wishlist/WishList";
import FinishEmailSignUp from './auth/FinishEmailSignUp';

// import LoginSignUp from "./pages/login/LoginSignUp";
import Register from "./pages/login/Register";
import Login from "./pages/login/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<LoginSignUp/>} /> */}
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/finishSignUp" element={<FinishEmailSignUp />} />
          <Route path="/product" element={<ProductDisplay/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path="/wishlist" element={<WishList/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
