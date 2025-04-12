/* eslint-disable max-len */
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

// Initialize Firestore
const db = getFirestore();

const coinsToReferrer = onDocumentUpdated(
    {document: "orders/{orderId}"},
    async (event) => {
      const beforeData = event.data.before.data();
      const afterData = event.data.after.data();

      // Check if this is the status update we care about (order completed)
      if (beforeData.status !== "completed" && afterData.status === "completed") {
        const userId = afterData.userId;

        // Get user data
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) return;

        const userData = userDoc.data();

        // Check if user was referred and this is their first completed order
        if (userData.referringUserId) {
          // Check if this is their first completed order
          const previousOrders = await db.collection("orders")
              .where("uid", "==", userId)
              .where("status", "==", "completed")
              .orderBy("dateOfOrder", "asc")
              .limit(2)
              .get();

          // If this is their first completed order
          if (previousOrders.size === 1 && previousOrders.docs[0].id === event.params.orderId) {
            // Get admin controls for reward amount
            const adminDoc = await db.collection("controls").doc("admin").get();
            if (!adminDoc.exists) return;

            const adminData = adminDoc.data();
            const {referrerCoins, referrerExpiry, referrerMessage} = adminData;

            if (!referrerCoins) return;

            // Calculate expiration date
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + referrerExpiry);

            // Create coins for the referrer
            const referrerCoinsRef = db.collection("users")
                .doc(userData.referringUserId)
                .collection("coins")
                .doc();

            const coinsData = {
              amount: referrerCoins,
              amountLeft: referrerCoins,
              message: referrerMessage || `Reward for referring ${userData.name || userId}`,
              expiresOn: expirationDate,
              createdAt: FieldValue.serverTimestamp(),
              isExpired: false,
              referredUser: userId,
            };

            await referrerCoinsRef.set(coinsData);

            logger.log(`Added ${referrerCoins} coins to referrer ${userData.referringUserId} for first order by ${userId}`);
          }
        }
      }
    },
);

module.exports = coinsToReferrer;
