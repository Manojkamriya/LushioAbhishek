import React from "react";
import "./productCard.css";
import ProductCard from "./ProductCard";

const products = [
  { id: 1,
    image1: "./LushioFitness/Images/card-image.webp",
    image2: "./LushioFitness/Images/card-image-2.webp",
    description: "Women Black Friends Typography Boyfriend T-shirt",
    newPrice: "1199",
    oldPrice: "1599",
    discount: "53",
    rating:"4.5",
  },
  { id: 2,
    image1: "./LushioFitness/Images/card-image.webp",
    image2: "./LushioFitness/Images/card-image-2.webp",
    description: "Women Black Friends Typography Boyfriend T-shirt",
    newPrice: "1199",
    oldPrice: "1599",
    discount: "53",
    rating:"4.5",
  },
  { id: 3,
    image1: "./LushioFitness/Images/card-image.webp",
    image2: "./LushioFitness/Images/card-image-2.webp",
    description: "Women Black Friends Typography Boyfriend T-shirt",
    newPrice: "1199",
    oldPrice: "1599",
    discount: "53",
    rating:"4.5",
  },
  { id: 4,
    image1: "./LushioFitness/Images/card-image.webp",
    image2: "./LushioFitness/Images/card-image-2.webp",
    description: "Women Black Friends Typography Boyfriend T-shirt",
    newPrice: "1199",
    oldPrice: "1599",
    discount: "53",
    rating:"4.5",
  },
];

function ProductCards() {
  return (
    <div className="card-container">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          image1={product.image1}
          image2={product.image2}
          description={product.description}
          newPrice={product.newPrice}
          oldPrice={product.oldPrice}
          discount={product.discount}
          rating={product.rating}
          liked={false}
        />
      ))}
    </div>
  );
}

export default ProductCards;
