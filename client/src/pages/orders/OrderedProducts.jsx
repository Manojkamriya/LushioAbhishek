import React from "react";

const OrderedProducts = ({orderedProducts}) => {
  const products = [
    {
        name: "Men's Black Hoodie",
        quantity: 1,
        price: 1800,
        size: "L",
        color: "black",
        height: "Below",
        image: "/Images/product400.jpg",
      },
      {
        name: "Men's White T-Shirt",
        quantity: 2,
        price: 900,
        height: "Above",
        size: "S",
        color: "white",
        image: "/Images/product401.jpg",
      },
  ];

  return (
    <div className="ordered-products-container">
      <h2 className="ordered-products-heading">Ordered Products</h2>
      <div className="ordered-products-list">
        {orderedProducts.map((product,index) => (
          <div className="ordered-product" key={index}>
            <img
              src={product.productDetails.cardImages[0]}
              alt={product.name}
              className="ordered-product-image"
            />
            <div className="ordered-product-details">
              <p className="ordered-product-name">{product.productName}</p>
              <p className="ordered-product-info">Size: {product.size}</p>
              <p className="ordered-product-info">Height: {product.heightType || "Normal"}</p>

              <p className="ordered-product-info">Quantity: {product.quantity}</p>
              <p className="ordered-product-info">Color: {product.color} 
              <span 
              className="color-box"
      style={{
     display:"inline-block",
     marginLeft:"5px",
        width: "10px",
        height: "10px",
        backgroundColor: product.colorCode,
       
      }}
    ></span>
              </p>
             
              {/* <p className="ordered-product-price">₹{product.price}</p> */}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default OrderedProducts;
