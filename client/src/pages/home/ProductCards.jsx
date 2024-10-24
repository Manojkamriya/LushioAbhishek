import React from "react";
import { useNavigate } from "react-router-dom";
import "./productCard.css";
import ProductCard from "./ProductCard";
import all_product from "../../components/context/assets/all_product";

function ProductCards() {
  const navigate = useNavigate();

  // Helper function to filter and display products based on category
  const renderProductsByCategory = (category) => {
    return all_product
      .filter((item) => item.category === category && item.id % 6 <= 3) // Combined filter logic
      .map((item) => (
        <ProductCard
          key={item.id}
          id={item.id}
          description={item.name}
          image1={item.image}
          image2={item.image}
          newPrice={item.new_price}
          oldPrice={item.old_price}
          discount={item.discount}
          rating={item.rating}
          liked={false}
          data={item.data || {}}
        />
      ));
  };

  return (
    <>
      {/* Men's Product Section */}
      <div className="card-container">{renderProductsByCategory("men")}</div>
      <button className="fluid-button" onClick={() => navigate("/men")}>
        Show More
      </button>

      {/* Women's Product Section */}
      <div className="card-container">{renderProductsByCategory("women")}</div>
      <button className="fluid-button" onClick={() => navigate("/women")}>
      Show More
      </button>

      {/* Accessories Section */}
      <div className="card-container">
        {renderProductsByCategory("accessories")}
      </div>
      <button className="fluid-button" onClick={() => navigate("/accessories")}>
      Show More
      </button>
    </>
  );
}

export default ProductCards;
