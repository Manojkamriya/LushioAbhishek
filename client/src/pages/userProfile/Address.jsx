import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './address.css';
import { getUser } from "../../firebaseUtils.js";

export default function Address() {
  const [addressData, setAddressData] = useState([]);
  const [user, setUser] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isChangingDefault, setISChangingDefault] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    pinCode: '',
    contactNo: '',
    isDefault: false,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
 
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
    if(user){
      const fetchAddresses = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/addresses/${user.uid}`);
          const sortedAddresses = response.data.addresses.sort((a, b) => b.isDefault - a.isDefault);
          setAddressData(sortedAddresses);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAddresses();
    }
  }, [user]);
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await axios.delete(`http://127.0.0.1:5001/lushio-fitness/us-central1/api/user/addresses/delete/${user.uid}/${id}`);
        setAddressData(addressData.filter((address) => address.id !== id));
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsAddingNew(false);
    setNewAddress(addressData[index]);
  };

  const handleSave = async () => {
    if (!newAddress.name || !newAddress.address || !newAddress.pinCode || !newAddress.contactNo) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      if (editingIndex !== null) {
        const updatedAddress = { ...newAddress };
        await axios.post(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/addresses/${user.uid}`, { updateAddress: updatedAddress });
        const updatedData = [...addressData];
        updatedData[editingIndex] = updatedAddress;
        setAddressData(updatedData.sort((a, b) => b.isDefault - a.isDefault));
        setEditingIndex(null);
      } else {
        const response = await axios.post(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/addresses/${user.uid}`, { newAddress });
        setAddressData(response.data.addresses.sort((a, b) => b.isDefault - a.isDefault));
      }

      setNewAddress({ name: '', address: '', pinCode: '', contactNo: '', isDefault: false });
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleSetDefault = async (id) => {
    setISChangingDefault(true);
    try {
      const response = await axios.post(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/addresses/${user.uid}`, {
        setDefaultAddress: {
          id: id
        }
      });
      setAddressData(response.data.addresses.sort((a, b) => b.isDefault - a.isDefault));
    } catch (error) {
      console.error('Error setting default address:', error);
    } finally {
      setISChangingDefault(false); // Always set loading to false when done
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleAddNewAddress = () => {
    setEditingIndex(null);
    setIsAddingNew(true);
    setNewAddress({ name: '', address: '', pinCode: '', contactNo: '', isDefault: false });
  };
  if(isLoading){
    return <div className="loader-container"> <span className="loader"></span></div>;
   }
  return (
//     <div className="address-wrapper">
//       <div className="address-title">
//         <h2>My Addresses</h2>
//         <hr />
//       </div>

     
//       <div className="address-container">
//     {addressData.map((info, i) => (
//       <div className="myaddress" key={info.id}>
//         <h4>{info.name}</h4>
//         <p>{info.address}</p>
//         <p>Pin Code: {info.pinCode}</p>
//         <p>Contact Number: {info.contactNo}</p>
    
//         {info.isDefault && <h3 className="default-address">Default Address</h3>}
//         <div className="address-action">
//           <button onClick={() => handleEdit(i)}>Edit</button>
//           <button onClick={() => handleRemove(info.id)}>Remove</button>
//           {!info.isDefault && <button onClick={() => handleSetDefault(info.id)}>Set as Default</button>}
//         </div>
//       </div>
//     ))}

//     {(isAddingNew || editingIndex !== null) && (
//       <div className="myaddress edit-address">
//         <h4>{editingIndex !== null ? "Edit Address" : "Add New Address"}</h4>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={newAddress.name}
//           onChange={handleInputChange}
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Address"
//           value={newAddress.address}
//           onChange={handleInputChange}
//         />
//         <input
//           type="text"
//           name="pinCode"
//           placeholder="Pin Code"
//           value={newAddress.pinCode}
//           onChange={handleInputChange}
//         />
//         <input
//           type="text"
//           name="contactNo"
//           placeholder="Contact Number"
//           value={newAddress.contactNo}
//           onChange={handleInputChange}
//         />
//         <div className="address-action">
//           <button onClick={handleSave}>Save</button>
//         </div>
//       </div>
//     )}
//     <div className="myaddress add-new" onClick={handleAddNewAddress}>
//       <span>+</span>
//       <p>Add new addresses</p>
//     </div>
//   </div>
// </div>
<div className="address-wrapper">
  {
    isChangingDefault &&  <div className="spinner-overlay">
    <div></div>
  </div>
  }
<div className="address-title">
  <h2>My Addresses</h2>
  <hr />
</div>

<div className="address-container">
  {/* Conditionally render address list only if not adding or editing */}
  {!(isAddingNew || editingIndex !== null) && (
    <>
      {addressData.map((info, i) => (
        <div className="myaddress" key={info.id}>
          <h4>{info.name}</h4>
          <p>{info.address}</p>
          <p>Pin Code: {info.pinCode}</p>
          <p>Contact Number: {info.contactNo}</p>
          
          {info.isDefault && <h3 className="default-address">Default Address</h3>}
          <div className="address-action">
            <button onClick={() => handleEdit(i)}>Edit</button>
            <button onClick={() => handleRemove(info.id)}>Remove</button>
            {!info.isDefault && <button onClick={() => handleSetDefault(info.id)}>Set as Default</button>}
          </div>
        </div>
      ))}
    </>
  )}

  {/* Show the form when adding or editing an address */}
  {(isAddingNew || editingIndex !== null) && (
    <div className="myaddress edit-address">
      <h4>{editingIndex !== null ? "Edit Address" : "Add New Address"}</h4>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={newAddress.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={newAddress.address}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="pinCode"
        placeholder="Pin Code"
        value={newAddress.pinCode}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="contactNo"
        placeholder="Contact Number"
        value={newAddress.contactNo}
        onChange={handleInputChange}
      />
      <div className="address-action">
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  )}

  {/* Show add new button only when not adding or editing */}
  {!(isAddingNew || editingIndex !== null) && (
    <div className="myaddress add-new" onClick={handleAddNewAddress}>
      <span>+</span>
      <p>Add new addresses</p>
    </div>
  )}
</div>
</div>

  );
}