import React, { useContext } from "react";
import "./ShopCategory.css";
import { ShopContext } from "../../components/context/ShopContext";
import ProductCard from "../home/ProductCard";
function ShopCategory(props) {
  const { all_product } = useContext(ShopContext);
  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-6</span> out of 18 products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src="./LushioFitness/Images/dropdown_icon.png" alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return (
              <ProductCard
                key={i}
                id={item.id}
                discription={item.name}
                image1={item.image}
                image2={item.image}
                newPrice={item.new_price}
                oldPrice={item.old_price}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
}

export default ShopCategory;
