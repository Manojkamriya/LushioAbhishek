/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable max-len */
const express = require("express");
const admin = require("firebase-admin");
const axios = require("axios");
const router = express.Router();
const db = admin.firestore();

// Shiprocket creds
const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const SHIPROCKET_API_TOKEN = process.env.SHIPROCKET_API_TOKEN;

// Endpoint to create a new order
router.post("/createOrder", async (req, res) => {
  const {uid, modeOfPayment,
    razorpay_payment_id, razorpay_order_id, razorpay_signature,
    phonepe_payment_id, phonepe_order_id, phonepe_signature,
    paypal_payment_id, paypal_order_id, paypal_signature, orderedProducts, address,
    totalAmount, payableAmount, discount, lushioCurrencyUsed, couponCode,
  } = req.body;

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    const userEmail = userDoc.exists ? userDoc.data().email : null;

    // 1. Create the order document in orders collection
    const orderRef = db.collection("orders").doc();
    const dateOfOrder = new Date();

    const orderData = {
      uid,
      dateOfOrder,
      userEmail,
      couponCode,
      address: {
        areaDetails: address.areaDetails,
        contactNo: address.contactNo,
        country: address.country,
        flatDetails: address.flatDetails,
        isDefault: address.isDefault,
        landmark: address.landmark,
        name: address.name,
        pinCode: address.pinCode,
        state: address.state,
        townCity: address.townCity,
      },
      totalAmount,
      payableAmount,
      discount,
      lushioCurrencyUsed,
      modeOfPayment,
      // Conditional fields based on the mode of payment
      ...(modeOfPayment === "razorpay" && {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      }),
      ...(modeOfPayment === "paypal" && {
        paypal_order_id,
        paypal_payment_id,
        paypal_signature,
      }),
      ...(modeOfPayment === "phonepe" && {
        phonepe_order_id,
        phonepe_payment_id,
        phonepe_signature,
      }),
      orderedProducts: orderedProducts.map((product) => ({
        productId: product.productId,
        color: product.color,
        colorCode: product.colorCode,
        heightType: product.heightType,
        size: product.size,
        quantity: product.quantity,
      })),
    };

    await orderRef.set(orderData);

    // 2. Save order ID in the user's subcollection of orders
    const userOrderRef = db.collection("users").doc(uid).collection("orders").doc(orderRef.id);
    await userOrderRef.set({orderId: orderRef.id, dateOfOrder});

    // 3. Save ordered products as subcollection under the order document
    const orderedProductsRef = orderRef.collection("orderedProducts");
    for (const product of orderedProducts) {
      const productDoc = await db.collection("products").doc(product.productId).get();

      if (productDoc.exists) {
        await orderedProductsRef.add({
          ...product,
          productDetails: productDoc.data(), // Including additional product details from products collection
        });
      }
    }

    // 4. Place Shiprocket order
    const sanitizedContactNo = address.contactNo.startsWith("91") ? parseInt(address.contactNo.slice(2), 10) : parseInt(address.contactNo, 10);

    const shiprocketOrderData = {
      "order_id": orderRef.id,
      "order_date": dateOfOrder.toISOString(),
      "pickup_location": "Primary Location", // Shiprocket-specific pickup location name
      "billing_customer_name": address.name,
      "billing_address": address.flatDetails,
      "billing_address_2": address.landmark,
      "billing_city": address.townCity,
      "billing_pincode": address.pinCode,
      "billing_state": address.state,
      "billing_country": address.country,
      "billing_phone": sanitizedContactNo,
      "order_items": orderedProducts.map((product) => ({
        "name": product.productName,
        "sku": product.productId,
        "units": product.quantity,
        "selling_price": product.price,
      })),
      "payment_method": modeOfPayment === "cashOnDelivery" ? "COD" : "Prepaid",
      "sub_total": payableAmount,
      ...(userEmail && {"billing_email": userEmail}), // Include email if it exists
    };

    try {
      const shiprocketResponse = await axios.post(SHIPROCKET_API_URL, shiprocketOrderData, {
        headers: {
          "Authorization": `Bearer ${SHIPROCKET_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const {shipment_id, tracking_id} = shiprocketResponse.data;

      // 5. Update Firestore order with Shiprocket shipment details
      await orderRef.update({
        shiprocket: {
          shipment_id,
          tracking_id,
          status: "created",
        },
      });

      res.status(200).json({
        message: "Order created successfully",
        orderId: orderRef.id,
        shiprocket: {shipment_id, tracking_id},
      });
    } catch (shiprocketError) {
      // Shiprocket API call failed
      console.error("Shiprocket order creation failed:", shiprocketError);

      // Delete the created order and user order reference
      await orderRef.delete();
      await userOrderRef.delete();

      res.status(500).json({
        message: "Order creation failed due to Shiprocket error. Order data has been rolled back.",
        error: shiprocketError.message,
      });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({message: "Failed to create order", error});
  }
});

module.exports = router;
