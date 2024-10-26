import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

  const MediaPreview = ({ url, onRemove }) => {
    const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/);
    return (
      <div className="relative inline-block m-2">
        {isVideo ? (
          <video width="200" height="200" controls className="rounded">
            <source src={url} type={`video/${url.split('.').pop()}`} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={url} alt="preview" className="w-48 h-48 object-cover rounded" />
        )}
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
          type="button"
        >
          ×
        </button>
      </div>
    );
  };

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
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            className="w-full p-2 border rounded"
          />
          <div className="flex flex-wrap mt-2">
            {product.cardImages?.map((url, index) => (
              <MediaPreview
                key={index}
                url={url}
                onRemove={() => handleRemoveImage(url)}
              />
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
                    <div className="flex flex-wrap mt-2">
                      {color.images?.map((url, index) => (
                        <MediaPreview
                          key={index}
                          url={url}
                          onRemove={() => handleRemoveImage(url, color.name, heightType)}
                        />
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
                <div className="flex flex-wrap mt-2">
                  {color.images?.map((url, index) => (
                    <MediaPreview
                      key={index}
                      url={url}
                      onRemove={() => handleRemoveImage(url, color.name)}
                    />
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

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { storage } from "../../firebaseConfig";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { X } from 'lucide-react';

// const Editor = ({ productId }) => {
//   const [product, setProduct] = useState({
//     name: '',
//     displayName: '',
//     description: '',
//     price: '',
//     gst: '',
//     discount: '',
//     categories: '',
//     height: '',
//     aboveHeight: { colorOptions: [], quantities: {} },
//     belowHeight: { colorOptions: [], quantities: {} },
//     colorOptions: [],
//     quantities: {},
//     cardImages: [],
//   });

//   const [isHeightBased, setIsHeightBased] = useState(false);
//   const [newColor, setNewColor] = useState({ name: '', code: '#000000' });
//   const [loading, setLoading] = useState(true);

//   const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/${productId}`
//         );
//         const productData = response.data;
//         setProduct(productData);
//         setIsHeightBased(!!productData.height);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching product:', error);
//         setLoading(false);
//       }
//     };

//     if (productId) {
//       fetchProduct();
//     }
//   }, [productId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProduct({ ...product, [name]: value });
//   };

//   const handleCategoryChange = (e) => {
//     setProduct({ ...product, categories: e.target.value.split(',').map(cat => cat.trim()) });
//   };

//   const handleColorAdd = (type = 'normal') => {
//     if (newColor.name && newColor.code) {
//       const newColorWithImages = { ...newColor, images: [] };
//       if (type === 'above') {
//         setProduct({
//           ...product,
//           aboveHeight: {
//             ...product.aboveHeight,
//             colorOptions: [...product.aboveHeight.colorOptions, newColorWithImages]
//           }
//         });
//       } else if (type === 'below') {
//         setProduct({
//           ...product,
//           belowHeight: {
//             ...product.belowHeight,
//             colorOptions: [...product.belowHeight.colorOptions, newColorWithImages]
//           }
//         });
//       } else {
//         setProduct({
//           ...product,
//           colorOptions: [...product.colorOptions, newColorWithImages]
//         });
//       }
//       setNewColor({ name: '', code: '#000000' });
//     }
//   };

//   const handleQuantityChange = (color, size, value, type = 'normal') => {
//     if (type === 'above') {
//       setProduct({
//         ...product,
//         aboveHeight: {
//           ...product.aboveHeight,
//           quantities: {
//             ...product.aboveHeight.quantities,
//             [color]: { ...product.aboveHeight.quantities[color], [size]: parseInt(value) }
//           }
//         }
//       });
//     } else if (type === 'below') {
//       setProduct({
//         ...product,
//         belowHeight: {
//           ...product.belowHeight,
//           quantities: {
//             ...product.belowHeight.quantities,
//             [color]: { ...product.belowHeight.quantities[color], [size]: parseInt(value) }
//           }
//         }
//       });
//     } else {
//       setProduct(prevProduct => ({
//         ...prevProduct,
//         quantities: {
//           ...prevProduct.quantities,
//           [color]: {
//             ...prevProduct.quantities[color],
//             [size]: parseInt(value)
//           }
//         }
//       }));
//     }
//   };

//   const handleImageUpload = async (e, colorName = null, heightType = null) => {
//     const files = Array.from(e.target.files);
    
//     const uploadPromises = files.map(async (file) => {
//       const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
//       try {
//         const snapshot = await uploadBytesResumable(storageRef, file);
//         const downloadURL = await getDownloadURL(snapshot.ref);
//         return downloadURL;
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         return null;
//       }
//     });

//     try {
//       const imageUrls = await Promise.all(uploadPromises);
//       const validUrls = imageUrls.filter(url => url !== null);

//       setProduct(prevProduct => {
//         let updatedProduct = { ...prevProduct };

//         if (colorName && heightType) {
//           const heightSection = `${heightType}Height`;
//           const colorIndex = updatedProduct[heightSection].colorOptions.findIndex(
//             color => color.name === colorName
//           );

//           if (colorIndex !== -1) {
//             const existingImages = updatedProduct[heightSection].colorOptions[colorIndex].images || [];
//             updatedProduct[heightSection].colorOptions[colorIndex].images = [...existingImages, ...validUrls];
//           }
//         } else if (colorName) {
//           const colorIndex = updatedProduct.colorOptions.findIndex(
//             color => color.name === colorName
//           );

//           if (colorIndex !== -1) {
//             const existingImages = updatedProduct.colorOptions[colorIndex].images || [];
//             updatedProduct.colorOptions[colorIndex].images = [...existingImages, ...validUrls];
//           }
//         } else {
//           updatedProduct.cardImages = [...(updatedProduct.cardImages || []), ...validUrls];
//         }

//         return updatedProduct;
//       });
//     } catch (error) {
//       console.error('Error handling image uploads:', error);
//     }
//   };

//   const handleRemoveImage = (imageUrl, colorName = null, heightType = null) => {
//     setProduct(prevProduct => {
//       let updatedProduct = { ...prevProduct };

//       if (colorName && heightType) {
//         const heightSection = `${heightType}Height`;
//         const colorIndex = updatedProduct[heightSection].colorOptions.findIndex(
//           color => color.name === colorName
//         );

//         if (colorIndex !== -1) {
//           updatedProduct[heightSection].colorOptions[colorIndex].images = 
//             updatedProduct[heightSection].colorOptions[colorIndex].images.filter(url => url !== imageUrl);
//         }
//       } else if (colorName) {
//         const colorIndex = updatedProduct.colorOptions.findIndex(
//           color => color.name === colorName
//         );

//         if (colorIndex !== -1) {
//           updatedProduct.colorOptions[colorIndex].images = 
//             updatedProduct.colorOptions[colorIndex].images.filter(url => url !== imageUrl);
//         }
//       } else {
//         updatedProduct.cardImages = updatedProduct.cardImages.filter(url => url !== imageUrl);
//       }

//       return updatedProduct;
//     });
//   };

//   const MediaPreview = ({ url, onRemove }) => {
//     const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/);
//     return (
//       <div className="relative inline-block m-2">
//         {isVideo ? (
//           <video width="200" height="200" controls className="rounded">
//             <source src={url} type={`video/${url.split('.').pop()}`} />
//             Your browser does not support the video tag.
//           </video>
//         ) : (
//           <img src={url} alt="preview" className="w-48 h-48 object-cover rounded" />
//         )}
//         <button
//           onClick={onRemove}
//           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//           type="button"
//         >
//           <X size={16} />
//         </button>
//       </div>
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(
//         `http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/update/${productId}`,
//         product
//       );
//       console.log('Product updated:', response.data);
//       alert("Updated successfully");
//     } catch (error) {
//       console.error('Error updating product:', error);
//       alert("Update failed");
//     }
//   };

//   // if (loading) {
//   //   return <div className="text-center p-4">Loading...</div>;
//   // }

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="name" className="block mb-1">Name</label>
//             <input
//               id="name"
//               name="name"
//               value={product.name}
//               onChange={handleInputChange}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label htmlFor="displayName" className="block mb-1">Display Name</label>
//             <input
//               id="displayName"
//               name="displayName"
//               value={product.displayName}
//               onChange={handleInputChange}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="description" className="block mb-1">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={product.description}
//             onChange={handleInputChange}
//             required
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div className="grid grid-cols-3 gap-4">
//           <div>
//             <label htmlFor="price" className="block mb-1">Price</label>
//             <input
//               id="price"
//               name="price"
//               type="number"
//               value={product.price}
//               onChange={handleInputChange}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label htmlFor="gst" className="block mb-1">GST (%)</label>
//             <input
//               id="gst"
//               name="gst"
//               type="number"
//               value={product.gst}
//               onChange={handleInputChange}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label htmlFor="discount" className="block mb-1">Discount (%)</label>
//             <input
//               id="discount"
//               name="discount"
//               type="number"
//               value={product.discount}
//               onChange={handleInputChange}
//               required
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="categories" className="block mb-1">Categories (comma-separated)</label>
//           <input
//             id="categories"
//             name="categories"
//             value={Array.isArray(product.categories) ? product.categories.join(', ') : product.categories}
//             onChange={handleCategoryChange}
//             required
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="cardImages" className="block mb-1">Card Images</label>
//           <input
//             id="cardImages"
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) => handleImageUpload(e)}
//             className="w-full p-2 border rounded"
//           />
//           <div className="flex flex-wrap mt-2">
//             {product.cardImages?.map((url, index) => (
//               <MediaPreview
//                 key={index}
//                 url={url}
//                 onRemove={() => handleRemoveImage(url)}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             id="isHeightBased"
//             type="checkbox"
//             checked={isHeightBased}
//             onChange={(e) => setIsHeightBased(e.target.checked)}
//             className="rounded"
//           />
//           <label htmlFor="isHeightBased">Height-based classification</label>
//         </div>

//         {isHeightBased ? (
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="height" className="block mb-1">Height (cm)</label>
//               <input
//                 id="height"
//                 name="height"
//                 type="number"
//                 value={product.height}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             {['above', 'below'].map((heightType) => (
//               <div key={heightType} className="border p-4 rounded">
//                 <h3 className="font-semibold mb-2">{heightType === 'above' ? 'Above' : 'Below'} Height</h3>
//                 <div className="flex space-x-2 mb-2">
//                   <input
//                     type="text"
//                     placeholder="Color name"
//                     value={newColor.name}
//                     onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
//                     className="p-2 border rounded"
//                   />
//                   <input
//                     type="color"
//                     value={newColor.code}
//                     onChange={(e) => setNewColor({ ...newColor, code: e.target.value })}
//                     className="p-1 border rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleColorAdd(heightType)}
//                     className="px-4 py-2 bg-blue-500 text-white rounded"
//                   >
//                     Add Color
//                   </button>
//                 </div>
//                 {product[`${heightType}Height`].colorOptions.map((color) => (
//                   <div key={color.name} className="mt-4 border-t pt-4">
//                     <div className="flex items-center space-x-2">
//                       <span className="font-medium">{color.name}</span>
//                       <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.code }}></div>
//                     </div>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*,video/*"
//                       onChange={(e) => handleImageUpload(e, color.name, heightType)}
//                       className="mt-2 w-full p-2 border rounded"
//                     />
//                     <div className="flex flex-wrap mt-2">
//                       {color.images?.map((url, index) => (
//                         <MediaPreview
//                           key={index}
//                           url={url}
//                           onRemove={() => handleRemoveImage(url, color.name, heightType)}
//                         />
//                       ))}
//                     </div>
//                     <div className="grid grid-cols-4 gap-2 mt-2">
//                     {sizeOptions.map((size) => (
//                         <div key={size} className="flex items-center space-x-2">
//                           <label className="w-10">{size}</label>
//                           <input
//                             type="number"
//                             value={product[`${heightType}Height`].quantities[color.name]?.[size] || ''}
//                             onChange={(e) => handleQuantityChange(color.name, size, e.target.value, heightType)}
//                             className="w-20 p-1 border rounded"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div>
//               <h3 className="font-semibold">Colors</h3>
//               <div className="flex space-x-2 mb-2">
//                 <input
//                   type="text"
//                   placeholder="Color name"
//                   value={newColor.name}
//                   onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
//                   className="p-2 border rounded"
//                 />
//                 <input
//                   type="color"
//                   value={newColor.code}
//                   onChange={(e) => setNewColor({ ...newColor, code: e.target.value })}
//                   className="p-1 border rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleColorAdd()}
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Add Color
//                 </button>
//               </div>
//               {product.colorOptions.map(color => (
//                 <div key={color.name} className="mt-4 border-t pt-4">
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium">{color.name}</span>
//                     <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.code }}></div>
//                   </div>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*,video/*"
//                     onChange={(e) => handleImageUpload(e, color.name)}
//                     className="mt-2 w-full p-2 border rounded"
//                   />
//                   <div className="flex flex-wrap mt-2">
//                     {color.images?.map((url, index) => (
//                       <MediaPreview
//                         key={index}
//                         url={url}
//                         onRemove={() => handleRemoveImage(url, color.name)}
//                       />
//                     ))}
//                   </div>
//                   <div className="grid grid-cols-4 gap-2 mt-2">
//                     {sizeOptions.map(size => (
//                       <div key={size} className="flex items-center space-x-2">
//                         <label className="w-10">{size}</label>
//                         <input
//                           type="number"
//                           value={product.quantities[color.name]?.[size] || ''}
//                           onChange={(e) => handleQuantityChange(color.name, size, e.target.value)}
//                           className="w-20 p-1 border rounded"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="flex space-x-4">
//           <button 
//             type="submit" 
//             className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//           >
//             Save Changes
//           </button>
//           <button 
//             type="button" 
//             onClick={() => window.history.back()} 
//             className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Editor;

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { storage } from '../../firebaseConfig';
// // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

// // const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

// // const Editor = ({ product, onClose, onUpdate }) => {
// //   const [editedProduct, setEditedProduct] = useState(initializeProduct(product));
// //   const [images, setImages] = useState([]);
// //   const [newImages, setNewImages] = useState([]);
// //   const [removedImageUrls, setRemovedImageUrls] = useState([]);
// //   const [useHeightClassification, setUseHeightClassification] = useState(!!product.height);
// //   const [sizeError, setSizeError] = useState('');
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   useEffect(() => {
// //     setEditedProduct(initializeProduct(product));
// //     setUseHeightClassification(!!product.height);
// //     if (product.imageUrls) {
// //       setImages(product.imageUrls.map(url => ({ url, isExisting: true })));
// //     } else {
// //       setImages([]);
// //     }
// //   }, [product]);

// //   function initializeProduct(product) {
// //     const initialProduct = { ...product };
// //     if (initialProduct.height) {
// //       initialProduct.aboveHeight = initialProduct.height.aboveHeight || { colorOptions: [], sizeOptions: {}, quantities: {} };
// //       initialProduct.belowHeight = initialProduct.height.belowHeight || { colorOptions: [], sizeOptions: {}, quantities: {} };
// //     } else {
// //       initialProduct.colorOptions = initialProduct.colorOptions || [];
// //       initialProduct.sizeOptions = initialProduct.sizeOptions || {};
// //       initialProduct.quantities = initialProduct.quantities || {};
// //     }
// //     return initialProduct;
// //   }

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setEditedProduct(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleArrayChange = (e, index, field) => {
// //     const newArray = [...editedProduct[field]];
// //     newArray[index] = e.target.value;
// //     setEditedProduct(prev => ({ ...prev, [field]: newArray }));
// //   };

// //   const handleNestedChange = (e, field, subfield) => {
// //     setEditedProduct(prev => ({
// //       ...prev,
// //       [field]: { ...prev[field], [subfield]: e.target.value }
// //     }));
// //   };

// //   const handleImageUpload = (e) => {
// //     const files = Array.from(e.target.files);
// //     setNewImages([...newImages, ...files]);
// //   };

// //   const handleRemoveImage = (index, isExisting) => {
// //     if (isExisting) {
// //       const removedUrl = images[index].url;
// //       setRemovedImageUrls([...removedImageUrls, removedUrl]);
// //       setImages(images.filter((_, i) => i !== index));
// //     } else {
// //       setNewImages(newImages.filter((_, i) => i !== index));
// //     }
// //   };

// //   const uploadImagesToFirebase = async () => {
// //     return Promise.all(newImages.map(image => {
// //       const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
// //       const uploadTask = uploadBytesResumable(storageRef, image);

// //       return new Promise((resolve, reject) => {
// //         uploadTask.on('state_changed',
// //           (snapshot) => {
// //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// //             console.log(`Upload is ${progress}% done`);
// //           },
// //           (error) => {
// //             console.error('Error uploading image:', error);
// //             reject(error);
// //           },
// //           () => {
// //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
// //               resolve(downloadURL);
// //             }).catch((error) => {
// //               console.error('Error getting download URL:', error);
// //               reject(error);
// //             });
// //           }
// //         );
// //       });
// //     }));
// //   };

// //   const removeImagesFromFirebase = async () => {
// //     return Promise.all(removedImageUrls.map(url => {
// //       const imageRef = ref(storage, url);
// //       return deleteObject(imageRef);
// //     }));
// //   };

// //   const handleColorChange = (section, index, field, value) => {
// //     const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
// //     setEditedProduct(prev => {
// //       const updatedSection = { ...prev[sectionKey] };
// //       const updatedColors = [...(updatedSection.colorOptions || [])];
// //       updatedColors[index] = { ...updatedColors[index], [field]: value };
// //       return { ...prev, [sectionKey]: { ...updatedSection, colorOptions: updatedColors } };
// //     });
// //   };

// //   const handleAddColor = (section) => {
// //     const newColor = { name: '', hex: '#000000' };
// //     setEditedProduct(prev => {
// //       if (useHeightClassification) {
// //         const sectionKey = section === 'above' ? 'aboveHeight' : 'belowHeight';
// //         const updatedSection = { ...prev[sectionKey] };
// //         return {
// //           ...prev,
// //           [sectionKey]: {
// //             ...updatedSection,
// //             colorOptions: [...(updatedSection.colorOptions || []), newColor],
// //             sizeOptions: { ...(updatedSection.sizeOptions || {}), [newColor.name]: [] },
// //             quantities: { ...(updatedSection.quantities || {}), [newColor.name]: {} }
// //           }
// //         };
// //       } else {
// //         return {
// //           ...prev,
// //           colorOptions: [...(prev.colorOptions || []), newColor],
// //           sizeOptions: { ...(prev.sizeOptions || {}), [newColor.name]: [] },
// //           quantities: { ...(prev.quantities || {}), [newColor.name]: {} }
// //         };
// //       }
// //     });
// //   };

// //   const handleRemoveColor = (section, colorName) => {
// //     const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
// //     setEditedProduct(prev => {
// //       const updatedSection = { ...prev[sectionKey] };
// //       const updatedColors = (updatedSection.colorOptions || []).filter(color => color.name !== colorName);
// //       const updatedSizeOptions = { ...(updatedSection.sizeOptions || {}) };
// //       delete updatedSizeOptions[colorName];
// //       const updatedQuantities = { ...(updatedSection.quantities || {}) };
// //       delete updatedQuantities[colorName];
// //       return {
// //         ...prev,
// //         [sectionKey]: {
// //           ...updatedSection,
// //           colorOptions: updatedColors,
// //           sizeOptions: updatedSizeOptions,
// //           quantities: updatedQuantities
// //         }
// //       };
// //     });
// //   };

// //   const handleAddSize = (section, colorName, size) => {
// //     const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
// //     const sizesArray = size.split(',').map(s => s.trim());
// //     const invalidSizes = sizesArray.filter(s => !validSizes.includes(s));

// //     if (invalidSizes.length > 0) {
// //       setSizeError(`Invalid sizes: ${invalidSizes.join(', ')}`);
// //     } else {
// //       setSizeError('');
// //       setEditedProduct(prev => {
// //         const updatedSection = { ...prev[sectionKey] };
// //         const currentSizes = updatedSection.sizeOptions?.[colorName] || [];
// //         const uniqueSizes = [...new Set([...currentSizes, ...sizesArray])];
// //         const updatedSizeOptions = {
// //           ...(updatedSection.sizeOptions || {}),
// //           [colorName]: uniqueSizes
// //         };
// //         const updatedQuantities = {
// //           ...(updatedSection.quantities || {}),
// //           [colorName]: uniqueSizes.reduce((acc, size) => ({
// //             ...acc,
// //             [size]: updatedSection.quantities?.[colorName]?.[size] || 0
// //           }), {})
// //         };
// //         return {
// //           ...prev,
// //           [sectionKey]: {
// //             ...updatedSection,
// //             sizeOptions: updatedSizeOptions,
// //             quantities: updatedQuantities
// //           }
// //         };
// //       });
// //     }
// //   };

// //   const handleQuantityChange = (section, colorName, size, value) => {
// //     const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
// //     const newValue = parseInt(value, 10) || 0;
// //     setEditedProduct(prev => {
// //       const updatedSection = { ...prev[sectionKey] };
// //       return {
// //         ...prev,
// //         [sectionKey]: {
// //           ...updatedSection,
// //           quantities: {
// //             ...(updatedSection.quantities || {}),
// //             [colorName]: {
// //               ...(updatedSection.quantities?.[colorName] || {}),
// //               [size]: newValue
// //             }
// //           }
// //         }
// //       };
// //     });
// //   };

// //   const handleHeightClassificationChange = (e) => {
// //     const newUseHeightClassification = e.target.checked;
// //     setUseHeightClassification(newUseHeightClassification);

// //     setEditedProduct(prev => {
// //       if (newUseHeightClassification) {
// //         return {
// //           ...prev,
// //           height: { value: '', aboveHeight: { colorOptions: [], sizeOptions: {}, quantities: {} }, belowHeight: { colorOptions: [], sizeOptions: {}, quantities: {} } },
// //           aboveHeight: { colorOptions: [], sizeOptions: {}, quantities: {} },
// //           belowHeight: { colorOptions: [], sizeOptions: {}, quantities: {} },
// //           colorOptions: undefined,
// //           sizeOptions: undefined,
// //           quantities: undefined
// //         };
// //       } else {
// //         return {
// //           ...prev,
// //           height: undefined,
// //           aboveHeight: undefined,
// //           belowHeight: undefined,
// //           colorOptions: [],
// //           sizeOptions: {},
// //           quantities: {}
// //         };
// //       }
// //     });
// //   };

// //   // Format product data for submission
// //   const formatProductData = (product) => {
// //     // Convert categories to array if it's a string
// //     if (typeof product.categories === 'string') product.categories.split(',').map(cat => cat.trim());

// //     // Ensure numeric fields are numbers
// //     ['price', 'gst', 'discount'].forEach(field => {
// //       product[field] = Number(product[field]);
// //     });

// //     // Format height data
// //     if (useHeightClassification) {
// //       product.height = {
// //         value: Number(product.height?.value || 0),
// //         aboveHeight: { ...product.aboveHeight },
// //         belowHeight: { ...product.belowHeight }
// //       };
// //       delete product.colorOptions;
// //       delete product.sizeOptions;
// //       delete product.quantities;
// //     } else {
// //       delete product.height;
// //       delete product.aboveHeight;
// //       delete product.belowHeight;
// //     }

// //     // Ensure quantities are numbers
// //     ['aboveHeight', 'belowHeight', 'colorOptions'].forEach(section => {
// //       if (product[section]) {
// //         Object.keys(product[section].quantities).forEach(color => {
// //           Object.keys(product[section].quantities[color]).forEach(size => {
// //             product[section].quantities[color][size] = Number(product[section].quantities[color][size]);
// //           });
// //         });
// //       }
// //     });

// //     return product;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);
// //     try {
// //       await removeImagesFromFirebase();
// //       // Upload images to Firebase and get URLs
// //       let newImageUrls = await uploadImagesToFirebase();

// //       // Combine existing and newly uploaded image URLs
// //       let updatedProduct = formatProductData({
// //         ...editedProduct,
// //         imageUrls: [...images.filter(img => img.isExisting).map(img => img.url), ...newImageUrls]
// //       });

// //       console.log(updatedProduct);

// //       // Send the PUT request to update the product in the backend API
// //       let response = await axios.put(`http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/update/${editedProduct.id}`, updatedProduct);

// //       if (response.status === 200) {
// //         onUpdate(updatedProduct);
// //         onClose();
// //       } else {
// //         throw new Error('Failed to update product');
// //       }
// //     } catch (error) {
// //       console.error('Error updating product:', error);
// //       alert('Failed to update product. Please try again.');
// //     } finally {
// //       setIsSubmitting(false); // Reset submitting state after handling the submission process
// //     }
// //   };

// //   return (
// //     <div className="editor-container">
// //       <h2>Edit Product</h2>
// //       <form onSubmit={handleSubmit} className="edit-product-form">
// //         <div className="image-upload">
// //           <label>Current Images</label>
// //           <div className="image-preview">
// //             {images.map((image, index) => (
// //               <div key={index} className="image-item">
// //                 <img src={image.url} alt={`Product ${index + 1}`} />
// //                 <button type="button" onClick={() => handleRemoveImage(index, true)}>Remove</button>
// //               </div>
// //             ))}
// //           </div>
// //           <label>Add New Images</label>
// //           <input type="file" multiple onChange={handleImageUpload} />
// //           <div className="image-preview">
// //             {newImages.map((image, index) => (
// //               <div key={index} className="image-item">
// //                 <img src={URL.createObjectURL(image)} alt={`New ${index + 1}`} />
// //                 <button type="button" onClick={() => handleRemoveImage(index, false)}>Remove</button>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="form-fields">
// //           <input type="text" name="name" value={editedProduct.name} onChange={handleInputChange} placeholder="Name" />
// //           <input type="text" name="displayName" value={editedProduct.displayName} onChange={handleInputChange} placeholder="Display Name" />
// //           <textarea name="description" value={editedProduct.description} onChange={handleInputChange} placeholder="Description" />
// //           <input type="number" name="price" value={editedProduct.price} onChange={handleInputChange} placeholder="Price" />
// //           <input type="number" name="gst" value={editedProduct.gst} onChange={handleInputChange} placeholder="GST Percentage" />
// //           <input type="number" name="discount" value={editedProduct.discount} onChange={handleInputChange} placeholder="Discount Percentage" />
// //           <input type="text" name="categories" value={editedProduct.categories.join(',')} onChange={(e) => setEditedProduct(prev => ({ ...prev, categories: e.target.value.split(',') }))} placeholder="Categories (comma separated)" />
// //         </div>

// //         <div className="height-classification">
// //           <label>
// //             <input
// //               type="checkbox"
// //               checked={useHeightClassification}
// //               onChange={handleHeightClassificationChange}
// //             />
// //             Use height-based classification
// //           </label>
// //         </div>

// //         {useHeightClassification ? (
// //           <>
// //             <input
// //               type="number"
// //               name="height"
// //               value={editedProduct.height?.value || ''}
// //               onChange={(e) => handleNestedChange(e, 'height', 'value')}
// //               placeholder="Height(in cm)"
// //             />
// //             {['above', 'below'].map(section => (
// //               <div key={section} className="height-section">
// //                 <h3>{section === 'above' ? 'Above Height' : 'Below Height'}</h3>
// //                 <button type="button" onClick={() => handleAddColor(section)}>Add Color</button>
// //                 {(editedProduct[section === 'above' ?
// //                   'aboveHeight' :
// //                   'belowHeight']?.colorOptions || []).map((color, index) => (
// //                     <div key={index} className="color-item">
// //                       <input
// //                         type="text"
// //                         value={color.name}
// //                         onChange={(e) => handleColorChange(section, index, 'name', e.target.value)}
// //                         placeholder="Color Name"
// //                       />
// //                       <input
// //                         type="color"
// //                         value={color.hex}
// //                         onChange={(e) => handleColorChange(section, index, 'hex', e.target.value)}
// //                       />
// //                       <button type="button" onClick={() => handleRemoveColor(section, color.name)}>Remove Color</button>
// //                       <input
// //                         type="text"
// //                         placeholder="Sizes(comma separated)"
// //                         onBlur={(e) => handleAddSize(section, color.name, e.target.value)}
// //                       />
// //                       <div>
// //                         Sizes:{editedProduct[section === 'above' ?
// //                           'aboveHeight' :
// //                           'belowHeight']?.sizeOptions[color.name]?.map(size => (
// //                             <span key={size}>
// //                               {size}
// //                               <input
// //                                 type="number"
// //                                 value={
// //                                   editedProduct[section === 'above' ?
// //                                     'aboveHeight' :
// //                                     'belowHeight']?.quantities[color.name]?.[size] || ''}
// //                                 onChange={(e) => handleQuantityChange(section, color.name, size, e.target.value)}
// //                                 min='0'
// //                                 placeholder='Quantity'
// //                               />
// //                             </span>
// //                           ))}
// //                       </div>
// //                     </div>
// //                   ))}
// //               </div>))}
// //           </>
// //         ) : (
// //           <div className='color-size-section'>
// //             <h3>Colors and Sizes</h3>
// //             <button type='button' onClick={() => handleAddColor()}>Add Color</button>
// //             {(editedProduct.colorOptions || []).map((color, index) => (
// //               <div key={index} className='color-item'>
// //                 <input
// //                   type='text'
// //                   value={color.name}
// //                   onChange={(e) => handleColorChange('', index, 'name', e.target.value)}
// //                   placeholder='Color Name'
// //                 />
// //                 <input
// //                   type='color'
// //                   value={color.hex}
// //                   onChange={(e) => handleColorChange('', index, 'hex', e.target.value)}
// //                 />
// //                 <button type='button' onClick={() => handleRemoveColor('', color.name)}>Remove Color</button>
// //                 <input
// //                   type='text'
// //                   placeholder='Sizes(comma separated)'
// //                   onBlur={(e) => handleAddSize('', color.name, e.target.value)}
// //                 />
// //                 <div>Sizes:{editedProduct.sizeOptions[color.name]?.map(size => (
// //                   <span key={size}>
// //                     {size}
// //                     <input
// //                       type='number'
// //                       value={
// //                         editedProduct.quantities[color.name]?.[size] || ''}
// //                       onChange={(e) => handleQuantityChange('', color.name, size, e.target.value)}
// //                       min='0'
// //                       placeholder='Quantity'
// //                     />
// //                   </span>))}
// //                 </div>
// //               </div>))}
// //           </div>)}

// //         <button type='submit' disabled={isSubmitting}>
// //           {isSubmitting ? 'Updating...' : 'Update Product'}
// //         </button>
// //       </form>
// //       <button onClick={onClose}>Cancel</button>
// //     </div>);
// // };

// // export default Editor;

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { storage } from '../../firebaseConfig';
// // // import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

// // // const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

// // // const Editor = ({ product, onClose, onUpdate }) => {
// // //   const [editedProduct, setEditedProduct] = useState(initializeProduct(product));
// // //   const [images, setImages] = useState([]);
// // //   const [newImages, setNewImages] = useState([]);
// // //   const [removedImageUrls, setRemovedImageUrls] = useState([]);
// // //   const [useHeightClassification, setUseHeightClassification] = useState(!!product.height);
// // //   const [sizeError, setSizeError] = useState('');
// // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // //   useEffect(() => {
// // //     setEditedProduct(initializeProduct(product));
// // //     setUseHeightClassification(!!product.height);
// // //     if (product.imageUrls) {
// // //       setImages(product.imageUrls.map(url => ({ url, isExisting: true })));
// // //     } else {
// // //       setImages([]);
// // //     }
// // //   }, [product]);

// // //   function initializeProduct(product) {
// // //     const initialProduct = { ...product };
// // //     if (initialProduct.height) {
// // //       initialProduct.aboveHeight = initialProduct.height.aboveHeight || { colorOptions: [], sizeOptions: {}, quantities: {} };
// // //       initialProduct.belowHeight = initialProduct.height.belowHeight || { colorOptions: [], sizeOptions: {}, quantities: {} };
// // //     } else {
// // //       initialProduct.colorOptions = initialProduct.colorOptions || [];
// // //       initialProduct.sizeOptions = initialProduct.sizeOptions || {};
// // //       initialProduct.quantities = initialProduct.quantities || {};
// // //     }
// // //     return initialProduct;
// // //   }

// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setEditedProduct(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleArrayChange = (e, index, field) => {
// // //     const newArray = [...editedProduct[field]];
// // //     newArray[index] = e.target.value;
// // //     setEditedProduct(prev => ({ ...prev, [field]: newArray }));
// // //   };

// // //   const handleNestedChange = (e, field, subfield) => {
// // //     setEditedProduct(prev => ({
// // //       ...prev,
// // //       [field]: { ...prev[field], [subfield]: e.target.value }
// // //     }));
// // //   };

// // //   const handleImageUpload = (e) => {
// // //     const files = Array.from(e.target.files);
// // //     setNewImages([...newImages, ...files]);
// // //   };

// // //   const handleRemoveImage = (index, isExisting) => {
// // //     if (isExisting) {
// // //       const removedUrl = images[index].url;
// // //       setRemovedImageUrls([...removedImageUrls, removedUrl]);
// // //       setImages(images.filter((_, i) => i !== index));
// // //     } else {
// // //       setNewImages(newImages.filter((_, i) => i !== index));
// // //     }
// // //   };

// // //   const uploadImagesToFirebase = async () => {
// // //     return Promise.all(newImages.map(image => {
// // //       const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
// // //       const uploadTask = uploadBytesResumable(storageRef, image);

// // //       return new Promise((resolve, reject) => {
// // //         uploadTask.on('state_changed',
// // //           (snapshot) => {
// // //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// // //             console.log(`Upload is ${progress}% done`);
// // //           },
// // //           (error) => {
// // //             console.error('Error uploading image:', error);
// // //             reject(error);
// // //           },
// // //           () => {
// // //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
// // //               resolve(downloadURL);
// // //             }).catch((error) => {
// // //               console.error('Error getting download URL:', error);
// // //               reject(error);
// // //             });
// // //           }
// // //         );
// // //       });
// // //     }));
// // //   };

// // //   const removeImagesFromFirebase = async () => {
// // //     return Promise.all(removedImageUrls.map(url => {
// // //       const imageRef = ref(storage, url);
// // //       return deleteObject(imageRef);
// // //     }));
// // //   };

// // //   const handleColorChange = (section, index, field, value) => {
// // //     const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
// // //     setEditedProduct(prev => {
// // //       const updatedSection = { ...prev[sectionKey] };
// // //       const updatedColors = [...(updatedSection.colorOptions || [])];
// // //       updatedColors[index] = { ...updatedColors[index], [field]: value };
// // //       return { ...prev, [sectionKey]: { ...updatedSection, colorOptions: updatedColors } };
// // //     });
// // //   };

// // //   const handleAddColor = (section) => {
// // //     const newColor = { name: '', hex: '#000000' };
// // //     setEditedProduct(prev => {
// // //       if (useHeightClassification) {
// // //         const sectionKey = section === 'above' ? 'aboveHeight' : 'belowHeight';
// // //         const updatedSection = { ...prev[sectionKey] };
// // //         return {
// // //           ...prev,
// // //           [sectionKey]: {
// // //             ...updatedSection,
// // //             colorOptions: [...(updatedSection.colorOptions || []), newColor],
// // //             sizeOptions: { ...(updatedSection.sizeOptions || {}), [newColor.name]: [] },
// // //             quantities: { ...(updatedSection.quantities || {}), [newColor.name]: {} }
// // //           }
// // //         };
// // //       } else {
// // //         return {
// // //           ...prev,
// // //           colorOptions: [...(prev.colorOptions || []), newColor],
// // //           sizeOptions: { ...(prev.sizeOptions || {}), [newColor.name]: [] },
// // //           quantities: { ...(prev.quantities || {}), [newColor.name]: {} }
// // //         };
// // //       }
// // //     });
// // //   };

// // //   const handleRemoveColor = (section, colorName) => {
// // //     const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
// // //     setEditedProduct(prev => {
// // //       const updatedSection = { ...prev[sectionKey] };
// // //       const updatedColors = (updatedSection.colorOptions || []).filter(color => color.name !== colorName);
// // //       const updatedSizeOptions = { ...(updatedSection.sizeOptions || {}) };
// // //       delete updatedSizeOptions[colorName];
// // //       const updatedQuantities = { ...(updatedSection.quantities || {}) };
// // //       delete updatedQuantities[colorName];
// // //       return {
// // //         ...prev,
// // //         [sectionKey]: {
// // //           ...updatedSection,
// // //           colorOptions: updatedColors,
// // //           sizeOptions: updatedSizeOptions,
// // //           quantities: updatedQuantities
// // //         }
// // //       };
// // //     });
// // //   };

// // //   const handleAddSize = (section, colorName, size) => {
// // //     const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
// // //     const sizesArray = size.split(',').map(s => s.trim());
// // //     const invalidSizes = sizesArray.filter(s => !validSizes.includes(s));

// // //     if (invalidSizes.length > 0) {
// // //       setSizeError(`Invalid sizes: ${invalidSizes.join(', ')}`);
// // //     } else {
// // //       setSizeError('');
// // //       setEditedProduct(prev => {
// // //         const updatedSection = { ...prev[sectionKey] };
// // //         const currentSizes = updatedSection.sizeOptions?.[colorName] || [];
// // //         const uniqueSizes = [...new Set([...currentSizes, ...sizesArray])];
// // //         const updatedSizeOptions = {
// // //           ...(updatedSection.sizeOptions || {}),
// // //           [colorName]: uniqueSizes
// // //         };
// // //         const updatedQuantities = {
// // //           ...(updatedSection.quantities || {}),
// // //           [colorName]: uniqueSizes.reduce((acc, size) => ({
// // //             ...acc,
// // //             [size]: updatedSection.quantities?.[colorName]?.[size] || 0
// // //           }), {})
// // //         };
// // //         return {
// // //           ...prev,
// // //           [sectionKey]: {
// // //             ...updatedSection,
// // //             sizeOptions: updatedSizeOptions,
// // //             quantities: updatedQuantities
// // //           }
// // //         };
// // //       });
// // //     }
// // //   };

// // //   const handleQuantityChange = (section, colorName, size, value) => {
// // //     const sectionKey = section === 'above' ? 'aboveHeight' : section === 'below' ? 'belowHeight' : 'colorOptions';
// // //     const newValue = parseInt(value, 10) || 0;
// // //     setEditedProduct(prev => {
// // //       const updatedSection = { ...prev[sectionKey] };
// // //       return {
// // //         ...prev,
// // //         [sectionKey]: {
// // //           ...updatedSection,
// // //           quantities: {
// // //             ...(updatedSection.quantities || {}),
// // //             [colorName]: {
// // //               ...(updatedSection.quantities?.[colorName] || {}),
// // //               [size]: newValue
// // //             }
// // //           }
// // //         }
// // //       };
// // //     });
// // //   };

// // //   const handleHeightClassificationChange = (e) => {
// // //     const newUseHeightClassification = e.target.checked;
// // //     setUseHeightClassification(newUseHeightClassification);

// // //     setEditedProduct(prev => {
// // //       if (newUseHeightClassification) {
// // //         return {
// // //           ...prev,
// // //           height: { value: '', aboveHeight: { colorOptions: [], sizeOptions: {}, quantities: {} }, belowHeight: { colorOptions: [], sizeOptions: {}, quantities: {} } },
// // //           aboveHeight: { colorOptions: [], sizeOptions: {}, quantities: {} },
// // //           belowHeight: { colorOptions: [], sizeOptions: {}, quantities: {} },
// // //           colorOptions: undefined,
// // //           sizeOptions: undefined,
// // //           quantities: undefined
// // //         };
// // //       } else {
// // //         return {
// // //           ...prev,
// // //           height: undefined,
// // //           aboveHeight: undefined,
// // //           belowHeight: undefined,
// // //           colorOptions: [],
// // //           sizeOptions: {},
// // //           quantities: {}
// // //         };
// // //       }
// // //     });
// // //   };

// // //   const formatProductData = (product) => {
// // //     const formattedProduct = { ...product };

// // //     // Convert categories to array if it's a string
// // //     if (typeof formattedProduct.categories === 'string') {
// // //       formattedProduct.categories = formattedProduct.categories.split(',').map(cat => cat.trim());
// // //     }

// // //     // Ensure numeric fields are numbers
// // //     ['price', 'gst', 'discount'].forEach(field => {
// // //       formattedProduct[field] = Number(formattedProduct[field]);
// // //     });

// // //     // Format height data
// // //     if (useHeightClassification) {
// // //       formattedProduct.height = {
// // //         value: Number(formattedProduct.height?.value || 0),
// // //         aboveHeight: formattedProduct.aboveHeight || { colorOptions: [], sizeOptions: {}, quantities: {} },
// // //         belowHeight: formattedProduct.belowHeight || { colorOptions: [], sizeOptions: {}, quantities: {} }
// // //       };
// // //       delete formattedProduct.colorOptions;
// // //       delete formattedProduct.sizeOptions;
// // //       delete formattedProduct.quantities;
// // //     } else {
// // //       delete formattedProduct.height;
// // //       delete formattedProduct.aboveHeight;
// // //       delete formattedProduct.belowHeight;
// // //     }

// // //     // Ensure quantities are numbers
// // //     const processQuantities = (section) => {
// // //       if (formattedProduct[section]) {
// // //         Object.keys(formattedProduct[section].quantities).forEach(color => {
// // //           Object.keys(formattedProduct[section].quantities[color]).forEach(size => {
// // //             formattedProduct[section].quantities[color][size] = Number(formattedProduct[section].quantities[color][size]);
// // //           });
// // //         });
// // //       }
// // //     };

// // //     if (useHeightClassification) {
// // //       processQuantities('aboveHeight');
// // //       processQuantities('belowHeight');
// // //     } else {
// // //       processQuantities('colorOptions');
// // //     }

// // //     return formattedProduct;
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setIsSubmitting(true);
// // //     try {
// // //       await removeImagesFromFirebase();
// // //       const newImageUrls = await uploadImagesToFirebase();

// // //       const updatedProduct = formatProductData({
// // //         ...editedProduct,
// // //         imageUrls: [...images.filter(img => img.isExisting).map(img => img.url), ...newImageUrls],
// // //       });

// // //       console.log(updatedProduct);

// // //       const response = await axios.put(`http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/update/${editedProduct.id}`, updatedProduct);

// // //       if (response.status === 200) {
// // //         onUpdate(updatedProduct);
// // //         onClose();
// // //       } else {
// // //         throw new Error('Failed to update product');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error updating product:', error);
// // //       alert('Failed to update product. Please try again.');
// // //     }
// // //   };

// // //   return (
// // //     <div className="editor-container">
// // //       <h2>Edit Product</h2>
// // //       <form onSubmit={handleSubmit} className="edit-product-form">
// // //         <div className="image-upload">
// // //           <label>Current Images</label>
// // //           <div className="image-preview">
// // //             {images.map((image, index) => (
// // //               <div key={index} className="image-item">
// // //                 <img src={image.url} alt={`Product ${index + 1}`} />
// // //                 <button type="button" onClick={() => handleRemoveImage(index, true)}>Remove</button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <label>Add New Images</label>
// // //           <input type="file" multiple onChange={handleImageUpload} />
// // //           <div className="image-preview">
// // //             {newImages.map((image, index) => (
// // //               <div key={index} className="image-item">
// // //                 <img src={URL.createObjectURL(image)} alt={`New ${index + 1}`} />
// // //                 <button type="button" onClick={() => handleRemoveImage(index, false)}>Remove</button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         <div className="form-fields">
// // //           <input type="text" name="name" value={editedProduct.name} onChange={handleInputChange} placeholder="Name" />
// // //           <input type="text" name="displayName" value={editedProduct.displayName} onChange={handleInputChange} placeholder="Display Name" />
// // //           <textarea name="description" value={editedProduct.description} onChange={handleInputChange} placeholder="Description" />
// // //           <input type="number" name="price" value={editedProduct.price} onChange={handleInputChange} placeholder="Price" />
// // //           <input type="number" name="gst" value={editedProduct.gst} onChange={handleInputChange} placeholder="GST Percentage" />
// // //           <input type="number" name="discount" value={editedProduct.discount} onChange={handleInputChange} placeholder="Discount Percentage" />
// // //           <input type="text" name="categories" value={editedProduct.categories.join(', ')} onChange={(e) => setEditedProduct(prev => ({ ...prev, categories: e.target.value.split(',') }))} placeholder="Categories (comma separated)" />
// // //         </div>

// // //         <div className="height-classification">
// // //           <label>
// // //             <input
// // //               type="checkbox"
// // //               checked={useHeightClassification}
// // //               onChange={handleHeightClassificationChange}
// // //             />
// // //             Use height-based classification
// // //           </label>
// // //         </div>

// // //         {useHeightClassification ? (
// // //   <>
// // //     <input
// // //       type="number"
// // //       name="height"
// // //       value={editedProduct.height?.value || ''}
// // //       onChange={(e) => handleNestedChange(e, 'height', 'value')}
// // //       placeholder="Height (in cm)"
// // //     />
// // //     {['above', 'below'].map(section => (
// // //       <div key={section} className="height-section">
// // //         <h3>{section === 'above' ? 'Above Height' : 'Below Height'}</h3>
// // //         <button type="button" onClick={() => handleAddColor(section)}>Add Color</button>
// // //         {(editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight']?.colorOptions || []).map((color, index) => (
// // //           <div key={index} className="color-item">
// // //             <input
// // //               type="text"
// // //               value={color.name}
// // //               onChange={(e) => handleColorChange(section, index, 'name', e.target.value)}
// // //               placeholder="Color Name"
// // //             />
// // //             <input
// // //               type="color"
// // //               value={color.hex}
// // //               onChange={(e) => handleColorChange(section, index, 'hex', e.target.value)}
// // //             />
// // //             <button type="button" onClick={() => handleRemoveColor(section, color.name)}>Remove Color</button>
// // //             <input
// // //               type="text"
// // //               placeholder="Sizes (comma separated)"
// // //               onBlur={(e) => handleAddSize(section, color.name, e.target.value)}
// // //             />
// // //             <div>
// // //               Sizes: {editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight']?.sizeOptions[color.name]?.map(size => (
// // //                 <span key={size}>
// // //                   {size}
// // //                   <input
// // //                     type="number"
// // //                     value={editedProduct[section === 'above' ? 'aboveHeight' : 'belowHeight']?.quantities[color.name]?.[size] || ''}
// // //                     onChange={(e) => handleQuantityChange(section, color.name, size, e.target.value)}
// // //                     min="0"
// // //                     placeholder="Quantity"
// // //                   />
// // //                 </span>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     ))}
// // //   </>
// // // ) : (
// // //           <div className="color-size-section">
// // //             <h3>Colors and Sizes</h3>
// // //             <button type="button" onClick={() => handleAddColor()}>Add Color</button>
// // //             {(editedProduct.colorOptions || []).map((color, index) => (
// // //               <div key={index} className="color-item">
// // //                 <input
// // //                   type="text"
// // //                   value={color.name}
// // //                   onChange={(e) => handleColorChange('', index, 'name', e.target.value)}
// // //                   placeholder="Color Name"
// // //                 />
// // //                 <input
// // //                   type="color"
// // //                   value={color.hex}
// // //                   onChange={(e) => handleColorChange('', index, 'hex', e.target.value)}
// // //                 />
// // //                 <button type="button" onClick={() => handleRemoveColor('', color.name)}>Remove Color</button>
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Sizes (comma separated)"
// // //                   onBlur={(e) => handleAddSize('', color.name, e.target.value)}
// // //                 />
// // //                 <div>
// // //                   Sizes: {editedProduct.sizeOptions[color.name]?.map(size => (
// // //                     <span key={size}>
// // //                       {size}
// // //                       <input
// // //                         type="number"
// // //                         value={editedProduct.quantities[color.name]?.[size] || ''}
// // //                         onChange={(e) => handleQuantityChange('', color.name, size, e.target.value)}
// // //                         min="0"
// // //                         placeholder="Quantity"
// // //                       />
// // //                     </span>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}

// // //         {sizeError && <div className="error">{sizeError}</div>}

// // //         <div className="button-group">
// // //           <button type="submit" className="submit-btn" disabled={isSubmitting}>
// // //             {isSubmitting ? 'Updating...' : 'Update Product'}
// // //           </button>
// // //           <button type="button" onClick={onClose} className="cancel-btn" disabled={isSubmitting}>Cancel</button>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default Editor;