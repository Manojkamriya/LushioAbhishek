import React, { useEffect } from 'react';

const SimpleColorOptions = ({ data, selectedColor, selectedSize, quantity, onColorSelect, onSizeSelect }) => {

  useEffect(() => {
    if (data?.colorOptions?.length > 0 && !selectedColor) {
      onColorSelect(data.colorOptions[0]);  // Set default color if none is selected
    }
  }, [data, selectedColor, onColorSelect]);

  if (!data?.colorOptions?.length) {
    return <p>No color options available</p>;  // Handle case when no colors are available
  }

  const sizeOptions = selectedColor ? data.sizeOptions[selectedColor.name] : [];

  return (
    <>
      <p>Available Colors:</p>
      <div className="color-selector">
        {data.colorOptions.map(color => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color)}
            style={{
              backgroundColor: color.hex,
              aspectRatio: 1/1,
            }}
            className={color.name === selectedColor?.name ? "selected" : ""}
          >
          </button>
        ))}
      </div>
      {selectedColor && <p>Selected Color: {selectedColor.name}</p>}

      <p>Available Sizes:</p>
      {selectedColor && (
        <div className="size-buttons">
          {sizeOptions?.map(size => (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              style={{ aspectRatio: 1/1 }}
              className={size === selectedSize ? "selected" : ""}
            >
              {size}
            </button>
          ))}
        </div>
      )}

   
    </>
  );
};

export default SimpleColorOptions;
