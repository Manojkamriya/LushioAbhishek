import React from 'react'
import './productCard.css'
import Card from './ProductCard'

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
