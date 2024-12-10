import React,{useState,useContext} from 'react';
import { Modal, Backdrop, Fade, Box } from '@mui/material'; // Adjust imports if using a different library
import { UserContext } from "../../components/context/UserContext";
import { useWishlist } from "../../components/context/WishlistContext";
import "./newcart.css"
const CartRow = ({
  item,
  selectedItems,
  handleCheckboxChange,
  handleOpen,
  handleClose,
  open,
  selectedProduct,
  handleMoveToWishlist,
  handleRemoveFromCart
}) => {
  const isHeightBased = item.height;
  const inStock = isHeightBased 
    ? item.product[item.height]?.quantities?.[item.color]?.[item.size] > 0 
    : item.product.quantities[item.color]?.[item.size] > 0;
    const { user } = useContext(UserContext);
    const { wishlist } = useWishlist();
    const [quantity, setQuantity] = useState(null);
    const wishlistItem = wishlist.find((e) => e.productId === item.product.id); 
    // const fetchQuantity = async () => {
    //   try {
       
    //     setQuantity(null); // Reset quantity before fetching
  
    //     const response = await axios.post(`${process.env.REACT_APP_API_URL}/getQty`, {
    //       pid,
    //       color,
    //       heightType,
    //       size,
    //     });
    //     setQuantity(response.data.quantity);
    //   } catch (err) {
       
    //       console.log("Unable to connect to the server");
        
    //   }
    // };
    //console.log(wishlistItem);
  return (
    <> 
        <div className="itemContainer-base-item">
     <div className={`cartitems-format ${!inStock ? "sold-out" : ""}`}>
      <div className="itemContainer-base-itemLeft">
      {!inStock ? (
          <button
            className="cart-add-to-wishlist"
            onClick={() => handleMoveToWishlist(wishlistItem?.id, item.product.id,item.id)}
          >
            Move to wishlist
          </button>
        ) : (
          <input
            type="checkbox"
            className={`checkbox ${selectedItems[item.id] ? "checked" : ""}`}
            checked={selectedItems[item.id] || false}
            onChange={() => handleCheckboxChange(item.id)}
          />
        )}
        <img
          style={{
            background: "rgb(244, 255, 249)",
            height: "155px",
            width: "111px",
          }}
          src={item.product.cardImages[0]} 
          alt=""
          className="image-base-imgResponsive"
        />
      </div>
      <div className="itemContainer-base-itemRight">
      <img
        src="/Images/icons/delete.png"
        onClick={() => handleOpen(item)}
        className="remove-cart-delete"
        alt="Remove"
      />
        <div className="itemContainer-base-details">
          <div className="itemContainer-base-brand">LUSHIO</div>
       <div className="itemContainer-base-description">
       {item.product.displayName} 
          </div>
          <p className="product-color">
           { item.height && <p> <strong>Height:</strong> {item.height}</p>}
          </p>
          <p className="product-color">
            <strong>Color:</strong> {item.color}
            <span
              className="color-box"
              style={{ backgroundColor: "pink" }}
            ></span>
          </p>
          <div className="itemContainer-base-sizeAndQtyContainer">
            <div className="itemContainer-base-sizeAndQty">
              <div className="itemComponents-base-size">
                <span className="">Size:  {item.size}</span>
                {/* <img src="/Images/icons/quantityDropdown.svg" alt=""/> */}
              </div>

              <div className="itemComponents-base-quantity">
                <span className="">Qty: {item.quantity}</span>
                <img src="/Images/icons/quantityDropdown.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="itemContainer-base-description">
          ₹ {item.product.price * item.quantity} 
          </div>
         
        </div>

        <div className="returnPeriod-base-returnItem">
          <img
            src="/Images/icons/return.svg"
            alt=""
            className="returnPeriod-base-returnIcon"
          />

          <div className="returnPeriod-base-returnText">
            <span className="returnPeriod-base-returnDays">14 days</span> return
            available
          </div>
        </div>
      </div>
      </div>
    </div>

    
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
            style: { backgroundColor: "rgba(0, 0, 0, 0.2)" } // Adjust opacity here
        }}
        disableScrollLock
      >
        <Fade in={open}>
          <Box
       //  className="delete-cart-modal"
         sx={{
           position: "absolute",
           top: { xs: "auto", sm: "50%" }, // On mobile, no top alignment
           left: { xs: "50%", sm: "50%" },
           bottom: { xs: 0, sm: "auto" }, // On mobile, stick to bottom
           transform: { xs: "translateX(-50%)", sm: "translate(-50%, -50%)" }, // Adjust transform
           width: { xs: "100%", sm: "350px" },
           bgcolor: "background.paper",
           border: "0.5px solid #000",
           borderRadius: "5px",
           boxShadow: 24,
           p: 4,
         }}
          >
            <div className="remove-cart-buttons">
            <div className="popup-close-img">
                <img
              src="/Images/icons/cross.png"
              alt=""
              
              onClick={handleClose}
            />
                </div>
              <div className="remove-product-details">
               
                <img src={selectedProduct?.cardImages[0]} alt="" className="remove-product-image" />
                <div className="remove-product-info">
                  <h3>{selectedProduct?.displayName}</h3>
                  <p><strong>Quantity:</strong> {selectedProduct?.quantity || "1"}</p>
                  <p><strong>Price:</strong> Rs. {selectedProduct?.price}</p>
                  <p><strong>Size:</strong> {selectedProduct?.size}</p>
                  <p className="remove-product-color">
                    <strong>Color:</strong> {selectedProduct?.color}
                    <span className="remove-color-box" style={{ backgroundColor: selectedProduct?.color }}></span>
                  </p>
                </div>
              </div>
              <div className='remove-cart-popup-buttons'>
              <button onClick={() => handleMoveToWishlist(wishlistItem?.id, item.product.id,item.id)}>
                Move to Wishlist
              </button>
              <button onClick={() => handleRemoveFromCart(user.uid, item.id)}>
                Remove from cart
              </button>

              </div>
            
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CartRow;
