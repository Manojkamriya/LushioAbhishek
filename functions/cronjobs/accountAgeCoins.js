/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// Cloud Function to assign coins based on account age (1 month, 1 year, 2 years, 5 years)
const assignAccountAgeCoins = functions.pubsub.schedule("0 0 * * *").onRun(async (context) => {
  const currentDate = new Date();

  // Coin amounts for different milestones
  const coinsForMilestones = {
    oneMonth: 50, // Hardcoded amounts for now
    oneYear: 100,
    twoYears: 200,
    fiveYears: 500,
  };

  const expiryDate = new Date();
  expiryDate.setDate(currentDate.getDate() + 30); // Coins expire in 30 days

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    snapshot.forEach(async (doc) => {
      const user = doc.data();
      const createdOn = user.createdAt;

      if (createdOn) {
        const accountCreationDate = new Date(createdOn._seconds * 1000); // Firestore timestamp to JS Date
        const diffInMs = currentDate - accountCreationDate;
        const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30); // Difference in months
        const diffInYears = diffInMonths / 12; // Difference in years

        const coinsRef = usersRef.doc(doc.id).collection("coins");

        // Check if the account has reached certain milestones
        if (Math.floor(diffInMonths) === 1) {
          // Add coins for 1-month-old account
          await coinsRef.add({
            amount: coinsForMilestones.oneMonth,
            message: "1 Month Account Anniversary",
            expiry: expiryDate,
          });
          console.log(`1 month coins added for user: ${doc.id}`);
        }

        if (Math.floor(diffInYears) === 1) {
          // Add coins for 1-year-old account
          await coinsRef.add({
            amount: coinsForMilestones.oneYear,
            message: "1 Year Account Anniversary",
            expiry: expiryDate,
          });
          console.log(`1 year coins added for user: ${doc.id}`);
        }

        if (Math.floor(diffInYears) === 2) {
          // Add coins for 2-year-old account
          await coinsRef.add({
            amount: coinsForMilestones.twoYears,
            message: "2 Years Account Anniversary",
            expiry: expiryDate,
          });
          console.log(`2 year coins added for user: ${doc.id}`);
        }

        if (Math.floor(diffInYears) === 5) {
          // Add coins for 5-year-old account
          await coinsRef.add({
            amount: coinsForMilestones.fiveYears,
            message: "5 Years Account Anniversary",
            expiry: expiryDate,
          });
          console.log(`5 year coins added for user: ${doc.id}`);
        }
      }
    });

    console.log("Account age coins assigned to users.");
  } catch (error) {
    console.error("Error assigning account age coins: ", error);
  }
});

module.exports = {assignAccountAgeCoins};
