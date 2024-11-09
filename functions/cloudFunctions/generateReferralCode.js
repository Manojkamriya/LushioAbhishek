/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const generateReferralCode = functions.firestore
    .document("users/{userId}")
    .onCreate(async (snap, context) => {
      const userId = context.params.userId;
      const userData = snap.data();

      // Skip if referral code already exists
      if (userData.referralCode) return null;

      try {
        let referralCode = `lush-${userId.slice(-5)}`;

        // Check for duplicates
        const duplicateCheck = await admin.firestore()
            .collection("users")
            .where("referralCode", "==", referralCode)
            .get();

        if (!duplicateCheck.empty) {
          // In case of duplicate, append a random char
          const extraChar = Math.random().toString(36).substring(7, 8);
          referralCode = `${referralCode}-${extraChar}`;
        }

        await snap.ref.update({
          referralCode,
          referralCodeGeneratedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Generated referral code ${referralCode} for user ${userId}`);
        return null;
      } catch (error) {
        console.error("Error generating referral code:", error);

        // Log error to separate collection for monitoring
        await admin.firestore()
            .collection("errors")
            .add({
              type: "referral_generation",
              userId,
              error: error.message,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

        return null;
      }
    });

module.exports = generateReferralCode;
