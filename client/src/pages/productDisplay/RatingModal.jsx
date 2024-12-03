import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import "./button.css";
import MultiStepForm from "./MultiStepForm";
import { UserContext } from "../../components/context/UserContext";
import "./modal.css";
const RatingModal = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Hook for navigation

  const handleOpen = () => {
    if (!user) {
    //  setOpen(true);
      navigate('/login');
    } else {
      setOpen(true);
    }
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
           className="modal-box"
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
            <img
              src="/Images/icons/cross.png"
              alt=""
              className="modal-close"
              onClick={handleClose}
            />
            <MultiStepForm productId={productId} handleClose={handleClose} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default RatingModal;
