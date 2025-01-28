import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReturnExchange from "./ReturnExchange";

const OrderedProducts = ({ orderedProducts, canReturn,orderId }) => {
  

  return (
    <div className="ordered-products-container">
      <h2 className="ordered-products-heading">Ordered Products</h2>
      <div className="ordered-products-list">
        {orderedProducts.map((product, index) => (
          <div className="ordered-product-wrapper" key={product?.id || index}>
            <div className="ordered-product">
              <Link to={`/product/${product?.productDetails?.id}`}>
                <img
                  src={product?.productDetails?.cardImages?.[0]}
                  alt={product?.name || "Product"}
                  className="ordered-product-image"
                />
              </Link>

              <div className="ordered-product-details">
                <p className="ordered-product-name">
                  {product?.productName || product?.name}
                </p>
                <p className="ordered-product-info">Size: {product?.size}</p>
                <p className="ordered-product-info">
                  Height: {product?.heightType || "Normal"}
                </p>
                <p className="ordered-product-info">
                  Quantity: {product?.quantity}
                </p>
                <p className="ordered-product-info">
                  Color: {product?.color}
                  <span
                    className="color-box"
                    style={{
                      display: "inline-block",
                      marginLeft: "5px",
                      width: "10px",
                      height: "10px",
                      backgroundColor: product?.productDetails?.colorOptions?.find(
                        (color) => color.name === product?.color
                      )?.code,
                    }}
                  ></span>
                </p>
              </div>
            </div>

            <ReturnExchange
              title="RETURN/EXCHANGE PRODUCT"
              canReturn={canReturn}
              identifier={index}
          orderId={orderId}
          product={product}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderedProducts;
