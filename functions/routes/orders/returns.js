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

    // Fetch dimensions from the admin document
    const adminDoc = await db.collection("controls").doc("admin").get();
    if (!adminDoc.exists) {
      throw new Error("Admin document not found");
    }
    const {length, breadth, height, weight, returnEnabled} = adminDoc.data();
    if (!length || !breadth || !height || !weight) {
      throw new Error("Incomplete dimension or weight data in admin document.");
    }

    if (!returnEnabled) {
      return res.status(400).json({
        success: false,
        message: "This feature is currently dissabled.",
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
      "returnDate": new Date(),
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

// Fetch return orders with pagination and date filtering
router.get("/fetch", async (req, res) => {
  try {
    // Get query parameters with defaults
    const {
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Validate date format (yyyy-mm-dd)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if ((fromDate && !dateRegex.test(fromDate)) || (toDate && !dateRegex.test(toDate))) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use yyyy-mm-dd",
      });
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query
    let query = db.collection("orders")
        .where("status", "==", "return_initiated")
        .where("shiprocket.return_order", "!=", null);

    // Add date filters if provided
    if (fromDate) {
      const fromDateTime = new Date(fromDate);
      query = query.where("returnDate", ">=", fromDateTime);
    }
    if (toDate) {
      const toDateTime = new Date(toDate);
      // Set time to end of day
      toDateTime.setHours(23, 59, 59, 999);
      query = query.where("returnDate", "<=", toDateTime);
    }

    // Order by returnDate in descending order
    query = query.orderBy("returnDate", "desc");

    // Calculate pagination
    const startAt = (pageNum - 1) * limitNum;

    // Get total count for pagination info
    const totalSnapshot = await query.count().get();
    const total = totalSnapshot.data().count;

    // Apply pagination
    query = query.limit(limitNum).offset(startAt);

    // Execute query
    const snapshot = await query.get();

    // Extract order IDs
    const orders = snapshot.docs.map((doc) => doc.id);

    return res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching return orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching return orders",
    });
  }
});

// Get specific return order details
router.get("/details/:oid", async (req, res) => {
  try {
    const {oid} = req.params;

    // Get order document
    const orderDoc = await db.collection("orders").doc(oid).get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderData = orderDoc.data();

    // Verify this is a return order
    if (orderData.status !== "return_initiated" || !orderData.shiprocket?.return_order) {
      return res.status(400).json({
        success: false,
        message: "Not a return order",
      });
    }

    // Get return items details from orderedProducts subcollection
    const returnItemIds = Object.keys(orderData.returnItems || {});
    const returnItemsPromises = returnItemIds.map((productId) =>
      orderDoc.ref.collection("orderedProducts").doc(productId).get(),
    );

    const returnItemDocs = await Promise.all(returnItemsPromises);

    // Combine return items data
    const returnItems = returnItemDocs.reduce((acc, doc) => {
      if (doc.exists) {
        const productData = doc.data();
        acc[doc.id] = {
          ...orderData.returnItems[doc.id],
          productName: productData.productName,
          productDetails: productData.productDetails,
          productId: productData.productId,
        };
      }
      return acc;
    }, {});

    // Prepare response data
    const responseData = {
      orderId: oid,
      orderDetails: {
        shiprocketOrderId: orderData.shiprocket?.order_id,
        returnOrderId: orderData.shiprocket?.return_order?.order_id,
        returnShipmentId: orderData.shiprocket?.return_order?.shipment_id,
        returnAwbCode: orderData.shiprocket?.return_awb?.awb_code,
        returnDate: orderData.returnDate?.toDate(),
        status: orderData.status,
        createdAt: orderData.createdAt?.toDate(),
        updatedAt: orderData.updatedAt?.toDate(),
      },
      customerDetails: {
        uid: orderData.uid,
        email: orderData.email,
        address: orderData.address,
      },
      returnItems,
      shiprocketDetails: {
        returnOrder: orderData.shiprocket?.return_order,
        returnAwb: orderData.shiprocket?.return_awb,
      },
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching return order details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching return order details",
    });
  }
});

// Update return order
router.patch("/update/:oid", async (req, res) => {
  let token = null;
  try {
    const {oid} = req.params;
    const {action, length, breadth, height, weight, return_warehouse_id} = req.body;

    // Validate action array
    if (!Array.isArray(action) || action.length === 0 || action.length > 2) {
      return res.status(400).json({
        success: false,
        message: "Action must be an array with 1-2 values",
      });
    }

    // Validate action values
    const validActions = ["product_details", "warehouse_address"];
    const invalidActions = action.filter((a) => !validActions.includes(a));
    if (invalidActions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid actions: ${invalidActions.join(", ")}`,
      });
    }

    // Get order document
    const orderDoc = await db.collection("orders").doc(oid).get();
    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderData = orderDoc.data();

    // Verify this is a return order
    if (orderData.status !== "return_initiated" || !orderData.shiprocket?.return_order) {
      return res.status(400).json({
        success: false,
        message: "Not a return order",
      });
    }

    const return_order_id = orderData.shiprocket?.return_order?.order_id;
    if (!return_order_id) {
      return res.status(400).json({
        success: false,
        message: "Return order ID not found",
      });
    }

    // Prepare update data based on action
    const updateData = {
      order_id: return_order_id,
    };

    // Validate and add product details if requested
    if (action.includes("product_details")) {
      if (!length || !breadth || !height || !weight) {
        return res.status(400).json({
          success: false,
          message: "All dimensions and weight are required for product_details update",
        });
      }

      updateData.length = parseFloat(length);
      updateData.breadth = parseFloat(breadth);
      updateData.height = parseFloat(height);
      updateData.weight = parseFloat(weight);

      // Validate numbers
      const dimensions = [updateData.length, updateData.breadth, updateData.height, updateData.weight];
      if (dimensions.some((d) => isNaN(d) || d <= 0)) {
        return res.status(400).json({
          success: false,
          message: "All dimensions and weight must be positive numbers",
        });
      }
    }

    // Validate and add warehouse address if requested
    if (action.includes("warehouse_address")) {
      if (!return_warehouse_id) {
        return res.status(400).json({
          success: false,
          message: "return_warehouse_id is required for warehouse_address update",
        });
      }
      updateData.return_warehouse_id = return_warehouse_id;
    }

    // Generate token and make API call to Shiprocket
    token = await generateToken();

    const response = await axios.patch(
        `${SHIPROCKET_API_URL}/orders/edit`,
        updateData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
    );

    // Update order document with new details
    // Note: We're not updating the status field as per requirement
    const firestoreUpdate = {
      "updatedAt": new Date(),
    };

    if (action.includes("product_details")) {
      firestoreUpdate["shiprocket.return_order.length"] = updateData.length;
      firestoreUpdate["shiprocket.return_order.breadth"] = updateData.breadth;
      firestoreUpdate["shiprocket.return_order.height"] = updateData.height;
      firestoreUpdate["shiprocket.return_order.weight"] = updateData.weight;
    }

    if (action.includes("warehouse_address")) {
      firestoreUpdate["shiprocket.return_order.return_warehouse_id"] = updateData.return_warehouse_id;
    }

    await db.collection("orders").doc(oid).update(firestoreUpdate);

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating return order:", error);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error updating return order",
    });
  } finally {
    if (token) {
      await destroyToken(token);
    }
  }
});

module.exports = router;
