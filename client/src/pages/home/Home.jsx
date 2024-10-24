import React from "react";
import Media from "./data";
import Carousel from "./Carousel";
import CollectionCard from "./CollectionCard";
import ProductCards from "./ProductCards";

export default function Home() {
  return (
    <>
      <Carousel images={Media} />
      <ProductCards />
      <div className="collection-card-container">
        <CollectionCard
          image="/LushioFitness/Images/assets/card-image-7.webp"
          name="SHIRTS"
        />
        <CollectionCard
          image="/LushioFitness/Images/assets/card-image-5.webp"
          name="BEST SELLERS"
        />
        <CollectionCard
          image="/LushioFitness/Images/assets/card-image-6.webp"
          name="SALE"
        />
      </div>
      <br></br>
    </>
  );
}
