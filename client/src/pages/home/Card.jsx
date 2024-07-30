import React from 'react'
import './mycard.css'
function Card(props) {
  return (
    <>
        <div className='mycard'>
       <div className="mycard-wrapper">
        <img className='mycard-image' src={props.image} alt=''/>
        <h1>{props.name}</h1>
        <button>PRODUCTS</button>
      </div>
    
    </div>

    </>
  )
}

export default Card
