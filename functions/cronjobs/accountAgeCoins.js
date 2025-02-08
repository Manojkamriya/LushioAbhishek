/* eslint-disable max-len */
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {getFirestore} = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

// Cloud Function to assign coins based on account age
const assignAccountAgeCoins = onSchedule("every day 00:00", async (event) => {
  const db = getFirestore();
  const currentDate = new Date();

  try {
    const adminControlsDoc = await db.collection("controls").doc("admin").get();
    const adminControls = adminControlsDoc.data();

    if (!adminControls || !adminControls.engine) {
      logger.log("Coin assignment is turned off or admin controls not found.");
      return;
    }

    const {coinSettings} = adminControls;

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    const processUserPromises = snapshot.docs.map(async (doc) => {
      const user = doc.data();
      const createdOn = user.createdAt;

      if (createdOn) {
        const accountCreationDate = new Date(createdOn._seconds * 1000);
        const diffInMs = currentDate - accountCreationDate;
        const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30);
        const diffInYears = diffInMonths / 12;

        const coinsRef = usersRef.doc(doc.id).collection("coins");
        const milestoneTrackerRef = usersRef.doc(doc.id).collection("milestone_tracker");

        const milestones = [
          {name: "oneMonth", condition: Math.floor(diffInMonths) === 1},
          {name: "oneYear", condition: Math.floor(diffInYears) === 1},
          {name: "twoYears", condition: Math.floor(diffInYears) === 2},
          {name: "fiveYears", condition: Math.floor(diffInYears) === 5},
        ];

        for (const milestone of milestones) {
          if (milestone.condition) {
            const milestoneDoc = await milestoneTrackerRef.doc(milestone.name).get();

            if (!milestoneDoc.exists) {
              const settings = coinSettings[milestone.name];
              const expiryDate = new Date(currentDate.getTime() + settings.expiry * 24 * 60 * 60 * 1000);

              await coinsRef.add({
                amount: settings.coins,
                amountLeft: settings.coins,
                message: settings.message,
                expiresOn: expiryDate,
                createdAt: currentDate,
                isExpired: false,
              });

              await milestoneTrackerRef.doc(milestone.name).set({
                assignedAt: currentDate,
                coins: settings.coins,
              });

              logger.log(`${milestone.name} coins added for user: ${doc.id}`);
            }
          }
        }
      }
    });

    await Promise.all(processUserPromises);

    logger.log("Account age coins assigned to users.");
  } catch (error) {
    logger.error("Error assigning account age coins: ", error);
  }
});

module.exports = assignAccountAgeCoins;
