import React, { useEffect, useState, useCallback, useRef } from "react";
import "./ShopCategory.css";
import ProductCard from "../home/ProductCard";
import axios from "axios";

function ShopCategory(props) {
  const [filterProducts, setFilterProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState("rating");
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [color, setColor] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const filterRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/allProducts`
        );
        const data = response.data;

        if (Array.isArray(data.products)) {
       const categoryProducts  =  data.products.filter((product) =>
        product.categories.includes(props.category)
      );
          setProducts(categoryProducts);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [props.category]);

  const openFilter = () => {
    if (filterRef.current) {
      filterRef.current.style.left = "0";
      document.body.classList.add("no-scroll");
    }
  };

  const closeFilter = () => {
    if (filterRef.current) {
      filterRef.current.style.left = "-550px";
      document.body.classList.remove("no-scroll");
    }
  };

  // Extract unique categories dynamically from products
  const getUniqueCategories = (products) => {
    const categorySet = new Set();

    products.forEach((product) => {
      product.categories.forEach((category) => {
        categorySet.add(category);
      });
    });

    return Array.from(categorySet);
  };

  const uniqueCategories = getUniqueCategories(products);

  const getUniqueColors = (products) => {
    const categorySet = new Set();

    products.forEach((product) => {
      product.colorOptions.forEach((color) => {
        categorySet.add(color.name);
      });
    });

    return Array.from(categorySet);
  };

  const uniqueColors = getUniqueColors(products);

  // Filtering products based on selected filters
  useEffect(() => {
    let productsCopy = products.filter((product) =>
      product.categories.includes(props.category)
    );

if (subCategory && subCategory.length > 0) {
  productsCopy = productsCopy.filter((item) =>
    item.categories.some((category) => subCategory.includes(category))
  );
  setIsFilterApplied(true);
}

if (color.length > 0) {
  productsCopy = productsCopy.filter((item) =>
    item.colorOptions.some((option) => color.includes(option.name))
  );
  setIsFilterApplied(true);
}


    if (priceRange) {
      switch (priceRange) {
        case "all":
          productsCopy = productsCopy.filter((item) => item.price > 0);
          break;
        case "under-600":
          productsCopy = productsCopy.filter((item) => item.price < 600);
          break;
        case "600-900":
          productsCopy = productsCopy.filter(
            (item) => item.price >= 600 && item.price <= 900
          );
          break;
        case "above-900":
          productsCopy = productsCopy.filter((item) => item.price > 900);
          break;
        default:
          break;
      }
      setIsFilterApplied(true);
    }

    setFilterProducts(productsCopy);
  }, [subCategory, priceRange, color, props.category, products]);

  // Sorting products based on selected sortType
  const sortProduct = useCallback(() => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts([...fpCopy].sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts([...fpCopy].sort((a, b) => b.price - a.price));
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
  }, [sortType]);

  useEffect(() => {
    sortProduct();
  }, [sortType, sortProduct]);

  // Reset filters when category changes
  useEffect(() => {
    let categoryProducts = products.filter(
      (product) => product.category === props.category
    );
    setFilterProducts(categoryProducts.sort((a, b) => b.rating - a.rating));
    setSortType("rating");
    setSubCategory([]);
    setPriceRange("");
    setColor([]);
    setIsFilterApplied(false);
  }, [props.category, products]);

  const clearFilter = () => {
    setSubCategory([]);
    setPriceRange("");
    setColor([]);
    setIsFilterApplied(false);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

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
          {isFilterApplied && (
            <button onClick={clearFilter} className="clear-filter-button">
              Clear All Filters
            </button>
          )}
          <img
            className="filter-open"
            src="/Images/icons/filter.png"
            alt=""
            onClick={openFilter}
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

          <div className="subCategory">
            <h4>Subcategory</h4>
            {uniqueCategories.map((sub) => (
              <label key={sub}>
                <input
                  type="checkbox"
                  value={sub}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(sub)}
                />
                {sub}
              </label>
            ))}
          </div>
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
          {/* Color Filter */} 
          {
            uniqueColors.length > 0 &&     <div className="colorFilter">
            <h4>Color Filter</h4>
            {uniqueColors.map((col) => (
              <label key={col}>
                <input
                  type="checkbox"
                  value={col}
                  onChange={toggleColor}
                  checked={color.includes(col)}
                />
                {col}
              </label>
            ))}
          </div>
      
          }
      

          <button onClick={clearFilter}>Clear All Filters</button>
        </div>

        <div className="shopcategory-products">
          {filterProducts.map((item, i) => (
            <ProductCard
              key={i}
              id={item.id}
              displayName={item.displayName}
              image1={item.cardImages?.[0] || ""}
              image2={item.cardImages?.[1] || ""}
              rating={item.rating || 0}
              price={item.price || 0}
              description={item.description}
              discount={item.discount || 0}
              aboveHeight={item.aboveHeight || {}}
              belowHeight={item.belowHeight || {}}
              colorOptions={item.colorOptions || []}
              quantities={item.quantities || {}}
              height={item.height || ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopCategory;
