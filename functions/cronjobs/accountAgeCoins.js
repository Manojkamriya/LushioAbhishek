/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// Cloud Function to assign coins based on account age (1 month, 1 year, 2 years, 5 years)
const assignAccountAgeCoins = functions.pubsub.schedule("0 0 * * *").onRun(async (context) => {
  const currentDate = new Date();

  try {
    // Fetch admin controls
    const adminControlsDoc = await db.collection("controls").doc("admin").get();
    const adminControls = adminControlsDoc.data();

    if (!adminControls || !adminControls.engine) {
      console.log("Coin assignment is turned off or admin controls not found.");
      return null;
    }

    const {coinSettings} = adminControls;

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

        const milestones = [
          {name: "oneMonth", condition: Math.floor(diffInMonths) === 1},
          {name: "oneYear", condition: Math.floor(diffInYears) === 1},
          {name: "twoYears", condition: Math.floor(diffInYears) === 2},
          {name: "fiveYears", condition: Math.floor(diffInYears) === 5},
        ];

        for (const milestone of milestones) {
          if (milestone.condition) {
            const settings = coinSettings[milestone.name];
            const expiryDate = new Date(currentDate.getTime() + settings.expiry * 24 * 60 * 60 * 1000);

            await coinsRef.add({
              amount: settings.coins,
              message: settings.message,
              expiry: expiryDate,
            });
            console.log(`${milestone.name} coins added for user: ${doc.id}`);
          }
        }
      }
    });

    console.log("Account age coins assigned to users.");
  } catch (error) {
    console.error("Error assigning account age coins: ", error);
  }
});

module.exports = {assignAccountAgeCoins};
