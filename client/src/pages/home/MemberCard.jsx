import React from 'react'

export default function MemberCard(props) {
  return (
    <>
    <div className="flip-card-container">
    <div className="flip-card">
      <div className="flip-card-front">
        <img src={props.frontImage} alt="error" />
       <h4>LushioFitness®</h4>
     
       <img src='./Images/wishlist.png' alt=''/>
      </div>
      <div className="flip-card-back">
      <img src={props.backImage} alt="error" />
      </div>
    </div>
  </div>
    </>
  )
}


