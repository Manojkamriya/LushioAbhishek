/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();

// Fetch all coupons route
router.get("/", async (req, res) => {
  try {
    const couponsSnapshot = await db.collection("coupons").get();
    const coupons = couponsSnapshot.docs.map((doc) => {
      const data = doc.data();
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
  let {code, validity, discount, discountType, onPurchaseOf, forUsers} = req.body;

  // Check if all fields are present
  if (!code || !validity || discount == null || !discountType || onPurchaseOf == null || !forUsers) {
    return res.status(400).json({error: "All fields are mandatory"});
  }

  // Validate discount type
  if (!["percentage", "fixed"].includes(discountType)) {
    return res.status(400).json({error: "Discount type must be either 'percentage' or 'fixed'"});
  }

  // Additional validation for percentage discount
  if (discountType === "percentage" && (discount <= 0 || discount > 100)) {
    return res.status(400).json({error: "Percentage discount must be between 0 and 100"});
  }

  // Validate fixed discount amount
  if (discountType === "fixed" && discount <= 0) {
    return res.status(400).json({error: "Fixed discount amount must be greater than 0"});
  }

  // Trim whitespace from code and check for spaces
  code = code.trim();
  if (code.includes(" ")) {
    return res.status(400).json({error: "Coupon code must not contain spaces"});
  }

  // Check if forUsers value is valid
  const validForUsers = ["all", "firstPurchase", "hidden", null];
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
      validity: new Date(validity),
      discount: parseFloat(discount),
      discountType,
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
  const {validity, discount, discountType, onPurchaseOf, forUsers} = req.body;

  // Validate discount type if provided
  if (discountType && !["percentage", "fixed"].includes(discountType)) {
    return res.status(400).json({error: "Discount type must be either 'percentage' or 'fixed'"});
  }

  // Validate discount value if provided
  if (discount != null) {
    if (discountType === "percentage" && (discount <= 0 || discount > 100)) {
      return res.status(400).json({error: "Percentage discount must be between 0 and 100"});
    }
    if (discountType === "fixed" && discount <= 0) {
      return res.status(400).json({error: "Fixed discount amount must be greater than 0"});
    }
  }

  // Validate `forUsers` field
  const validForUsers = ["all", "firstPurchase", "hidden", null];
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
      ...(discountType && {discountType}),
      ...(onPurchaseOf != null && {onPurchaseOf: parseFloat(onPurchaseOf)}),
      ...(forUsers && {forUsers}),
    });

    return res.status(200).json({message: "Coupon updated successfully"});
  } catch (error) {
    return res.status(500).json({error: "Error updating coupon", details: error.message});
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
    if (!couponData) {
      return res.status(404).json({error: "Coupon details not found"});
    }

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
      case "hidden":
        break;

      case "firstPurchase": {
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

    // Calculate discount based on type
    let discountAmount;
    if (couponData.discountType === "percentage") {
      discountAmount = (purchaseOf * couponData.discount) / 100;
    } else {
      discountAmount = Math.min(couponData.discount, purchaseOf); // Don't allow fixed discount to exceed purchase amount
    }

    return res.status(200).json({
      discount: parseFloat(discountAmount.toFixed(2)),
      discountType: couponData.discountType,
    });
  } catch (error) {
    return res.status(500).json({error: "Error processing coupon", details: error.message});
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

// Route to send usable coupons
router.get("/usableCoupons/:uid", async (req, res) => {
  const {uid} = req.params;

  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    const userData = userDoc.data();
    const usedCoupons = userData.usedCoupons || [];
    const currentDate = new Date();

    const couponsSnapshot = await db.collection("coupons").get();
    const validCoupons = {};

    for (const doc of couponsSnapshot.docs) {
      const couponData = doc.data();
      const isExpired = currentDate > couponData.validity.toDate();
      const isUsed = usedCoupons.includes(couponData.code);

      if (isExpired || isUsed) continue;

      let isValidForUser = false;

      switch (couponData.forUsers) {
        case "all":
          isValidForUser = true;
          break;

        case "firstPurchase": {
          const ordersSnapshot = await userRef.collection("orders").get();
          if (ordersSnapshot.empty) {
            isValidForUser = true;
          }
          break;
        }

        case null:
        case "hidden":
          isValidForUser = false;
          break;

        default:
          return res.status(400).json({error: "Invalid forUsers value in coupon"});
      }

      if (isValidForUser) {
        const formattedValidity = couponData.validity.toDate().toISOString().split("T")[0];

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

  if (!uid || !code) {
    return res.status(400).json({error: "UID and code are required"});
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    // Get current usedCoupons array
    const userData = userDoc.data();
    const currentUsedCoupons = userData.usedCoupons || [];

    // Only add if not already present
    if (!currentUsedCoupons.includes(code)) {
      currentUsedCoupons.push(code);

      await userRef.update({
        usedCoupons: currentUsedCoupons,
      });
    }

    return res.status(200).json({message: "Coupon marked as used"});
  } catch (error) {
    console.error("Full error:", error);
    return res.status(500).json({error: "Error marking coupon as used", details: error.message});
  }
});

module.exports = router;
