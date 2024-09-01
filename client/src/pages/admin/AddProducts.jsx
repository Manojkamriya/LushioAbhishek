import React, { useState } from 'react';
import './AddProducts.css';

const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const AddProducts = () => {
    const [name, setName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [gst, setGst] = useState(5); // Default GST to 5%
    const [discount, setDiscount] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizeOptions, setSizeOptions] = useState({});
    const [sizeError, setSizeError] = useState('');

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleAddColor = () => {
        if (newColor && !colorOptions.includes(newColor)) {
            setColorOptions([...colorOptions, newColor]);
            setSizeOptions({ ...sizeOptions, [newColor]: [] });
            setNewColor('');
        }
    };

    const handleAddSize = (color, size) => {
        if (size.trim() !== '') {
            const sizesArray = size.split(',').map(s => s.trim());
            const invalidSizes = sizesArray.filter(s => !validSizes.includes(s));

            if (invalidSizes.length > 0) {
                setSizeError(`Invalid sizes: ${invalidSizes.join(', ')}`);
            } else {
                setSizeError('');
                setSizeOptions({
                    ...sizeOptions,
                    [color]: [...(sizeOptions[color] || []), ...sizesArray]
                });
            }
        }
    };

    const handleRemoveColor = (color) => {
        setColorOptions(colorOptions.filter(c => c !== color));
        const newSizeOptions = { ...sizeOptions };
        delete newSizeOptions[color];
        setSizeOptions(newSizeOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission

        const productData = {
            name,
            displayName,
            description,
            price,
            gst,
            discount,
            categories,
            images,
            colorOptions,
            sizeOptions,
        };

        console.log(productData);

        alert('Product saved successfully!');
    };

    return (
        <div className="add-product-container">
            <h2>Add Products</h2>
            <form onSubmit={handleSubmit} className="add-product-form" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                <div className="image-upload">
                    <label>Choose or Drop Images</label>
                    <input type="file" multiple onChange={handleImageUpload} />
                </div>

                <div className="image-preview">
                    {images.map((image, index) => (
                        <div key={index} className="image-item">
                            <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                            <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
                        </div>
                    ))}
                </div>

                <div className="form-fields">
                    <input
                        type="text"
                        placeholder="Name Field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="GST (Default: 5%)"
                        value={gst}
                        onChange={(e) => setGst(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Discount"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Categories (comma separated)"
                        value={categories.join(', ')}
                        onChange={(e) => setCategories(e.target.value.split(',').map(cat => cat.trim()))}
                    />
                </div>

                <div className="color-size-selection">
                    <input
                        type="text"
                        placeholder="Add Color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && newColor.trim() !== '') {
                                e.preventDefault(); // Prevent form submission
                                handleAddColor();
                            }
                        }}
                    />
                    <button type="button" onClick={handleAddColor}>
                        Add Color
                    </button>

                    {colorOptions.map((color) => (
                        <div key={color} className="color-option">
                            <h4>{color}</h4>
                            <button type="button" onClick={() => handleRemoveColor(color)}>
                                Remove Color
                            </button>
                            <input
                                type="text"
                                placeholder={`Add sizes for ${color} (comma separated)`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                        e.preventDefault(); // Prevent form submission
                                        handleAddSize(color, e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            />
                            {sizeError && <div className="size-error">{sizeError}</div>}
                            <div className="sizes-list">
                                {sizeOptions[color]?.map((size) => (
                                    <span key={size} className="size-item">{size}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" className="save-button">Save</button>
            </form>
        </div>
    );
};

export default AddProducts;
