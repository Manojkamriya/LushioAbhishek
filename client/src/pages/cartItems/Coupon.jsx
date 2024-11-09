import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { Modal, Backdrop, Fade, Box, Radio, FormControl, FormControlLabel, RadioGroup,Typography, } from '@mui/material';
import "./Coupon.css";
import { UserContext } from "../../components/context/UserContext";
function Coupon() {
  const [open, setOpen] = useState(false);
  const {user} = useContext(UserContext);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Set initially to null
 // State variables for individual messages
 const [purchaseOf, setPurchaseOf] = useState('6000');
 const [discountedAmount, setDiscountedAmount] = useState(parseFloat(purchaseOf)); // Store the discounted amount

 const [successMessage, setSuccessMessage] = useState('');
 const [errorMessage, setErrorMessage] = useState('');
 const [validationMessage, setValidationMessage] = useState('');

 //const handleOpen = () => setOpen(true);
 const handleClose = () => {
   setOpen(false);
   // Reset fields and messages
  // setUid('');
  // setCode('');
  setPurchaseOf('1000');
  setDiscountedAmount(parseFloat(purchaseOf)); // Reset discounted amount

   setSuccessMessage('');
   setErrorMessage('');
   setValidationMessage('');
 };

 const handleSubmit = async (uid, code,purchaseOf) => {
  
   setSuccessMessage(''); // Clear previous success messages
   setErrorMessage('');   // Clear previous error messages
   setValidationMessage(''); // Clear previous validation messages

   // Validate inputs
   if (!uid || !code || !purchaseOf) {
     setValidationMessage('All fields are required.');
     return;
   }

   try {
     const response = await axios.post(`${process.env.REACT_APP_API_URL}/coupon/use`, {
       uid,
       code,
       purchaseOf: parseFloat(purchaseOf),
     });

     // Set success message with discount if coupon is applied
  //   setSuccessMessage('Coupon applied successfully! Discount: ₹' + response.data.discount);
     // Set success message with discount if coupon is applied
     const discount = response.data.discount;
     setSuccessMessage('Coupon applied successfully! Discount: ₹' + discount);
     const newAmount = parseFloat(purchaseOf) - discount; // Calculate the new amount after applying discount
     setDiscountedAmount(newAmount < 0 ? 0 : newAmount); // Ensure the amount does not go below 0
   } catch (error) {
     // Set error message based on the response from the server
     if (error.response) {
       setErrorMessage(error.response.data.error);
     } else {
       setErrorMessage('Error applying coupon');
     }
   }
 };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/coupon`);
        setCoupons(response.data.coupons);

        // Set the first coupon as selected by default if coupons are available
        if (response.data.coupons.length > 0) {
          setSelectedCoupon(response.data.coupons[0].code); // Set selected coupon after fetching
        }
      } catch (error) {
        console.log("Error fetching coupons.");
      }
    };
    fetchCoupons();
  }, []);

  const handleOpen = () => setOpen(true);
 // const handleClose = () => setOpen(false);

  return (
    <div>
      <button onClick={handleOpen}>Apply Coupon</button>
      
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
            <h2>Select a Coupon</h2>

            <FormControl component="fieldset">
              <RadioGroup
                value={selectedCoupon}
                onChange={(e) => setSelectedCoupon(e.target.value)}
              >
               <img
              src="/Images/icons/cross.png"
              alt=""
              className='coupon-close'
              onClick={handleClose}
              style={{ aspectRatio: 1 }}
            />
                {coupons.map((coupon) => (
                  <FormControlLabel
                    key={coupon.id}
                    value={coupon.code}
                    control={<Radio />}
                    label={
                      <div className="coupon-container">
                        <p><strong>Coupon Code:</strong> {coupon.code}</p>
                        <p><strong>Validity:</strong> {coupon.Validity}</p>
                        <p><strong>Minimum Purchase:</strong> ₹{coupon.onPurchaseOf}</p>
                        <p><strong>Discount:</strong> {coupon.discount}</p>
                      </div>
                    }
                  />
                ))}
                 {/* Display messages */}
            {validationMessage && <Typography color="warning">{validationMessage}</Typography>}
            {successMessage && <Typography color="success">{successMessage}</Typography>}
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                <button className='apply-button' onClick={()=>handleSubmit(user.uid, selectedCoupon, purchaseOf)}>Apply Coupon</button>
              </RadioGroup>
            </FormControl>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default Coupon;
