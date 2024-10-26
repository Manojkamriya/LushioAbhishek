import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseConfig.js";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/context/UserContext";
import "./user.css";

function User() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to sign out?");
    
    if (confirmLogout) {
      signOut(auth)
        .then(() => {
          alert("Logged out Successfully!");
          window.location.href = "/LushioFitness";
        })
        .catch((error) => {
          console.error("Error signing out:", error);
          alert("Couldn't Log out, please try again.");
        });
    }
  };

  return (
    <>
      {user && <h1 className="user-greet">Welcome {user.displayName}</h1>}
      <p className="user-question">What would you like to do?</p>
      <div className="user-action-container">
        <div className="user-action" onClick={() => { navigate("/user-editProfile") }}>
          <Link to="/user-editProfile">
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

        <div className="user-action" onClick={() => { navigate("/LushioFitness") }}>
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
        <div className="user-action" onClick={() => { navigate("/user/orders") }}>
          <Link to="/user-orders">
            <img src="./LushioFitness/Images/icons/orders.png" alt="logo" />
          </Link>
          <div className="action-details">
            <h3>Your Orders</h3>
            <p>Track, return, or buy things again</p>
          </div>
        </div>

        <div className="user-action" onClick={() => { navigate("/user-address") }}>
          <Link to="/user-address">
            <img src="./LushioFitness/Images/icons/address.png" alt="logo" />{" "}
          </Link>

          <div className="action-details">
            <h3>My Addresses</h3>
            <p>Add, Remove or change your default address</p>
          </div>
        </div>
        <div className="user-action" onClick={() => { navigate("/user-referAndEarn") }}>
          <Link to="/user-referAndEarn">
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
