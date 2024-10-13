import React, { useState, useEffect } from 'react';

const HeightBasedOptions = ({ data }) => {
  const [heightCategory, setHeightCategory] = useState('aboveHeight');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (data && data.aboveHeight && data.aboveHeight.colorOptions.length > 0) {
      setSelectedColor(data.aboveHeight.colorOptions[0]);
    }
  }, [data]);

  if (!data) {
    return <div>Loading...</div>; // Or any other loading state representation
  }

  const handleHeightSelect = (category) => {
    setHeightCategory(category);
    if (data[category] && data[category].colorOptions.length > 0) {
      setSelectedColor(data[category].colorOptions[0]);
    } else {
      setSelectedColor(null);
    }
    setSelectedSize('');
    setQuantity(0);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize('');
    setQuantity(0);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (selectedColor && data[heightCategory].quantities[selectedColor.name]) {
      setQuantity(data[heightCategory].quantities[selectedColor.name][size] || 0);
    }
  };

  const colorOptions = data[heightCategory]?.colorOptions || [];
  const sizeOptions = selectedColor && data[heightCategory]?.sizeOptions ? 
    data[heightCategory].sizeOptions[selectedColor.name] || [] : [];

  return (
    <>
      <p>Select Height</p>
      <div className="height-selector">
        <button 
          onClick={() => handleHeightSelect('aboveHeight')} 
          className={heightCategory === "aboveHeight" ? "selected" : ""}
        >
          Above {data.height?.value || 0}cm
        </button>
        <button 
          onClick={() => handleHeightSelect('belowHeight')} 
          className={heightCategory === "belowHeight" ? "selected" : ""}
        >
          Below {data.height?.value || 0}cm
        </button>
      </div>
      <p>Available Colors:</p>
      <div className="color-selector">
        {colorOptions.map(color => (
          <button 
            key={color.name} 
            onClick={() => handleColorSelect(color)} 
            style={{ backgroundColor: color.hex }}
            className={color.name === selectedColor?.name ? "selected" : ""}
          />
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
              className={size === selectedSize ? "selected" : ""}
            >
              {size}
            </button>
          ))}
        </div>
      )}
      {selectedSize && (
        <div>
          <p>Quantity Available: {quantity}</p>
          {quantity === 0 && (
            <p style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock!</p>
          )}
        </div>
      )}
    </>
  );
};

export default HeightBasedOptions;