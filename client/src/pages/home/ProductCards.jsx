import React from "react";
import "./productCard.css";
import ProductCard from "./ProductCard";
import all_product from "../../components/context/assets/all_product";

function ProductCards() {
  return (
    <div className="card-container">
  
       {all_product.map((item, i) => {
          if (item.id===18 ||item.id===15 ||item.id===13 ||item.id===14)  {
            return (
              <ProductCard
              key={i}
              id={item.id}
              description={item.name}
              image1={item.image}
              image2={item.image}
              newPrice={item.new_price}
              oldPrice={item.old_price}
              discount={Math.round(
                ((item.old_price - item.new_price) / item.old_price) * 100
              )}
              rating={item.rating}
              liked={false}
              productOptions={item.productOptions}
              />
            );
          } else {
            return null;
          }
        })}
    </div>
  );
}

export default ProductCards;
