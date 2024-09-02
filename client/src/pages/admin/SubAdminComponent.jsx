import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";

const SubAdminComponent = () => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logged out Successfully!");
        window.location.href = "/LushioFitness";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        alert("Couldn't Log out, please try again.");
      });
  };

  return (
    <div>
      <h1>Sub-Admin Panel</h1>
      {/* Other sub-admin functionalities */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SubAdminComponent;
