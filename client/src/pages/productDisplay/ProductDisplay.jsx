import React, {useState} from 'react'
import './product.css'
function ProductDisplayPage(props) {
  const [size, setSize] = useState('')
  // const [image, setImage] = useState(props.image)
  console.log(size);
  return (
    <>
    
      <div className="productDisplay">
        <div className="productDisplay-left">
        <div className="productDisplay-img-list">
          <img  src={props.image_l1} alt='' />
          <img src={props.image_l2} alt='' />
          <img src={props.image_l3} alt='' />
          <img src={props.image_l4} alt='' />
        
        </div>
        <div className="productDispaly-img">
          <img className='productDisplay-main-img' src={props.image} alt=''/>
        </div>
        </div>
        <div className="productDisplay-right">
          <h1>{props.name}</h1>
          <div className="productDisplay-right-stars">
            <img src='./Images/star-icon.png' alt=''/>
            <img src='./Images/star-icon.png' alt=''/>
            <img src='./Images/star-icon.png' alt=''/>
            <img src='./Images/star-icon.png' alt=''/>
            <img src='./Images/star-icon.png' alt=''/>
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
<div className="productDisplay-right-discription">
  {props.discription}
</div>
<div className="productDisplay-right-size">
  <h1>Select Size</h1>
  <div className="productDisplay-right-sizes">
    <div onClick={()=>setSize('S')}>S</div>
    <div  onClick={()=>setSize('M')}>M</div>
    <div  onClick={()=>setSize('L')}>L</div>
    <div  onClick={()=>setSize('XL')}>XL</div>
    <div  onClick={()=>setSize('XXL')}>XXL</div>
  </div>
</div>
<button>ADD TO CART</button>
{/* <button> WISHLIST</button> */}
<p className='productDisplay-right-category'>
   <span>Category :</span>{props.category}
   </p>
   <p className='productDisplay-right-category'>
   <span>Tags :</span>{props.tags}
   </p>
          </div>
      </div>
    </>
  )
}

function ProductDisplay(){
  return(
<>
<ProductDisplayPage
       image="./Images/p1_product.png"
       image_l1='./Images/p1_product.png'
       image_l2='./Images/p1_product_i2.png'
       image_l3='./Images/p1_product_i3.png'
       image_l4='./Images/p1_product_i4.png'
       name='Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse'
        discription='A lightweight, Usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment'
        old_price='300'
        new_price='240'
        discount='53'
        category=' Women, T-Shirt, Crop Top'
        tags='Modern Latest'
       />

</>
  )
}
export default ProductDisplay
