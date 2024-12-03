import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Editor from './Editor';
import { IoArrowBack } from 'react-icons/io5'; 
import './EditProduct.css';

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/allProducts`);
      setProducts(response.data.products);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again or add products first.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/products/delete/${id}`);
        fetchProducts();
        setError(null);
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleEdit = async (id) => {
    try {
    
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
      setSelectedProduct(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to fetch product details. Please try again.');
    }
   
  };

  const handleEditorClose = () => {
    setSelectedProduct(null);
  };

  const handleProductUpdate = (updatedProduct) => {
    setSelectedProduct(updatedProduct);
    fetchProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="EditProduct-container">
           
      <h1 className="EditProduct-title">Edit Product</h1>
      
      <SwitchTransition>
        <CSSTransition
          key={selectedProduct ? 'editor' : 'list'}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          {selectedProduct ? (
            <div className="EditProduct-editor">
              
              <button onClick={handleEditorClose} className="editor-close-btn">
  <IoArrowBack className="editor-close-icon" /> Go Back
</button>

              <Editor
                product={selectedProduct}
                onClose={handleEditorClose}
                onUpdate={handleProductUpdate}
              />
            </div>
          ) : (
            <div className="EditProduct-content">
              <input
                type="text"
                placeholder="Search bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="EditProduct-searchBar"
              />
              {error && <div className="EditProduct-error">{error}</div>}
              <div className="EditProduct-productsList">
                {filteredProducts.map(product => (
                  <div key={product.id} className="EditProduct-productCard">
                    <div className="EditProduct-productInfo">
                      <img src={product.cardImages[0]} alt={product.name} className="EditProduct-productImage" />
                      <span>{product.name}</span>
                    </div>
                    <div className="EditProduct-buttonsContainer">
                    <button
 onClick={() => handleEdit(product.id)}
 className="EditProduct-editButton"
>
 Edit
</button>  
                    { !product.categories.includes("my") &&
   <button
   onClick={(e) => {
     e.stopPropagation();
     handleDelete(product.id);
   }}
   className="EditProduct-deleteButton"
 >
   Delete
 </button>
                    } 
                     
                   
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default EditProduct;