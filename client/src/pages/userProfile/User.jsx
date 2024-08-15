import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig.js";
import { signOut } from "firebase/auth";
import "./user.css";

function User() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Log the UID in the console
        console.log("User UID:", user.uid);
        setUser(user.displayName);  
      } else {
        // If not authenticated, redirect to the login page
        navigate("/login");
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Redirect to the login page after successful sign out
        alert("Logged out Successfully!");
        window.location.href = "/LushioFitness"; // Ensure this route is defined in your router
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        alert("Couldn't Log out, please try again.");
      });
  };

  return (
    <>
      <h1 className="user-greet">Welcome {user}</h1>
      <p className="user-question">What would you like to do?</p>
      <div className="user-action-container">
        <div className="user-action">
          <Link to="/user/profile">
            <img
              src="./LushioFitness/Images/icons/editProfile.png"
              alt="logo"
            />
          </Link>
          <div className="action-details">
            <h3>Edit Profile</h3>
            <p>Edit personal info, change password</p>
          </div>
        </div>

        <div className="user-action">
          <Link to="/LushioFitness">
            <img
              src="./LushioFitness/Images/icons/continueShopping.png"
              alt="logo"
            />
          </Link>
          <div className="action-details">
            <h3>Keep Shopping</h3>
            <p>Go to Home page</p>
          </div>
        </div>
        <div className="user-action">
          <Link to="/orders">
            <img src="./LushioFitness/Images/icons/orders.png" alt="logo" />
          </Link>
          <div className="action-details">
            <h3>Your Orders</h3>
            <p>Track, return, or buy things again</p>
          </div>
        </div>
        
        <div className="user-action">
        <Link to="/refer-and-earn">
            <img src="./LushioFitness/Images/icons/referEarn.png" alt="logo" />{" "}
          </Link>
         
          <div className="action-details">
            <h3>Refer and Earn</h3>
            <p>Refer to your friends, family members</p>
          </div>
        </div>
        <div className="user-action" onClick={handleLogout}>
          <img src="./LushioFitness/Images/icons/logout.png" alt="Sign Out" />
          <div className="action-details">
            <h3>Sign Out</h3>
            <p>Sign out from your account</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
