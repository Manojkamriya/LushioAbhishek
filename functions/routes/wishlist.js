/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Add to wishlist
router.post("/add", async (req, res) => {
  try {
    const {uid, productId} = req.body;

    if (!uid || !productId) {
      return res.status(400).json({error: "Missing required fields"});
    }

    const wishlistRef = admin.firestore().collection("users").doc(uid).collection("wishlist");

    // Check if the product already exists in the wishlist
    const existingItemSnapshot = await wishlistRef.where("productId", "==", productId).get();

    if (!existingItemSnapshot.empty) {
      return res.status(400).json({message: "Product already in wishlist"});
    }

    // If not in wishlist, add the item
    const wishlistItem = {
      productId,
      createdAt: new Date(),
    };

    const newWishlistItemRef = await wishlistRef.add(wishlistItem);

    res.status(201).json({id: newWishlistItemRef.id, ...wishlistItem});
  } catch (error) {
    console.error("Error adding item to wishlist:", error);
    res.status(500).json({error: "Failed to add item to wishlist"});
  }
});

// Delete from wishlist
router.delete("/delete", async (req, res) => {
  try {
    const {uid, itemId} = req.body;

    if (!uid || !itemId) {
      return res.status(400).json({error: "Missing required fields"});
    }

    await admin.firestore()
        .collection("users")
        .doc(uid)
        .collection("wishlist")
        .doc(itemId)
        .delete();

    res.status(200).json({message: "Item removed from wishlist successfully"});
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    res.status(500).json({error: "Failed to remove item from wishlist"});
  }
});

// Get all wishlist items with product details
router.get("/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const wishlistRef = admin.firestore().collection("users").doc(uid).collection("wishlist");
    const snapshot = await wishlistRef.get();

    const wishlistItems = await Promise.all(snapshot.docs.map(async (doc) => {
      const wishlistItem = {id: doc.id, ...doc.data()};

      // Fetch product details using the productId from the wishlist item
      const productRef = admin.firestore().collection("products").doc(wishlistItem.productId);
      const productSnapshot = await productRef.get();

      // Attach product data if it exists
      if (productSnapshot.exists) {
        wishlistItem.product = {id: productSnapshot.id, ...productSnapshot.data()};
      } else {
        wishlistItem.product = null;
      }

      return wishlistItem;
    }));

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist items with product details:", error);
    res.status(500).json({error: "Failed to fetch wishlist items"});
  }
});

// Get an Object of all productIds in the user's wishlist
router.get("/array/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const wishlistRef = admin.firestore().collection("users").doc(uid).collection("wishlist");
    const snapshot = await wishlistRef.get();

    // Extract both document ID and productId for each wishlist item
    const wishlistItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      productId: doc.data().productId,
    }));

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error("Error fetching product IDs from wishlist:", error);
    res.status(500).json({error: "Failed to fetch product IDs"});
  }
});

// Get wishlist item count
router.get("/count/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const wishlistRef = admin.firestore().collection("users").doc(uid).collection("wishlist");
    const snapshot = await wishlistRef.count().get();

    res.status(200).json({count: snapshot.data().count});
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    res.status(500).json({error: "Failed to fetch wishlist count"});
  }
});

module.exports = router;
