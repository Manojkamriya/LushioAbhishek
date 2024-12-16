/* eslint-disable max-len */
const {onUserCreate} = require("firebase-functions/v2/auth");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");
const logger = require("firebase-functions/logger");

const db = getFirestore();
const auth = getAuth();

const checkDuplicateUser = onUserCreate(async (user) => {
  const {email, phoneNumber, uid} = user;

  try {
    // Check for duplicates in Firestore
    let isDuplicate = false;

    if (email) {
      const emailQuery = await db.collection("users").where("email", "==", email).get();
      if (!emailQuery.empty) {
        isDuplicate = true;
        logger.log(`Duplicate email found: ${email}`);
      }
    }

    if (phoneNumber) {
      const phoneQuery = await db.collection("users").where("phoneNumber", "==", phoneNumber).get();
      if (!phoneQuery.empty) {
        isDuplicate = true;
        logger.log(`Duplicate phone number found: ${phoneNumber}`);
      }
    }

    if (isDuplicate) {
      // Delete the newly created Firebase Auth user
      await auth.deleteUser(uid);
      logger.log(`New user with UID ${uid} deleted due to duplicate.`);

      // Also delete the Firestore document if it exists
      const userDoc = await db.collection("users").doc(uid).get();
      if (userDoc.exists) {
        await db.collection("users").doc(uid).delete();
        logger.log(`Firestore document for UID ${uid} deleted due to duplicate.`);
      }

      return;
    }

    // No duplicates found, add user details to Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      await db.collection("users").doc(uid).set({
        uid,
        email: email || null,
        phoneNumber: phoneNumber || null,
        createdAt: FieldValue.serverTimestamp(),
        cloudFunctionVerified: true,
      });
      logger.log("User added to Firestore.");
    } else {
      await db.collection("users").doc(uid).update({
        cloudFunctionVerified: true,
      });
      logger.log("cloudFunctionVerified field appended to existing Firestore document.");
    }

    logger.log("User successfully validated and added to Firestore.");
  } catch (error) {
    logger.error("Error validating user:", error);
  }
});

module.exports = {checkDuplicateUser};


// /* eslint-disable max-len */
// const {getFirestore, FieldValue} = require("firebase-admin/firestore");
// const {getAuth} = require("firebase-admin/auth");

// const db = getFirestore();
// const auth = getAuth();

// const checkDuplicateUser = async (user) => {
//   const {email, phoneNumber, uid} = user;

//   try {
//     // Check for duplicates in Firestore
//     let isDuplicate = false;

//     if (email) {
//       const emailQuery = await db.collection("users").where("email", "==", email).get();
//       if (!emailQuery.empty) {
//         isDuplicate = true;
//         console.log(`Duplicate email found: ${email}`);
//       }
//     }

//     if (phoneNumber) {
//       const phoneQuery = await db.collection("users").where("phoneNumber", "==", phoneNumber).get();
//       if (!phoneQuery.empty) {
//         isDuplicate = true;
//         console.log(`Duplicate phone number found: ${phoneNumber}`);
//       }
//     }

//     if (isDuplicate) {
//       // Delete the newly created Firebase Auth user
//       await auth.deleteUser(uid);
//       console.log(`New user with UID ${uid} deleted due to duplicate.`);
//       return;
//     }

//     // No duplicates found, add user details to Firestore
//     const userDoc = await db.collection("users").doc(uid).get();
//     if (!userDoc.exists) {
//       await db.collection("users").doc(uid).set({
//         uid,
//         email: email || null,
//         phoneNumber: phoneNumber || null,
//         createdAt: FieldValue.serverTimestamp(),
//         cloudFunctionVerified: true,
//       });
//       console.log("User added to Firestore.");
//     } else {
//       await db.collection("users").doc(uid).update({
//         cloudFunctionVerified: true,
//       });
//       console.log("cloudFunctionVerified field appended to existing Firestore document.");
//     }

//     console.log("User successfully validated and added to Firestore.");
//   } catch (error) {
//     console.error("Error validating user:", error);
//   }
// };

// module.exports = checkDuplicateUser;


// // /* eslint-disable max-len */
// // const admin = require("firebase-admin");

// // const db = admin.firestore();

// // const checkDuplicateUser = async (user) => {
// //   const {email, phoneNumber, uid} = user;

// //   try {
// //     // Check for duplicates in Firestore
// //     let isDuplicate = false;

// //     if (email) {
// //       const emailQuery = await db.collection("users").where("email", "==", email).get();
// //       if (!emailQuery.empty) {
// //         isDuplicate = true;
// //         console.log(`Duplicate email found: ${email}`);
// //       }
// //     }

// //     if (phoneNumber) {
// //       const phoneQuery = await db.collection("users").where("phoneNumber", "==", phoneNumber).get();
// //       if (!phoneQuery.empty) {
// //         isDuplicate = true;
// //         console.log(`Duplicate phone number found: ${phoneNumber}`);
// //       }
// //     }

// //     if (isDuplicate) {
// //       // Delete the newly created Firebase Auth user
// //       await admin.auth().deleteUser(uid);
// //       console.log(`New user with UID ${uid} deleted due to duplicate.`);
// //       return;
// //     }

// //     // No duplicates found, add user details to Firestore
// //     const userDoc = await db.collection("users").doc(uid).get();
// //     if (!userDoc.exists) {
// //       await db.collection("users").doc(uid).set({
// //         uid,
// //         email: email || null,
// //         phoneNumber: phoneNumber || null,
// //         createdAt: admin.firestore.FieldValue.serverTimestamp(),
// //         cloudFunctionVerified: true,
// //       });
// //       console.log("User added to Firestore.");
// //     } else {
// //       await db.collection("users").doc(uid).update({
// //         cloudFunctionVerified: true,
// //       });
// //       console.log("cloudFunctionVerified field appended to existing Firestore document.");
// //     }

// //     console.log("User successfully validated and added to Firestore.");
// //   } catch (error) {
// //     console.error("Error validating user:", error);
// //   }
// // };

// // module.exports = checkDuplicateUser;
