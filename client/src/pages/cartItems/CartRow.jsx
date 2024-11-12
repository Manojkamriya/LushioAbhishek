import React from 'react';
import { Modal, Backdrop, Fade, Box } from '@mui/material'; // Adjust imports if using a different library

const CartRow = ({
  item,
  selectedItems,
  addToWishlist,
  removeFromCart,
  handleCheckboxChange,
  handleIncrement,
  handleDecrement,
  handleOpen,
  handleClose,
  open,
  selectedProduct,
  handleAddToWishlist,
  handleRemoveFromCart
}) => {
  const isHeightBased = item.height;
  const inStock = isHeightBased 
    ? item.product[item.height]?.quantities?.[item.color]?.[item.size] > 0 
    : item.product.quantities[item.color]?.[item.size] > 0;

  return (
    <div>
      <div className={`cartitems-format cartitems-format-main ${!inStock ? "sold-out" : ""}`}>
        {!inStock ? (
          <button
            className="cart-add-to-wishlist"
          
          >
            Move to wishlist
          </button>
        ) : (
          <input
            type="checkbox"
            checked={selectedItems[item.id] || false}
            onChange={() => handleCheckboxChange(item.id)}
          />
        )}
        <div> <img src={item.product.cardImages[0]} alt="" className="carticon-product-icon" />
      { item.height && <p>Height: {item.height}</p>}
        <p>Color: {item.color}</p>        <p>Size: {item.size}</p>
        </div>
       
        <p>{item.product.displayName}</p>
        <p>{item.product.price}</p>
        <div className="quantity-controller">
          <button
            className="cartitems-quantity"
            onClick={() => handleDecrement(item.id)}
            disabled={!inStock}
          >
            &#45;
          </button>
          <button className="cartitems-quantity">
            {item.quantity}
          </button>
          <button
            className="cartitems-quantity"
            onClick={() => handleIncrement(item.id)}
            disabled={!inStock}
          >
            &#43;
          </button>
        </div>
        <p>{item.product.price * item.quantity}</p>
        <img
          src="/Images/icons/delete.png"
          onClick={() => handleOpen(item)}
          alt="Remove"
          className="cartitems-remove-icon"
        />
      </div>
      <hr />
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
            <div className="remove-cart-buttons">
              <img src={selectedProduct?.cardImages[0]} alt="" />
              <div>
                <p>{selectedProduct?.displayName}</p>
                <span>{}</span> 
              </div>
              <p>{selectedProduct?.name}</p>
              <p>{selectedProduct?.price}</p>
              <button onClick={() => handleAddToWishlist(selectedProduct?.id)}>
                Move to Wishlist
              </button>
              <button onClick={() => handleRemoveFromCart(selectedProduct?.id)}>
                Remove from cart
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default CartRow;
