import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Modal, Backdrop, Fade, Box, Typography } from '@mui/material';
import './Coupon.css';
import { UserContext } from '../../components/context/UserContext';

function Coupon({ setDiscount, cartAmount }) {
  const [open, setOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(''); // For radio-selected coupon
  const [inputCoupon, setInputCoupon] = useState(''); // For manually entered coupon
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/coupon`);
        if (response.data && response.data.coupons) {
          setCoupons(response.data.coupons);
          if (response.data.coupons.length > 0) {
            setSelectedCoupon(response.data.coupons[0].code); // Set the first coupon as selected
          }
        }
      } catch (error) {
        console.log('Error fetching coupons.');
      }
    };
    fetchCoupons();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
    setValidationMessage('');
    setInputCoupon(''); // Reset input coupon on close
  };

  const handleSubmit = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setValidationMessage('');

    const couponCode = inputCoupon || selectedCoupon; // Prioritize input coupon if available

    // Check if all necessary data is present
    if (!user?.uid || !couponCode || !cartAmount) {
      setValidationMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/coupon/use`, {
        uid: user.uid,
        code: couponCode,
        purchaseOf: parseFloat(cartAmount),
      });

      const discountValue = response.data.discount;
      setDiscount(discountValue); // Update discount in parent component
      setSuccessMessage('Coupon applied successfully! Discount: ₹' + discountValue);
      handleClose();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error applying coupon');
    }
    setInputCoupon(''); 
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>Apply Coupon</button>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: "9px",
              boxShadow: 10,
              p: 4,
            }}
          >
            <img
              src="/Images/icons/cross.png"
              alt="Close"
              className="coupon-close"
              onClick={handleClose}
            />
            <div className="coupon-input-container">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                onChange={(e) => setInputCoupon(e.target.value)}
                value={inputCoupon}
                className="coupon-input"
              />
              <button onClick={handleSubmit} className="apply-button">Apply</button>
            </div>
            <h2>Select a Coupon</h2>
            <div className="options">
              {coupons.map((coupon) => (
                <label key={coupon.code} className={`option ${selectedCoupon === coupon.code ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="coupon"
                    value={coupon.code}
                    checked={selectedCoupon === coupon.code && !inputCoupon} // Prevent radio selection if inputCoupon is used
                    onChange={() => setSelectedCoupon(coupon.code)}
                  />
                  <div>
                    <p>{coupon.code} - Valid until: {coupon.validity || 'N/A'}</p>
                    <p>Min Amount: {coupon.onPurchaseOf || 'N/A'}, Discount: {coupon.discount || 'N/A'}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="coupon-button-container">
              <button onClick={handleClose} className="cancel-button">Cancel</button>
              <button onClick={handleSubmit} className="apply-button">Apply Coupon</button>
            </div>

            {validationMessage && <Typography color="warning">{validationMessage}</Typography>}
            {successMessage && <Typography color="success">{successMessage}</Typography>}
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default Coupon;
