/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();
const router = express.Router();
const logger = require("firebase-functions/logger");

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
    const lushioCash = Number(userData.lushioCash) || 0; // Default to 0 if cash doesn't exist

    // Fetch the user's coins subcollection
    const coinsSnapshot = await db.collection("users").doc(userId).collection("coins").get();
    let lushioCoins = 0;

    coinsSnapshot.forEach((doc) => {
      const coinData = doc.data();
      if (!coinData.lushioCash && coinData.isExpired && coinData.amountLeft <= 0) {
        return; // Skip expired coins
      }
      lushioCoins += Number(coinData.amountLeft) || 0; // Add the amount from each document
    });

    const totalCredits = lushioCoins + lushioCash; // Sum of coins and cash

    // Return the totals in the response
    res.status(200).json({
      lushioCoins,
      lushioCash,
      totalCredits,
    });
  } catch (error) {
    logger.error("Error fetching user credits: ", error);
    res.status(500).json({error: "Internal server error"});
  }
});

// Route to send coins to all users
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
    logger.log("Fetching users from database...");
    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      logger.log("No users found in database");
      return res.status(404).json({error: "No users found in database"});
    }

    logger.log(`Found ${usersSnapshot.size} users`);

    const batch = db.batch();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + numericDays);

    usersSnapshot.forEach((userDoc) => {
      const userId = userDoc.id;
      const newCoinRef = db.collection("users").doc(userId).collection("coins").doc();

      batch.set(newCoinRef, {
        amount: numericAmount,
        amountLeft: numericAmount,
        message: message,
        expiresOn: expirationDate,
        createdAt: new Date(),
        isExpired: false,
      });
    });

    logger.log("Committing batch write...");
    await batch.commit();
    logger.log("Batch write successful");

    res.status(200).json({
      message: `Successfully sent ${numericAmount} coins to ${usersSnapshot.size} users`,
      usersAffected: usersSnapshot.size,
    });
  } catch (error) {
    logger.error("Detailed error in /send route:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      code: error.code,
    });
  }
});

/*
  ***********
  ** TODOS **
  ***********

  *** Route to send coins to  specific user (admin will give emails or phone numbers of users)
  * Request body should contain the following:
  * - emails or phone number (the admin type the values of uploads a csv file)
  * - amount: The amount of coins to send
  * - days: The number of days until the coins expire
  * - message: The message to attach to the coins

  *** Route to send coins to active users
  * need to think how to do this

  *** Route to send coins to users who ordered between a specific date range
  ** Logic - get all the orders between the date range and get the users from the orders and send coins to them.
              (order should not be a cancelled order and return period should have ended.)
              cancellationDate should not exist or be null
              returnExchangeExpiresOn -> How is this field comming since we dont get a realtime update of delivery from shiprocket.
  * Request body should contain the following:
  * - startDate: The start date of the range
  * - endDate: The end date of the range
  * - amount: The amount of coins to send
  * - days: The number of days until the coins expire
  * - message: The message to attach to the coins
*/


// Route to consume coins and cash
router.post("/consume", async (req, res) => {
  try {
    const {uid, coinsToConsume, oid, orderAmount} = req.body;

    // Input validation
    if (!uid || !coinsToConsume || !oid || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Start a transaction to ensure data consistency
    const result = await db.runTransaction(async (transaction) => {
      let remainingCoinsToConsume = coinsToConsume;
      const consumptionDetails = [];

      // Get user document reference
      const userRef = db.collection("users").doc(uid);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      // Get coins subcollection
      const coinsQuery = await userRef
          .collection("coins")
          .orderBy("expiresOn", "asc")
          .get();

      // Process each coin document
      for (const coinDoc of coinsQuery.docs) {
        const coinData = coinDoc.data();

        // Skip if coin is expired or has no amount left
        if (coinData.isExpired || coinData.amountLeft <= 0) {
          continue;
        }

        const coinRef = userRef.collection("coins").doc(coinDoc.id);

        if (remainingCoinsToConsume > 0) {
          const consumableAmount = Math.min(coinData.amountLeft, remainingCoinsToConsume);

          // Update coin document
          transaction.update(coinRef, {
            amountLeft: coinData.amountLeft - consumableAmount,
            orders: [...(coinData.orders || []), {
              oid,
              consumedAmount: consumableAmount,
              orderAmount,
              consumedAt: new Date(),
            }],
          });

          remainingCoinsToConsume -= consumableAmount;
          consumptionDetails.push({
            coinId: coinDoc.id,
            consumedAmount: consumableAmount,
          });
        }
      }

      // If there are still coins to consume, use lushioCash
      if (remainingCoinsToConsume > 0) {
        const userData = userDoc.data();
        const availableCash = userData.lushioCash || 0;

        if (availableCash < remainingCoinsToConsume) {
          throw new Error("Insufficient funds");
        }

        // Update user's lushioCash
        transaction.update(userRef, {
          lushioCash: availableCash - remainingCoinsToConsume,
        });

        // Create a new document in coins subcollection for lushioCash transaction
        const lushioCashTransactionRef = userRef.collection("coins").doc();
        transaction.create(lushioCashTransactionRef, {
          lushioCash: true,
          cashUsed: remainingCoinsToConsume,
          oid,
          orderAmount,
          createdAt: new Date(),
        });

        consumptionDetails.push({
          type: "lushioCash",
          consumedAmount: remainingCoinsToConsume,
        });
      }

      return {
        success: true,
        consumptionDetails,
        totalConsumed: coinsToConsume,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error consuming coins:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error processing coin consumption",
    });
  }
});

module.exports = router;
