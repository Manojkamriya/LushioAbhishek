import React from "react";
import "./collectionCard.css";
function CollectionCard(props) {
  return (
    <div className="collection-card-wrapper" style={{aspectRatio: 45/65}}>
      <div className="collection-card">
        <img className="collection-card-image" src={props.image} alt="" />
        <h1>{props.name}</h1>
        <button>PRODUCTS</button>
      </div>
    </div>
  );
}

export default CollectionCard;
