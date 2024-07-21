import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { ShopContext } from '../../components/context/ShopContext';
function ProductCard(props) {
      // const {product} = props;
      const {addToCart} = useContext(ShopContext)
    return (
     
      <div className='card'>
        <div className="item-image">
        <Link to='/product'>
          <img  src={props.image1} alt=''/>
          <img  src={props.image2} alt=''/>
          </Link>
        </div>
        <div className="item-naming">
          <div className="info">
            <h3>LushioFitness®</h3>
            <h4>{props.discription}</h4>
           
          </div>
          <div className="add-wishlist">
            <img src='./Images/icons/wishlist.png' alt=''  onClick={()=>{addToCart(props.id)}}/>
          </div>
        </div>
        <div className="item-price">
          <span className="new-price">
          ₹{props.newPrice}
          </span>
          <span className="old-price">
          ₹{props.oldPrice}
            </span>
            <span className="discount">
          {props.discount}% OFF
            </span>
        </div>
     
      </div>
     
     
    )
  }
export default ProductCard;  