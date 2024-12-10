import React,{useState} from 'react'
import "./OrderManagement.css"

const OrderManagement = () => {
    const [dimensions, setDimensions] = useState({
        length: '',
        width: '',
        height: '',
        weight: '',
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setDimensions((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const { length, width, height, weight } = dimensions;
    
        if (length && width && height && weight) {
          alert(`Order Dimensions:\nLength: ${length} cm\nWidth: ${width} cm\nHeight: ${height} cm\nWeight: ${weight} cm`);
        } else {
          alert('Please fill in all fields.');
        }
      };
    
      return (
        <>
          <div className='order-dimensions-form-wrapper'>
          <form className="order-dimensions-form" onSubmit={handleSubmit}>
          <h3>Order Dimensions</h3>
          <div className='form-fields'>
          <div className="form-group">
            <label>
              Length (cm):
              <input
                type="number"
                name="length"
                value={dimensions.length}
                onChange={handleChange}
                placeholder="Enter length"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Width (cm):
              <input
                type="number"
                name="width"
                value={dimensions.width}
                onChange={handleChange}
                placeholder="Enter width"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Height (cm):
              <input
                type="number"
                name="height"
                value={dimensions.height}
                onChange={handleChange}
                placeholder="Enter height"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Weight (Kg):
              <input
                type="number"
                name="weight"
                value={dimensions.weight}
                onChange={handleChange}
                placeholder="Enter weight(in KG)"
                required
              />
            </label>
          </div>
          </div>
         
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        <button className="submit-button">
          Orders
          </button>
        </div>
        
     
    

        </>
       
       
      );
}

export default OrderManagement
