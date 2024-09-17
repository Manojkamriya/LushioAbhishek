import React, {useState} from "react"
import {FaStar} from "react-icons/fa"

function StarRating() {
    const [rating , setRating] = useState(null);
    const [hover, setHover]  = useState(null)
  return (
    <div>
      {[...Array(5)].map((star, i)=>{
        const ratingValue = i+1;
        return (
            <label>
                <input 
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={()=>setRating(ratingValue)}
              
                />
                <FaStar className="star" size={30}
                color={ratingValue <= (hover || rating) ? "#ffc107":"#e4e5e9"}
                onMouseOver={()=>setHover(ratingValue)}
                onMouseOut={()=>setHover(null)}
                />
            </label>
        );
      })}
    </div>
  )
}

export default StarRating
