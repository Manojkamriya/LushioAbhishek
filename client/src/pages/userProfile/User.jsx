import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './user.css';
function User() {
  const [userName, setUserName]  = useState("User");
  return (
    <>
     <h1 className='user-greet'>Welcome {userName}</h1> 
     <p className='user-question'>What would you like to do ?</p>
     <div className="user-action-container">
      
        <div className="user-action">
        <Link to='/user/profile'>
            <img src='./Images/icons/editProfile.png' alt='logo'/>  </Link>     
<div className="action-details">
<h3>Edit Profile</h3>
<p>Edit your account details</p>
</div>

        </div>
      
        <div className="user-action">
        <Link to='/'>
            <img src='./Images/icons/continueShopping.png' alt='logo'/> </Link>     
            <div className="action-details">
<h3>Keep Shopping</h3>
<p>Go to Home page</p>
</div>
        </div>
        <div className="user-action">
            <img src='./Images/icons/orders.png' alt='logo'/>
            
            <div className="action-details">
<h3>Your Orders</h3>
<p>Track, return or buy things again</p>
</div>
        </div>
        <div className="user-action">
            <img src='./Images/icons/referEarn.png' alt='logo'/>
            <div className="action-details">
<h3>Refer and Earn</h3>
<p>Refer to your friends, family members</p>
</div>
        </div>
     </div>
    </>
  )
}

export default User
