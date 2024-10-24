import React, { useState } from "react";
import { Modal, Box, Fade, Backdrop } from "@mui/material";

import "./button.css"; 
// import "../userProfile/user.css";
import MultiStepForm from "../shopCategory/MultiStepForm";
import "./modal.css";
const AnimatedModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 

 
  
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
          
<MultiStepForm/>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default AnimatedModal;
