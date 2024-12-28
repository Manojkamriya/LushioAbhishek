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

// Pickup order
router.post("/pickup", async (req, res) => {
  const {oid} = req.body;
  if (!oid) {
    return res.status(400).json({message: "Order ID not found"});
  }

  try {
    // Get order from database
    const orderDoc = await db.collection("orders").doc(oid).get();
    if (!orderDoc.exists) {
      return res.status(404).json({message: "Order not found"});
    }

    const orderData = orderDoc.data();
    const shipment_id = orderData.shiprocket.shipment_id;

    // Generate token and make Shiprocket API call
    let token;
    try {
      token = await generateToken();
      const shiprocketResponse = await axios.post(
          `${SHIPROCKET_API_URL}/courier/generate/pickup`,
          {shipment_id},
          {
            headers: {"Authorization": `Bearer ${token}`},
          },
      );

      // Update order with pickup details
      await db.collection("orders").doc(oid).update({
        "shiprocket.pickup_status": shiprocketResponse.data.pickup_status,
        "shiprocket.pickup_details": {
          scheduled_date: shiprocketResponse.data.response.pickup_scheduled_date,
          token_number: shiprocketResponse.data.response.pickup_token_number,
          status: shiprocketResponse.data.response.status,
          generated_date: shiprocketResponse.data.response.pickup_generated_date,
          pickup_data: shiprocketResponse.data.response.data,
        },
        "status": "pickup_scheduled",
        "updatedAt": new Date(),
      });

      return res.status(200).json({
        message: "Pickup scheduled successfully",
        pickup_details: {
          scheduled_date: shiprocketResponse.data.response.pickup_scheduled_date,
          token_number: shiprocketResponse.data.response.pickup_token_number,
          status: shiprocketResponse.data.response.status,
          pickup_data: shiprocketResponse.data.response.data,
        },
      });
    } catch (apiError) {
      console.error("Shiprocket API Error:", apiError.response?.data || apiError.message);
      return res.status(500).json({
        message: "Failed to schedule pickup with Shiprocket",
        error: apiError.response?.data?.message || apiError.message,
      });
    } finally {
      if (token) {
        await destroyToken(token);
      }
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Generate and Print Manifest
router.post("/manifest", async (req, res) => {
  const {oid} = req.body;
  if (!oid) {
    return res.status(400).json({message: "Order ID not found"});
  }

  let token;
  try {
    // Get order from database
    const orderDoc = await db.collection("orders").doc(oid).get();
    if (!orderDoc.exists) {
      return res.status(404).json({message: "Order not found"});
    }

    const orderData = orderDoc.data();
    if (orderData.shiprocket.pickup_status !== 1) {
      return res.status(409).json({message: "Pickup must be requested first."});
    }

    const {shipment_id, order_id} = orderData.shiprocket;

    // Generate token
    token = await generateToken();

    // Step 1: Generate Manifest
    const generateResponse = await axios.post(
        `${SHIPROCKET_API_URL}/manifests/generate`,
        {shipment_id},
        {
          headers: {"Authorization": `Bearer ${token}`},
        },
    );

    // Check if manifest generation was successful
    if (generateResponse.data.status !== 1) {
      throw new Error(generateResponse.data.message || "Failed to generate manifest");
    }

    // Step 2: Print Manifest
    const printResponse = await axios.post(
        `${SHIPROCKET_API_URL}/manifests/print`,
        {order_id},
        {
          headers: {"Authorization": `Bearer ${token}`},
        },
    );

    // Store manifest details in order document
    await db.collection("orders").doc(oid).update({
      "shiprocket.manifest": {
        generated_at: new Date(),
        manifest_url: printResponse.data.manifest_url,
        status: "generated",
      },
      "status": "manifest_generated",
      "updatedAt": new Date(),
    });

    return res.status(200).json({
      message: "Manifest generated and printed successfully",
      manifest_url: printResponse.data.manifest_url,
    });
  } catch (error) {
    console.error("Manifest Error:", error.response?.data || error);
    return res.status(500).json({
      message: "Failed to generate/print manifest",
      error: error.response?.data?.message || error.message,
    });
  } finally {
    if (token) {
      await destroyToken(token);
    }
  }
});

// Generate Label
router.post("/label", async (req, res) => {
  const {oid} = req.body;
  if (!oid) {
    return res.status(400).json({message: "Order ID not found"});
  }

  let token;
  try {
    // Get order from database
    const orderDoc = await db.collection("orders").doc(oid).get();
    if (!orderDoc.exists) {
      return res.status(404).json({message: "Order not found"});
    }

    const orderData = orderDoc.data();
    const shipment_id = orderData.shiprocket.shipment_id;

    // Generate token
    token = await generateToken();

    // Generate Label
    const labelResponse = await axios.post(
        `${SHIPROCKET_API_URL}/courier/generate/label`,
        {shipment_id},
        {
          headers: {"Authorization": `Bearer ${token}`},
        },
    );

    if (labelResponse.data.label_created === 1) {
      // Store label details in order document
      await db.collection("orders").doc(oid).update({
        "shiprocket.label": {
          generated_at: new Date(),
          label_url: labelResponse.data.label_url,
          status: labelResponse.data.response,
        },
        "status": "label_generated",
        "updatedAt": new Date(),
      });
      return res.status(200).json({
        message: "Label generated successfully",
        label_url: labelResponse.data.label_url,
      });
    } else {
      return res.status(500).json({
        error: labelResponse.data.not_created,
      });
    }
  } catch (error) {
    console.error("Label Generation Error:", error.response?.data || error);
    return res.status(500).json({
      message: "Failed to generate label",
      error: error.response?.data?.message || error.message,
    });
  } finally {
    if (token) {
      await destroyToken(token);
    }
  }
});

// Generate Invoice
router.post("/invoice", async (req, res) => {
  const {oid} = req.body;
  if (!oid) {
    return res.status(400).json({message: "Order ID not found"});
  }

  let token;
  try {
    // Get order from database
    const orderDoc = await db.collection("orders").doc(oid).get();
    if (!orderDoc.exists) {
      return res.status(404).json({message: "Order not found"});
    }

    const orderData = orderDoc.data();
    const order_id = orderData.shiprocket.order_id;

    // Generate token
    token = await generateToken();

    // Generate Invoice
    const invoiceResponse = await axios.post(
        `${SHIPROCKET_API_URL}/orders/print/invoice`,
        {order_id},
        {
          headers: {"Authorization": `Bearer ${token}`},
        },
    );

    if (invoiceResponse.data.is_invoice_created) {
      // Store invoice details in order document
      await db.collection("orders").doc(oid).update({
        "shiprocket.invoice": {
          generated_at: new Date(),
          invoice_url: invoiceResponse.data.invoice_url,
          status: "generated",
        },
        "status": "invoice_generated",
        "updatedAt": new Date(),
      });

      return res.status(200).json({
        message: "Invoice generated successfully",
        invoice_url: invoiceResponse.data.invoice_url,
      });
    } else {
      return res.status(500).json({
        error: invoiceResponse.data.not_created,
      });
    }
  } catch (error) {
    console.error("Invoice Generation Error:", error.response?.data || error);
    return res.status(500).json({
      message: "Failed to generate invoice",
      error: error.response?.data?.message || error.message,
    });
  } finally {
    if (token) {
      await destroyToken(token);
    }
  }
});

module.exports = router;
