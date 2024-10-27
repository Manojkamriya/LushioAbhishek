import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import "./ShopCategory.css";
import { ShopContext } from "../../components/context/ShopContext";
import ProductCard from "../home/ProductCard";
function ShopCategory(props) {
  const { all_product, clearAllData } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState("rating");
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [color, setColor] = useState([]);
  const [isFilterApplied, setIsFilterApplied]  = useState(false);
const filterRef  = useRef();
  const openFilter = () => {
    if (filterRef.current) {
      filterRef.current.style.left = "0";
      document.body.classList.add('no-scroll');
    
    }
  };

  const closeFilter = () => {
    if (filterRef.current) {
      filterRef.current.style.left = "-550px";
      document.body.classList.remove('no-scroll');
    }
  };
  // const availableColors = [
  //   { name: 'Red', hex: '#FF0000' },
  //   { name: 'Black', hex: '#000000' },
  //   { name: 'Blue', hex: '#0000FF' },
  //   { name: 'Green', hex: '#008000' },
  //   { name: 'Yellow', hex: '#FFFF00' }
  // ];
  const subCategoryOptions = {
    men: ["Shirts", "Joggers", "Outerwear", "Pants", "Hats/Caps"],
    women: ["Upperwear", "Tops", "Leggings", "Outerwear", "Matching Sets"],
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
      setIsFilterApplied(true);
    }

    if (color.length > 0) {
      productsCopy = productsCopy.filter((item) => color.includes(item.color));
      setIsFilterApplied(true);
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
      setIsFilterApplied(true);
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
        case "discount":
          setFilterProducts([...fpCopy].sort((a, b) => b.discount - a.discount));
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
    setIsFilterApplied(false);
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
    setIsFilterApplied(false);
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
    {  isFilterApplied &&   <button onClick={clearFilter} className="clear-filter-button">Clear All Filters</button>}
        
          <img
            className="filter-open"
            src="/Images/icons/filter.png"
            alt=""
            onClick={()=>openFilter()}
          />
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
            <option value="discount">Sort by: Discount</option>
          </select>
        </div>
      </div>

      <div className="shopcategory-container">
        <div className="filter-container" ref={filterRef}>
        <img
              className="filter-cross-icon"
              src="/Images/icons/cross.png"
              alt=""
              onClick={closeFilter}
            />
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

          {/* Color Filter  */}
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
           {/* <div className="colorFilter">
      <h4>Color Filter</h4>
      {availableColors.map((color) => (
        <label key={color.name} className="color-checkbox">
          <input
            type="checkbox"
            value={color.name}
            onChange={toggleColor}
            // checked={color.includes(color.name)}
          />
          <span
            className="color-swatch"
            style={{ backgroundColor: color.hex }}
          ></span>
          {color.name}
        </label>
          <label className="custom-checkbox">
          <input
            type="checkbox"
            value={color.name}
            onChange={toggleColor}
           
          />
          <span className="checkmark"></span>
          {color.name}
        </label>
      ))}
    </div> */}

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
          {
            isFilterApplied &&           <button onClick={closeFilter} className="apply-filter-button">Apply Filters</button>
          }


          <button onClick={clearFilter}>Clear All Filters</button>
       
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
              // discount={Math.round(
              //   ((item.old_price - item.new_price) / item.old_price) * 100
              // )}
              discount = {item.discount}
              rating={item.rating}
              liked={false}
              productOptions={item.productOptions}
              data={item.data || {}}
            />
          ))}
          
        </div>
      </div>

      <div className="shopcategory-loadmore" onClick={()=>clearAllData()}>Explore More</div>
   
    </div>
  );
}

export default ShopCategory;
