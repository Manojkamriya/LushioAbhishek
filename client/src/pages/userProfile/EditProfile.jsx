import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUser } from "../../firebaseUtils.js";

function EditProfile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
   
    gender: "",
  });

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser(); 
        setUser(currentUser);
        console.log(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

 
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
         const response = await axios.get(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/details/${user.uid}`);
       
        setUserData(response.data);
        
          console.log("Fetched user data:", response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/details/${user.uid}`, userData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="edit-profile-container">
      <p className="user-question">Edit Your Profile</p>
      <form onSubmit={handleSubmit} className="edit-profile">
        <label>Name</label>
        <input
          type="text"
          name="displayName"
          placeholder="Enter your Name"
          value={userData.displayName}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={userData.email}
          onChange={handleChange}
          required
        />

        <label>Phone no.</label>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Enter your phone no."
          value={userData.phoneNumber}
          onChange={handleChange}
          required
        />

    

        <div className="radio-input">
          <label>Gender</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={userData.gender === "Male"}
                onChange={handleChange}
                required
              /> Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={userData.gender === "Female"}
                onChange={handleChange}
                required
              /> Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={userData.gender === "Other"}
                onChange={handleChange}
                required
              /> Other
            </label>
          </div>
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;
