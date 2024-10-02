/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const admin = require("firebase-admin");
const db = admin.firestore();
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

module.exports = router;
