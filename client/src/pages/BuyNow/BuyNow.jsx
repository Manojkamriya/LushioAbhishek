import React from "react";
import { useLocation } from "react-router-dom";

const BuyNowPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const heightCategory = queryParams.get("heightCategory");
  const selectedColor = queryParams.get("selectedColor");
  const selectedSize = queryParams.get("selectedSize");
  const imageURL = queryParams.get("imageURL"); // For image URL
  const imageData = queryParams.get("imageData"); // For Base64 encoded image

  return (
    <div>
      <h1>Buy Now</h1>
    {  heightCategory &&
      <p>Height Category: {heightCategory}</p>}
      <p>Selected Color: {selectedColor}</p>
      <p>Selected Size: {selectedSize}</p>

      {/* Display the image */}
      {imageURL && <img src={imageURL} alt="Product" />}
      {imageData && <img src={imageData} alt="Product" />}
    </div>
  );
};

export default BuyNowPage;
