import React from 'react'
import { useNavigate } from 'react-router-dom'
function EmptyOrder() {
    const navigate = useNavigate();
  return (
    <div className="empty-cart">
      <img src="/Images/EmptyOrder.png" alt="" className="no-orders"/>
      <p>Nothing in the bag</p>
      <button onClick={() => navigate("/")}>Shop Now</button>
    </div>
  )
}

export default EmptyOrder
