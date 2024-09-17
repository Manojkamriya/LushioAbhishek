import React,{useEffect, useState} from 'react'
import "./wishlist.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function EmptyWishList() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    
      const fetchUserData = async () => {
        try {
       
         const response = await axios.get("https://us-central1-lushio-fitness.cloudfunctions.net/api/user/name/vPG55M3EeIgNgWntobMJBHoB3dJ3");
       
        setUser(response.data);
        
          console.log("Fetched user data:", response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    
  }, []);

  return (
    
      
  <div className="empty-wishlist">
    <img src="./LushioFitness/Images/emptyWishlist.png" alt=""/>
    <h3>Hey! your wishlist is empty.
    </h3>
    <p>Save your favourites here and make them yours soon!</p>
    <button onClick={()=>navigate("/LushioFitness")}>Shop Now</button>
    {user && <p>{user.name}</p>}
  </div>
    
  )
}

export default EmptyWishList
