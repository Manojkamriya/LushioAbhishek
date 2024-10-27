/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const express = require("express");
const admin = require("firebase-admin");
const moment = require("moment");

const db = admin.firestore();

// eslint-disable-next-line new-cap
const router = express.Router();

// Helper function to convert date from DD-MM-YYYY to YYYY-MM-DD
function convertToISODate(dateString) {
  if (!dateString) return null;
  const parsedDate = moment(dateString, "DD-MM-YYYY", true);
  return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : null;
}

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
router.post("/details/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDoc = db.collection("users").doc(uid);
    const userData = (await userDoc.get()).data() || {};

    // Initialize update counts if they don't exist
    const dobUpdateCount = userData.dobUpdateCount || 0;
    const doaUpdateCount = userData.doaUpdateCount || 0;

    // Check if the user has exceeded the allowed updates for dob and doa
    if (req.body.dob && dobUpdateCount >= 2) {
      return res.status(400).send("DOB can only be updated twice.");
    }

    if (req.body.doa && doaUpdateCount >= 2) {
      return res.status(400).send("DOA can only be updated twice.");
    }
    console.log(req.body.dob);
    // Prepare updated user data
    const updatedUserData = {
      displayName: req.body.displayName || userData.displayName || null,
      email: req.body.email || userData.email || null,
      phoneNumber: req.body.phoneNumber || userData.phoneNumber || null,
      gender: req.body.gender || userData.gender || null,
      dob: req.body.dob ? convertToISODate(req.body.dob) : userData.dob || null,
      doa: req.body.doa ? convertToISODate(req.body.doa) : userData.doa || null,
    };

    // Increment the update counters if dob or doa is updated
    if (req.body.dob && dobUpdateCount < 2) {
      updatedUserData.dobUpdateCount = dobUpdateCount + 1;
    }

    if (req.body.doa && doaUpdateCount < 2) {
      updatedUserData.doaUpdateCount = doaUpdateCount + 1;
    }

    // Save the updated user data
    await userDoc.set(updatedUserData, {merge: true});

    // Prepare the response data with display dates
    const responseData = {
      ...updatedUserData,
    };

    return res.status(200).json(responseData);
  } catch (error) {
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
