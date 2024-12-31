/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable max-len */
const express = require("express");
const axios = require("axios");
const router = express.Router();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();
const {generateToken, destroyToken} = require("./shiprocketAuth");

// URLs
const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const API_URL = process.env.REACT_APP_API_URL;

// Create return order
router.post("/create", async (req, res) => {
  let token = null;
  try {
    // Get uid and oid from request
    const {uid, oid, returnItems} = req.body;

    if (!uid || !oid || !returnItems) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters.",
      });
    }

    // Get order details from Firestore
    const orderDoc = await db.collection("orders").doc(oid).get();
    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderData = orderDoc.data();
    const order_id = orderData.shiprocket?.order_id;

    if (orderData.uid !== uid) {
      return res.status(403).json({message: "Unauthorized access to order"});
    }

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "Shiprocket order ID not found for this order",
      });
    }

    // Get user details
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    // Fetch ordered products that are being returned
    const orderedProductsRef = db.collection("orders").doc(oid).collection("orderedProducts");
    const returnProductIds = Object.keys(returnItems);

    const returnProductsPromises = returnProductIds.map((productId) =>
      orderedProductsRef.doc(productId).get(),
    );

    const returnProductDocs = await Promise.all(returnProductsPromises);

    // Check if all products exist
    const missingProducts = returnProductDocs.filter((doc) => !doc.exists);
    if (missingProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some products not found in the order",
      });
    }
    let sub_total = 0;
    // Prepare order items array
    const order_items = returnProductDocs.map((doc) => {
      const productData = doc.data();
      const returnData = returnItems[doc.id];
      sub_total += Number(productData.productDetails.discountedPrice);
      return {
        name: productData.productName,
        sku: `SKU-${productData.productId}`,
        units: returnData.units,
        selling_price: Number(productData.productDetails.discountedPrice),
        return_reason: returnData.return_reason,
      };
    });
    console.log(order_items);

    // Generate Shiprocket token
    token = await generateToken();

    // Get pickup locations to find primary location (seller's address)
    const pickupLocationsResponse = await axios.get(
        `${API_URL}/pickup/pickup-locations`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
    );

    const primaryLocation = pickupLocationsResponse.data.data.shipping_address.find(
        (location) => location.is_primary_location === 1,
    );

    if (!primaryLocation) {
      return res.status(400).json({
        success: false,
        message: "No primary pickup location found",
      });
    }
    // Fetch dimensions from the admin document
    const adminDoc = await db.collection("controls").doc("admin").get();
    if (!adminDoc.exists) {
      throw new Error("Admin document not found");
    }
    const {length, breadth, height, weight} = adminDoc.data();
    if (!length || !breadth || !height || !weight) {
      throw new Error("Incomplete dimension or weight data in admin document.");
    }

    // Prepare return order data
    const returnOrderData = {
      order_id,
      order_date: new Date().toISOString().split("T")[0], // yyyy-mm-dd format

      // customer address details
      pickup_customer_name: orderData.address.name.split(" ")[0],
      pickup_last_name: orderData.address.name?.split(" ").pop() || "",
      pickup_address: `${orderData.address.flatDetails}, ${orderData.address.areaDetails}`,
      pickup_address_2: orderData.address.landmark || "",
      pickup_city: orderData.address.townCity,
      pickup_state: orderData.address.state,
      pickup_country: orderData.address.country,
      pickup_pincode: orderData.address.pinCode,
      pickup_email: orderData.email,
      pickup_phone: orderData.address.contactNo.replace(/\D/g, "").slice(-10),

      // seller address details
      shipping_customer_name: primaryLocation.name.split(" ")[0],
      shipping_last_name: primaryLocation.name?.split(" ").pop() || "",
      shipping_address: primaryLocation.address,
      shipping_address_2: primaryLocation.address_2,
      shipping_city: primaryLocation.city,
      shipping_state: primaryLocation.state,
      shipping_country: primaryLocation.country,
      shipping_pincode: primaryLocation.pin_code,
      shipping_email: primaryLocation.email,
      shipping_phone: primaryLocation.phone,

      order_items,
      payment_method: "Prepaid",
      sub_total,
      length,
      breadth,
      height,
      weight,
    };

    // Create return order in Shiprocket
    const returnOrderResponse = await axios.post(
        `${SHIPROCKET_API_URL}/orders/create/return`,
        returnOrderData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
    );

    // Extract shipment_id from return order response
    const shipment_id = returnOrderResponse.data.shipment_id;
    if (!shipment_id) {
      throw new Error("Shipment ID not found in return order response");
    }

    // Generate AWB for return shipment
    const awbResponse = await axios.post(
        `${SHIPROCKET_API_URL}/courier/assign/awb`,
        {
          shipment_id,
          is_return: 1,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
    );


    // Update order document with return order details
    await db.collection("orders").doc(oid).update({
      "shiprocket.return_order": returnOrderResponse.data,
      "shiprocket.return_awb": awbResponse.data,
      "returnItems": returnItems,
      "status": "return_initiated",
      "updatedAt": new Date(),
    });

    return res.status(200).json({
      success: true,
      data: {
        return_order: returnOrderResponse.data,
        awb_details: awbResponse.data,
      },
    });
  } catch (error) {
    console.error("Error creating return order:", error);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error creating return order",
    });
  } finally {
    if (token) {
      await destroyToken(token);
    }
  }
});

module.exports = router;
