import React, { useState, useEffect } from 'react';

const SimpleColorOptions = ({data}) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {

    if ( data && data.colorOptions && data.colorOptions.length > 0) {
      setSelectedColor(data.colorOptions[0]);
    }
  }, [data.colorOptions, data]);
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize('');
    setQuantity(0);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(data.quantities[selectedColor.name][size]);
  };

  if (!data || !data.colorOptions) {
    return <p>No color options available</p>;
  }
 
  const sizeOptions = selectedColor ? data.sizeOptions[selectedColor.name] : [];

  return (
    <>
      {/* <h2>Color Selector</h2> */}
      <p>Available Colors:</p>
      <div className="color-selector">
      
        {data.colorOptions.map(color => (
          <button 
            key={color.name} 
            onClick={() => handleColorSelect(color)} 
            style={{
              backgroundColor: color.hex, 
             
            }}
            className={color.name === selectedColor?.name? "selected" : ""}
          >
            {/* {color.name} */}
          </button>
        ))}
      </div>
      { selectedColor &&  <p> Selected Color {selectedColor.name}</p>} 
      <p>Available Sizes:</p>
      {selectedColor && (
        <div className="size-buttons">
       
          {sizeOptions.map(size => (
            <button 
              key={size} 
              onClick={() => handleSizeSelect(size)} 
            
              className={size === selectedSize? "selected":""}
            >
              {size}
            </button>
          ))}
        </div>
      )}
      
         {selectedSize && (
        <>
          <p>Quantity Available: {quantity}</p>
          {quantity === 0 && (
            <p style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock!</p>
          )}
        </>
      )}
    </>
  );
};

export default SimpleColorOptions ;