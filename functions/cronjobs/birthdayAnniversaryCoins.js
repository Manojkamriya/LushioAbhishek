/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// Helper function to fetch dynamic control values (e.g., amount, message, expiry)
const getControlValues = async (type) => {
  const controlsRef = db.collection("controls").doc("admin");
  const controlDoc = await controlsRef.get();

  if (!controlDoc.exists) {
    console.error(`Control document for ${type} does not exist.`);
    throw new Error(`Control document for ${type} does not exist.`);
  }

  const data = controlDoc.data();
  return {
    amount: data[`${type}Coins`] || 100, // Default to 100 if not found
    message: data[`${type}Message`] || `${type} gift`, // Default message if not found
    expiryDays: data[`${type}Expiry`] || 30, // Default to 30 days expiry if not found
  };
};

// cron job for birthday coins on 1st of every month
const assignBirthdayCoins = functions.pubsub.schedule("0 0 1 * *").onRun(async (context) => {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Current month in 'MM' format

  try {
    const {amount, message, expiryDays} = await getControlValues("dob");
    const expiryDate = new Date();
    expiryDate.setDate(currentDate.getDate() + expiryDays); // Coins will expire after `expiryDays` days

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log("No users found.");
      return null;
    }

    // Loop through all users in the users collection
    snapshot.forEach(async (doc) => {
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
              amount: amount, // Using fetched amount
              message: message, // Using fetched message
              expiry: expiryDate,
            });

            console.log(`Coins added for user: ${doc.id}`);
          } catch (err) {
            console.error(`Error adding coins for user: ${doc.id} (DOB: ${userDOB})`, err);
          }
        }
      } else {
        console.warn(`Invalid or missing DOB for user: ${doc.id}`);
      }
    });

    console.log("Birthday coins assignment process completed.");
    return null;
  } catch (error) {
    console.error("Error assigning birthday coins: ", error);
    return null;
  }
});

// cron job for anniversary coins on 1st of every month
const assignAnniversaryCoins = functions.pubsub.schedule("0 0 1 * *").onRun(async (context) => {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Current month in 'MM' format

  try {
    const {amount, message, expiryDays} = await getControlValues("doa");
    const expiryDate = new Date();
    expiryDate.setDate(currentDate.getDate() + expiryDays); // Coins will expire after `expiryDays` days

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log("No users found.");
      return null;
    }

    // Loop through all users in the users collection
    snapshot.forEach(async (doc) => {
      const user = doc.data();
      const userDOA = user.doa; // Expected format: "YYYY-MM-DD"

      // Ensure DOA exists and is in the correct format
      if (userDOA && userDOA.length === 10) {
        const doaMonth = userDOA.substring(5, 7); // Extracting the birth month 'MM'

        // Check if the current month matches the user's birth month
        if (doaMonth === currentMonth) {
          const coinsRef = usersRef.doc(doc.id).collection("coins");

          try {
            // Add a new document to the user's coins subcollection
            await coinsRef.add({
              amount: amount, // Using fetched amount
              message: message, // Using fetched message
              expiry: expiryDate,
            });

            console.log(`Coins added for user: ${doc.id}`);
          } catch (err) {
            console.error(`Error adding coins for user: ${doc.id} (DOA: ${userDOA})`, err);
          }
        }
      } else {
        console.warn(`Invalid or missing DOA for user: ${doc.id}`);
      }
    });

    console.log("Anniversary coins assignment process completed.");
    return null;
  } catch (error) {
    console.error("Error assigning anniversary coins: ", error);
    return null;
  }
});

module.exports = {assignBirthdayCoins, assignAnniversaryCoins};
