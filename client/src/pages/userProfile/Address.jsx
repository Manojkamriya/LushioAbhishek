import React, { useState } from 'react';
import './address.css';

const initialAddressData = [
  {
    name: "Manoj Kamriya",
    address: "73, P&T colony, Gali No. 05 Ratlam, Madhya Pradesh ",
    pinCode: 457001,
    contactNo: 7489236023,
  },
  {
    name: "Pranit Mandloi",
    address: "325 Sector B Scheme no 136 Behind Brilliant Aura",
    pinCode: 452010,
    contactNo: 7999658233,
  }
];

export default function Address() {
  const [addressData, setAddressData] = useState(initialAddressData);
  const [editingIndex, setEditingIndex] = useState(null); // Track which address is being edited
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    pinCode: '',
    contactNo: '',
  });
  const [isAddingNew, setIsAddingNew] = useState(false); // Track if adding a new address

  // Remove address
  const handleRemove = (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updatedData = addressData.filter((_, i) => i !== index);
      setAddressData(updatedData);
    }
  };

  // Edit address
  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsAddingNew(false); // Hide the add form if editing an existing address
    setNewAddress(addressData[index]); // Load existing data into form for editing
  };

  // Save edited or new address
  const handleSave = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.pinCode || !newAddress.contactNo) {
      alert("Please fill in all fields!");
      return;
    }

    if (editingIndex !== null) {
      const updatedData = [...addressData];
      updatedData[editingIndex] = newAddress;
      setAddressData(updatedData);
      setEditingIndex(null);
    } else {
      setAddressData([...addressData, newAddress]);
    }

    // Reset form
    setNewAddress({ name: '', address: '', pinCode: '', contactNo: '' });
    setIsAddingNew(false); // Close the add new form
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  // Show form to add a new address
  const handleAddNewAddress = () => {
    setEditingIndex(null); // Reset edit state
    setIsAddingNew(true); // Show the form for adding a new address
    setNewAddress({ name: '', address: '', pinCode: '', contactNo: '' }); // Reset form
  };

  return (
    <div className="address-wrapper">
      <div className="address-title">
        <h2>My Addresses</h2>
        <hr />
      </div>

      <div className="address-container">
        {addressData.map((info, i) => (
          <div className="myaddress" key={i}>
            <h4>{info.name}</h4>
            <p>{info.address}</p>
            <p>Pin Code: {info.pinCode}</p>
            <p>Contact Number: {info.contactNo}</p>
            <div className="address-action">
              <button onClick={() => handleEdit(i)}>edit</button>
              <button onClick={() => handleRemove(i)}>remove</button>
            </div>
          </div>
        ))}

        {/* Add New Address Button */}
        <div className="myaddress add-new" onClick={handleAddNewAddress}>
          <span>+</span>
          <p>Add new address</p>
        </div>

        {/* Add / Edit Address Form */}
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
      </div>
    </div>
  );
}
