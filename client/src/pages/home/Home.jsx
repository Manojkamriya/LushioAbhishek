import React from "react";
import Media from "./data";
import Carousel from "./Carousel";
import Card from "./Card";
import ProductCards from "./ProductCards";

// import ProductDisplay from "./ProductDisplay"

export default function Home() {
  return (
    <>
      <Carousel images={Media} />
      <ProductCards />
      <div className="mycard-container">
        <Card
          image="./LushioFitness/Images/assets/card-image-7.webp"
          name="SHIRTS"
        />
        <Card
          image="./LushioFitness/Images/assets/card-image-5.webp"
          name="BEST SELLERS"
        />
        <Card
          image="./LushioFitness/Images/assets/card-image-6.webp"
          name="SALE"
        />
      </div>
      <br></br> <br></br>
    </>
  );
}
