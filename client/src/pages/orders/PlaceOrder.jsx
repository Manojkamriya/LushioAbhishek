import React, { useContext } from "react";
import { ShopContext } from "../../components/context/ShopContext";
function PlaceOrder() {
  const { getTotalCartAmount } = useContext(ShopContext);
  return (
    <form action="" className="place-order">
      <div className="place-order-left">
        <p className="title"> Delivery Information</p>
        <div className="multi-fields">
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
        </div>
        <input type="email" placeholder="Email Address" />
        <input type="text" placeholder="Street" />
        <div className="multi-fields">
          <input type="text" placeholder="City" />
          <input type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input type="text" placeholder="PIN Code" />
          <input type="text" placeholder="Country" />
        </div>
        <input type="text" placeholder="Phone Number" />
      </div>
      <div className="place-order-right">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{getTotalCartAmount()}</h3>
            </div>
          </div>
          <button>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
// import React, { useState } from 'react';
// import { Rating } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import StarIcon from '@mui/icons-material/Star';

// // Customizing the star rating component for animation
// const AnimatedStarRating = styled(Rating)({
//   '& .MuiRating-iconHover': {
//     transform: 'scale(1.2)', // Scale up the star when hovered
//     transition: 'transform 0.5s ease-in-out',
//   },
//   '& .MuiRating-iconFilled': {
//     color: '#ffcc00', // Filled star color
//     transition: 'transform 0.5s ease-in-out',
//   },
//   '& .MuiRating-iconEmpty': {
//     color: '#c1c1c1', // Empty star color
//     transition: 'transform 0.5s ease-in-out',
//   },
//   '& .MuiRating-iconActive': {
//     transform: 'scale(1.2)', // Slightly enlarge active star
//   },
// });

// const AnimatedStarRatingComponent = () => {
//   const [rating, setRating] = useState(3);

//   const handleRatingChange = (event, newValue) => {
//     setRating(newValue);
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
//       <h2>Animated Star Rating</h2>
//       <AnimatedStarRating
//         name="animated-rating"
//         value={rating}
//         precision={0.5} // Allow half-star ratings
//         onChange={handleRatingChange}
//         icon={<StarIcon fontSize="large" />} // Customize the star icon
//         emptyIcon={<StarIcon fontSize="large" />} // Custom empty icon
//         sx={{ fontSize: '3rem' }} // Custom size of the stars
//       />
//       <p>Your Rating: {rating}</p>
//     </div>
//   );
// };

// export default AnimatedStarRatingComponent;