/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
// const admin = require("firebase-admin");
// const db = admin.firestore();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();
const router = express.Router();

// Route to get the total coins and cash for a user
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch the user's main document
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    const userData = userDoc.data();
    const lushioCash = userData.lushioCash || 0; // Default to 0 if cash doesn't exist

    // Fetch the user's coins subcollection
    const coinsSnapshot = await db.collection("users").doc(userId).collection("coins").get();
    let lushioCoins = 0;

    coinsSnapshot.forEach((doc) => {
      const coinData = doc.data();
      lushioCoins += coinData.amount || 0; // Add the amount from each document
    });

    const totalCredits = lushioCoins + lushioCash; // Sum of coins and cash

    // Return the totals in the response
    res.status(200).json({
      lushioCoins,
      lushioCash,
      totalCredits,
    });
  } catch (error) {
    console.error("Error fetching user credits: ", error);
    res.status(500).json({error: "Internal server error"});
  }
});

router.post("/send", async (req, res) => {
  const {amount, days, message} = req.body;

  if (!amount || !days || !message) {
    return res.status(400).json({
      error: "Missing required parameters",
      received: {amount, days, message},
    });
  }

  // Validate input types
  const numericAmount = Number(amount);
  const numericDays = Number(days);

  if (isNaN(numericAmount) || isNaN(numericDays)) {
    return res.status(400).json({
      error: "Invalid parameters",
      details: "Amount and days must be valid numbers",
    });
  }


  try {
    // Get all users
    console.log("Fetching users from database...");
    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      console.log("No users found in database");
      return res.status(404).json({error: "No users found in database"});
    }

    console.log(`Found ${usersSnapshot.size} users`);

    const batch = db.batch();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + numericDays);

    usersSnapshot.forEach((userDoc) => {
      const userId = userDoc.id;
      const newCoinRef = db.collection("users").doc(userId).collection("coins").doc();

      batch.set(newCoinRef, {
        amount: numericAmount,
        expiry: expirationDate,
        message: message,
      });
    });

    console.log("Committing batch write...");
    await batch.commit();
    console.log("Batch write successful");

    res.status(200).json({
      message: `Successfully sent ${numericAmount} coins to ${usersSnapshot.size} users`,
      usersAffected: usersSnapshot.size,
    });
  } catch (error) {
    console.error("Detailed error in /send route:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      code: error.code,
    });
  }
});

module.exports = router;
