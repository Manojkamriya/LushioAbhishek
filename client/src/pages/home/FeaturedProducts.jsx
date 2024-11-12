import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';

const API_ENDPOINTS = {
  men: `${process.env.REACT_APP_API_URL}/filters/featuredMen`,
  women: `${process.env.REACT_APP_API_URL}/filters/featuredWomen`,
  featured: `${process.env.REACT_APP_API_URL}/filters/featuredAccessories`,
};

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState({ men: [], women: [], featured: [] });
  const [loadingStates, setLoadingStates] = useState({ men: true, women: true, featured: true });
  const [error, setError] = useState(null);

  const fetchCategoryData = async (category, url) => {
    try {
      const response = await axios.get(url);
      setProducts((prevProducts) => ({
        ...prevProducts,
        [category]: response.data,
      }));
    } catch (error) {
      setError(`Failed to fetch data for ${category}`);
    } finally {
      setLoadingStates((prevLoading) => ({
        ...prevLoading,
        [category]: false,
      }));
    }
  };

  useEffect(() => {
    Object.entries(API_ENDPOINTS).forEach(([category, url]) => {
      fetchCategoryData(category, url);
    });
  }, []);

  const renderProductSection = (category, buttonText, route) => {
    if (loadingStates[category]) {
      return <div className="loader-container"><span className="loader"></span></div>;
    }
    if (error) {
      return <p>{error}</p>;
    }

    return (
      <>
        <div className="product-card-container">
          {products[category].map((item) => (
            <ProductCard
              key={item.id}
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
        <button className="fluid-button" onClick={() => navigate(route)}>
          {buttonText}
        </button>
      </>
    );
  };

  return (
    <>
      {renderProductSection('men', 'Show More', '/men')}
      {renderProductSection('women', 'Show More', '/women')}
      {renderProductSection('featured', 'Show More', '/accessories')}
    </>
  );
};

export default FeaturedProducts;
