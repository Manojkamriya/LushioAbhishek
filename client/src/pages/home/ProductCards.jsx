import React from "react";
import "./productCard.css";
import Card from "./ProductCard";

function ProductCards() {
  return (
    <div className="card-container">
      {/* <Card/><Card/> */}

      <Card
        image1="./LushioFitness/Images/card-image.webp"
        image2="./LushioFitness/Images/card-image-2.webp"
        discription="Women Black Friends Typography Boyfriend T-shirt"
        newPrice="599"
        oldPrice="1299"
        discount="53"
      />
      <Card
        image1="./LushioFitness/Images/card-image.webp"
        image2="./LushioFitness/Images/card-image-2.webp"
        discription="Women Black Friends Typography Boyfriend T-shirt"
        newPrice="599"
        oldPrice="1299"
        discount="53"
      />
      <Card
        image1="./LushioFitness/Images/card-image.webp"
        image2="./LushioFitness/Images/card-image-2.webp"
        discription="Women Black Friends Typography Boyfriend T-shirt"
        newPrice="599"
        oldPrice="1299"
        discount="53"
      />
      <Card
        image1="./LushioFitness/Images/card-image.webp"
        image2="./LushioFitness/Images/card-image-2.webp"
        discription="Women Black Friends Typography Boyfriend T-shirt"
        newPrice="599"
        oldPrice="1299"
        discount="53"
      />

    
    </div>
  );
}

export default ProductCards;
