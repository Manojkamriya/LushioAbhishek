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
// const logger = require("firebase-functions/logger");

// Validation middleware
const validateOrderRequest = (req, res, next) => {
  const required = ["uid", "modeOfPayment", "orderedProducts", "address", "totalAmount", "payableAmount"];
  const missing = required.filter((field) => !req.body[field]);

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missing.join(", ")}`,
    });
  }

  if (!req.body.orderedProducts?.length) {
    return res.status(400).json({
      message: "Order must contain at least one product",
    });
  }

  next();
};

// URLs
const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const API_URL = process.env.REACT_APP_API_URL;

// Create a order
router.post("/createOrder", validateOrderRequest, async (req, res) => {
  const {
    uid, modeOfPayment, orderedProducts, address,
    totalAmount, payableAmount, discount, lushioCurrencyUsed, couponCode,
    paymentData,
  } = req.body;

  // Start a Firestore batch
  const batch = db.batch();
  const orderRef = db.collection("orders").doc();
  const userOrderRef = db.collection("users").doc(uid).collection("orders").doc(orderRef.id);

  try {
    // Validate and sanitize the contact number
    const sanitizedContactNo = address.contactNo.replace(/\D/g, "").slice(-10); // Get the last 10 digits
    if (sanitizedContactNo.length !== 10) {
      throw new Error("Invalid contact number");
    }

    // Fetch and validate products with inventory reduction
    const productPromises = orderedProducts.map(async (product) => {
      const productDoc = await db.collection("products").doc(product.productId).get();
      if (!productDoc.exists) {
        throw new Error(`Product ${product.productId} not found`);
      }

      const productData = productDoc.data();

      // Reduce product inventory based on height type
      let quantitiesMap;
      if (product.heightType === "normal") {
        quantitiesMap = productData.quantities; // Access the quantities map directly

        const sizeQuantity = quantitiesMap?.[product.color]?.[product.size];
        if (!sizeQuantity || sizeQuantity < product.quantity) {
          throw new Error(`Insufficient inventory for product ${product.productId}, color ${product.color}, size ${product.size}`);
        }

        // Update the quantities map
        const updatedQuantities = {
          ...quantitiesMap,
          [product.color]: {
            ...quantitiesMap[product.color],
            [product.size]: sizeQuantity - product.quantity,
          },
        };

        batch.update(productDoc.ref, {quantities: updatedQuantities});
      } else {
        // Handle height-based products (above/below)
        const heightKey = product.heightType === "above" ? "aboveHeight" : "belowHeight";
        quantitiesMap = productData[heightKey]; // Access the height-specific map

        const sizeQuantity = quantitiesMap?.[product.color]?.[product.size];
        if (!sizeQuantity || sizeQuantity < product.quantity) {
          throw new Error(`Insufficient inventory for height-based product ${product.productId}, height ${product.heightType}, color ${product.color}, size ${product.size}`);
        }

        // Update the height-based map
        const updatedQuantities = {
          ...quantitiesMap,
          [product.color]: {
            ...quantitiesMap[product.color],
            [product.size]: sizeQuantity - product.quantity,
          },
        };

        batch.update(productDoc.ref, {[heightKey]: updatedQuantities});
      }

      return {
        ...product,
        productDetails: productData,
      };
    });

    const validatedProducts = await Promise.all(productPromises);

    // Calculate the total amount and verify
    const calculatedTotal = validatedProducts.reduce((sum, product) => sum + product.productDetails.discountedPrice * product.quantity, 0);

    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      throw new Error("Total amount mismatch");
    }

    // Get user details
    const userDoc = await db.collection("users").doc(uid).get();
    const email = userDoc.exists ? userDoc.data().email : null;

    const dateOfOrder = new Date();

    // Prepare order data
    const orderData = {
      uid,
      dateOfOrder,
      email,
      couponCode,
      address,
      totalAmount,
      payableAmount,
      discount,
      lushioCurrencyUsed,
      modeOfPayment,
      status: "Pending",
      paymentData: paymentData?.data || null,
    };

    // Fetch dimensions from the admin document
    const adminDoc = await db.collection("controls").doc("admin").get();
    if (!adminDoc.exists) {
      throw new Error("Admin document not found");
    }

    const {length, breadth, height, weight, companyName, resellerName, pickupLocation} = adminDoc.data();
    if (!length || !breadth || !height || !weight) {
      throw new Error("Incomplete dimension or weight data in admin document.");
    }
    if (!companyName || ! resellerName || !pickupLocation) {
      throw new Error("Missing company or pickup information.");
    }

    // Prepare Shiprocket order data
    const shiprocketOrderData = {
      order_id: orderRef.id,
      order_date: dateOfOrder.toISOString().split("T")[0], // Format: YYYY-MM-DD
      pickup_location: pickupLocation,
      shipping_is_billing: true,
      company_name: companyName,
      reseller_name: resellerName,
      billing_customer_name: address.name?.split(" ")[0],
      billing_last_name: address.name?.split(" ").pop() || "",
      billing_address: `${address.flatDetails}, ${address.areaDetails}`, // Concatenated flatDetails and areaDetails
      billing_address_2: address.landmark || "",
      billing_city: address.townCity,
      billing_pincode: address.pinCode,
      billing_state: address.state,
      billing_country: address.country,
      billing_phone: sanitizedContactNo,
      billing_email: email,
      order_items: validatedProducts.map((product) => ({
        name: product.productDetails.displayName,
        sku: `SKU-${product.productId}`,
        units: product.quantity,
        selling_price: product.productDetails.price,
      })),
      payment_method: modeOfPayment === "cashOnDelivery" ? "COD" : "Prepaid",
      sub_total: payableAmount,
      shipping_charges: 0,
      length,
      breadth,
      height,
      weight,
    };

    // logger.log(shiprocketOrderData);
    let token;
    try {
      token = await generateToken();
      const shiprocketResponse = await axios.post(
          `${SHIPROCKET_API_URL}/orders/create/adhoc`,
          shiprocketOrderData,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
      );
      // logger.log(shiprocketResponse.data);
      if (!shiprocketResponse.data.shipment_id || !shiprocketResponse.data.order_id) {
        throw new Error("Invalid response from Shiprocket API");
      }

      const awbResponse = await axios.post(
          `${SHIPROCKET_API_URL}/courier/assign/awb`,
          {
            shipment_id: shiprocketResponse.data.shipment_id,
          },
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
      );

      // Add Shiprocket details to the order
      orderData.shiprocket = {
        ...shiprocketResponse.data,
        // awb_code: awbResponse.data.awb_code,
        awb_details: awbResponse.data,
      };
      orderData.status = "created";

      // Add order data to batch
      batch.set(orderRef, orderData);
      batch.set(userOrderRef, {orderId: orderRef.id, dateOfOrder});

      // Add ordered products as subcollection
      validatedProducts.forEach((product) => {
        const productRef = orderRef.collection("orderedProducts").doc();
        batch.set(productRef, product);
      });

      // Commit batch
      await batch.commit();
      if (couponCode) {
        try {
          await axios.post(`${API_URL}/coupon/markUsed`, {
            uid,
            code: couponCode,
          });
        } catch (couponError) {
          console.error("Error marking coupon as used:", couponError);
          // We don't throw here as the order is already created successfully
          // Just log the error for tracking
        }
      }
    } catch (shiprocketError) {
      console.error("Shiprocket API Error:", shiprocketError.response?.data || shiprocketError);

      // Log detailed error information
      if (shiprocketError.response?.data?.errors) {
        console.error("Validation errors:", JSON.stringify(shiprocketError.response.data.errors, null, 2));
      }

      throw new Error(`Shiprocket API Error: ${shiprocketError.response?.data?.message || shiprocketError.message}`);
    } finally {
      if (token) {
        await destroyToken(token);
      }
    }

    res.status(200).json({
      message: "Order created successfully",
      orderId: orderRef.id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.response?.data) {
      console.error("API Error Details:", {
        status: error.response.status,
        data: error.response.data,
        endpoint: error.config?.url,
      });
    }
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
      details: error.response?.data?.errors || null,
    });
  }
});

// Get order details by orderId
router.get("/:orderId", async (req, res) => {
  try {
    const {orderId} = req.params;
    const {uid} = req.query; // For validation that this user owns the order

    // Check required fields
    if (!uid || !orderId) {
      return res.status(400).json({message: "Required fields missing."});
    }

    // Check if the `uid` exists in the `users` collection
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({message: "Invalid User ID"});
    }

    // Get the order document
    const orderDoc = await db.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({message: "Order not found"});
    }

    const orderData = orderDoc.data();

    // Validate user owns this order
    if (orderData.uid !== uid) {
      return res.status(403).json({message: "Unauthorized access to order"});
    }

    // Get ordered products subcollection
    const productsSnapshot = await orderDoc.ref.collection("orderedProducts").get();
    const orderedProducts = productsSnapshot.docs.map((doc) => ({
      opid: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      ...orderData,
      orderedProducts,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
});

// Get all orders for a user
router.get("/", async (req, res) => {
  try {
    const {uid, limit = 5, lastOrderId} = req.query;

    // Validate if `uid` is provided
    if (!uid) {
      return res.status(400).json({message: "User ID is required"});
    }

    // Check if the `uid` exists in the `users` collection
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({message: "Invalid User ID"});
    }

    // Build the base query for fetching orders
    let query = db.collection("orders").where("uid", "==", uid).orderBy("dateOfOrder", "desc").limit(parseInt(limit));

    // Add pagination if `lastOrderId` is provided
    if (lastOrderId) {
      const lastOrderDoc = await db.collection("orders").doc(lastOrderId).get();
      if (lastOrderDoc.exists) {
        query = query.startAfter(lastOrderDoc);
      }
    }

    // Execute the query to get orders
    const ordersSnapshot = await query.get();

    // Process orders and fetch their orderedProducts
    const orders = await Promise.all(
        ordersSnapshot.docs.map(async (doc) => {
        // Get the orderedProducts subcollection for this order
          const orderedProductsSnapshot = await doc.ref.collection("orderedProducts").get();

          const orderedProducts = orderedProductsSnapshot.docs.map((productDoc) => ({
            opid: productDoc.id,
            ...productDoc.data(),
          }));

          return {
            orderId: doc.id,
            ...doc.data(),
            orderedProducts,
          };
        }),
    );

    // Pagination metadata
    const lastVisible = ordersSnapshot.docs[ordersSnapshot.docs.length - 1];

    res.status(200).json({
      orders,
      pagination: {
        hasMore: orders.length === parseInt(limit),
        lastOrderId: lastVisible?.id,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Cancel an order
router.post("/cancel", async (req, res) => {
  const {oid, uid} = req.body;

  if (!oid || !uid) {
    return res.status(400).json({message: "Order ID and User ID are required"});
  }

  try {
    // Get the order document
    const orderDoc = await db.collection("orders").doc(oid).get();

    if (!orderDoc.exists) {
      return res.status(404).json({message: "Order not found"});
    }

    const orderData = orderDoc.data();

    // Validate user owns this order
    if (orderData.uid !== uid) {
      return res.status(403).json({message: "Unauthorized access to order"});
    }

    // Check if order is already cancelled
    if (orderData.status === "cancelled") {
      return res.status(400).json({message: "Order is already cancelled"});
    }

    // Get Shiprocket order details
    const shiprocketOrderId = orderData.shiprocket?.order_id;
    if (!shiprocketOrderId) {
      return res.status(400).json({message: "Shiprocket order ID not found"});
    }

    let token;
    try {
      // Cancel order on Shiprocket
      token = await generateToken();
      await axios.post(
          `${SHIPROCKET_API_URL}/orders/cancel`,
          {ids: [shiprocketOrderId]},
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
      );

      // Update order status in Firestore
      await db.collection("orders").doc(oid).update({
        status: "cancelled",
        cancellationDate: new Date(),
      });

      res.status(200).json({
        message: "Order cancelled successfully",
      });
    } catch (shiprocketError) {
      console.error("Shiprocket API Error:", shiprocketError.response?.data || shiprocketError);
      throw new Error(`Shiprocket API Error: ${shiprocketError.response?.data?.message || shiprocketError.message}`);
    } finally {
      if (token) {
        await destroyToken(token);
      }
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
});

// Update delivery address
router.put("/address/update", async (req, res) => {
  const {oid, address, uid} = req.body;

  if (!oid || !address || !uid) {
    return res.status(400).json({message: "Order ID, address details, and user ID are required"});
  }

  try {
    const orderDoc = await db.collection("orders").doc(oid).get();
    if (!orderDoc.exists) {
      return res.status(404).json({message: "Order not found"});
    }

    const orderData = orderDoc.data();
    if (orderData.uid !== uid) {
      return res.status(403).json({message: "Unauthorized access to order"});
    }

    const shiprocketOrderId = orderData.shiprocket?.order_id;
    if (!shiprocketOrderId) {
      return res.status(400).json({message: "Shiprocket order ID not found"});
    }

    // Validate and sanitize contact number
    const sanitizedContactNo = address.contactNo.replace(/\D/g, "").slice(-10);
    if (sanitizedContactNo.length !== 10) {
      return res.status(400).json({message: "Invalid contact number"});
    }

    // Get user details
    const userDoc = await db.collection("users").doc(uid).get();
    const email = userDoc.exists ? userDoc.data().email : null;

    let token;
    try {
      token = await generateToken();

      const shiprocketAddressData = {
        order_id: shiprocketOrderId,
        shipping_customer_name: address.name,
        shipping_phone: sanitizedContactNo,
        shipping_address: `${address.flatDetails}, ${address.areaDetails}`,
        shipping_address_2: address.landmark || "",
        shipping_city: address.townCity,
        shipping_state: address.state,
        shipping_country: address.country,
        shipping_pincode: address.pinCode,
        shipping_email: email,
      };

      await axios.post(
          `${SHIPROCKET_API_URL}/orders/address/update`,
          shiprocketAddressData,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
      );

      // Update address in Firestore
      await orderDoc.ref.update({
        address: {
          ...address,
          contactNo: address.contactNo,
        },
        updatedAt: new Date(),
      });

      res.status(200).json({
        message: "Address updated successfully",
      });
    } catch (shiprocketError) {
      console.error("Shiprocket API Error:", shiprocketError.response?.data || shiprocketError);
      throw new Error(`Shiprocket API Error: ${shiprocketError.response?.data?.message || shiprocketError.message}`);
    } finally {
      if (token) {
        await destroyToken(token);
      }
    }
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      message: "Failed to update address",
      error: error.message,
    });
  }
});

module.exports = router;
