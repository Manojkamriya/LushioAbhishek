/* eslint-disable max-len */
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {getFirestore} = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

// Firestore instance
const db = getFirestore();

// Helper function to fetch dynamic control values (e.g., amount, message, expiry)
const getControlValues = async (type) => {
  const controlsRef = db.collection("controls").doc("admin");
  const controlDoc = await controlsRef.get();

  if (!controlDoc.exists) {
    logger.error(`Control document for ${type} does not exist.`);
    throw new Error(`Control document for ${type} does not exist.`);
  }

  const data = controlDoc.data();
  return {
    amount: data[`${type}Coins`] || 100, // Default to 100 if not found
    message: data[`${type}Message`] || `${type} gift`, // Default message if not found
    expiryDays: data[`${type}Expiry`] || 30, // Default to 30 days expiry if not found
  };
};

// Cron job for birthday coins on the 1st of every month
const assignBirthdayCoins = onSchedule("0 0 1 * *", async () => {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Current month in 'MM' format

  try {
    const {amount, message, expiryDays} = await getControlValues("dob");
    const expiryDate = new Date();
    expiryDate.setDate(currentDate.getDate() + expiryDays); // Coins will expire after `expiryDays` days

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      logger.log("No users found.");
      return;
    }

    // Loop through all users in the users collection
    const promises = snapshot.docs.map(async (doc) => {
      const user = doc.data();
      const userDOB = user.dob; // Expected format: "YYYY-MM-DD"

      // Ensure DOB exists and is in the correct format
      if (userDOB && userDOB.length === 10) {
        const dobMonth = userDOB.substring(5, 7); // Extracting the birth month 'MM'

        // Check if the current month matches the user's birth month
        if (dobMonth === currentMonth) {
          const coinsRef = usersRef.doc(doc.id).collection("coins");

          try {
            // Add a new document to the user's coins subcollection
            await coinsRef.add({
              amount: amount,
              amountLeft: amount,
              message: message,
              expiresOn: expiryDate,
              createdAt: currentDate,
              isExpired: false,
              isUsed: false,
            });

            logger.log(`Coins added for user: ${doc.id}`);
          } catch (err) {
            logger.error(`Error adding coins for user: ${doc.id} (DOB: ${userDOB})`, err);
          }
        }
      } else {
        logger.warn(`Invalid or missing DOB for user: ${doc.id}`);
      }
    });

    await Promise.all(promises);
    logger.log("Birthday coins assignment process completed.");
  } catch (error) {
    logger.error("Error assigning birthday coins: ", error);
  }
});

// Cron job for anniversary coins on the 1st of every month
const assignAnniversaryCoins = onSchedule("0 0 1 * *", async () => {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Current month in 'MM' format

  try {
    const {amount, message, expiryDays} = await getControlValues("doa");
    const expiryDate = new Date();
    expiryDate.setDate(currentDate.getDate() + expiryDays); // Coins will expire after `expiryDays` days

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      logger.log("No users found.");
      return;
    }

    // Loop through all users in the users collection
    const promises = snapshot.docs.map(async (doc) => {
      const user = doc.data();
      const userDOA = user.doa; // Expected format: "YYYY-MM-DD"

      // Ensure DOA exists and is in the correct format
      if (userDOA && userDOA.length === 10) {
        const doaMonth = userDOA.substring(5, 7); // Extracting the anniversary month 'MM'

        // Check if the current month matches the user's anniversary month
        if (doaMonth === currentMonth) {
          const coinsRef = usersRef.doc(doc.id).collection("coins");

          try {
            // Add a new document to the user's coins subcollection
            await coinsRef.add({
              amount: amount,
              amountLeft: amount,
              message: message,
              expiresOn: expiryDate,
              createdAt: currentDate,
              isExpired: false,
              isUsed: false,
            });

            logger.log(`Coins added for user: ${doc.id}`);
          } catch (err) {
            logger.error(`Error adding coins for user: ${doc.id} (DOA: ${userDOA})`, err);
          }
        }
      } else {
        logger.warn(`Invalid or missing DOA for user: ${doc.id}`);
      }
    });

    await Promise.all(promises);
    logger.log("Anniversary coins assignment process completed.");
  } catch (error) {
    logger.error("Error assigning anniversary coins: ", error);
  }
});

module.exports = {assignBirthdayCoins, assignAnniversaryCoins};
