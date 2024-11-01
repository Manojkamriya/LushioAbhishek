import React, { useState, useEffect } from "react";
import axios from "axios";
const moment = require("moment");

// Helper function to convert date from YYYY-MM-DD to DD-MM-YYYY
function convertToDisplayDate(dateString) {
  if (!dateString) return null;
  const parsedDate = moment(dateString, "YYYY-MM-DD", true);
  return parsedDate.isValid() ? parsedDate.format("DD-MM-YYYY") : null;
}

function EditCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/coupon/`);
        setCoupons(response.data.coupons);
      } catch (error) {
        setError("Error fetching coupons.");
      }
    };
    fetchCoupons();
  }, []);

  const handleDelete = async (code) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/coupon/delete/${code}`);
        setCoupons((prevCoupons) => prevCoupons.filter((coupon) => coupon.code !== code));
        setSuccess("Coupon deleted successfully.");
      } catch (error) {
        setError("Error deleting coupon.");
      }
    }
  };

  const handleEditClick = (coupon) => {
    setEditMode(true);
    setCurrentCoupon({ ...coupon });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCoupon((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { code, validity, discount, onPurchaseOf, forUsers } = currentCoupon;

    // Validation: Check for non-negative values and future date
    if (discount < 0 || onPurchaseOf < 0) {
      setError("Discount and Minimum Purchase must be non-negative.");
      return;
    }
    if (!moment(validity, "YYYY-MM-DD").isAfter(moment())) {
      setError("Validity date must be a future date.");
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/coupon/update/${code}`, {
        validity,
        discount: parseFloat(discount),
        onPurchaseOf: parseFloat(onPurchaseOf),
        forUsers,
      });
      setCoupons((prevCoupons) =>
        prevCoupons.map((coupon) => (coupon.code === code ? currentCoupon : coupon))
      );
      setEditMode(false);
      setSuccess("Coupon updated successfully.");
    } catch (error) {
      setError("Error updating coupon.");
    }
  };

  return (
    <div>
      <h2>Edit Coupons</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <div className="coupon-cards">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="coupon-card">
            <p>Code: {coupon.code}</p>
            <p>Validity: {convertToDisplayDate(new Date(coupon.validity).toISOString().split("T")[0])}</p>
            <button onClick={() => handleEditClick(coupon)}>Edit</button>
            <button onClick={() => handleDelete(coupon.code)}>Delete</button>
          </div>
        ))}
      </div>

      {editMode && currentCoupon && (
        <div className="edit-form">
          <h3>Edit Coupon - {currentCoupon.code}</h3>
          <form onSubmit={handleUpdate}>
            <label>
              Validity:
              <input
                type="date"
                name="validity"
                value={currentCoupon.validity}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Discount (%):
              <input
                type="number"
                name="discount"
                value={currentCoupon.discount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </label>
            <label>
              Minimum Purchase:
              <input
                type="number"
                name="onPurchaseOf"
                value={currentCoupon.onPurchaseOf}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </label>
            <label>
              For Users:
              <select name="forUsers" value={currentCoupon.forUsers} onChange={handleChange} required>
                <option value="all">All</option>
                <option value="firstPurchase">First Purchase</option>
                <option value="">Not Applicable</option>
              </select>
            </label>
            <button type="submit">Update Coupon</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditCoupons;
