import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from './Editor';
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
      const response = await axios.get('http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/allProducts');
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
        await axios.delete(`http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/delete/${id}`);
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
      const response = await axios.get(`http://127.0.0.1:5001/lushio-fitness/us-central1/api/products/${id}`);
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
      <input
        type="text"
        placeholder="Search bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="EditProduct-searchBar"
      />
      {error && <div className="EditProduct-error">{error}</div>}
      <div className="EditProduct-content">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product.id);
                  }}
                  className="EditProduct-deleteButton"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {selectedProduct && (
          <div className="EditProduct-editor">
            <Editor
              product={selectedProduct}
              onClose={handleEditorClose}
              onUpdate={handleProductUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;