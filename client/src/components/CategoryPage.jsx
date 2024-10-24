import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../pages/home/ProductCard"; // Assuming you have a ProductCard component
import products from "../components/context/assets/all_product"; // Assuming you have a products array
import "./categoryPage.css"
function CategoryPage() {
  const { category, subCategory } = useParams(); // Get the category from URL params
  const filteredProducts = products.filter(product => 
    product.category === category && product.subCategory === subCategory
  );
  
  return (
    <div className="category-page">
      <h1 className="category-page-heading">Products in {subCategory}</h1>
      
      {/* Check if there are any filtered products */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(item => (
            <ProductCard 
            key={item.id}
            id={item.id}
            description={item.name}
            image1={item.image}
            image2={item.image}
            newPrice={item.new_price}
            oldPrice={item.old_price}
           
            discount = {item.discount}
            rating={item.rating}
            liked={false}
           
            data={item.data || {}}
            />
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p> 
      )}
    </div>
  );
}

export default CategoryPage;
