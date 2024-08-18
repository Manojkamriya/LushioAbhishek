/* eslint-disable max-len */
const express = require("express");
const admin = require("firebase-admin");

const db = admin.firestore();

// eslint-disable-next-line new-cap
const router = express.Router();

// Fetch user name by UID
router.get("/name/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    console.log(`username : ${uid}`);
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
    };

    return res.status(200).json(userDetails);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Update user details by UID
router.post("/details/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDoc = db.collection("users").doc(uid);
    const userData = (await userDoc.get()).data() || {};

    const updatedUserData = {
      displayName: req.body.displayName || userData.displayName || null,
      email: req.body.email || userData.email || null,
      phoneNumber: req.body.phoneNumber || userData.phoneNumber || null,
      gender: req.body.gender || userData.gender || null,
    };

    await userDoc.set(updatedUserData, {merge: true});

    return res.status(200).json(updatedUserData);
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
      await addressesRef.add({
        ...newAddress,
        isDefault: false,
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

module.exports = router;
