/* eslint-disable max-len */
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

// Firestore instance
const db = getFirestore();

// Cloud Function to remove expired coins daily
const removeExpiredCoins = onSchedule("0 0 * * *", async () => {
  const currentDate = FieldValue.serverTimestamp(); // Current date
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      logger.log("No users found.");
      return;
    }

    const promises = snapshot.docs.map(async (doc) => {
      const userId = doc.id;
      const coinsRef = usersRef.doc(userId).collection("coins");
      const coinsSnapshot = await coinsRef.get();

      if (coinsSnapshot.empty) {
        logger.log(`No coins found for user: ${userId}`);
        return;
      }

      const coinPromises = coinsSnapshot.docs.map(async (coinDoc) => {
        const coinData = coinDoc.data();
        const expiryTimestamp = coinData.expiry;

        if (expiryTimestamp && expiryTimestamp.toDate() < currentDate) {
          logger.log(`Removing expired coin for user: ${userId}, coin ID: ${coinDoc.id}`);
          await coinDoc.ref.delete();
        }
      });

      await Promise.all(coinPromises);
    });

    await Promise.all(promises);
    logger.log("Expired coins removed successfully.");
  } catch (error) {
    logger.error("Error removing expired coins: ", error);
  }
});

module.exports = removeExpiredCoins;
