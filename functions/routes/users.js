const express = require("express");
const admin = require("firebase-admin");

const db = admin.firestore();

// eslint-disable-next-line new-cap
const router = express.Router();

// Fetch user name by UID
router.get("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    console.log(uid);
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

module.exports = router;
