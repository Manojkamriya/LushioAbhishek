import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "./UserContext"; 

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addressData, setAddressData] = useState([]);
  const { user } = useContext(UserContext); 
  const [isChangingDefault, setISChangingDefault] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/addresses/${user.uid}`);
      const sortedAddresses = response.data.addresses.sort((a, b) => b.isDefault - a.isDefault);
      setAddressData(sortedAddresses);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (newAddress) => {
    setISChangingDefault(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/addresses/${user.uid}`, { newAddress });
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
      await axios.post(`${process.env.REACT_APP_API_URL}/user/addresses/${user.uid}`, { updateAddress: updatedAddress });
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
        setISChangingDefault(true);
        await axios.delete(`${process.env.REACT_APP_API_URL}/user/addresses/delete/${user.uid}/${id}`);
        setAddressData(addressData.filter((address) => address.id !== id));
      } catch (error) {
        console.error('Error deleting address:', error);
      }
      finally {
        setISChangingDefault(false);
      }
    }
  };

  const handleSetDefault = async (id) => {
    setISChangingDefault(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/addresses/${user.uid}`, {
        setDefaultAddress: { id }
      });
      setAddressData(response.data.addresses.sort((a, b) => b.isDefault - a.isDefault));
    } catch (error) {
      console.error('Error setting default address:', error);
    } finally {
      setISChangingDefault(false);
    }
  };
  useEffect(() => {
    const defaultAddress = addressData.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [addressData]);
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
      selectedAddress,
      setSelectedAddress,
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
