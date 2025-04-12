import React, { useState } from 'react';
import axios from 'axios';
import './SendTokens.css';

// API
const API = process.env.REACT_APP_API_URL;

const SendTokens = () => {
  const [method, setMethod] = useState('specific');
  const [recipients, setRecipients] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState('');
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const parseRecipients = () => {
    if (!recipients) return [];
    return recipients.split(',').map(item => item.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    
    try {
      let endpoint = '';
      let data = {};
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      // Common fields for all methods
      data.amount = amount;
      data.days = days;
      data.message = message;
      
      // Method-specific configurations
      switch(method) {
        case 'specific':
          endpoint = `${API}/wallet/send-specific`;
          if (uploadedFile) {
            // For file uploads, we need to use FormData
            const formData = new FormData();
            formData.append('recipientsFile', uploadedFile);
            formData.append('amount', amount);
            formData.append('days', days);
            formData.append('message', message);
            
            config.headers = {
              'Content-Type': 'multipart/form-data'
            };
            
            // Make the request with FormData
            const response = await axios.post(endpoint, formData, config);
            setResponse({
              success: true,
              data: response.data
            });
            setLoading(false);
            return;
          } else {
            data.recipients = parseRecipients();
          }
          break;
        case 'all':
          endpoint = `${API}/wallet/send`;
          break;
        case 'dateRange':
          endpoint = `${API}/wallet/send-to-active`;
          data.startDate = startDate;
          data.lastDate = lastDate;
          break;
        case 'orderSuccess':
          endpoint = `${API}/wallet/send-to-orders`;
          data.startDate = startDate;
          data.lastDate = lastDate;
          break;
        default:
          throw new Error('Invalid method selected');
      }
      
      // Make the request with JSON data
      const response = await axios.post(endpoint, data, config);
      
      setResponse({
        success: true,
        data: response.data
      });
    } catch (error) {
      setResponse({
        success: false,
        error: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="SendTokens-container">
      <div className="SendTokens-header">
        <h1>Send LushioCoins</h1>
        <p>Distribute tokens to users from the admin panel</p>
      </div>
      
      <form onSubmit={handleSubmit} className="SendTokens-form">
        <div className="SendTokens-methodSelector">
          <h2>Select Distribution Method</h2>
          <div className="SendTokens-methods">
            <button 
              type="button" 
              className={`SendTokens-methodButton ${method === 'specific' ? 'active' : ''}`}
              onClick={() => setMethod('specific')}
            >
              Specific Users
            </button>
            <button 
              type="button" 
              className={`SendTokens-methodButton ${method === 'all' ? 'active' : ''}`}
              onClick={() => setMethod('all')}
            >
              All Users
            </button>
            <button 
              type="button" 
              className={`SendTokens-methodButton ${method === 'dateRange' ? 'active' : ''}`}
              onClick={() => setMethod('dateRange')}
            >
              Active Date Range
            </button>
            <button 
              type="button" 
              className={`SendTokens-methodButton ${method === 'orderSuccess' ? 'active' : ''}`}
              onClick={() => setMethod('orderSuccess')}
            >
              Successful Orders
            </button>
          </div>
        </div>
        
        {method === 'specific' && (
          <div className="SendTokens-section">
            <h3>Specific Users</h3>
            <div className="SendTokens-option">
              <label>Upload CSV <span style={{color:"red"}}>COMMING SOON</span></label>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                className="SendTokens-fileInput"
              />
            </div>
            <div className="SendTokens-option">
              <label>Or Enter Emails/Phone Numbers (comma separated)</label>
              <textarea 
                value={recipients} 
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="user@example.com, +1234567890"
                className="SendTokens-textarea"
              />
            </div>
          </div>
        )}
        
        {(method === 'dateRange' || method === 'orderSuccess') && (
          <div className="SendTokens-section">
            <h3>{method === 'dateRange' ? 'Active Users Date Range' : 'Successful Orders Date Range'}</h3>
            <div className="SendTokens-dateFields">
              <div className="SendTokens-option">
                <label>Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="SendTokens-input"
                  required
                />
              </div>
              <div className="SendTokens-option">
                <label>End Date</label>
                <input 
                  type="date" 
                  value={lastDate} 
                  onChange={(e) => setLastDate(e.target.value)}
                  className="SendTokens-input"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="SendTokens-section">
          <h3>Token Details</h3>
          <div className="SendTokens-option">
            <label>Amount</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Number of LushioCoins"
              className="SendTokens-input"
              required
            />
          </div>
          <div className="SendTokens-option">
            <label>Expiry (Days)</label>
            <input 
              type="number" 
              value={days} 
              onChange={(e) => setDays(e.target.value)}
              placeholder="Number of days until expiry"
              className="SendTokens-input"
              required
            />
          </div>
          <div className="SendTokens-option">
            <label>Message</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message to include with the tokens"
              className="SendTokens-textarea"
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="SendTokens-submitButton"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send LushioCoins'}
        </button>
      </form>
      
      {response && (
        <div className={`SendTokens-response ${response.success ? 'success' : 'error'}`}>
          <h3>{response.success ? 'Success!' : 'Error'}</h3>
          <pre>{JSON.stringify(response.success ? response.data : response.error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SendTokens;