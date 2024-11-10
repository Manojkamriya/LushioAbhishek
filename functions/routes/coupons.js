/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();

// Fetch all coupons route
router.get("/", async (req, res) => {
  try {
    // Retrieve all coupons from the 'coupons' collection
    const couponsSnapshot = await db.collection("coupons").get();

    // Map the coupon documents to a structured JSON response
    const coupons = couponsSnapshot.docs.map((doc) => {
      const data = doc.data();

      // Format the validity date to YYYY-MM-DD and remove the time component
      const formattedValidity = data.validity.toDate().toISOString().split("T")[0];

      return {
        id: doc.id,
        ...data,
        validity: formattedValidity,
      };
    });

    return res.status(200).json({coupons});
  } catch (error) {
    return res.status(500).json({error: "Error fetching coupons", details: error.message});
  }
});

// Add coupon route
router.post("/add", async (req, res) => {
  const {code, validity, discount, onPurchaseOf, forUsers} = req.body;

  // Check if all fields are present
  if (!code || !validity || discount == null || onPurchaseOf == null || !forUsers) {
    return res.status(400).json({error: "All fields are mandatory"});
  }

  // Check if forUsers value is valid
  const validForUsers = ["all", "firstPurchase", null];
  if (!validForUsers.includes(forUsers)) {
    return res.status(400).json({error: "Invalid forUsers value"});
  }

  try {
    // Check if coupon code already exists
    const existingCoupon = await db.collection("coupons").doc(code).get();
    if (existingCoupon.exists) {
      return res.status(400).json({error: "Coupon code already exists"});
    }

    // Add new coupon to Firestore
    await db.collection("coupons").doc(code).set({
      code,
      validity: new Date(validity), // this saves the date only, in db the time is set to 0 (due to use of IST it will show time as 5:30 AM)
      discount: parseFloat(discount),
      onPurchaseOf: parseFloat(onPurchaseOf),
      forUsers,
    });

    return res.status(201).json({message: "Coupon added successfully"});
  } catch (error) {
    return res.status(500).json({error: "Error adding coupon", details: error.message});
  }
});

// Update coupon route
router.put("/update/:cid", async (req, res) => {
  const {cid} = req.params;
  const {validity, discount, onPurchaseOf, forUsers} = req.body;

  // Validate `forUsers` field
  const validForUsers = ["all", "firstPurchase", null];
  if (forUsers && !validForUsers.includes(forUsers)) {
    return res.status(400).json({error: "Invalid forUsers value"});
  }

  try {
    // Check if coupon exists
    const couponRef = db.collection("coupons").doc(cid);
    const couponDoc = await couponRef.get();

    if (!couponDoc.exists) {
      return res.status(404).json({error: "Coupon not found"});
    }

    // Update coupon data
    await couponRef.update({
      ...(validity && {validity: new Date(validity)}),
      ...(discount != null && {discount: parseFloat(discount)}),
      ...(onPurchaseOf != null && {onPurchaseOf: parseFloat(onPurchaseOf)}),
      ...(forUsers && {forUsers}),
    });

    return res.status(200).json({message: "Coupon updated successfully"});
  } catch (error) {
    return res.status(500).json({error: "Error updating coupon", details: error.message});
  }
});

// Delete coupon route
router.delete("/delete/:cid", async (req, res) => {
  const {cid} = req.params;

  try {
    const couponRef = db.collection("coupons").doc(cid);
    const couponDoc = await couponRef.get();

    if (!couponDoc.exists) {
      return res.status(404).json({error: "Coupon not found"});
    }

    await couponRef.delete();
    return res.status(200).json({message: "Coupon deleted successfully"});
  } catch (error) {
    return res.status(500).json({error: "Error deleting coupon", details: error.message});
  }
});

// Use coupon route
router.post("/use", async (req, res) => {
  const {uid, code, purchaseOf} = req.body;

  // Basic validation
  if (!uid || !code || purchaseOf == null) {
    return res.status(400).json({error: "UID, code, and purchaseOf are required"});
  }

  try {
    // Fetch coupon details by code
    const couponDoc = await db.collection("coupons").doc(code).get();

    if (couponDoc.empty) {
      return res.status(404).json({error: "Coupon not found"});
    }

    const couponData = couponDoc.data();
    const currentDate = new Date();

    // Check if the coupon is valid (not expired)
    if (currentDate > couponData.validity.toDate()) {
      return res.status(400).json({error: "Coupon has expired"});
    }

    // Check if purchase amount meets minimum requirement
    if (purchaseOf < couponData.onPurchaseOf) {
      return res.status(400).json({error: `Minimum purchase amount required is ${couponData.onPurchaseOf}`});
    }

    // Check if the coupon has been used by the user
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    const userData = userDoc.data();
    if (userData.usedCoupons && userData.usedCoupons.includes(code)) {
      return res.status(400).json({error: "Coupon already used by user"});
    }

    // Additional `forUsers` check
    switch (couponData.forUsers) {
      case "all":
        break; // Valid for all users

      case "firstPurchase": {
        // Check if this is the user's first purchase
        const ordersSnapshot = await userRef.collection("orders").get();
        if (!ordersSnapshot.empty) {
          return res.status(400).json({error: "Coupon valid only for first purchase"});
        }
        break;
      }

      case null:
      default:
        return res.status(400).json({error: "Coupon not applicable for this user"});
    }

    // Calculate and return discount
    const discountAmount = parseFloat(couponData.discount.toFixed(2));
    return res.status(200).json({discount: discountAmount});
  } catch (error) {
    return res.status(500).json({error: "Error processing coupon", details: error.message});
  }
});

router.get("/usableCoupons/:uid", async (req, res) => {
  const {uid} = req.params;

  try {
    // Reference to the user document
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    const userData = userDoc.data();
    const usedCoupons = userData.usedCoupons || [];
    const currentDate = new Date();

    // Fetch all coupons
    const couponsSnapshot = await db.collection("coupons").get();
    const validCoupons = {};

    // Check each coupon for eligibility
    for (const doc of couponsSnapshot.docs) {
      const couponData = doc.data();
      const isExpired = currentDate > couponData.validity.toDate();
      const isUsed = usedCoupons.includes(couponData.code);

      // Skip expired or already used coupons
      if (isExpired || isUsed) continue;

      // Check the `forUsers` condition
      let isValidForUser = false;

      switch (couponData.forUsers) {
        case "all":
          isValidForUser = true;
          break;

        case "firstPurchase": {
          // Check if this is the user's first purchase
          const ordersSnapshot = await userRef.collection("orders").get();
          if (ordersSnapshot.empty) {
            isValidForUser = true;
          }
          break;
        }

        case null:
          isValidForUser = false;
          break;

        default:
          return res.status(400).json({error: "Invalid forUsers value in coupon"});
      }

      if (isValidForUser) {
        const formattedValidity = couponData.validity.toDate().toISOString().split("T")[0];

        // Add the coupon details directly to the validCoupons JSON object
        validCoupons[doc.id] = {
          id: doc.id,
          ...couponData,
          validity: formattedValidity,
        };
      }
    }

    return res.status(200).json(validCoupons);
  } catch (error) {
    return res.status(500).json({error: "Error fetching user-specific coupons", details: error.message});
  }
});


// Route to mark a coupon as used
router.post("/markUsed", async (req, res) => {
  const {uid, code} = req.body;

  // Basic validation
  if (!uid || !code) {
    return res.status(400).json({error: "UID and code are required"});
  }

  try {
    // Reference to the user document
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    // Add the code to the `usedCoupons` array, only if it’s not already there
    await userRef.update({
      usedCoupons: admin.firestore.FieldValue.arrayUnion(code),
    });

    return res.status(200).json({message: "Coupon marked as used"});
  } catch (error) {
    return res.status(500).json({error: "Error marking coupon as used", details: error.message});
  }
});

module.exports = router;
