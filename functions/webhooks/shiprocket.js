/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();
const {getOrderStatus} = require("../routes/orders/statusDescription");

// Middleware to verify security token
const verifyToken = (req, res, next) => {
  const apiKey = req.header("x-api-key");

  // If token is configured but not provided or incorrect, reject the request
  if (process.env.WEBHOOK_TOKEN && apiKey !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({message: "Unauthorized"});
  }

  next();
};

// Webhook endpoint for Shiprocket status updates
router.post("/orderStatus", verifyToken, async (req, res) => {
  try {
    // Always respond with 200 as per specifications
    res.status(200).send();

    // Extract relevant data from webhook payload
    const {
      awb,
      order_id,
      sr_order_id,
      current_status,
      current_status_id,
      shipment_status,
      shipment_status_id,
      current_timestamp,
      scans,
    } = req.body;

    if (!order_id) {
      console.error("Order ID not provided in webhook payload");
      return;
    }

    // Find the order in our database
    const orderDoc = await db.collection("orders").doc(order_id).get();

    if (!orderDoc.exists) {
      console.error(`Order not found for order_id: ${order_id}`);
      return;
    }

    // Map the Shiprocket status to our application status
    const status = getOrderStatus(shipment_status_id);

    // Prepare update data
    const updateData = {
      "shiprocket.status_code": shipment_status_id,
      "shiprocket.status": shipment_status,
      "shiprocket.last_update": current_timestamp,
      "shiprocket.awb_code": awb,
      "shiprocket.sr_order_id": sr_order_id,
      "shiprocket.tracking_data": {
        current_status,
        current_status_id,
        shipment_status,
        shipment_status_id,
        current_timestamp,
        last_scan: scans && scans.length > 0 ? scans[scans.length - 1] : null,
      },
      status,
    };

    if (shipment_status_id === 7) {
      // Parse the timestamp string into a JavaScript Date object
      const dateParts = current_timestamp.split(" "); // ["23", "05", "2023", "11:43:52"]
      const [day, month, year, time] = dateParts;
      const timeParts = time.split(":"); // ["11", "43", "52"]
      const [hours, minutes, seconds] = timeParts;

      // JavaScript months are 0-indexed (0-11)
      const deliveredDate = new Date(year, month - 1, day, hours, minutes, seconds);
      updateData["deliveredOn"] = deliveredDate;

      // Get returnExchangeDays from admin controls collection
      try {
        const adminDoc = await db.collection("controls").doc("admin").get();
        if (adminDoc.exists) {
          const returnExchangeDays = adminDoc.data().returnExchangeDays || 7; // Default to 7 days if not specified

          // Calculate the expiration date by adding days to deliveredDate
          const expirationDate = new Date(deliveredDate);
          expirationDate.setDate(expirationDate.getDate() + returnExchangeDays);

          // Add the expiration date to updateData
          updateData["returnExchangeExpiresOn"] = expirationDate;
        }
      } catch (error) {
        console.error("Error getting admin document:", error);
      }
    }

    // If this is the first tracking update, store all scans
    if (scans && scans.length > 0) {
      updateData["shiprocket.scans"] = scans;
    }

    // Update the order document
    await db.collection("orders").doc(order_id).update(updateData);

    console.log(`Successfully updated order ${order_id} status to ${status} (Shiprocket: ${shipment_status})`);
  } catch (error) {
    console.error("Error processing webhook:", error);
    // We've already sent a 200 response to Shiprocket as required
  }
});

module.exports = router;
