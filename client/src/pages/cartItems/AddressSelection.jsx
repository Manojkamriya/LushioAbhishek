
import React, { useState,useEffect} from 'react';
import PhoneInput from "react-phone-input-2";
import { useAddress } from '../../components/context/AddressContext';
import "./addressSelection.css"
import AddressForm from './AddressForm';
const AddressSelection = ({selectedAddres, setSelectedAddres})=> {
  const {
    addressData,
    isChangingDefault,
    isLoading,
    handleAddAddress,
    handleEditAddress,
    handleRemoveAddress,
    handleSetDefault,
    selectedAddress,
    setSelectedAddress,
  } = useAddress();

  const [editingIndex, setEditingIndex] = useState(null);
  //const [selectedAddress, setSelectedAddress] = useState(null); // New state
  const [newAddress, setNewAddress] = useState({
    name: '',
    flatDetails: '',
    areaDetails: '',
    landmark: '',
    pinCode: '',
    contactNo: '',
    townCity: '',
    state: '',
    country: 'India',
    isDefault: false,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsAddingNew(false);
    setNewAddress(addressData[index]);
  };

  const handlePhoneInputChange = (value) => {
    setNewAddress((prevState) => ({
      ...prevState,
      contactNo: value,
    }));
  };
 useEffect(() => {
  const defaultAddress = addressData.find((addr) => addr.isDefault);
  if (defaultAddress) {
    setSelectedAddress(defaultAddress);
  }
}, [addressData]);
const handleAddressSelection = (address) => {
  setSelectedAddress(address); // Store the selected address object
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleSave = () => {
    if (!newAddress.name || !newAddress.pinCode || !newAddress.contactNo || !newAddress.flatDetails || !newAddress.areaDetails) {
      alert("Please fill in all required fields!");
      return;
    }
// Extract numeric part (without country code)
const numericValue = newAddress.contactNo.replace(/\D/g, "");

// Check if the phone number has exactly 10 digits
if (numericValue.length !== 12) {
  alert("Phone number must be exactly 10 digits.");
  return;
}
    if (editingIndex !== null) {
      handleEditAddress(newAddress, editingIndex);
      setEditingIndex(null);
    } else {
      handleAddAddress(newAddress);
    }

    setNewAddress({
      name: '',
      flatDetails: '',
      areaDetails: '',
      landmark: '',
      pinCode: '',
      contactNo: '',
      townCity: '',
      state: '',
      country: 'India',
      isDefault: false,
    });
    setIsAddingNew(false);
  };

  const handleAddNewAddress = () => {
    setEditingIndex(null);
    setIsAddingNew(true);
    setNewAddress({
      name: '',
      flatDetails: '',
      areaDetails: '',
      landmark: '',
      pinCode: '',
      contactNo: '',
      townCity: '',
      state: '',
      country: 'India',
      isDefault: false,
    });
  };

  const [pinCode, setPinCode] = useState("");
  const [locationInfo, setLocationInfo] = useState({ district: "", state: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (pinCode.length === 6) {
      fetchDistrictAndState(pinCode);
    } else {
      setLocationInfo({ district: "", state: "" });
      setError("");
    }
  }, [pinCode]);

  const fetchDistrictAndState = async (code) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${code}`);
     
      const data = await response.json();
console.log(data);
      if (data && data[0] && data[0].Status === "Success") {
        setLocationInfo({
          district: data[0].PostOffice[0].District,
          state: data[0].PostOffice[0].State,
        });
        setNewAddress((prevAddress) => ({
          ...prevAddress,
          townCity: data[0].PostOffice[0].District,
          state: data[0].PostOffice[0].State,
        }));
        setError("");
      } else {
        setLocationInfo({ district: "", state: "" });
        setError("Invalid PIN code. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching district and state:", error.message);
      setError("Error fetching data. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="loader-container"><span className="loader"></span></div>;
  }

  return (
    <div className="address-selection-wrapper">
      {isChangingDefault && <div className="spinner-overlay"><div></div></div>}
      <div className="address-title">
        <h2>My Addresses</h2>
        <hr />
      </div>
      <AddressForm
        isAddingNew={isAddingNew}
        editingIndex={editingIndex}
        newAddress={newAddress}
        handleInputChange={handleInputChange}
        handlePhoneInputChange={handlePhoneInputChange}
        pinCode={pinCode}
        setPinCode={setPinCode}
        error={error}
        locationInfo={locationInfo}
        handleSave={handleSave}
        setIsAddingNew={setIsAddingNew}
        setEditingIndex={setEditingIndex}
      />
      {/* {(isAddingNew || editingIndex !== null) && (
        <div className="edit-address">
          <h4>{editingIndex !== null ? "Edit Address" : "Add New Address"}</h4>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            id="name"
            value={newAddress.name}
            onChange={handleInputChange}
            autoFocus
          />

          <label htmlFor="contactNo">Contact Number</label>
          <PhoneInput
            country={"in"}
            value={newAddress.contactNo}
            onChange={handlePhoneInputChange}
            countryCodeEditable={false}
            disableDropdown={true}
            inputProps={{
              name: "contactNo",
              required: true,
              autoFocus: false,
            }}
          />

          <label htmlFor="flatDetails">Flat, House no., Building, Company, Apartment</label>
          <input
            type="text"
            name="flatDetails"
            placeholder="Flat, House no., Building, Company, Apartment"
            id="flatDetails"
            value={newAddress.flatDetails}
            onChange={handleInputChange}
          />

          <label htmlFor="areaDetails">Area, Street, Sector, Village</label>
          <input
            type="text"
            name="areaDetails"
            placeholder="Area, Street, Sector, Village"
            id="areaDetails"
            value={newAddress.areaDetails}
            onChange={handleInputChange}
          />

          <label htmlFor="landmark">Landmark</label>
          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            id="landmark"
            value={newAddress.landmark}
            onChange={handleInputChange}
          />

          <label>Enter 6-digit Postal PIN Code:</label>
          <input
            type="text"
            name="pinCode"
            placeholder="Pin Code"
            value={pinCode}
            onChange={(e) => {
              setPinCode(e.target.value);
              handleInputChange(e);
            }}
            maxLength={6}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {pinCode.length === 6 && !error && (
            <div>
              <label>District:</label>
              <input
                name="townCity"
                type="text"
                value={locationInfo.district}
                onChange={handleInputChange}
              />
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={locationInfo.state}
                readOnly
                onChange={handleInputChange}
              />
            </div>
          )}

          <label htmlFor="country">Country</label>
          <input
            type="text"
            name="country"
            value="India"
            readOnly
          />

          <div className="address-action">
            <button onClick={handleSave}>Save</button>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingIndex(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}

        <div className="address-selection-container">
        {!(isAddingNew || editingIndex !== null) && (
                <div className="Add-new-address" onClick={handleAddNewAddress}>
                  <span>+</span>
                  <p>Add new addresses</p>
                </div>
             )}
              {addressData.length === 0 ? (
                <p>No addresses found. Please add a new address.</p>
              ) : (
                !(isAddingNew || editingIndex !== null) && (
                  <>
                    {addressData.map((info, i) => (
                      <label key={info.id} 
                      // className="address-option" 
                      htmlFor={`address-${info.id}`}
                      className={`address-option ${selectedAddress?.id === info.id ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          id={`address-${info.id}`}
                          name="selectedAddress"
                          value={info.id}
                          checked={selectedAddress?.id === info.id}
                          onChange={() => handleAddressSelection(info)} // Pass the entire address object
                         // onChange={() => setSelectedAddress(info)}
                        />
                        <div className="address">
                          <h4>{info.name}</h4>
                          <span>{info.flatDetails}{", "}{info.areaDetails}{", "}{info.landmark}{", "}{info.townCity}{", "}{info.state}{", "}</span>
                          <span>Pin Code: {info.pinCode}  </span>
                         
                          <p>Contact Number: {info.contactNo.startsWith('91') ? info.contactNo.substring(2) : info.contactNo}</p>

                          {info.isDefault && <h3 className="default-address">Default Address</h3>}
                          <div className="address-action">
                            <button onClick={() => handleEdit(i)}>Edit</button>
                            <button onClick={() => handleRemoveAddress(info.id)}>Remove</button>
                            {!info.isDefault && <button onClick={() => handleSetDefault(info.id)}>Set as Default</button>}
                          </div>
                        </div>
                      </label>
                    ))}
                    <button className="address-done-button">Done</button>
                  </>
                )
              )}
      
      
    

           </div> 
    </div>
  );
}
export default AddressSelection;

