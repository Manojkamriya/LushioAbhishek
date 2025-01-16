import React, { useState, useEffect } from "react";

const PINCodeLookup = () => {
  const [pinCode, setPinCode] = useState("");
  const [locationInfo, setLocationInfo] = useState({ district: "", state: "" });
  const [customDistrict, setCustomDistrict] = useState(""); // State for custom district
  const [error, setError] = useState(""); // State for error messages

  useEffect(() => {
    if (pinCode.length === 6) {
      fetchDistrictAndState(pinCode);
    } else {
      // Reset locationInfo and error if the input is not 6 digits
      setLocationInfo({ district: "", state: "" });
      setError("");
    }
  }, [pinCode]);

  const fetchDistrictAndState = async (code) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      if (!response.ok) {
       console.log("Network response was not ok");
      }
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === "Success") {
        setLocationInfo({
          district: data[0].PostOffice[0].District,
          state: data[0].PostOffice[0].State,
        });
        setError(""); // Clear any previous error message
      } else {
        setLocationInfo({ district: "", state: "" }); // Reset information
        setError("Invalid PIN code. Please try again."); // Set error message
      }
    } catch (error) {
      console.error("Error fetching district and state:", error.message);
      setError("Error fetching data. Please try again."); // Set error message
    }
  };

  // Handle custom district input change
  const handleCustomDistrictChange = (e) => {
    setCustomDistrict(e.target.value);
    // Set the district to the custom value
    setLocationInfo((prev) => ({ ...prev, district: e.target.value }));
  };

  return (
    <div>
      <label>Enter 6-digit Postal PIN Code:</label>
      <input
        type="text"
        value={pinCode}
        onChange={(e) => setPinCode(e.target.value)}
        maxLength={6}
      />
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
      {pinCode.length === 6 && !error && (
        <div>
          <label htmlFor="">District:</label>
          <input
            type="text"
            value={locationInfo.district}
            onChange={handleCustomDistrictChange} // Update the district based on custom input
          />
          <label htmlFor="">State:</label>
          <input
            type="text" 
            value={locationInfo.state}
            onChange={(e) => setLocationInfo((prev) => ({ ...prev, state: e.target.value }))} // Allow state to be set manually as well
          />
        </div>
      )}
    </div>
  );
};

export default PINCodeLookup;
