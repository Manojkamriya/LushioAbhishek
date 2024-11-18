/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable max-len */
const express = require("express");
const admin = require("firebase-admin");
const axios = require("axios");
const router = express.Router();
const db = admin.firestore();

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
const SHIPROCKET_API_TOKEN = process.env.SHIPROCKET_API_TOKEN;

// Endpoint to create a new order
router.post("/createOrder", validateOrderRequest, async (req, res) => {
  const {
    uid, modeOfPayment, orderedProducts, address,
    totalAmount, payableAmount, discount, lushioCurrencyUsed, couponCode,
    ...paymentDetails
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

    // Fetch and validate products
    const productPromises = orderedProducts.map(async (product) => {
      const productDoc = await db.collection("products").doc(product.productId).get();
      if (!productDoc.exists) {
        throw new Error(`Product ${product.productId} not found`);
      }
      return {
        ...product,
        productDetails: productDoc.data(),
      };
    });

    const validatedProducts = await Promise.all(productPromises);

    // Calculate the total amount and verify
    const calculatedTotal = validatedProducts.reduce((sum, product) =>
      sum + product.productDetails.price * product.quantity, 0);

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
      status: "pending",
      ...(paymentDetails && {
        [`${modeOfPayment}_details`]: paymentDetails,
      }),
    };

    // Prepare Shiprocket order data
    const shiprocketOrderData = {
      order_id: orderRef.id,
      order_date: dateOfOrder.toISOString(),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,

      shipping_is_billing: true,
      company_name: process.env.COMPANY_NAME,
      reseller_name: process.env.RESELLER_NAME,

      billing_customer_name: address.name,
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
        sku: product.productId,
        units: product.quantity,
        selling_price: product.productDetails.price,

        // DOUBTFUL FIELDS
        // weight: product.productDetails.weight || 0.5, // Default weight if not specified
        // dimensions: product.productDetails.dimensions || {length: 10, width: 10, height: 10},

      })),
      payment_method: modeOfPayment === "cashOnDelivery" ? "COD" : "Prepaid",
      sub_total: payableAmount,

      // DOUBTFUL FIELDS
      // length: 10, // Default package dimensions
      // breadth: 10,
      // height: 10,
      // weight: 0.5,
    };

    // Create Shiprocket order
    // const shiprocketResponse = await axios.post(
    //     SHIPROCKET_API_URL,
    //     shiprocketOrderData,
    //     {
    //       headers: {
    //         "Authorization": `Bearer ${SHIPROCKET_API_TOKEN}`,
    //         "Content-Type": "application/json",
    //       },
    //     },
    // );

    // const {shipment_id, tracking_id} = shiprocketResponse.data;

    // Add Shiprocket details to the order
    orderData.shiprocket = {
      // shipment_id,
      // tracking_id,
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

    res.status(200).json({
      message: "Order created successfully",
      orderId: orderRef.id,
      // shiprocket: {shipment_id, tracking_id},
    });
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// CLAUDE
// router.post("/createOrder", validateOrderRequest, async (req, res) => {
//   const {
//     uid, modeOfPayment, orderedProducts, address,
//     // razorpay_payment_id, razorpay_order_id, razorpay_signature,
//     // phonepe_payment_id, phonepe_order_id, phonepe_signature,
//     // paypal_payment_id, paypal_order_id, paypal_signature,
//     totalAmount, payableAmount, discount, lushioCurrencyUsed, couponCode,
//     ...paymentDetails
//   } = req.body;

//   // Start a Firestore batch
//   const batch = db.batch();
//   const orderRef = db.collection("orders").doc();
//   const userOrderRef = db.collection("users").doc(uid).collection("orders").doc(orderRef.id);

//   try {
//     // Validate phone number
//     let sanitizedContactNo = address.contactNo.replace(/\D/g, "");
//     // Check if the number starts with "+91" or is 12 digits long
//     if (sanitizedContactNo.startsWith("+91") || sanitizedContactNo.length === 12) {
//       sanitizedContactNo = sanitizedContactNo.slice(2); // Remove the "+91" prefix
//     }
//     const parsedContactNo = parseInt(sanitizedContactNo, 10);
//     if (parsedContactNo.length < 10) {
//       throw new Error("Invalid contact number");
//     }

//     // 1. Validate products and calculate total
//     let calculatedTotal = 0;
//     const productPromises = orderedProducts.map(async (product) => {
//       const productDoc = await db.collection("products").doc(product.productId).get();
//       if (!productDoc.exists) {
//         throw new Error(`Product ${product.productId} not found`);
//       }
//       const productData = productDoc.data();
//       calculatedTotal += productData.price * product.quantity;
//       return {...product, productDetails: productData};
//     });

//     const validatedProducts = await Promise.all(productPromises);

//     // Verify total amount
//     if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
//       throw new Error("Total amount mismatch");
//     }

//     // 2. Get user details
//     const userDoc = await db.collection("users").doc(uid).get();
//     const userEmail = userDoc.exists ? userDoc.data().email : null;
//     const dateOfOrder = new Date();

//     // 3. Prepare order data
//     const orderData = {
//       uid,
//       dateOfOrder,
//       userEmail,
//       couponCode,
//       address,
//       totalAmount,
//       payableAmount,
//       discount,
//       lushioCurrencyUsed,
//       modeOfPayment,
//       status: "pending",
//       ...(modeOfPayment === "razorpay" && {
//         razorpay_payment_id: paymentDetails.razorpay_payment_id,
//         razorpay_order_id: paymentDetails.razorpay_order_id,
//         razorpay_signature: paymentDetails.razorpay_signature,
//       }),
//       ...(modeOfPayment === "paypal" && {
//         paypal_order_id: paymentDetails.paypal_order_id,
//         paypal_payment_id: paymentDetails.paypal_payment_id,
//         paypal_signature: paymentDetails.paypal_signature,
//       }),
//       ...(modeOfPayment === "phonepe" && {
//         phonepe_order_id: paymentDetails.phonepe_order_id,
//         phonepe_payment_id: paymentDetails.phonepe_payment_id,
//         phonepe_signature: paymentDetails.phonepe_signature,
//       }),
//       // Add other payment method details similarly
//     };

//     // 4. Prepare Shiprocket data
//     const shiprocketOrderData = {
//       order_id: orderRef.id,
//       order_date: dateOfOrder.toISOString(),
//       pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
//       billing_customer_name: address.name,
//       billing_address: address.flatDetails,
//       billing_address_2: address.landmark || "",
//       billing_city: address.townCity,
//       billing_pincode: address.pinCode,
//       billing_state: address.state,
//       billing_country: address.country,
//       billing_phone: sanitizedContactNo,
//       billing_email: userEmail,
//       order_items: validatedProducts.map((product) => ({
//         name: product.productDetails.name,
//         sku: product.productId,
//         units: product.quantity,
//         selling_price: product.productDetails.price,

//         // DOUBTFUL FIELDS
//         // weight: product.productDetails.weight || 0.5, // Default weight if not specified
//         // dimensions: product.productDetails.dimensions || {length: 10, width: 10, height: 10},
//       })),
//       payment_method: modeOfPayment === "cashOnDelivery" ? "COD" : "Prepaid",
//       sub_total: payableAmount,

//       // DOUBTFUL FIELDS
//       // length: 10, // Default package dimensions
//       // breadth: 10,
//       // height: 10,
//       // weight: 0.5,
//     };

//     // 5. Create Shiprocket order
//     const shiprocketResponse = await axios.post(
//         SHIPROCKET_API_URL,
//         shiprocketOrderData,
//         {
//           headers: {
//             "Authorization": `Bearer ${SHIPROCKET_API_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//         },
//     );

//     const {shipment_id, tracking_id} = shiprocketResponse.data;

//     // 6. Update order data with Shiprocket details
//     orderData.shiprocket = {
//       shipment_id,
//       tracking_id,
//       status: "created",
//     };

//     // 7. Prepare batch writes
//     batch.set(orderRef, orderData);
//     batch.set(userOrderRef, {orderId: orderRef.id, dateOfOrder});

//     // // Add products as subcollection
//     // const productsBatch = db.batch();
//     // validatedProducts.forEach((product, index) => {
//     //   const productRef = orderRef.collection("orderedProducts").doc();
//     //   productsBatch.set(productRef, product);
//     // });

//     // Save ordered products as subcollection
//     for (const product of orderedProducts) {
//       const productDoc = await db.collection("products").doc(product.productId).get();
//       if (productDoc.exists) {
//         const productRef = orderRef.collection("orderedProducts").doc();
//         batch.set(productRef, {
//           ...product,
//           productDetails: productDoc.data(),
//         });
//       }
//     }

//     // 8. Commit all changes
//     await batch.commit();
//     // await productsBatch.commit();

//     res.status(200).json({
//       message: "Order created successfully",
//       orderId: orderRef.id,
//       shiprocket: {shipment_id, tracking_id},
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);

//     // Attempt to clean up any created documents
//     // try {
//     //   await orderRef.delete();
//     //   await userOrderRef.delete();
//     // } catch (cleanupError) {
//     //   console.error("Cleanup failed:", cleanupError);
//     // }

//     res.status(500).json({
//       message: "Failed to create order",
//       error: error.message,
//     });
//   }
// });

module.exports = router;

//   try {
//     const userDoc = await db.collection("users").doc(uid).get();
//     const userEmail = userDoc.exists ? userDoc.data().email : null;

//     // 1. Create the order document in orders collection
//     const orderRef = db.collection("orders").doc();
//     const dateOfOrder = new Date();

//     const orderData = {
//       uid,
//       dateOfOrder,
//       userEmail,
//       couponCode,
//       address: {
//         areaDetails: address.areaDetails,
//         contactNo: address.contactNo,
//         country: address.country,
//         flatDetails: address.flatDetails,
//         isDefault: address.isDefault,
//         landmark: address.landmark,
//         name: address.name,
//         pinCode: address.pinCode,
//         state: address.state,
//         townCity: address.townCity,
//       },
//       totalAmount,
//       payableAmount,
//       discount,
//       lushioCurrencyUsed,
//       modeOfPayment,
//       // Conditional fields based on the mode of payment
//       ...(modeOfPayment === "razorpay" && {
//         razorpay_payment_id,
//         razorpay_order_id,
//         razorpay_signature,
//       }),
//       ...(modeOfPayment === "paypal" && {
//         paypal_order_id,
//         paypal_payment_id,
//         paypal_signature,
//       }),
//       ...(modeOfPayment === "phonepe" && {
//         phonepe_order_id,
//         phonepe_payment_id,
//         phonepe_signature,
//       }),
//       orderedProducts: orderedProducts.map((product) => ({
//         productId: product.productId,
//         color: product.color,
//         colorCode: product.colorCode,
//         heightType: product.heightType,
//         size: product.size,
//         quantity: product.quantity,
//       })),
//     };

//     await orderRef.set(orderData);

//     // 2. Save order ID in the user's subcollection of orders
//     const userOrderRef = db.collection("users").doc(uid).collection("orders").doc(orderRef.id);
//     await userOrderRef.set({orderId: orderRef.id, dateOfOrder});

//     // 3. Save ordered products as subcollection under the order document
//     const orderedProductsRef = orderRef.collection("orderedProducts");
//     for (const product of orderedProducts) {
//       const productDoc = await db.collection("products").doc(product.productId).get();

//       if (productDoc.exists) {
//         await orderedProductsRef.add({
//           ...product,
//           productDetails: productDoc.data(), // Including additional product details from products collection
//         });
//       }
//     }

//     // 4. Place Shiprocket order
//     const sanitizedContactNo = address.contactNo.startsWith("91") ? parseInt(address.contactNo.slice(2), 10) : parseInt(address.contactNo, 10);

//     const shiprocketOrderData = {
//       "order_id": orderRef.id,
//       "order_date": dateOfOrder.toISOString(),
//       "pickup_location": "Primary Location", // Shiprocket-specific pickup location name CHANGE IT

//       "shipping_is_billing": true,
//       "company_name": process.env.COMPANY_NAME,
//       "reseller_name": process.env.RESELLER_NAME,

//       "billing_customer_name": address.name,
//       "billing_address": address.flatDetails,
//       "billing_address_2": address.landmark,
//       "billing_city": address.townCity,
//       "billing_pincode": address.pinCode,
//       "billing_state": address.state,
//       "billing_country": address.country,
//       "billing_phone": sanitizedContactNo,
//       "order_items": orderedProducts.map((product) => ({
//         "name": product.productName,
//         "sku": product.productId,
//         "units": product.quantity,
//         "selling_price": product.price,
//       })),
//       "payment_method": modeOfPayment === "cashOnDelivery" ? "COD" : "Prepaid",
//       "sub_total": payableAmount,
//       ...(userEmail && {"billing_email": userEmail}), // Include email if it exists
//     };

//     try {
//       const shiprocketResponse = await axios.post(SHIPROCKET_API_URL, shiprocketOrderData, {
//         headers: {
//           "Authorization": `Bearer ${SHIPROCKET_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const {shipment_id, tracking_id} = shiprocketResponse.data;

//       // 5. Update Firestore order with Shiprocket shipment details
//       await orderRef.update({
//         shiprocket: {
//           shipment_id,
//           tracking_id,
//           status: "created",
//         },
//       });

//       res.status(200).json({
//         message: "Order created successfully",
//         orderId: orderRef.id,
//         shiprocket: {shipment_id, tracking_id},
//       });
//     } catch (shiprocketError) {
//       // Shiprocket API call failed
//       console.error("Shiprocket order creation failed:", shiprocketError);

//       // Delete the created order and user order reference
//       await orderRef.delete();
//       await userOrderRef.delete();

//       res.status(500).json({
//         message: "Order creation failed due to Shiprocket error. Order data has been rolled back.",
//         error: shiprocketError.message,
//       });
//     }
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({message: "Failed to create order", error});
//   }
// });

// module.exports = router;
