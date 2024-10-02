/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// cron job for birthday coins on 1st of every month
const assignBirthdayCoins = functions.pubsub.schedule("0 0 1 * *").onRun(async (context) => {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Current month in 'MM' format
  const expiryDate = new Date();
  expiryDate.setDate(currentDate.getDate() + 30); // Coins will expire after 30 days

  try {
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
              amount: 100, // Adjust the amount as needed
              message: "Birthday gift",
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
  const expiryDate = new Date();
  expiryDate.setDate(currentDate.getDate() + 30); // Coins will expire after 30 days

  try {
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

      // Ensure DOB exists and is in the correct format
      if (userDOA && userDOA.length === 10) {
        const dobMonth = userDOA.substring(5, 7); // Extracting the birth month 'MM'

        // Check if the current month matches the user's birth month
        if (dobMonth === currentMonth) {
          const coinsRef = usersRef.doc(doc.id).collection("coins");

          try {
            // Add a new document to the user's coins subcollection
            await coinsRef.add({
              amount: 100, // Adjust the amount as needed
              message: "Anniversary gift",
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
