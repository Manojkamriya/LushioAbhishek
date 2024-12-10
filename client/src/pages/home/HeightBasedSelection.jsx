import React, { useState, useEffect } from 'react';

const ProductDetails = ({ data, selectedHeight, setSelectedHeight, selectedColor, setSelectedColor, selectedSize, setSelectedSize }) => {
    const [quantities, setQuantities] = useState(data[selectedHeight]?.quantities?.[selectedColor] || {});

    useEffect(() => {
        // Update selected color only when the selectedHeight changes
        const initialColor = data[selectedHeight]?.colorOptions?.[0]?.name || "";
        if (selectedColor !== initialColor) {
            setSelectedColor(initialColor);
        }
    }, [selectedHeight, data, setSelectedColor]);

    useEffect(() => {
        // Update quantities based on selectedHeight and selectedColor
        setQuantities(data[selectedHeight]?.quantities?.[selectedColor] || {});
    }, [selectedHeight, selectedColor, data]);

    // Handle height selection
    const handleHeightChange = (newHeight) => {
        setSelectedHeight(newHeight);
        const initialColor = data[newHeight]?.colorOptions?.[0]?.name || "";
        setSelectedColor(initialColor);
        setSelectedSize(null);
    };

    // Handle color selection
    const handleColorChange = (colorName) => {
        setSelectedColor(colorName);
        setSelectedSize(null);
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    return (
        <>
            <p>Select Height:</p>
            <div className="height-selector">
                <button
                    onClick={() => handleHeightChange("aboveHeight")}
                    className={selectedHeight === "aboveHeight" ? "selected" : ""}
                    style={{ aspectRatio: 3 }}
                >
                    Above Height
                </button>
                <button
                    onClick={() => handleHeightChange("belowHeight")}
                    className={selectedHeight === "belowHeight" ? "selected" : ""}
                    style={{ aspectRatio: 3 }}
                >
                    Below Height
                </button>
            </div>

            {/* Color Selector */}
            <p>Select Color: </p>
            {data[selectedHeight]?.colorOptions?.length > 0 ? (
                <div className="color-selector">
                    {data[selectedHeight].colorOptions.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => handleColorChange(color.name)}
                            style={{
                                backgroundColor: color.code,
                                aspectRatio: 1 / 1,
                            }}
                            className={color.name === selectedColor ? "selected" : ""}
                        />
                    ))}
                </div>
            ) : (
                <p>No colors available for the selected height.</p>
            )}

            {selectedColor && (
                <>
                    <p>Select Size for: {selectedColor}</p>
                    {Object.keys(quantities).length > 0 ? (
                        <div className="size-selector">
                            {Object.entries(quantities).map(([size, quantity]) => (
                                <button
                                    key={size}
                                    style={{ aspectRatio: 29 / 15 }}
                                    onClick={() => handleSizeChange(size)}
                                 //   className={size === selectedSize ? "selected" : ""}
                                 disabled={ data[selectedHeight]?.quantities?.[selectedColor]?.[
                                    size
                                  ] ===0}
                                 className={`${size === selectedSize ? "selected" : ""} ${
                                    data[selectedHeight]?.quantities?.[selectedColor]?.[
                                      size
                                    ] ===0
                                      ? "sold-out"
                                      : ""
                                  }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p>No sizes available for the selected color.</p>
                    )}
                </>
            )}
        </>
    );
};

export default ProductDetails;
