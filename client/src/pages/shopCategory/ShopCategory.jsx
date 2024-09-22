import React, { useContext, useEffect, useState, useCallback } from "react";
import "./ShopCategory.css";
import { ShopContext } from "../../components/context/ShopContext";
import ProductCard from "../home/ProductCard";

function ShopCategory(props) {
  const { all_product } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState("rating");
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [color, setColor] = useState([]);

  
  const subCategoryOptions = {
    men: ["Shirts", "Joggers", "Outerwear", "Pants", "Hats/Caps"],
    women: ["Panty", "Tops", "Leggings", "Outerwear", "Matching Sets"],
    accessories:["Gloves", "Shakers", "Wrist Band", "Deadlift Band"],
  };

  // Dynamically get subcategories based on props.category
  const currentSubCategories = subCategoryOptions[props.category.toLowerCase()] || [];

  // Filtering products based on selected filters
  useEffect(() => {
    let productsCopy = all_product.filter(
      (product) => product.category === props.category
    );

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    if (color.length > 0) {
      productsCopy = productsCopy.filter((item) => color.includes(item.color));
    }

    if (priceRange) {
      switch (priceRange) {
        case "all":
          productsCopy = productsCopy.filter((item) => item.new_price > 0);
          break;
        case "under-600":
          productsCopy = productsCopy.filter((item) => item.new_price < 600);
          break;
        case "600-900":
          productsCopy = productsCopy.filter(
            (item) => item.new_price >= 600 && item.new_price <= 900
          );
          break;
        case "above-900":
          productsCopy = productsCopy.filter((item) => item.new_price > 900);
          break;
        default:
          break;
      }
    }

    setFilterProducts(productsCopy);
  }, [subCategory, priceRange, color, props.category, all_product]);

  // Sorting products based on selected sortType
  const sortProduct = useCallback(() => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts([...fpCopy].sort((a, b) => a.new_price - b.new_price));
        break;
      case "high-low":
        setFilterProducts([...fpCopy].sort((a, b) => b.new_price - a.new_price));
        break;
      case "rating":
        setFilterProducts([...fpCopy].sort((a, b) => b.rating - a.rating));
        break;
      default:
        break;
    }
  }, [filterProducts, sortType]);

  useEffect(() => {
    sortProduct();
  }, [sortType, sortProduct]);

  // Reset filters when category changes
  useEffect(() => {
    let categoryProducts = all_product.filter(
      (product) => product.category === props.category
    );
    setFilterProducts(categoryProducts.sort((a, b) => b.rating - a.rating));
    setSortType("rating");
    setSubCategory([]);
    setPriceRange("");
    setColor([]);
  }, [props.category, all_product]);

  // Clear all filters
  const clearFilter = () => {
    let categoryProducts = all_product.filter(
      (product) => product.category === props.category
    );
    setFilterProducts(categoryProducts);
    setSortType("rating");
    setSubCategory([]);
    setPriceRange("");
    setColor([]);
  };

  // Toggle subcategory filter
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Toggle color filter
  const toggleColor = (e) => {
    const value = e.target.value;
    setColor((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-6</span> out of {filterProducts.length} products
        </p>
        <div className="shopcategory-sort">
          <select
            name="sort"
            id="sort"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="rating">Sort by: Rating</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
      </div>

      <div className="shopcategory-container">
        <div className="filter-container">
          {/* Dynamic Subcategory Filter */}
          <div className="subCategory">
            <h4>Subcategory</h4>
            {currentSubCategories.map((sub) => (
              <label key={sub}>
                <input
                  type="checkbox"
                  value={sub.toLowerCase()}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(sub.toLowerCase())}
                />
                {sub}
              </label>
            ))}
          </div>

          {/* Color Filter */}
          <div className="colorFilter">
            <h4>Color Filter</h4>
            <label>
              <input
                type="checkbox"
                value={"red"}
                onChange={toggleColor}
                checked={color.includes("red")}
              />
              Red
            </label>
            <label>
              <input
                type="checkbox"
                value={"black"}
                onChange={toggleColor}
                checked={color.includes("black")}
              />
              Black
            </label>
          </div>

          {/* Price Filter */}
          <div className="priceFilter">
            <h4>Price Filter</h4>
            <label>
              <input
                type="radio"
                name="price"
                value="all"
                onChange={(e) => setPriceRange(e.target.value)}
                checked={priceRange === "all"}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                name="price"
                value="under-600"
                onChange={(e) => setPriceRange(e.target.value)}
                checked={priceRange === "under-600"}
              />
              Under ₹600
            </label>
            <label>
              <input
                type="radio"
                name="price"
                value="600-900"
                onChange={(e) => setPriceRange(e.target.value)}
                checked={priceRange === "600-900"}
              />
              ₹600 - ₹900
            </label>
            <label>
              <input
                type="radio"
                name="price"
                value="above-900"
                onChange={(e) => setPriceRange(e.target.value)}
                checked={priceRange === "above-900"}
              />
              Over ₹900
            </label>
          </div>

          <button onClick={clearFilter}>Clear Filters</button>
        </div>

        {/* Product Display */}
        <div className="shopcategory-products">
          {filterProducts.map((item, i) => (
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
            />
          ))}
        </div>
      </div>

      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
}

export default ShopCategory;
