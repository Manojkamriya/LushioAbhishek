/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const express = require("express");
const admin = require("firebase-admin");
const moment = require("moment");

const db = admin.firestore();

// eslint-disable-next-line new-cap
const router = express.Router();

// NOT NEEDED NOW
// Helper function to convert date from DD-MM-YYYY to YYYY-MM-DD
// function convertToISODate(dateString) {
//   if (!dateString) return null;
//   const parsedDate = moment(dateString, "DD-MM-YYYY", true);
//   return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : null;
// }

// Helper function to convert date from YYYY-MM-DD to DD-MM-YYYY

function convertToDisplayDate(dateString) {
  if (!dateString) return null;
  const parsedDate = moment(dateString, "YYYY-MM-DD", true);
  return parsedDate.isValid() ? parsedDate.format("DD-MM-YYYY") : null;
}

// Fetch user name by UID
router.get("/name/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    // console.log(`username : ${uid}`);
    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }

    const userData = userDoc.data();
    const userName = userData.displayName;
    return res.status(200).json({name: userName});
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Fetch user details by UID
router.get("/details/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }

    const userData = userDoc.data();
    const userDetails = {
      displayName: userData.displayName || null,
      email: userData.email || null,
      phoneNumber: userData.phoneNumber || null,
      photoURL: userData.photoURL || null,
      gender: userData.gender || null,
      dob: convertToDisplayDate(userData.dob) || null,
      doa: convertToDisplayDate(userData.doa) || null,
    };

    return res.status(200).json(userDetails);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Update user details by UID (limited DOB and DOA to 2 updates)
router.patch("/details/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const updates = req.body; // Only contains changed fields from frontend

    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No updates provided");
    }

    // Get the user's current data
    const userDoc = db.collection("users").doc(uid);
    const userSnapshot = await userDoc.get();

    if (!userSnapshot.exists) {
      return res.status(404).send("User not found");
    }

    const userData = userSnapshot.data();

    // Initialize update counts
    const dobUpdateCount = userData.dobUpdateCount || 0;
    const doaUpdateCount = userData.doaUpdateCount || 0;

    // Check DOB and DOA update limits
    if (updates.dob && dobUpdateCount >= 2) {
      return res.status(400).send("Date of Birth can only be updated twice.");
    }
    if (updates.doa && doaUpdateCount >= 2) {
      return res.status(400).send("Date of Anniversary can only be updated twice.");
    }

    // Check for email and phone number conflicts only if they're being updated
    const usersRef = db.collection("users");

    if (updates.email) {
      const emailSnapshot = await usersRef
          .where("email", "==", updates.email)
          .get();
      const conflictingEmail = emailSnapshot.docs.find((doc) => doc.id !== uid);
      if (conflictingEmail) {
        return res.status(400).send("Email is already in use by another account.");
      }
    }

    if (updates.phoneNumber) {
      const phoneSnapshot = await usersRef
          .where("phoneNumber", "==", updates.phoneNumber)
          .get();
      const conflictingPhone = phoneSnapshot.docs.find((doc) => doc.id !== uid);
      if (conflictingPhone) {
        return res.status(400).send("Phone number is already in use by another account.");
      }
    }

    // Prepare the update object
    const updateData = {...updates};

    // Only increment update counters if those fields are being updated
    if (updates.dob) {
      updateData.dobUpdateCount = dobUpdateCount + 1;
    }
    if (updates.doa) {
      updateData.doaUpdateCount = doaUpdateCount + 1;
    }

    // Remove any undefined or null values to prevent overwriting with nulls
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    // Update only the changed fields
    await userDoc.update(updateData);

    // Fetch and return the updated user data
    const updatedSnapshot = await userDoc.get();
    const updatedData = updatedSnapshot.data();

    // Remove internal fields from response
    const responseData = {...updatedData};
    delete responseData.dobUpdateCount;
    delete responseData.doaUpdateCount;

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).send(error.message);
  }
});

// Fetch user addresses by UID
router.get("/addresses/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const addressesRef = db.collection("users").doc(uid).collection("addresses");
    const addressesSnapshot = await addressesRef.get();

    if (addressesSnapshot.empty) {
      return res.status(404).send("No addresses found. Add some addresses first!");
    }

    const addresses = addressesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({addresses});
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Update, add new address, or set address as default
router.post("/addresses/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const {newAddress, updateAddress, setDefaultAddress} = req.body;
    const addressesRef = db.collection("users").doc(uid).collection("addresses");

    // Add a new address
    if (newAddress) {
      // Check if there are any existing addresses
      const addressesSnapshot = await addressesRef.get();
      const isFirstAddress = addressesSnapshot.empty;

      // Add the new address, making it default if it's the first address
      await addressesRef.add({
        ...newAddress,
        isDefault: isFirstAddress ? true : false,
      });
    }

    // Update an existing address
    if (updateAddress) {
      const addressDoc = addressesRef.doc(updateAddress.id);
      await addressDoc.set(updateAddress, {merge: true});
    }

    // Set an address as default (unset other defaults)
    if (setDefaultAddress) {
      const addressesSnapshot = await addressesRef.get();
      addressesSnapshot.forEach(async (doc) => {
        await doc.ref.update({
          isDefault: doc.id === setDefaultAddress.id,
        });
      });
    }

    const updatedAddressesSnapshot = await addressesRef.get();
    const updatedAddresses = updatedAddressesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({addresses: updatedAddresses});
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Delete an address by ID
router.delete("/addresses/delete/:uid/:id", async (req, res) => {
  try {
    const {uid, id} = req.params;
    const addressDoc = db.collection("users").doc(uid).collection("addresses").doc(id);
    const addressesRef = db.collection("users").doc(uid).collection("addresses");

    const addressSnapshot = await addressDoc.get();
    if (!addressSnapshot.exists) {
      return res.status(404).send("Address not found");
    }

    const addressData = addressSnapshot.data();

    // Check if the address to be deleted is the default address
    if (addressData.isDefault) {
      const addressesSnapshot = await addressesRef.get();

      // If only one address exists (which is default), prevent deletion
      if (addressesSnapshot.size === 1) {
        return res.status(400).send("Cannot delete the default address. Add another address or change the default address.");
      }

      // If other addresses exist, find another address to set as default
      let newDefaultAddress = null;
      addressesSnapshot.forEach((doc) => {
        if (doc.id !== id && !newDefaultAddress) {
          newDefaultAddress = doc;
        }
      });

      if (newDefaultAddress) {
        // Set the new address as the default
        await addressesRef.doc(newDefaultAddress.id).update({isDefault: true});
      }
    }

    // Delete the address
    await addressDoc.delete();
    return res.status(200).send("Address deleted successfully");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
