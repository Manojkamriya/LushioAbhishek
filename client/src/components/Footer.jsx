import React from "react";
import "./footer.css";
import { HashLink as Link } from "react-router-hash-link";
export default function Footer() {
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
              <Link to="/">Serch</Link>
            </li>
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
              <Link to="/">Account</Link>
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
          <input type="email" placeholder="Email Address" />
          <button>SUBSCRIBE</button>
        </div>
        <div className="quick-links">
          <img src="./LushioFitness/Images/lushio-text-3.png" alt="" />
          <h4>
            Lushio Fitenss is a Activewear clothing brand headquartered in
            Indore. Our goal is not to make products in large quantities, but
            rather make unique and special products that our customers can wear
            with pride
          </h4>
          <div className="footer-icon-container">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                ></path>{" "}
                <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"></path>{" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                ></path>{" "}
              </g>
            </svg>

            <svg
              enableBackground="new 0 0 56.693 56.693"
              height="56.693px"
              id="Layer_1"
              version="1.1"
              viewBox="0 0 56.693 56.693"
              width="56.693px"
            >
              <path d="M40.43,21.739h-7.645v-5.014c0-1.883,1.248-2.322,2.127-2.322c0.877,0,5.395,0,5.395,0V6.125l-7.43-0.029  c-8.248,0-10.125,6.174-10.125,10.125v5.518h-4.77v8.53h4.77c0,10.947,0,24.137,0,24.137h10.033c0,0,0-13.32,0-24.137h6.77  L40.43,21.739z" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 50 50"
            >
              <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div className="secondary">
        <h4>2024 © LushioFitness.com</h4>
      </div>
    </footer>
  );
}
