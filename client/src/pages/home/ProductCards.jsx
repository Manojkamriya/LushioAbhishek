import React from 'react'
// import MemberCard from './MemberCard'
import './productCard.css'
import { Link } from 'react-router-dom'
function Card(props) {
 
  return (
   
    <div className='card'>
      <div className="item-image">
      <Link to='/product'>
        <img  src={props.image1} alt=''/>
        <img  src={props.image2} alt=''/>
        </Link>
      </div>
      <div className="item-naming">
        <div className="info">
          <h3>LushioFitness®</h3>
          <h4>{props.discription}</h4>
         
        </div>
        <div className="add-wishlist">
          <img src='./Images/wishlist_2.png' alt='' />
        </div>
      </div>
      <div className="item-price">
        <span className="new-price">
        ₹{props.newPrice}
        </span>
        <span className="old-price">
        ₹{props.oldPrice}
          </span>
          <span className="discount">
        {props.discount}% OFF
          </span>
      </div>
    </div>
   
   
  )
}

function ProductCards() {
  return (
    <div className='card-container'>
      {/* <Card/><Card/> */}
    
      <Card
     
      image1='./Images/card-image.webp'
      image2='./Images/card-image-2.webp'
      discription='Women Black Friends Typography Boyfriend T-shirt'
      newPrice='599'
      oldPrice='1299'
      discount='53'

      />
       <Card
       image1='./Images/card-image-2.webp'
       image2='./Images/card-image.webp'
       discription='Women Black Friends Typography Boyfriend T-shirt'
       newPrice='599'
       oldPrice='1299'
       discount='53'

      />
        <Card
       image1='./Images/card-image-2.webp'
       image2='./Images/card-image.webp'
       discription='Women Black Friends Typography Boyfriend T-shirt'
       newPrice='599'
       oldPrice='1299'
       discount='53'

      />
        <Card
       image1='./Images/card-image-2.webp'
       image2='./Images/card-image.webp'
       discription='Women Black Friends Typography Boyfriend T-shirt'
       newPrice='599'
       oldPrice='1299'
       discount='53'

      />
      
      {/* <MemberCard
      frontImage="./Images/carousel-image-1.webp"
      backImage='./Images/carousel-image-2.webp'
      /> */}
    </div>
  )
}

export default ProductCards
