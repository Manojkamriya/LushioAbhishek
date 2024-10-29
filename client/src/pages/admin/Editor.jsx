import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import MediaRenderer from '../../components/MediaRenderer';
import URLMedia from "../../components/URLMediaRenderer";
const Editor = ({ product: initialProduct }) => {
  const [product, setProduct] = useState(null);
  const [isHeightBased, setIsHeightBased] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', code: '#000000' });

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  useEffect(() => {
    if (initialProduct) {
      // Initialize the product state with the provided data
      const formattedProduct = {
        ...initialProduct,
        aboveHeight: initialProduct.aboveHeight || { colorOptions: [], quantities: {} },
        belowHeight: initialProduct.belowHeight || { colorOptions: [], quantities: {} },
        colorOptions: initialProduct.colorOptions || [],
        quantities: initialProduct.quantities || {},
        cardImages: initialProduct.cardImages || [],
      };
      setProduct(formattedProduct);
      setIsHeightBased(!!initialProduct.height);
    }
  }, [initialProduct]);

  if (!product) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categoriesArray = e.target.value.split(',').map(cat => cat.trim());
    setProduct(prev => ({ ...prev, categories: categoriesArray }));
  };

  const handleColorAdd = (type = 'normal') => {
    if (newColor.name && newColor.code) {
      const newColorWithImages = { ...newColor, images: [] };

      setProduct(prev => {
        if (type === 'above') {
          return {
            ...prev,
            aboveHeight: {
              ...prev.aboveHeight,
              colorOptions: [...prev.aboveHeight.colorOptions, newColorWithImages]
            }
          };
        } else if (type === 'below') {
          return {
            ...prev,
            belowHeight: {
              ...prev.belowHeight,
              colorOptions: [...prev.belowHeight.colorOptions, newColorWithImages]
            }
          };
        } else {
          return {
            ...prev,
            colorOptions: [...prev.colorOptions, newColorWithImages]
          };
        }
      });

      setNewColor({ name: '', code: '#000000' });
    }
  };

  const handleQuantityChange = (color, size, value, type = 'normal') => {
    const parsedValue = value === '' ? '' : parseInt(value);

    setProduct(prev => {
      if (type === 'above' || type === 'below') {
        const heightSection = `${type}Height`;
        return {
          ...prev,
          [heightSection]: {
            ...prev[heightSection],
            quantities: {
              ...prev[heightSection].quantities,
              [color]: {
                ...prev[heightSection].quantities[color],
                [size]: parsedValue
              }
            }
          }
        };
      } else {
        return {
          ...prev,
          quantities: {
            ...prev.quantities,
            [color]: {
              ...prev.quantities[color],
              [size]: parsedValue
            }
          }
        };
      }
    });
  };

  const handleImageUpload = async (e, colorName = null, heightType = null) => {
    const files = Array.from(e.target.files);

    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      try {
        const snapshot = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;

      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    });

    try {
      const imageUrls = await Promise.all(uploadPromises);
      const validUrls = imageUrls.filter(url => url !== null);

      setProduct(prev => {
        if (colorName && heightType) {
          const heightSection = `${heightType}Height`;
          const colorIndex = prev[heightSection].colorOptions.findIndex(
            color => color.name === colorName
          );

          if (colorIndex !== -1) {
            const updatedColorOptions = [...prev[heightSection].colorOptions];
            updatedColorOptions[colorIndex] = {
              ...updatedColorOptions[colorIndex],
              images: [...(updatedColorOptions[colorIndex].images || []), ...validUrls]
            };

            return {
              ...prev,
              [heightSection]: {
                ...prev[heightSection],
                colorOptions: updatedColorOptions
              }
            };
          }
        } else if (colorName) {
          const colorIndex = prev.colorOptions.findIndex(
            color => color.name === colorName
          );

          if (colorIndex !== -1) {
            const updatedColorOptions = [...prev.colorOptions];
            updatedColorOptions[colorIndex] = {
              ...updatedColorOptions[colorIndex],
              images: [...(updatedColorOptions[colorIndex].images || []), ...validUrls]
            };

            return {
              ...prev,
              colorOptions: updatedColorOptions
            };
          }
        } else {
          return {
            ...prev,
            cardImages: [...(prev.cardImages || []), ...validUrls]
          };
        }
        return prev;
      });
    } catch (error) {
      console.error('Error handling image uploads:', error);
    }
  };

  const handleRemoveImage = (imageUrl, colorName = null, heightType = null) => {
    setProduct(prev => {
      if (colorName && heightType) {
        const heightSection = `${heightType}Height`;
        const colorIndex = prev[heightSection].colorOptions.findIndex(
          color => color.name === colorName
        );

        if (colorIndex !== -1) {
          const updatedColorOptions = [...prev[heightSection].colorOptions];
          updatedColorOptions[colorIndex] = {
            ...updatedColorOptions[colorIndex],
            images: updatedColorOptions[colorIndex].images.filter(url => url !== imageUrl)
          };

          return {
            ...prev,
            [heightSection]: {
              ...prev[heightSection],
              colorOptions: updatedColorOptions
            }
          };
        }
      } else if (colorName) {
        const colorIndex = prev.colorOptions.findIndex(
          color => color.name === colorName
        );

        if (colorIndex !== -1) {
          const updatedColorOptions = [...prev.colorOptions];
          updatedColorOptions[colorIndex] = {
            ...updatedColorOptions[colorIndex],
            images: updatedColorOptions[colorIndex].images.filter(url => url !== imageUrl)
          };

          return {
            ...prev,
            colorOptions: updatedColorOptions
          };
        }
      } else {
        return {
          ...prev,
          cardImages: prev.cardImages.filter(url => url !== imageUrl)
        };
      }
      return prev;
    });
  };

  // const MediaPreview = ({ url, onRemove }) => {
  //   const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/);
  //   return (
  //     <div className="relative inline-block m-2 image-item">
  //       {isVideo ? (
  //         <video width="200" height="200" className="rounded" autoPlay muted>
  //           <source src={url} type={`video/${url.split('.').pop()}`} />
  //           Your browser does not support the video tag.
  //         </video>
  //       ) : (
  //         <img src={url} alt="preview" className="w-48 h-48 object-cover rounded" />
  //       )}
  //       <button
  //         onClick={onRemove}
  //         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
  //         type="button"
  //       >
  //         ×
  //       </button>
  //     </div>
  //   );
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(product);
      const response = await axios.put(
        `http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/update/${product.id}`,
        product
      );
      console.log('Product updated:', response.data);
      alert("Updated successfully");
    } catch (error) {
      console.error('Error updating product:', error);
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="displayName" className="block mb-1">Display Name</label>
            <input
              id="displayName"
              name="displayName"
              value={product.displayName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block mb-1">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="gst" className="block mb-1">GST (%)</label>
            <input
              id="gst"
              name="gst"
              type="number"
              value={product.gst}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="discount" className="block mb-1">Discount (%)</label>
            <input
              id="discount"
              name="discount"
              type="number"
              value={product.discount}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label htmlFor="categories" className="block mb-1">Categories (comma-separated)</label>
          <input
            id="categories"
            name="categories"
            value={Array.isArray(product.categories) ? product.categories.join(', ') : product.categories}
            onChange={handleCategoryChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="cardImages" className="block mb-1">Card Images</label>
          <input
            id="cardImages"
            type="file"
            multiple

            accept="image/*, video/*"
            onChange={(e) => handleImageUpload(e)}
            className="w-full p-2 border rounded"
          />
          <div className="product-upload-image-preview">
            {product.cardImages?.map((url, index) => (
              <div key={index} className="product-upload-image-item">
                <URLMedia src={url} />
                <button className="image-remove-button" onClick={() => handleRemoveImage(url)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isHeightBased"
            type="checkbox"
            checked={isHeightBased}
            onChange={(e) => setIsHeightBased(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="isHeightBased">Height-based classification</label>
        </div>

        {isHeightBased ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="height" className="block mb-1">Height (cm)</label>
              <input
                id="height"
                name="height"
                type="number"
                value={product.height}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            {['above', 'below'].map((heightType) => (
              <div key={heightType} className="border p-4 rounded">
                <h3 className="font-semibold mb-2">{heightType === 'above' ? 'Above' : 'Below'} Height</h3>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Color name"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    className="p-2 border rounded"
                  />
                  <input
                    type="color"
                    value={newColor.code}
                    onChange={(e) => setNewColor({ ...newColor, code: e.target.value })}
                    className="p-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleColorAdd(heightType)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Add Color
                  </button>
                </div>
                {product[`${heightType}Height`].colorOptions.map((color) => (
                  <div key={color.name} className="mt-4 border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{color.name}</span>
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color.code }}
                      ></div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => handleImageUpload(e, color.name, heightType)}
                      className="mt-2 w-full p-2 border rounded"
                    />

                    <div className="product-upload-image-preview">
                      {color.images?.map((url, index) => (
                        <div key={index} className="product-upload-image-item">
                          <URLMedia src={url} />
                          <button className="image-remove-button" onClick={() => handleRemoveImage(url, color.name, heightType)}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {sizeOptions.map((size) => (
                        <div key={size} className="space-y-1">
                          <label className="text-sm font-medium">{size}</label>
                          <input
                            type="number"
                            min="0"
                            value={product[`${heightType}Height`].quantities[color.name]?.[size] || ''}
                            onChange={(e) => handleQuantityChange(color.name, size, e.target.value, heightType)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Color name"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="color"
                value={newColor.code}
                onChange={(e) => setNewColor({ ...newColor, code: e.target.value })}
                className="p-1 border rounded"
              />
              <button
                type="button"
                onClick={() => handleColorAdd()}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Color
              </button>
            </div>
            {product.colorOptions.map((color) => (
              <div key={color.name} className="border p-4 rounded">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{color.name}</span>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color.code }}
                  ></div>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleImageUpload(e, color.name)}
                  className="mt-2 w-full p-2 border rounded"
                />
                <div className="product-upload-image-preview">
                  {color.images?.map((url, index) => (
                    <div key={index} className="product-upload-image-item">
                      <URLMedia src={url} />
                      <button className="image-remove-button" onClick={() => handleRemoveImage(url, color.name)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {sizeOptions.map((size) => (
                    <div key={size} className="space-y-1">
                      <label className="text-sm font-medium">{size}</label>
                      <input
                        type="number"
                        min="0"
                        value={product.quantities[color.name]?.[size] || ''}
                        onChange={(e) => handleQuantityChange(color.name, size, e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editor;
