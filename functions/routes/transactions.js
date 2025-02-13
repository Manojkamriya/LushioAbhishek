/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();

router.post("/", async (req, res) => {
  try {
    const {uid, lastDocId, limit = 10} = req.body;

    // Input validation
    if (!uid) {
      return res.status(400).json({success: false, message: "User ID is required"});
    }

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({success: false, message: "User not found"});
    }

    let query = userRef.collection("coins").orderBy("createdAt", "desc").limit(limit);

    // Apply pagination if lastDocId is provided
    if (lastDocId) {
      const lastDocRef = await userRef.collection("coins").doc(lastDocId).get();
      if (lastDocRef.exists) {
        query = query.startAfter(lastDocRef);
      }
    }

    const coinsSnapshot = await query.get();

    if (coinsSnapshot.empty) {
      return res.status(200).json({success: true, transactions: [], hasMore: false});
    }

    const transactions = coinsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return data.lushioCash ?
        {
          id: doc.id,
          type: "cash",
          amount: data.amount,
          orderId: data.oid,
          orderAmount: data.orderAmount,
          transactionDate: data.consumedAt.toDate(),
          createdAt: data.createdAt.toDate(),
        } :
        {
          id: doc.id,
          type: "coin",
          amount: data.amount,
          amountLeft: data.amountLeft,
          expiresOn: data.expiresOn.toDate(),
          isExpired: data.isExpired,
          orders: (data.orders || []).map((order) => ({
            oid: order.oid,
            orderAmount: order.orderAmount,
            consumedAmount: order.consumedAmount,
            consumedAt: order.consumedAt.toDate(),
          })),
          createdAt: data.createdAt.toDate(),
        };
    });

    return res.status(200).json({
      success: true,
      transactions,
      hasMore: coinsSnapshot.docs.length === limit,
      lastDocId: coinsSnapshot.docs.length ? coinsSnapshot.docs[coinsSnapshot.docs.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({success: false, message: error.message || "Error fetching transactions"});
  }
});

module.exports = router;
