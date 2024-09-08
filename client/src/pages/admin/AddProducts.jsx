// AddProducts.jsx
import React, { useState } from 'react';
import './AddProducts.css';
import { storage } from '../../firebaseConfig'; // Import storage from Firebase config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
        setUploadedImageUrls(uploadedImageUrls.filter((_, i) => i !== index)); // Remove from uploaded URLs if needed
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

    const uploadImagesToFirebase = async () => {
        return Promise.all(images.map(image => {
            console.log('Uploading image:', image);
            const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
            console.log('Storage ref:', storageRef);
    
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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Upload images to Firebase and get their URLs
            const urls = await uploadImagesToFirebase();
            setUploadedImageUrls(urls);
    
            // Prepare JSON object with product data
            const productData = {
                name,
                displayName,
                description,
                price,
                gst,
                discount,
                categories: categories.join(', '),
                colorOptions: colorOptions,
                sizeOptions: sizeOptions,
                imageUrls: urls, // Include uploaded image URLs
            };
    
            const response = await fetch('http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Send data as JSON
                },
                body: JSON.stringify(productData), // Convert productData to JSON
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Product saved successfully!');
                console.log('Product added:', data);
            } else {
                alert('Failed to save product.');
            }
        } catch (error) {
            console.error('Error saving product:', error);
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
                            <span>{color}</span>
                            <input
                                type="text"
                                placeholder={`Sizes for ${color} (comma separated)`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                        handleAddSize(color, e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <button type="button" onClick={() => handleRemoveColor(color)}>Remove</button>
                        </div>
                    ))}
                    {sizeError && <p className="error">{sizeError}</p>}
                </div>

                <button type="submit">Save Product</button>
            </form>
        </div>
    );
};

export default AddProducts;
