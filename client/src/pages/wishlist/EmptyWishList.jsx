import React from 'react'
import "./wishlist.css"
import { useNavigate } from 'react-router-dom';

function EmptyWishList() {
  const navigate = useNavigate();
 
 return (
    
      
  <div className="empty-wishlist">
    <img src="/Images/emptyWishlist.png" alt=""/>
    <h3>Hey! your wishlist is empty.
    </h3>
    <p>Save your favourites here and make them yours soon!</p>
    <button onClick={()=>navigate("/")}>Shop Now</button>
   
  </div>
    
  )
}

export default EmptyWishList
