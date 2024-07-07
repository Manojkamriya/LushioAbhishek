import React from 'react'

function Card(props) {
  return (
    <>
        <div className="background-container">
    <div className="content">
   
      <h1>{props.name}</h1>
      <button>VIEW PRODUCTS</button>
    </div>
  </div>

    </>
  )
}

export default Card
