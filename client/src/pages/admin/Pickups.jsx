// Pickups.jsx
import React, { useState, useEffect } from 'react';
import './Pickups.css';

const API = process.env.REACT_APP_API_URL;
const CustomAlert = ({ message, type, onClose }) => (
  <div className={`custom-alert ${type}`}>
    <span>{message}</span>
    <button onClick={onClose} className="alert-close-button">&times;</button>
  </div>
);

const StatusBadge = ({ status }) => {
  let statusText = "Unknown";
  let statusClass = "status-unknown";

  switch (status) {
    case 1:
      statusText = "Active";
      statusClass = "status-active";
      break;
    case 2:
      statusText = "Primary";
      statusClass = "status-primary";
      break;
    default:
      break;
  }

  return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
};

const Pickups = ({ onClose }) => {
  const [pickupLocations, setPickupLocations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [formData, setFormData] = useState({
    pickup_location: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    address_2: '',
    city: '',
    state: '',
    country: '',
    pin_code: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPickupLocations();
  }, []);

  const fetchPickupLocations = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${API}/pickup/pickup-locations`);
      const responseData = await response.json();
      
      if (responseData.data) {
        setPickupLocations(responseData.data.shipping_address);
        setCompanyName(responseData.data.company_name);
      }
    } catch (error) {
      setError('Failed to fetch pickup locations');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${API}/pickup/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Pickup location added successfully!');
        setFormData({
          pickup_location: '',
          name: '',
          email: '',
          phone: '',
          address: '',
          address_2: '',
          city: '',
          state: '',
          country: '',
          pin_code: ''
        });
        fetchPickupLocations();
        setShowAddForm(false);
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError('Failed to add pickup location');
      }
    } catch (error) {
      setError('Failed to add pickup location');
    }
  };

  return (
    <div className="pickup-modal-overlay">
      <div className="pickup-modal">
        <div className="pickup-modal-header">
          <div>
            <h2>Pickup Locations</h2>
            {companyName && <p className="company-name">{companyName}</p>}
          </div>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        {error && (
          <CustomAlert 
            message={error} 
            type="error" 
            onClose={() => setError('')}
          />
        )}

        {success && (
          <CustomAlert 
            message={success} 
            type="success" 
            onClose={() => setSuccess('')}
          />
        )}

        <div className="pickup-content">
          {!showAddForm ? (
            <>
              <button 
                className="add-pickup-button" 
                onClick={() => setShowAddForm(true)}
              >
                Add New Pickup Location
              </button>

              <div className="pickup-locations-list">
                {pickupLocations.map((location) => (
                  <div key={location.id} className="pickup-location-card">
                    <div className="pickup-header">
                      <h3>{location.pickup_location}</h3>
                      <StatusBadge status={location.status} />
                    </div>
                    {location.is_primary_location === 1 && (
                      <div className="primary-badge">Primary Location</div>
                    )}
                    <p><strong>Contact:</strong> {location.name}</p>
                    <p><strong>Email:</strong> {location.email}</p>
                    <p><strong>Phone:</strong> {location.phone}</p>
                    <div className="address-section">
                      <p><strong>Address:</strong> {location.address}</p>
                      {location.address_2 && <p className="address-2">{location.address_2}</p>}
                      <p>{location.city}, {location.state}, {location.country} - {location.pin_code}</p>
                    </div>
                    {location.instruction && (
                      <p className="instruction"><strong>Instructions:</strong> {location.instruction}</p>
                    )}
                    {location.phone_verified === 1 && (
                      <div className="verified-badge">Phone Verified</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="pickup-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Pickup Location Name*</label>
                  <input
                    type="text"
                    name="pickup_location"
                    value={formData.pickup_location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    name="address_2"
                    value={formData.address_2}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>City*</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State*</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country*</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>PIN Code*</label>
                  <input
                    type="text"
                    name="pin_code"
                    value={formData.pin_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit">Add Pickup Location</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pickups;