import React, { useContext,useState } from "react";
import "./footer.css";
import { HashLink as Link } from "react-router-hash-link";
import { UserContext } from "./context/UserContext";
import axios from "axios";

export default function Footer() {

const { user } = useContext(UserContext);
const [email, setEmail] = useState(''); 
const [message, setMessage] = useState(''); 
const handleEmailChange = (e) => { 
  setEmail(e.target.value); };
   const handleSubscribe = async () => { 
    try { const response = await axios.post(`${process.env.REACT_APP_API_URL}/subscribe`, { email }); 
    setMessage('Subscription successful!'); 
    setEmail('');  }
     catch (error) {
       setMessage('Subscription failed. Please try again.'); 
      }
    } 
  return (
    <footer>
      <div className="primary">
        <div className="business-section">
          <h4>HELP</h4>
          <ul>
            <li>
              <Link to="/">FAQ</Link>
            </li>
            <li>
              <Link to="/">Return & Exchanges</Link>
            </li>
            <li>
              <Link to="/">Contact Us</Link>
            </li>
            <li>
              <Link to="/">Terms Of Service</Link>
            </li>
          </ul>
        </div>
        <div className="business-section">
          <h4>SHOP WITH US</h4>
          <ul>
           
            <li>
              <Link to="/">All Products</Link>
            </li>
            <li>
              <Link to="/">Gift Cards</Link>
            </li>
            <li>
              <Link to="/">Rewards</Link>
            </li>
          </ul>
        </div>
        <div className="business-section">
          <h4>EXPLORE</h4>
          <ul>
            <li>
              <Link to="/">Our Story</Link>
            </li>
            <li>
              <Link to="/">Customer Review</Link>
            </li>
            <li>
              <Link to="/">Careers</Link>
            </li>
            <li>
              <Link to="/user">Account</Link>
            </li>
          </ul>
        </div>
        <div className="business-section">
          <h4>JOIN THE LUSHIO FAMILY</h4>
          <p>
            {" "}
            Instantly receive updates, access to exclusive deals, product launch
            details, and more.
          </p>
          {/* <input type="email" placeholder="Email Address" />
          <button>SUBSCRIBE</button> */}
          <input type="email" placeholder="Email Address" value={email} onChange={handleEmailChange} /> <button onClick={handleSubscribe}>SUBSCRIBE</button> {message && <p>{message}</p>}
        </div>
        <div className="quick-links">
          <img src="/Images/icons/lushio-text-3-bg.png" alt="" />
          <h4>
            Lushio Fitenss is a Activewear clothing brand headquartered in
            Indore. Our goal is not to make products in large quantities, but
            rather make unique and special products that our customers can wear
            with pride
          </h4>
          <div className="footer-icon-container">
          <a 
        href="https://www.instagram.com/lushio.fitness/?igsh=MWlhdXRoOWlocXZ3YQ%3D%3D" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img src="/Images/icons/instagram.svg" alt=""/>
      </a>
      <a 
        href="https://in.linkedin.com/company/lushio-fitness" 
        target="_blank" 
        rel="noopener noreferrer"
      >
       <img src="/Images/icons/facebook.svg" alt=""/>
      </a>
      <a 
        href="https://in.linkedin.com/company/lushio-fitness" 
        target="_blank" 
        rel="noopener noreferrer"
      >
<img src="/Images/icons/linkedIn.svg" alt=""/>
      </a>




          </div>
        </div>
      </div>
      <div className="secondary">
        <h4>2024 © LushioFitness.com {user && <span>{user.displayName}</span>} </h4>
      </div>
    </footer>
  );
}
