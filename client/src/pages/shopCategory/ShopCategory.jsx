import React, { useContext, useEffect, useState,useCallback } from "react";
import "./ShopCategory.css";
import { ShopContext } from "../../components/context/ShopContext";
import ProductCard from "../home/ProductCard";

function ShopCategory(props) {
  const { all_product } = useContext(ShopContext);
  let [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [color, setColor] = useState([]); 

  useEffect(() => {
    let categoryProducts = all_product.filter(
      (product) => product.category === props.category
    );
    setFilterProducts(categoryProducts);
    setSortType("");
    setSubCategory([]);
    setPriceRange("");
    setColor([]);
   
    }, [props.category, all_product]);

    const clearFilter = () => {
      // setFilterProducts(categoryProducts);
      setSortType("");
      setSubCategory([]);
      setPriceRange("");
      setColor([]);
    }
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };
  const toggleColor = (e) => {
    const value  =e.target.value;
    setColor((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  }
  const sortProduct = useCallback(() => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.new_price - b.new_price));
        break;

      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.new_price - a.new_price));
        break;

      default:
        break;
    }
  }, [filterProducts, sortType]);

  useEffect(() => {
    let productsCopy = all_product.filter(
      (product) => product.category === props.category
    );

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    if(color.length > 0){
      productsCopy = productsCopy.filter((item) =>
        color.includes(item.color)
      );
    }

    if (priceRange) {
      switch (priceRange) {
        case "all":
          productsCopy = productsCopy.filter((item) => item.new_price >0);
          break;
        case "under-600":
          productsCopy = productsCopy.filter((item) => item.new_price < 600);
          break;
        case "600-900":
          productsCopy = productsCopy.filter((item) => item.new_price >= 600 && item.new_price <= 900);
          break;
        case "above-900":
          productsCopy = productsCopy.filter((item) => item.new_price > 900);
          break;
        default:
          break;
      }
    }

    setFilterProducts(productsCopy);
  }, [subCategory, priceRange,color, props.category, all_product]);
 
 
  useEffect(() => {
    sortProduct();
  }, [sortType, sortProduct]);

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-6</span> out of 18 products
        </p>
        <div className="shopcategory-sort">
          <select name="" id="" onChange={(e) => setSortType(e.target.value)}>
            <option value="relevant">Sort by: Rating</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
      </div>
      <div className="shopcategory-container">

      <div className="filter-container">
      
      <div className="subCategory">
        <h4>Subcategory</h4>
        <p>
          <input
            type="checkbox"
            value={"lowerwear"}
            onChange={toggleSubCategory}
            checked={subCategory.includes("lowerwear")} 
          />
          Lowerwear
        </p>
        <p>
          <input
            type="checkbox"
            value={"upperwear"}
            onChange={toggleSubCategory}
            checked={subCategory.includes("upperwear")} 
          />
          Upperwear
        </p>
      </div>
  <div className="colorFilter">
  <h4>Color Filter</h4>
  <p>
          <input
            type="checkbox"
            value={"red"}
            onChange={toggleColor}
            checked={color.includes("red")}
          />
          Red
        </p>
        <p>
          <input
            type="checkbox"
            value={"black"}
            onChange={toggleColor}
            checked={color.includes("black")}
          />
          Black
        </p>
  </div>
      <div className="priceFilter">
      <h4>Price Filter</h4>
      <p>
          <input
            type="radio"
            name="price"
            value="all"
            onChange={(e) => setPriceRange(e.target.value)}
            checked={priceRange === "all"} 
          />
         All
        </p>
        <p>
          <input
            type="radio"
            name="price"
            value="under-600"
            onChange={(e) => setPriceRange(e.target.value)}
            checked={priceRange === "under-600"} 
          />
          Under ₹600
        </p>
        <p>
          <input
            type="radio"
            name="price"
            value="600-900"
            onChange={(e) => setPriceRange(e.target.value)}
            checked={priceRange === "600-900"} 
          />
          ₹600 - ₹900
        </p>
        <p>
          <input
            type="radio"
            name="price"
            value="above-900"
            onChange={(e) => setPriceRange(e.target.value)}
            checked={priceRange === "above-900"} 
          />
        over ₹900
        </p>
      
      </div>
      <button onClick={clearFilter}>Clear Filters</button>
    </div>
    <div className="shopcategory-products">
      {filterProducts.map((item, i) => (
        <ProductCard
          key={i}
          id={item.id}
          discription={item.name}
          image1={item.image}
          image2={item.image}
          newPrice={item.new_price}
          oldPrice={item.old_price}
          discount={Math.round(
            ((item.old_price - item.new_price) / item.old_price) * 100
          )}
        />
      ))}
    </div>
      </div>
     
    
      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
}

export default ShopCategory;
