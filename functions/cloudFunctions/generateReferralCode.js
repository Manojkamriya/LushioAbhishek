/* eslint-disable max-len */
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

// Initialize Firestore
const db = getFirestore();

const generateReferralCode = onDocumentCreated(
    {document: "users/{userId}"},
    async (event) => {
      const snap = event.data;
      const userId = event.params.userId;
      const userData = snap.data();

      // Skip if referral code already exists
      if (userData.referralCode) return;

      try {
        let referralCode = `lush-${userId.slice(-5)}`;

        // Check for duplicates
        const duplicateCheck = await db.collection("users")
            .where("referralCode", "==", referralCode)
            .get();

        if (!duplicateCheck.empty) {
        // In case of duplicate, append a random char
          const extraChar = Math.random().toString(36).substring(7, 8);
          referralCode = `${referralCode}-${extraChar}`;
        }

        await db.collection("users").doc(userId).update({
          referralCode,
          referralCodeGeneratedAt: FieldValue.serverTimestamp(),
        });

        logger.log(`Generated referral code ${referralCode} for user ${userId}`);
      } catch (error) {
        logger.error("Error generating referral code:", error);

        // Log error to separate collection for monitoring
        await db.collection("errors").add({
          type: "referral_generation",
          userId,
          error: error.message,
          timestamp: FieldValue.serverTimestamp(),
        });
      }
    },
);

module.exports = generateReferralCode;
