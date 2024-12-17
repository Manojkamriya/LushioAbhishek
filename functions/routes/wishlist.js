/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
// const admin = require("firebase-admin");
// const db = admin.firestore();

const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();

// Add to wishlist
router.post("/add", async (req, res) => {
  try {
    const {uid, productId} = req.body;

    if (!uid || !productId) {
      return res.status(400).json({error: "Missing required fields"});
    }

    const productsRef = db.collection("products").doc(productId);
    const productSnapshot = await productsRef.get();

    // Check if the product exists
    if (!productSnapshot.exists) {
      return res.status(400).json({message: "Invalid product ID"});
    }

    const wishlistRef = db.collection("users").doc(uid).collection("wishlist");

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

    await db
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

    const wishlistRef = db.collection("users").doc(uid).collection("wishlist");
    const snapshot = await wishlistRef.get();

    let productsRemoved = false;

    // Fetch product details while filtering out missing products
    const wishlistItems = (await Promise.all(snapshot.docs.map(async (doc) => {
      const wishlistItem = {id: doc.id, ...doc.data()};

      // Fetch product details using the productId from the wishlist item
      const productRef = db.collection("products").doc(wishlistItem.productId);
      const productSnapshot = await productRef.get();

      if (productSnapshot.exists) {
        // Attach product data if it exists
        wishlistItem.product = {id: productSnapshot.id, ...productSnapshot.data()};
        return wishlistItem;
      } else {
        // If the product does not exist, mark productsRemoved as true and delete the wishlist item
        productsRemoved = true;
        await doc.ref.delete();
        return null; // Filter out this item
      }
    }))).filter((item) => item !== null); // Remove null items (deleted products)

    // Send response with a flag indicating if products were removed
    res.status(200).json({wishlistItems, productsRemoved});
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

    const wishlistRef = db.collection("users").doc(uid).collection("wishlist");
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

    const wishlistRef = db.collection("users").doc(uid).collection("wishlist");
    const snapshot = await wishlistRef.count().get();

    res.status(200).json({count: snapshot.data().count});
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    res.status(500).json({error: "Failed to fetch wishlist count"});
  }
});

module.exports = router;
