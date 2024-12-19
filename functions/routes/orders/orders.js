/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable max-len */
const express = require("express");
const axios = require("axios");
const router = express.Router();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();
const {generateToken, destroyToken} = require("./shipRocketAuth");

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

// Shiprocket creds
const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;

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

      billing_customer_name: address.name,
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

    // console.log(shiprocketOrderData);
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
      // console.log(shiprocketResponse.data);
      if (!shiprocketResponse.data.shipment_id || !shiprocketResponse.data.order_id) {
        throw new Error("Invalid response from Shiprocket API");
      }

      // Add Shiprocket details to the order
      orderData.shiprocket = {
        ...shiprocketResponse.data,
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
    const {uid} = req.body; // For validation that this user owns the order

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
    const orderedProducts = productsSnapshot.docs.map((doc) => doc.data());

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

    // Process orders
    const orders = ordersSnapshot.docs.map((doc) => ({
      orderId: doc.id,
      ...doc.data(),
    }));

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

module.exports = router;
