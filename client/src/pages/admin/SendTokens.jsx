import React, { useState } from 'react';
import axios from 'axios';
import './SendTokens.css'; // Importing the external CSS

const SendTokensForm = () => {
    // Form state
    const [formData, setFormData] = useState({
        amount: '',
        message: '',
        days: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // To show success

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:5001/lushio-fitness/us-central1/api/wallet/send',
                formData
            );
            console.log('Response:', response.data);
            setSuccessMessage('Tokens sent successfully!'); // Show success message
            setErrorMessage(''); // Clear any error message
            setFormData({ amount: '', message: '', days: '' }); // Reset the form
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Failed to send tokens, please try again.');
            setSuccessMessage(''); // Clear any success message
        }
    };

    return (
        <div className="send-tokens-container">
            <h2>Send Tokens</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="number"
                        name="amount"
                        placeholder="Field for amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        name="message"
                        placeholder="Field for message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <input
                        type="number"
                        name="days"
                        placeholder="Field for days after which tokens expire"
                        value={formData.days}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {/* Show success or error message */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default SendTokensForm;
