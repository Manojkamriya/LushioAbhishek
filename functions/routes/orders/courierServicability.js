/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const axios = require("axios");
const router = express.Router();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();
const {generateToken, destroyToken} = require("./shiprocketAuth");
// const logger = require("firebase-functions/logger");

// URLs
const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;

router.post("/serviceability", async (req, res) => {
  try {
    const {pickup_postcode, delivery_postcode, is_return, declared_value, oid} = req.body;

    // Validate required fields
    if (!pickup_postcode || !delivery_postcode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: pickup_postcode and delivery_postcode are mandatory",
      });
    }

    // Validate is_return and declared_value combination
    if (is_return !== undefined) {
      if (typeof is_return !== "number") {
        return res.status(400).json({
          success: false,
          message: `is_return must be a number when provided, given ${typeof is_return}`,
        });
      }
      if (declared_value === undefined) {
        return res.status(400).json({
          success: false,
          message: "declared_value is required when is_return is provided",
        });
      }
      if (typeof declared_value !== "number" || declared_value <= 0) {
        return res.status(400).json({
          success: false,
          message: "declared_value must be a positive number",
        });
      }
    }

    const requestData = {
      pickup_postcode,
      delivery_postcode,
    };

    // Only add is_return and declared_value if is_return is provided
    if (is_return !== undefined) {
      requestData.is_return = is_return;
      requestData.declared_value = declared_value;
    }

    // If oid is provided, fetch order_id from shiprocket collection
    if (oid) {
      const shiprocketDoc = await db.collection("shiprocket").doc(oid).get();
      if (!shiprocketDoc.exists) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      requestData.order_id = shiprocketDoc.data().order_id;
    } else {
      // If no oid, fetch weight from admin controls and set cod=1
      const adminDoc = await db.collection("controls").doc("admin").get();
      if (!adminDoc.exists) {
        return res.status(404).json({
          success: false,
          message: "Admin controls not found",
        });
      }
      requestData.weight = adminDoc.data().weight;
      requestData.cod = 1;
    }

    // Get auth token and make request
    let token;
    let response;

    try {
      token = await generateToken();
      response = await axios.get(`${SHIPROCKET_API_URL}/courier/serviceability/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: requestData,
      });

      // Find the minimum ETD from available courier companies
      let recommendedEtd = null;
      if (response.data?.data?.available_courier_companies?.length > 0 && response.data?.data?.recommended_courier_company_id) {
        const companies = response.data.data.available_courier_companies;
        const recommendedCourier = companies.find(
            (company) => company.courier_company_id === response.data.data.recommended_courier_company_id,
        );
        if (recommendedCourier) {
          recommendedEtd = recommendedCourier.etd;
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          ...response.data,
          min_etd: recommendedEtd,
        },
      });
    } catch (error) {
      // Handle Shiprocket API specific errors
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          message: error.response.data.message || "Shiprocket API error",
          error: error.response.data,
        });
      }

      // Handle other errors
      return res.status(500).json({
        success: false,
        message: "Error while fetching serviceability data",
        error: error.message,
      });
    } finally {
      // Clean up token if it was generated
      if (token) {
        await destroyToken(token);
      }
    }
  } catch (error) {
    // Handle any other unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
