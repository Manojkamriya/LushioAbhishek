/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// Cloud Function to remove expired coins daily
const removeExpiredCoins = functions.pubsub.schedule("0 0 * * *").onRun(async (context) => {
  const currentDate = new Date(); // Current date
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log("No users found.");
      return;
    }

    snapshot.forEach(async (doc) => {
      const userId = doc.id;
      const coinsRef = usersRef.doc(userId).collection("coins");
      const coinsSnapshot = await coinsRef.get();

      if (coinsSnapshot.empty) {
        console.log(`No coins found for user: ${userId}`);
        return;
      }

      coinsSnapshot.forEach(async (coinDoc) => {
        const coinData = coinDoc.data();
        const expiryTimestamp = coinData.expiry;

        if (expiryTimestamp && expiryTimestamp.toDate() < currentDate) {
          console.log(`Removing expired coin for user: ${userId}, coin ID: ${coinDoc.id}`);
          await coinDoc.ref.delete();
        }
      });
    });

    console.log("Expired coins removed successfully.");
  } catch (error) {
    console.error("Error removing expired coins: ", error);
  }
});

module.exports = {removeExpiredCoins};
