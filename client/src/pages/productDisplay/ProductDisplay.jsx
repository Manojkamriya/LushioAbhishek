import React, { useState } from "react";
import "./product.css";

function ProductDisplayPage(props) {
 const [image, setImage]  =useState(props.image);
  return (
    <div className="productDisplay">
           
      <div className="productDisplay-left">
        <div className="productDisplay-img-list">
          <img onClick={()=>setImage(props.image_l1)} src={props.image_l1} alt="" />
          <img onClick={()=>setImage(props.image_l2)}  src={props.image_l2} alt="" />
          <img onClick={()=>setImage(props.image_l3)}  src={props.image_l3} alt="" />
          <img onClick={()=>setImage(props.image_l4)}  src={props.image_l4} alt="" />
          <img src={props.image_l5} alt="" />
        </div>
        <div className="productDispaly-img">
          <img className="productDisplay-main-img" src={image} alt="" />
        </div>
      </div>
      <div className="productDisplay-right">
        <h1>{props.name } </h1>
        <div className="productDisplay-right-stars">
          <img src="./LushioFitness/Images/icons/star-icon.png" alt="" />
          <img src="./LushioFitness/Images/icons/star-icon.png" alt="" />
          <img src="./LushioFitness/Images/icons/star-icon.png" alt="" />
          <img src="./LushioFitness/Images/icons/star-icon.png" alt="" />
          <img src="./LushioFitness/Images/icons/star-icon.png" alt="" />
          <p>(122 reviews)</p> 
       
           
        </div>
        <div className="productDisplay-right-prices">
          <div className="productDisplay-right-price-new">
            ₹{props.new_price}
          </div>
          <div className="productDisplay-right-price-old">
            ₹{props.old_price}
          </div>

          <div className="productDisplay-right-price-discount">
            {props.discount}% OFF
          </div>
        </div>
        <p className="tax-statement">Inclusive of all taxes</p>
        <div className="productDisplay-right-discription">
          {props.discription}
        </div>
        <div className="productDisplay-right-size">
          <h1>Select Size</h1>
          <div className="productDisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <div className="productDisplay-right-size">
          <h1>Select Color</h1>
          <div className="productDisplay-right-sizes select-color">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div className="productDisplay-right-size">
        <h1>Select Height</h1>
        <div className="women-size">
          <button>5.6 feet or more</button>
          <button>below 5.6 feet</button>
        </div>
      </div>
        <div className="button-container">  <button>ADD TO CART</button>
        <button> WISHLIST</button></div>
        <button className="buy-button">BUY NOW</button>
     
        <p className="productDisplay-right-category">
          <span>Category :</span>
          {props.category}
        </p>
        <p className="productDisplay-right-category">
          <span>Discription : </span>
          {props.tags}
        </p>
        <img className="trust-image" src="./LushioFitness/Images/trust.png" alt=""/>
        <div className="review-container">
        <h5>Product Review</h5>
      
        <h6>Review 1</h6>
        <h6>Review 2</h6>
        <h6>Review 3</h6>
        <h6>Review 4</h6>
        <h6>Review 5</h6>
        </div>
      </div>
    </div>
  );
}

function ProductDisplay() {
  return (
    <ProductDisplayPage
      image="./LushioFitness/Images/p1_product.png"
      image_l1="./LushioFitness/Images/p1_product.png"
      image_l2="./LushioFitness/Images/p1_product_i2.png"
      image_l3="./LushioFitness/Images/p1_product_i3.png"
      image_l4="./LushioFitness/Images/p1_product_i4.png"
        image_l5="./LushioFitness/Images/p1_product_i4.png"
      name="Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse"
      discription="A lightweight, Usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment"
      old_price="300"
      new_price="240"
      discount="20"
      category=" Women, T-Shirt, Crop Top"
      tags="A lightweight, Usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment. Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse"
    />
  );
}
export default ProductDisplay;
