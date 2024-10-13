import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const Editor = ({ product, onClose, onUpdate }) => {
  const [editedProduct, setEditedProduct] = useState(initializeProduct(product));
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImageUrls, setRemovedImageUrls] = useState([]);
  const [useHeightClassification, setUseHeightClassification] = useState(!!product.height);
  const [sizeError, setSizeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);  

  useEffect(() => {
    setEditedProduct(initializeProduct(product));
    setUseHeightClassification(!!product.height);
    if (product.imageUrls) {
      setImages(product.imageUrls.map(url => ({ url, isExisting: true })));
    } else {
      setImages([]);
    }
  }, [product]);

  function initializeProduct(product) {
    const initialProduct = { ...product };
    if (initialProduct.height) {
      initialProduct.aboveHeight = initialProduct.height.aboveHeight || { colorOptions: [], sizeOptions: {}, quantities: {} };
      initialProduct.belowHeight = initialProduct.height.belowHeight || { colorOptions: [], sizeOptions: {}, quantities: {} };
    } else {
      initialProduct.colorOptions = initialProduct.colorOptions || [];
      initialProduct.sizeOptions = initialProduct.sizeOptions || {};
      initialProduct.quantities = initialProduct.quantities || {};
    }
    return initialProduct;
  }

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
      const updatedSection = { ...prev[sectionKey] };
      const updatedColors = [...(updatedSection.colorOptions || [])];
      updatedColors[index] = { ...updatedColors[index], [field]: value };
      return { ...prev, [sectionKey]: { ...updatedSection, colorOptions: updatedColors } };
    });
  };

  const handleAddColor = (section) => {
    const newColor = { name: '', hex: '#000000' };
    setEditedProduct(prev => {
      if (useHeightClassification) {
        const sectionKey = section === 'above' ? 'aboveHeight' : 'belowHeight';
        const updatedSection = { ...prev[sectionKey] };
        return {
          ...prev,
          [sectionKey]: {
            ...updatedSection,
            colorOptions: [...(updatedSection.colorOptions || []), newColor],
            sizeOptions: { ...(updatedSection.sizeOptions || {}), [newColor.name]: [] },
            quantities: { ...(updatedSection.quantities || {}), [newColor.name]: {} }
          }
        };
      } else {
        return {
          ...prev,
          colorOptions: [...(prev.colorOptions || []), newColor],
          sizeOptions: { ...(prev.sizeOptions || {}), [newColor.name]: [] },
          quantities: { ...(prev.quantities || {}), [newColor.name]: {} }
        };
      }
    });
  };

  const handleRemoveColor = (section, colorName) => {
    const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
    setEditedProduct(prev => {
      const updatedSection = { ...prev[sectionKey] };
      const updatedColors = (updatedSection.colorOptions || []).filter(color => color.name !== colorName);
      const updatedSizeOptions = { ...(updatedSection.sizeOptions || {}) };
      delete updatedSizeOptions[colorName];
      const updatedQuantities = { ...(updatedSection.quantities || {}) };
      delete updatedQuantities[colorName];
      return {
        ...prev,
        [sectionKey]: {
          ...updatedSection,
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
        const updatedSection = { ...prev[sectionKey] };
        const currentSizes = updatedSection.sizeOptions?.[colorName] || [];
        const uniqueSizes = [...new Set([...currentSizes, ...sizesArray])];
        const updatedSizeOptions = {
          ...(updatedSection.sizeOptions || {}),
          [colorName]: uniqueSizes
        };
        const updatedQuantities = {
          ...(updatedSection.quantities || {}),
          [colorName]: uniqueSizes.reduce((acc, size) => ({
            ...acc,
            [size]: updatedSection.quantities?.[colorName]?.[size] || 0
          }), {})
        };
        return {
          ...prev,
          [sectionKey]: {
            ...updatedSection,
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
    setEditedProduct(prev => {
      const updatedSection = { ...prev[sectionKey] };
      return {
        ...prev,
        [sectionKey]: {
          ...updatedSection,
          quantities: {
            ...(updatedSection.quantities || {}),
            [colorName]: {
              ...(updatedSection.quantities?.[colorName] || {}),
              [size]: newValue
            }
          }
        }
      };
    });
  };

  const handleHeightClassificationChange = (e) => {
    const newUseHeightClassification = e.target.checked;
    setUseHeightClassification(newUseHeightClassification);

    setEditedProduct(prev => {
      if (newUseHeightClassification) {
        return {
          ...prev,
          height: { value: '', aboveHeight: { colorOptions: [], sizeOptions: {}, quantities: {} }, belowHeight: { colorOptions: [], sizeOptions: {}, quantities: {} } },
          aboveHeight: { colorOptions: [], sizeOptions: {}, quantities: {} },
          belowHeight: { colorOptions: [], sizeOptions: {}, quantities: {} },
          colorOptions: undefined,
          sizeOptions: undefined,
          quantities: undefined
        };
      } else {
        return {
          ...prev,
          height: undefined,
          aboveHeight: undefined,
          belowHeight: undefined,
          colorOptions: [],
          sizeOptions: {},
          quantities: {}
        };
      }
    });
  };

  const formatProductData = (product) => {
    const formattedProduct = { ...product };

    // Convert categories to array if it's a string
    if (typeof formattedProduct.categories === 'string') {
      formattedProduct.categories = formattedProduct.categories.split(',').map(cat => cat.trim());
    }

    // Ensure numeric fields are numbers
    ['price', 'gst', 'discount'].forEach(field => {
      formattedProduct[field] = Number(formattedProduct[field]);
    });

    // Format height data
    if (useHeightClassification) {
      formattedProduct.height = {
        value: Number(formattedProduct.height?.value || 0),
        aboveHeight: formattedProduct.aboveHeight || { colorOptions: [], sizeOptions: {}, quantities: {} },
        belowHeight: formattedProduct.belowHeight || { colorOptions: [], sizeOptions: {}, quantities: {} }
      };
      delete formattedProduct.colorOptions;
      delete formattedProduct.sizeOptions;
      delete formattedProduct.quantities;
    } else {
      delete formattedProduct.height;
      delete formattedProduct.aboveHeight;
      delete formattedProduct.belowHeight;
    }

    // Ensure quantities are numbers
    const processQuantities = (section) => {
      if (formattedProduct[section]) {
        Object.keys(formattedProduct[section].quantities).forEach(color => {
          Object.keys(formattedProduct[section].quantities[color]).forEach(size => {
            formattedProduct[section].quantities[color][size] = Number(formattedProduct[section].quantities[color][size]);
          });
        });
      }
    };

    if (useHeightClassification) {
      processQuantities('aboveHeight');
      processQuantities('belowHeight');
    } else {
      processQuantities('colorOptions');
    }

    return formattedProduct;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await removeImagesFromFirebase();
      const newImageUrls = await uploadImagesToFirebase();

      const updatedProduct = formatProductData({
        ...editedProduct,
        imageUrls: [...images.filter(img => img.isExisting).map(img => img.url), ...newImageUrls],
      });

      console.log(updatedProduct);    

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
              onChange={handleHeightClassificationChange}
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
        {(editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight']?.colorOptions || []).map((color, index) => (
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
              Sizes: {editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight']?.sizeOptions[color.name]?.map(size => (
                <span key={size}>
                  {size}
                  <input
                    type="number"
                    value={editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight']?.quantities[color.name]?.[size] || ''}
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
            {(editedProduct.colorOptions || []).map((color, index) => (
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
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
          <button type="button" onClick={onClose} className="cancel-btn" disabled={isSubmitting}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Editor;