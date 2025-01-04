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

router.get("/fetch", async (req, res) => {
  const {status, fromDate, toDate, lastDoc, limit = 10} = req.query;

  try {
    // Start building the query
    let query = db.collection("orders");

    // Add status filter if provided
    if (status) {
      query = query.where("status", "==", status);
    }

    // Add date range filter if provided
    if (fromDate) {
      const startDate = new Date(fromDate);
      query = query.where("dateOfOrder", ">=", startDate);
    }
    if (toDate) {
      const endDate = new Date(toDate);
      endDate.setDate(endDate.getDate() + 1); // Include the entire end date
      query = query.where("dateOfOrder", "<", endDate);
    }

    // Order by creation date
    query = query.orderBy("dateOfOrder", "desc");

    // Apply pagination
    if (lastDoc) {
      const lastDocRef = await db.collection("orders").doc(lastDoc).get();
      if (!lastDocRef.exists) {
        return res.status(400).json({message: "Invalid last document reference"});
      }
      query = query.startAfter(lastDocRef);
    }

    // Set limit
    query = query.limit(limit);

    // Execute query
    const snapshot = await query.get();

    // Transform the data
    const orders = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const shiprocketData = data.shiprocket || {};

      const orderInfo = {
        oid: doc.id,
        pickup: Boolean(shiprocketData.pickup_details),
        manifest: Boolean(shiprocketData.manifest),
        label: Boolean(shiprocketData.label),
        invoice: Boolean(shiprocketData.invoice),
      };

      // Add URLs if they exist
      if (orderInfo.manifest && shiprocketData.manifest?.manifest_url) {
        orderInfo.manifest_url = shiprocketData.manifest.manifest_url;
      }
      if (orderInfo.label && shiprocketData.label?.label_url) {
        orderInfo.label_url = shiprocketData.label.label_url;
      }
      if (orderInfo.invoice && shiprocketData.invoice?.invoice_url) {
        orderInfo.invoice_url = shiprocketData.invoice.invoice_url;
      }

      orders.push(orderInfo);
    });

    // Determine if there are more documents
    const hasMore = orders.length === limit;
    const lastVisible = hasMore ? snapshot.docs[snapshot.docs.length - 1].id : null;

    return res.status(200).json({
      orders,
      hasMore,
      lastDoc: lastVisible,
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

module.exports = router;
