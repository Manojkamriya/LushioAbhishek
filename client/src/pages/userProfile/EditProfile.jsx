import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUser } from "../../firebaseUtils.js";
import moment from "moment";

// import Checker from "./Checker.jsx"
// import Test from "./Test.jsx";
function EditProfile() {
 
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    dob:"",
    doa: "",
    gender: "",
  });
const [isLoading, setIsLoading] = useState(false);
  // const convertToISODate = (dateString) => {
  //   if (!dateString) return '';
  //   const parsedDate = moment(dateString, "DD-MM-YYYY", true);
  //   return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : '';
  // };
  
  const convertToDisplayDate = (dateString) => {
    if (!dateString) return '';
    const parsedDate = moment(dateString, "YYYY-MM-DD", true);
    return parsedDate.isValid() ? parsedDate.format("DD-MM-YYYY") : '';
  };
  
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
      setIsLoading(true);
      const fetchUserData = async () => {
        try {
        // const response = await axios.get(`http://127.0.0.1:5001/lushio-fitness/us-central1/api/user/details/${user.uid}`);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/details/${user.uid}`);

      const data = response.data;
      setUserData({
        ...data,
        dob: convertToDisplayDate(data.dob),
        doa: convertToDisplayDate(data.doa)
      });
          console.log("Fetched user data:", response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
      setIsLoading(false);
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedData = {
        ...userData,
        dob: (convertToDisplayDate(userData.dob)),
        doa: (convertToDisplayDate(userData.doa))
      };
      console.log(updatedData);
      await axios.post(`${process.env.REACT_APP_API_URL}/user/details/${user.uid}`, updatedData);
      
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    finally{
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`);
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  if (isLoading) {
    return <div className="spinner-overlay"><div></div></div>;
  }
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
 <label>BirthDay Date</label>
    <input
      type="date"
      name="dob"
      value={userData.dob}
      onChange={handleChange}
      
    />

    <label>Anniversary Date </label>
    <input
      type="date"
      name="doa"
      value={userData.doa}
      onChange={handleChange}
      
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