import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const Editor = ({ product, onClose, onUpdate }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImageUrls, setRemovedImageUrls] = useState([]);
  const [useHeightClassification, setUseHeightClassification] = useState(!!product.height);
  const [sizeError, setSizeError] = useState('');

  useEffect(() => {
    if (product.imageUrls) {
      setImages(product.imageUrls.map(url => ({ url, isExisting: true })));
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...editedProduct[field]];
    newArray[index] = e.target.value;
    setEditedProduct(prev => ({ ...prev, [field]: newArray }));
  };

  const handleNestedChange = (e, field, subfield) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: { ...prev[field], [subfield]: e.target.value }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      const removedUrl = images[index].url;
      setRemovedImageUrls([...removedImageUrls, removedUrl]);
      setImages(images.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  const uploadImagesToFirebase = async () => {
    return Promise.all(newImages.map(image => {
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

  const removeImagesFromFirebase = async () => {
    return Promise.all(removedImageUrls.map(url => {
      const imageRef = ref(storage, url);
      return deleteObject(imageRef);
    }));
  };

  const handleColorChange = (section, index, field, value) => {
    const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
    setEditedProduct(prev => {
      const updatedColors = [...prev[sectionKey].colorOptions];
      updatedColors[index] = { ...updatedColors[index], [field]: value };
      return { ...prev, [sectionKey]: { ...prev[sectionKey], colorOptions: updatedColors } };
    });
  };

  const handleAddColor = (section) => {
    const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
    const newColor = { name: '', hex: '#000000' };
    setEditedProduct(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        colorOptions: [...prev[sectionKey].colorOptions, newColor],
        sizeOptions: { ...prev[sectionKey].sizeOptions, [newColor.name]: [] },
        quantities: { ...prev[sectionKey].quantities, [newColor.name]: {} }
      }
    }));
  };

  const handleRemoveColor = (section, colorName) => {
    const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
    setEditedProduct(prev => {
      const updatedColors = prev[sectionKey].colorOptions.filter(color => color.name !== colorName);
      const updatedSizeOptions = { ...prev[sectionKey].sizeOptions };
      delete updatedSizeOptions[colorName];
      const updatedQuantities = { ...prev[sectionKey].quantities };
      delete updatedQuantities[colorName];
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          colorOptions: updatedColors,
          sizeOptions: updatedSizeOptions,
          quantities: updatedQuantities
        }
      };
    });
  };

  const handleAddSize = (section, colorName, size) => {
    const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
    const sizesArray = size.split(',').map(s => s.trim());
    const invalidSizes = sizesArray.filter(s => !validSizes.includes(s));

    if (invalidSizes.length > 0) {
      setSizeError(`Invalid sizes: ${invalidSizes.join(', ')}`);
    } else {
      setSizeError('');
      setEditedProduct(prev => {
        const currentSizes = prev[sectionKey].sizeOptions[colorName] || [];
        const uniqueSizes = [...new Set([...currentSizes, ...sizesArray])];
        const updatedSizeOptions = {
          ...prev[sectionKey].sizeOptions,
          [colorName]: uniqueSizes
        };
        const updatedQuantities = {
          ...prev[sectionKey].quantities,
          [colorName]: uniqueSizes.reduce((acc, size) => ({
            ...acc,
            [size]: prev[sectionKey].quantities[colorName]?.[size] || 0
          }), {})
        };
        return {
          ...prev,
          [sectionKey]: {
            ...prev[sectionKey],
            sizeOptions: updatedSizeOptions,
            quantities: updatedQuantities
          }
        };
      });
    }
  };

  const handleQuantityChange = (section, colorName, size, value) => {
    const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
    const newValue = parseInt(value, 10) || 0;
    setEditedProduct(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        quantities: {
          ...prev[sectionKey].quantities,
          [colorName]: {
            ...prev[sectionKey].quantities[colorName],
            [size]: newValue
          }
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await removeImagesFromFirebase();
      const newImageUrls = await uploadImagesToFirebase();
      
      const updatedProduct = {
        ...editedProduct,
        imageUrls: [...images.filter(img => img.isExisting).map(img => img.url), ...newImageUrls],
        categories: editedProduct.categories.join(', '),
      };

      const response = await axios.put(`http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/update/${editedProduct.id}`, updatedProduct);
      
      if (response.status === 200) {
        onUpdate(updatedProduct);
        onClose();
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  return (
    <div className="editor-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="image-upload">
          <label>Current Images</label>
          <div className="image-preview">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.url} alt={`Product ${index + 1}`} />
                <button type="button" onClick={() => handleRemoveImage(index, true)}>Remove</button>
              </div>
            ))}
          </div>
          <label>Add New Images</label>
          <input type="file" multiple onChange={handleImageUpload} />
          <div className="image-preview">
            {newImages.map((image, index) => (
              <div key={index} className="image-item">
                <img src={URL.createObjectURL(image)} alt={`New ${index + 1}`} />
                <button type="button" onClick={() => handleRemoveImage(index, false)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-fields">
          <input type="text" name="name" value={editedProduct.name} onChange={handleInputChange} placeholder="Name" />
          <input type="text" name="displayName" value={editedProduct.displayName} onChange={handleInputChange} placeholder="Display Name" />
          <textarea name="description" value={editedProduct.description} onChange={handleInputChange} placeholder="Description" />
          <input type="number" name="price" value={editedProduct.price} onChange={handleInputChange} placeholder="Price" />
          <input type="number" name="gst" value={editedProduct.gst} onChange={handleInputChange} placeholder="GST Percentage" />
          <input type="number" name="discount" value={editedProduct.discount} onChange={handleInputChange} placeholder="Discount Percentage" />
          <input type="text" name="categories" value={editedProduct.categories.join(', ')} onChange={(e) => setEditedProduct(prev => ({ ...prev, categories: e.target.value.split(',') }))} placeholder="Categories (comma separated)" />
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
              name="height"
              value={editedProduct.height?.value || ''}
              onChange={(e) => handleNestedChange(e, 'height', 'value')}
              placeholder="Height (in cm)"
            />
            {['above', 'below'].map(section => (
              <div key={section} className="height-section">
                <h3>{section === 'above' ? 'Above Height' : 'Below Height'}</h3>
                <button type="button" onClick={() => handleAddColor(section)}>Add Color</button>
                {editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight'].colorOptions.map((color, index) => (
                  <div key={index} className="color-item">
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => handleColorChange(section, index, 'name', e.target.value)}
                      placeholder="Color Name"
                    />
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => handleColorChange(section, index, 'hex', e.target.value)}
                    />
                    <button type="button" onClick={() => handleRemoveColor(section, color.name)}>Remove Color</button>
                    <input
                      type="text"
                      placeholder="Sizes (comma separated)"
                      onBlur={(e) => handleAddSize(section, color.name, e.target.value)}
                    />
                    <div>
                      Sizes: {editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight'].sizeOptions[color.name]?.map(size => (
                        <span key={size}>
                          {size}
                          <input
                            type="number"
                            value={editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight'].quantities[color.name]?.[size] || ''}
                            onChange={(e) => handleQuantityChange(section, color.name, size, e.target.value)}
                            min="0"
                            placeholder="Quantity"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        ) : (
          <div className="color-size-section">
            <h3>Colors and Sizes</h3>
            <button type="button" onClick={() => handleAddColor()}>Add Color</button>
            {editedProduct.colorOptions.map((color, index) => (
              <div key={index} className="color-item">
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => handleColorChange('', index, 'name', e.target.value)}
                  placeholder="Color Name"
                />
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => handleColorChange('', index, 'hex', e.target.value)}
                />
                <button type="button" onClick={() => handleRemoveColor('', color.name)}>Remove Color</button>
                <input
                  type="text"
                  placeholder="Sizes (comma separated)"
                  onBlur={(e) => handleAddSize('', color.name, e.target.value)}
                />
                <div>
                  Sizes: {editedProduct.sizeOptions[color.name]?.map(size => (
                    <span key={size}>
                      {size}
                      <input
                        type="number"
                        value={editedProduct.quantities[color.name]?.[size] || ''}
                        onChange={(e) => handleQuantityChange('', color.name, size, e.target.value)}
                        min="0"
                        placeholder="Quantity"
                      />
                    </span>
                  ))}
                </div>
              </div>
            ))}
            </div>
        )}

        {sizeError && <div className="error">{sizeError}</div>}

        <div className="button-group">
          <button type="submit" className="submit-btn">Update Product</button>
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Editor;