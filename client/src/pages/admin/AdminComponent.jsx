import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import "./AdminComponent.css"; // Import the CSS file
import AddProducts from "./AddProducts";
import EditProducts from "./EditProducts.jsx";
import ChangeBanners from "./ChangeBanners";
import SendTokens from "./SendTokens";
import ViewComplaints from "./ViewComplaints";
import AdminControls from "./AdminControls";

const AdminComponent = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

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

  const renderComponent = () => {
    switch (selectedComponent) {
      case "AddProducts":
        return <AddProducts />;
      case "EditProducts":
        return <EditProducts />;
      case "ChangeBanners":
        return <ChangeBanners />;
      case "SendTokens":
        return <SendTokens />;
      case "ViewComplaints":
        return <ViewComplaints />;
      case "AdminControls":
        return <AdminControls />;
      default:
        return <h1>Welcome Admin</h1>;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <button onClick={() => setSelectedComponent("AddProducts")} className="admin-button">
          Add Products
        </button>
        <button onClick={() => setSelectedComponent("EditProducts")} className="admin-button">
          Edit Products
        </button>
        <button onClick={() => setSelectedComponent("ChangeBanners")} className="admin-button">
          Change Banners
        </button>
        <button onClick={() => setSelectedComponent("SendTokens")} className="admin-button">
          Send Tokens
        </button>
        <button onClick={() => setSelectedComponent("ViewComplaints")} className="admin-button">
          View Complaints
        </button>
        <button onClick={() => setSelectedComponent("AdminControls")} className="admin-button">
          Admin Controls
        </button>
        <button onClick={handleLogout} className="admin-logout-button">
          Logout
        </button>
      </div>
      <div className="admin-main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminComponent;
