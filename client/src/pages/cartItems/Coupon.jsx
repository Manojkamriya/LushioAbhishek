import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Modal, Backdrop, Fade, Box, Typography } from "@mui/material";
import { AiOutlineLoading } from "react-icons/ai";
import "./Coupon.css";
import { UserContext } from "../../components/context/UserContext";
function Coupon({ setDiscount, cartAmount }) {
  const [open, setOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(""); // For radio-selected coupon
  const [inputCoupon, setInputCoupon] = useState(""); // For manually entered coupon
  const [successMessage, setSuccessMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/coupon/usableCoupons/${user.uid}`
        );
       
        if (response.data) {
          const couponsData = Object.values(response.data); // Convert object to array
          console.log(couponsData);
          setCoupons(couponsData);
          if (couponsData.length > 0) {
            setSelectedCoupon(couponsData[0].id); // Set the first coupon as selected
          }
        }
      } catch (error) {
        console.log("Error fetching coupons.");
      }
    };
    fetchCoupons();
  }, [user.uid]);

  const handleClose = () => {
    setOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
    setValidationMessage("");
    setInputCoupon(""); // Reset input coupon on close
  };

  const handleSubmit = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setValidationMessage("");

    const couponCode = inputCoupon || selectedCoupon; // Prioritize input coupon if available

    // Check if all necessary data is present
    // if (!user?.uid || !couponCode || !cartAmount) {
    //   setValidationMessage("All fields are required.");
    //   return;
    // }

    try {
      setIsApplying(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/coupon/use`,
        {
          uid: user.uid,
          code: couponCode,
          purchaseOf: parseFloat(cartAmount),
        }
      );

      const discountValue = response.data.discount;
      setDiscount(discountValue); // Update discount in parent component
      setSuccessMessage(
        "Coupon applied successfully! Discount: ₹" + discountValue
      );
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error applying coupon");
    } finally {
      setIsApplying(false);
    }
    setInputCoupon("");
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>Apply</button>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box
            className="modal-box modal-box-coupon"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "76%",
              maxWidth: "400px",
              bgcolor: "background.paper",
              borderRadius: "9px",
              boxShadow: 10,
              p: 4,
            }}
          >
            <div className="coupon-container-mobile">
              <img
                src="/Images/icons/cross.png"
                alt="Close"
                className="coupon-close"
                onClick={handleClose}
              />

              {!success ? (
                <>
                <div className="coupon-input-container">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    onChange={(e) => setInputCoupon(e.target.value)}
                    value={inputCoupon}
                    className="coupon-input"
                  />
                  <button onClick={handleSubmit} className="apply-button">
                    Check
                  </button>
                </div>
               
                <div className="coupon-options">
                  {coupons.length > 0 ? (
                    <>
                     <h2 className="coupon-select-heading">Select a Coupon</h2>
                      {coupons.map((coupon) => (
                        <label
                          key={coupon.id}
                          className={`option ${
                            selectedCoupon === coupon.id ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="coupon"
                            value={coupon.id}
                            checked={
                              selectedCoupon === coupon.id && !inputCoupon
                            } // Prevent radio selection if inputCoupon is used
                            onChange={() => setSelectedCoupon(coupon.id)}
                          />
                          <div>
                            <p>
                              {coupon.id} - Valid until:{" "}
                              {coupon.validity || "N/A"}
                            </p>
                            <p>
                              Min Amount: {coupon.onPurchaseOf || "N/A"},
                              Discount: {coupon.discount || "N/A"}
                            </p>
                          </div>
                        </label>
                      ))}
                      <div className="coupon-button-container">
                        <button onClick={handleClose} className="cancel-button">
                          Cancel
                        </button>
                        <button onClick={handleSubmit} className="apply-button">
                          {isApplying ? (
                            <>
                              <AiOutlineLoading className="spinner-icon" />
                              Applying...
                            </>
                          ) : (
                            "Apply Coupon"
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="no-coupons-message">No coupons available</p>
                  )}
                </div>
              </>
              
              ) : (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="/Images/success.mp4"
                  className="success-message"
                >
                  Your browser does not support the video tag.
                </video>
              )}

             

              {validationMessage && (
                <Typography color="warning">{validationMessage}</Typography>
              )}
              {successMessage && (
                <Typography color="success">{successMessage}</Typography>
              )}
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default Coupon;
