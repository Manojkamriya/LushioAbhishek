import React, { useState } from "react";
import axios from "axios";
import "./addcoupon.css"
function AddCoupons() {
  const [formData, setFormData] = useState({
    code: "",
    validity: "",
    discount: "",
    onPurchaseOf: "",
    forUsers: "all",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { code, validity, discount, onPurchaseOf, forUsers } = formData;

    // Validation checks
    if (!code || !validity || !discount || !onPurchaseOf || !forUsers) {
      setError("All fields are mandatory.");
      return;
    }
    if (parseFloat(discount) <= 0 || parseFloat(onPurchaseOf) <= 0) {
      setError("Discount and minimum purchase must be positive values.");
      return;
    }
    const validityDate = new Date(validity);
    if (isNaN(validityDate) || validityDate <= new Date()) {
      setError("Validity date should be a future date.");
      return;
    }

    // API call to add coupon
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/coupon/add`, formData);
      setSuccess(response.data.message);
      setFormData(
        {
          code: "",
          validity: "",
          discount: "",
          onPurchaseOf: "",
          forUsers: "all",}
      );
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred while adding the coupon.");
    }
  };

  return (
    <div className="admin-coupon-container">
      <h2>Add Coupon</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Code:
          <input type="text" name="code" value={formData.code} onChange={handleChange} required />
        </label>
        <label>
          Validity:
          <input type="date" name="validity" value={formData.validity} onChange={handleChange} required />
        </label>
        <label>
          Discount (%):
          <input type="number" name="discount" value={formData.discount} onChange={handleChange} min="0" step="0.01" required />
        </label>
        <label>
          Minimum Purchase:
          <input type="number" name="onPurchaseOf" value={formData.onPurchaseOf} onChange={handleChange} min="0" step="0.01" required />
        </label>
        <label>
          For Users:
          <select name="forUsers" value={formData.forUsers} onChange={handleChange} required>
            <option value="all">All</option>
            <option value="firstPurchase">First Purchase</option>
            <option value="hidden">Hidden</option>
            <option value="">Not Applicable</option>
          </select>
        </label>
        <button type="submit">Add Coupon</button>
      </form>
    </div>
  );
}

export default AddCoupons;
