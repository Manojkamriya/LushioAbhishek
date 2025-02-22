/* eslint-disable max-len */
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

// Initialize Firestore
const db = getFirestore();

const coinsToReferred = onDocumentCreated(
    {document: "users/{userId}"},
    async (event) => {
      const snap = event.data;
      if (!snap) {
        logger.error("No data associated with event");
        return;
      }

      const userId = event.params.userId;
      const userData = snap.data();

      // Skip if no referral code is provided
      if (!userData?.referredBy) {
        logger.info(`No referredBy field for user ${userId}`);
        return;
      }

      try {
        // Verify the referring user exists
        const referringUserSnap = await db.collection("users")
            .where("referralCode", "==", userData.referredBy)
            .limit(1)
            .get();

        if (referringUserSnap.empty) {
          logger.warn(`Invalid referral code used: ${userData.referredBy}`);
          return;
        }

        const referringUser = referringUserSnap.docs[0];

        // Get admin controls
        const adminDoc = await db.collection("controls").doc("admin").get();

        if (!adminDoc.exists) {
          logger.error("Admin controls document does not exist");
          return;
        }

        const adminData = adminDoc.data();

        if (!adminData?.referredCoins || !adminData?.referredExpiry || !adminData?.referredMessage) {
          logger.error("Missing required admin control fields");
          return;
        }

        const {referredCoins, referredExpiry, referredMessage} = adminData;

        // Calculate expiration date
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + referredExpiry);

        // Create coins document in user's subcollection
        const coinsRef = db.collection("users")
            .doc(userId)
            .collection("coins")
            .doc();

        const coinsData = {
          amount: referredCoins,
          amountLeft: referredCoins,
          message: referredMessage,
          expiresOn: expirationDate,
          createdAt: FieldValue.serverTimestamp(),
          isExpired: false,
          referringUser: referringUser.id,
        };

        await coinsRef.set(coinsData);

        logger.log(`Added ${referredCoins} coins for referred user ${userId} (referred by ${referringUser.id})`);
      } catch (error) {
        logger.error("Error adding referral coins:", error.message);
        // Re-throw the error so Cloud Functions logs it properly
        throw error;
      }
    },
);

module.exports = coinsToReferred;
