import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from './Editor';

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
      setError('Failed to fetch products. Please try again.');
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

  const handleProductClick = async (id) => {
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 60px)',
      padding: '1rem',
      width: "70vw",
      backgroundColor: 'white',
      overflow: 'hidden'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Edit Product</h1>
      <input
        type="text"
        placeholder="Search bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <div style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden'
      }}>
        <div style={{
          flex: '1',
          overflowY: 'auto',
          marginRight: '1rem',
          paddingRight: '1rem'
        }}>
          {filteredProducts.map(product => (
            <div key={product.id} 
                 style={{ 
                   border: '1px solid #ccc', 
                   borderRadius: '4px', 
                   padding: '1rem', 
                   marginBottom: '0.5rem', 
                   display: 'flex', 
                   justifyContent: 'space-between', 
                   alignItems: 'center', 
                   cursor: 'pointer' 
                 }} 
                 onClick={() => handleProductClick(product.id)}>
              {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={product?.imageUrls[0]} alt={product.name} style={{ width: '4rem', height: '4rem', objectFit: 'cover', marginRight: '1rem' }} />
                <span>{product.name}</span>
              </div> */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
  {product?.imageUrls && product.imageUrls.length > 0 ? (
    <img 
      src={product.imageUrls[0]} 
      alt={product.name} 
      style={{ width: '4rem', height: '4rem', objectFit: 'cover', marginRight: '1rem' }} 
    />
  ) : (
    <span>No Image Available</span> // Fallback when there is no image
  )}
  <span>{product?.name || 'No Product Name'}</span> {/* Handle missing product name */}
</div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} 
                style={{ 
                  backgroundColor: 'red', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}>
                Delete
              </button>
            </div>
          ))}
        </div>
        {selectedProduct && (
          <div style={{ flex: '1', overflowY: 'auto' }}>
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