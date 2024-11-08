
import React, { useState, useEffect, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
  
    try {
      const responses = await Promise.allSettled(
        Object.entries(API_ENDPOINTS).map(([key, url]) => axios.get(url).then(res => ({ [key]: res.data })))
      );

      const newProducts = responses.reduce((acc, result) => {
        if (result.status === 'fulfilled') return { ...acc, ...result.value };
        return acc;
      }, { men: [], women: [], featured: [] });


      setProducts(newProducts);
    } catch {
      setError('Failed to fetch data from one or more APIs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="loader-container"> <span className="loader"></span></div>;
  if (error) return <p>{error}</p>;

  const renderProductSection = (category, buttonText, route) => (
    <>
      <div className="product-card-container">
        {products[category].map(item => (
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

  return (
    <>
      {renderProductSection('men', 'Show More', '/men')}
      {renderProductSection('women', 'Show More', '/women')}
      {renderProductSection('featured', 'Show More', '/accessories')}
    </>
  );
};

export default FeaturedProducts;
