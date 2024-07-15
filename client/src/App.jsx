import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginSignUp from "./pages/login/LoginSignUp";
import ProductDisplay from "./pages/productDisplay/ProductDisplay";
import Cart from "./pages/cart/Cart";
import WishList from "./pages/wishlist/WishList";
import FinishEmailSignUp from './auth/FinishEmailSignUp';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignUp/>} />
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
