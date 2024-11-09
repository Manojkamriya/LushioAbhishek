/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("firebase-admin");
const db = admin.firestore();
const router = express.Router();

// Email regex pattern for basic validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Add a subscriber
router.post("/", async (req, res) => {
  try {
    const {uid, email} = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({error: "Missing required email field."});
    }

    // Check if email format is valid
    if (!emailRegex.test(email)) {
      return res.status(400).json({error: "Invalid email format."});
    }

    // Check if uid already exists (if uid is provided)
    if (uid) {
      const uidDoc = await db.collection("subscribers").doc(uid).get();
      if (uidDoc.exists) {
        return res.status(400).json({error: "User has already subscribed."});
      }
    }

    // Check if email already exists
    const emailQuery = await db.collection("subscribers").where("email", "==", email).get();
    if (!emailQuery.empty) {
      return res.status(400).json({error: "Email already exists."});
    }

    // Reference to the subscribers collection, with optional UID
    const subscriberRef = uid ? db.collection("subscribers").doc(uid) : db.collection("subscribers").doc();

    // Add the subscriber with the current date
    await subscriberRef.set({
      uid: uid || null,
      email,
      subscribedOn: new Date(),
    });

    return res.status(200).json({message: "Subscriber added successfully."});
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return res.status(500).json({error: "Failed to add subscriber."});
  }
});

module.exports = router;
