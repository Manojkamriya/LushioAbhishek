import React,{useState} from "react";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import AddressSelection from "./AddressSelection"
const PlaceOrder = ({selectedAddress, setSelectedAddress})=> {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
 const handleOpen = () => {
        setOpen(true);
  };
  console.log(selectedAddress);
  return (
    <div>
     <button onClick={handleOpen} className="address-selection-button open-rating-button">
       Change
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
<AddressSelection selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress}/>
<button  onClick={handleClose} className="address-done-button">Done</button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default PlaceOrder;
