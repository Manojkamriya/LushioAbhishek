/* eslint-disable max-len */
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {getFirestore} = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

// Firestore instance
const db = getFirestore();

// Cloud Function to mark expired coins daily
const updateExpiredCoins = onSchedule("0 0 * * *", async () => {
  const currentDate = new Date(); // Current date
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
        const expiryDate = coinData.expiresOn?.toDate();

        // the coins are expired if the expiry date is in the past and the coin is not already marked as expired
        if (expiryDate && expiryDate < currentDate && !coinData.isExpired) {
          logger.log(`Marking coin as expired for user: ${userId}, coin ID: ${coinDoc.id}`);
          await coinDoc.ref.update({
            isExpired: true,
          });
        }
      });

      await Promise.all(coinPromises);
    });

    await Promise.all(promises);
    logger.log("Expired coins updated successfully.");
  } catch (error) {
    logger.error("Error updating expired coins: ", error);
  }
});

module.exports = updateExpiredCoins;
