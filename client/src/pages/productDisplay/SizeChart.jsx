import React,{useState} from 'react'
import { Modal, Box, Fade, Backdrop } from "@mui/material";
function SizeChart() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <div>
        <p className="size-chart" onClick={handleOpen}>Size Chart</p>
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
              width: "70%",
              maxWidht:"490px",
              bgcolor: "background.paper",
              border: ".5px solid #000",
              borderRadius: "9px",
              boxShadow: 24,
              p: 4,
            }}
          >
       <div className="chart-header">
        <p>Generalized Size chart</p>
        <img src="/Images/icons/cross.png" alt="" onClick={handleClose}/>
       </div>
       <div className="size-chart-image">
       <img src="/Images/size-chart.webp" alt=""/>
       <p>Disclaimer: These charts are for reference ONLY. This is intended to be a general guide, and while we do our best to ensure all our sizing is consistent, you may find that some styles vary in size. Fit may vary depending on the construction and material.</p> 
       </div>

    
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default SizeChart
