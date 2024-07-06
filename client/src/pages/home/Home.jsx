import React from 'react'

import Media from './data'
import Carousel from './Carousel'
import Card from './Card'
import ProductCards from './ProductCards'

// import ProductDisplay from './ProductDisplay'

export default function Home() {
  return (
    <>
   
       <Carousel images={Media}/>
       <ProductCards/>
       <div className="card-container">
       <Card
       name='SHORTS'
       />
        <Card
       name='SHORTS'
       />
        <Card
       name='SHORTS'
       />
       
       </div>
       <br></br>  <br></br>  <br></br> 
     
      
       <br></br>  <br></br> 
       

        <br></br> 
      
      
    
      
   <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br>
    </>
  )
}
