import React, { useState } from "react";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import StarRating from "./StarRating";
import "./button.css"; 
// import "../userProfile/user.css";
import "./modal.css";
const AnimatedModal = () => {
  const [open, setOpen] = useState(false);

  const [buttonState, setButtonState] = useState(""); // For managing button state


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClickAndClose = () => {
    setButtonState("onclic");
  
    setTimeout(() => {
      setButtonState("validate");
  
      setTimeout(() => {
        setButtonState(""); // Reset to default after validate state
        handleClose(); // Close the modal after reset
      }, 700);
    }, 1250);
  };
  
 
  
  return (
    <div>
      <button onClick={handleOpen} className="open-rating-button">
        Rate Us
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
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
              border: ".5px solid #000",
              borderRadius: "5px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className="feedback-container">
            <h2>Rate Us</h2>
            <p>
              Rate us to improve user experience and give your suggestion also
            </p>

<div className="star-rating">
              <StarRating />
            </div>
         
          <label for="review">Write your Review</label>

<textarea id="review" name="review" rows="4" cols="50"/>

</div>
<div className="container">
      <button 
        className={buttonState} 
        onClick={handleClickAndClose}>
      </button>
    </div> 


         
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default AnimatedModal;
