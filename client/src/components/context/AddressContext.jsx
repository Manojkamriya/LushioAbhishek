// AddressContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "./UserContext"; 

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addressData, setAddressData] = useState([]);
  const { user } = useContext(UserContext); 
  const [isChangingDefault, setISChangingDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

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

  const handleAddAddress = async (newAddress) => {
    setISChangingDefault(true);
    try {
      const response = await axios.post(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/addresses/${user.uid}`, { newAddress });
      setAddressData(response.data.addresses.sort((a, b) => b.isDefault - a.isDefault));
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setISChangingDefault(false);
    }
  };

  const handleEditAddress = async (updatedAddress, index) => {
    setISChangingDefault(true);
    try {
      await axios.post(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/addresses/${user.uid}`, { updateAddress: updatedAddress });
      const updatedData = [...addressData];
      updatedData[index] = updatedAddress;
      setAddressData(updatedData.sort((a, b) => b.isDefault - a.isDefault));
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setISChangingDefault(false);
    }
  };

  const handleRemoveAddress = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await axios.delete(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/addresses/delete/${user.uid}/${id}`);
        setAddressData(addressData.filter((address) => address.id !== id));
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefault = async (id) => {
    setISChangingDefault(true);
    try {
      const response = await axios.post(`https://us-central1-lushio-fitness.cloudfunctions.net/api/user/addresses/${user.uid}`, {
        setDefaultAddress: { id }
      });
      setAddressData(response.data.addresses.sort((a, b) => b.isDefault - a.isDefault));
    } catch (error) {
      console.error('Error setting default address:', error);
    } finally {
      setISChangingDefault(false);
    }
  };

  return (
    <AddressContext.Provider value={{
      addressData,
      isChangingDefault,
      isLoading,
      handleAddAddress,
      handleEditAddress,
      handleRemoveAddress,
      handleSetDefault,
      setAddressData,
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
