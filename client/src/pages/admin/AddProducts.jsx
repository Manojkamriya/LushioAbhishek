// AddProducts.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AddProducts.css';
import { storage } from '../../firebaseConfig'; // Import storage from Firebase config
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]); // To hold uploaded image URLs
    const [height, setHeight] = useState(''); // New height field
    const [colorOptionsAbove, setColorOptionsAbove] = useState([]); // Colors for "Above" height
    const [sizeOptionsAbove, setSizeOptionsAbove] = useState({});
    const [quantitiesAbove, setQuantitiesAbove] = useState({});
    const [colorOptionsBelow, setColorOptionsBelow] = useState([]); // Colors for "Below" height
    const [sizeOptionsBelow, setSizeOptionsBelow] = useState({});
    const [quantitiesBelow, setQuantitiesBelow] = useState({});
    const [newColorNameAbove, setNewColorNameAbove] = useState('');
    const [newColorHexAbove, setNewColorHexAbove] = useState('#000000');
    const [newColorNameBelow, setNewColorNameBelow] = useState('');
    const [newColorHexBelow, setNewColorHexBelow] = useState('#000000');
    const [sizeError, setSizeError] = useState('');
    const [useHeightClassification, setUseHeightClassification] = useState(false);
    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState({});
    const [quantities, setQuantities] = useState({});
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');

    // Image Upload Logic
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setUploadedImageUrls(uploadedImageUrls.filter((_, i) => i !== index)); // Remove from uploaded URLs if needed
    };

    // Color Handling for Above
    const handleAddColorAbove = () => {
        if (newColorNameAbove && !colorOptionsAbove.some(color => color.name === newColorNameAbove)) {
            setColorOptionsAbove([...colorOptionsAbove, { name: newColorNameAbove, hex: newColorHexAbove }]);
            setSizeOptionsAbove({ ...sizeOptionsAbove, [newColorNameAbove]: [] });
            setQuantitiesAbove({ ...quantitiesAbove, [newColorNameAbove]: {} });
            setNewColorNameAbove('');
            setNewColorHexAbove('#000000');
        }
    };

    const handleRemoveColorAbove = (colorName) => {
        setColorOptionsAbove(colorOptionsAbove.filter(color => color.name !== colorName));
        const newSizeOptions = { ...sizeOptionsAbove };
        delete newSizeOptions[colorName];
        setSizeOptionsAbove(newSizeOptions);
        const newQuantities = { ...quantitiesAbove };
        delete newQuantities[colorName];
        setQuantitiesAbove(newQuantities);
    };

    // Color Handling for Below
    const handleAddColorBelow = () => {
        if (newColorNameBelow && !colorOptionsBelow.some(color => color.name === newColorNameBelow)) {
            setColorOptionsBelow([...colorOptionsBelow, { name: newColorNameBelow, hex: newColorHexBelow }]);
            setSizeOptionsBelow({ ...sizeOptionsBelow, [newColorNameBelow]: [] });
            setQuantitiesBelow({ ...quantitiesBelow, [newColorNameBelow]: {} });
            setNewColorNameBelow('');
            setNewColorHexBelow('#000000');
        }
    };

    const handleRemoveColorBelow = (colorName) => {
        setColorOptionsBelow(colorOptionsBelow.filter(color => color.name !== colorName));
        const newSizeOptions = { ...sizeOptionsBelow };
        delete newSizeOptions[colorName];
        setSizeOptionsBelow(newSizeOptions);
        const newQuantities = { ...quantitiesBelow };
        delete newQuantities[colorName];
        setQuantitiesBelow(newQuantities);
    };

    // Size Handling for Above
    const handleAddSizeAbove = (colorName, size) => {
        const sizesArray = size.split(',').map(s => s.trim());
        const invalidSizes = sizesArray.filter(s => !validSizes.includes(s));

        if (invalidSizes.length > 0) {
            setSizeError(`Invalid sizes: ${invalidSizes.join(', ')}`);
        } else {
            setSizeError('');
            const uniqueSizes = [...new Set([...(sizeOptionsAbove[colorName] || []), ...sizesArray])]; // Ensure no duplicates
            setSizeOptionsAbove({ ...sizeOptionsAbove, [colorName]: uniqueSizes });
            // Initialize quantities for new sizes
            const newQuantities = { ...quantitiesAbove[colorName] };
            uniqueSizes.forEach(size => {
                if (!newQuantities[size]) newQuantities[size] = 0;
            });
            setQuantitiesAbove({ ...quantitiesAbove, [colorName]: newQuantities });
        }
    };

    // Size Handling for Below
    const handleAddSizeBelow = (colorName, size) => {
        const sizesArray = size.split(',').map(s => s.trim());
        const invalidSizes = sizesArray.filter(s => !validSizes.includes(s));

        if (invalidSizes.length > 0) {
            setSizeError(`Invalid sizes: ${invalidSizes.join(', ')}`);
        } else {
            setSizeError('');
            const uniqueSizes = [...new Set([...(sizeOptionsBelow[colorName] || []), ...sizesArray])]; // Ensure no duplicates
            setSizeOptionsBelow({ ...sizeOptionsBelow, [colorName]: uniqueSizes });
            // Initialize quantities for new sizes
            const newQuantities = { ...quantitiesBelow[colorName] };
            uniqueSizes.forEach(size => {
                if (!newQuantities[size]) newQuantities[size] = 0;
            });
            setQuantitiesBelow({ ...quantitiesBelow, [colorName]: newQuantities });
        }
    };

    const handleAddColor = () => {
        if (newColorName && !colorOptions.some(color => color.name === newColorName)) {
            setColorOptions([...colorOptions, { name: newColorName, hex: newColorHex }]);
            setSizeOptions({ ...sizeOptions, [newColorName]: [] });
            setQuantities({ ...quantities, [newColorName]: {} });
            setNewColorName('');
            setNewColorHex('#000000');
        }
    };

    const handleRemoveColor = (colorName) => {
        setColorOptions(colorOptions.filter(color => color.name !== colorName));
        const newSizeOptions = { ...sizeOptions };
        delete newSizeOptions[colorName];
        setSizeOptions(newSizeOptions);
        const newQuantities = { ...quantities };
        delete newQuantities[colorName];
        setQuantities(newQuantities);
    };

    const handleAddSize = (colorName, size) => {
        const sizesArray = size.split(',').map(s => s.trim());
        const invalidSizes = sizesArray.filter(s => !validSizes.includes(s));

        if (invalidSizes.length > 0) {
            setSizeError(`Invalid sizes: ${invalidSizes.join(', ')}`);
        } else {
            setSizeError('');
            const uniqueSizes = [...new Set([...(sizeOptions[colorName] || []), ...sizesArray])];
            setSizeOptions({ ...sizeOptions, [colorName]: uniqueSizes });
            // Initialize quantities for new sizes
            const newQuantities = { ...quantities[colorName] };
            uniqueSizes.forEach(size => {
                if (!newQuantities[size]) newQuantities[size] = 0;
            });
            setQuantities({ ...quantities, [colorName]: newQuantities });
        }
    };

    // handle quantity changes
    const handleQuantityChange = (colorName, size, value, section = null) => {
        const newValue = parseInt(value, 10) || 0;
        if (section === 'above') {
            setQuantitiesAbove({
                ...quantitiesAbove,
                [colorName]: { ...quantitiesAbove[colorName], [size]: newValue }
            });
        } else if (section === 'below') {
            setQuantitiesBelow({
                ...quantitiesBelow,
                [colorName]: { ...quantitiesBelow[colorName], [size]: newValue }
            });
        } else {
            setQuantities({
                ...quantities,
                [colorName]: { ...quantities[colorName], [size]: newValue }
            });
        }
    };

    // Image Upload Logic to Firebase
    const uploadImagesToFirebase = async () => {
        return Promise.all(images.map(image => {
            const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                    },
                    (error) => {
                        console.error('Error uploading image:', error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        }).catch((error) => {
                            console.error('Error getting download URL:', error);
                            reject(error);
                        });
                    }
                );
            });
        }));
    };

    // Form Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const urls = await uploadImagesToFirebase();
            setUploadedImageUrls(urls);

            const productData = {
                name,
                displayName,
                description,
                price,
                gst,
                discount,
                categories: categories.join(', '),
                imageUrls: urls,
            };

            if (useHeightClassification) {
                productData.height = { value: height };
                productData.aboveHeight = {
                    colorOptions: colorOptionsAbove,
                    sizeOptions: sizeOptionsAbove,
                    quantities: quantitiesAbove,
                };
                productData.belowHeight = {
                    colorOptions: colorOptionsBelow,
                    sizeOptions: sizeOptionsBelow,
                    quantities: quantitiesBelow,
                };
            } else {
                productData.colorOptions = colorOptions;
                productData.sizeOptions = sizeOptions;
                productData.quantities = quantities;
            }

            // console.log(productData);
            const response = await axios.post('http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/addProduct', productData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                alert('Product saved successfully!');
                console.log('Product added:', response.data);
            } else {
                alert('Failed to save product.');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        }
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
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input type="number" placeholder="GST Percentage" value={gst} onChange={(e) => setGst(e.target.value)} />
                    <input type="number" placeholder="Discount Percentage" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    <input type="text" placeholder="Categories (comma separated)" value={categories} onChange={(e) => setCategories(e.target.value.split(','))} />
                </div>
                <div className="height-classification">
                    <label>
                        <input
                            type="checkbox"
                            checked={useHeightClassification}
                            onChange={(e) => setUseHeightClassification(e.target.checked)}
                        />
                        Use height-based classification
                    </label>
                </div>

                {useHeightClassification ? (
                    <>
                        <input
                            type="number"
                            placeholder="Height (in cm)"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                        {/* Section for Above Height */}
                        <div className="height-section">
                            <h3>Above Height</h3>
                            <div>
                                <input type="text" placeholder="Color Name" value={newColorNameAbove} onChange={(e) => setNewColorNameAbove(e.target.value)} />
                                <input type="color" value={newColorHexAbove} onChange={(e) => setNewColorHexAbove(e.target.value)} />
                                <button type="button" onClick={handleAddColorAbove}>Add Color</button>
                            </div>

                            {colorOptionsAbove.map((color, index) => (
                                <div key={index} className="color-item">
                                <span style={{ color: color.hex }}>{color.name} ({color.hex})</span>
                                    <input type="text" placeholder="Sizes (comma separated)" onBlur={(e) => handleAddSizeAbove(color.name, e.target.value)} />
                                    <button type="button" onClick={() => handleRemoveColorAbove(color.name)}>Remove</button>
                                    <div>
                                        Sizes: {sizeOptionsAbove[color.name]?.map(size => (
                                            <span key={size}>
                                                {size}
                                                <input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={quantitiesAbove[color.name]?.[size] || ''}
                                                    onChange={(e) => handleQuantityChange(color.name, size, e.target.value, 'above')}
                                                    min="0"
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section for Below Height */}
                        <div className="height-section">
                            <h3>Below Height</h3>
                            <div>
                                <input type="text" placeholder="Color Name" value={newColorNameBelow} onChange={(e) => setNewColorNameBelow(e.target.value)} />
                                <input type="color" value={newColorHexBelow} onChange={(e) => setNewColorHexBelow(e.target.value)} />
                                <button type="button" onClick={handleAddColorBelow}>Add Color</button>
                            </div>

                            {colorOptionsBelow.map((color, index) => (
                                <div key={index} className="color-item">
                                <span style={{ color: color.hex }}>{color.name} ({color.hex})</span>
                                    <input type="text" placeholder="Sizes (comma separated)" onBlur={(e) => handleAddSizeBelow(color.name, e.target.value)} />
                                    <button type="button" onClick={() => handleRemoveColorBelow(color.name)}>Remove</button>
                                    <div>
                                        Sizes: {sizeOptionsBelow[color.name]?.map(size => (
                                            <span key={size}>
                                                {size}
                                                <input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={quantitiesBelow[color.name]?.[size] || ''}
                                                    onChange={(e) => handleQuantityChange(color.name, size, e.target.value, 'below')}
                                                    min="0"
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="color-size-section">
                        <h3>Colors and Sizes</h3>
                        <div>
                            <input
                                type="text"
                                placeholder="Color Name"
                                value={newColorName}
                                onChange={(e) => setNewColorName(e.target.value)}
                            />
                            <input
                                type="color"
                                value={newColorHex}
                                onChange={(e) => setNewColorHex(e.target.value)}
                            />
                            <button type="button" onClick={handleAddColor}>Add Color</button>
                        </div>

                        {colorOptions.map((color, index) => (
                            <div key={index} className="color-item">
                                <span style={{ color: color.hex }}>{color.name} ({color.hex})</span>
                                <input
                                    type="text"
                                    placeholder="Sizes (comma separated)"
                                    onBlur={(e) => handleAddSize(color.name, e.target.value)}
                                />
                                <button type="button" onClick={() => handleRemoveColor(color.name)}>Remove</button>
                                <div>
                                    Sizes: {sizeOptions[color.name]?.map(size => (
                                        <span key={size}>
                                            {size}
                                            <input
                                                type="number"
                                                placeholder="Quantity"
                                                value={quantities[color.name]?.[size] || ''}
                                                onChange={(e) => handleQuantityChange(color.name, size, e.target.value)}
                                                min="0"
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {sizeError && <div className="error">{sizeError}</div>}

                <button type="submit" className="submit-btn">Save Product</button>
            </form>
        </div>
    );
};

export default AddProducts;
