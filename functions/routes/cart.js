/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Add to cart
router.post("/add", async (req, res) => {
  try {
    const {uid, productId, quantity, color, size, height} = req.body;

    if (!uid || !productId || !quantity) {
      return res.status(400).json({error: "Missing required fields"});
    }

    const cartItem = {
      productId,
      quantity,
      color: color || null,
      size: size || null,
      height: height || null,
      createdAt: new Date(),
    };

    const cartRef = admin.firestore().collection("users").doc(uid).collection("cart");
    const newCartItemRef = await cartRef.add(cartItem);

    res.status(201).json({id: newCartItemRef.id, ...cartItem});
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({error: "Failed to add item to cart"});
  }
});

// Delete from cart
router.delete("/delete/:cartItemId", async (req, res) => {
  try {
    const {uid} = req.body;
    const {cartItemId} = req.params;

    if (!uid || !cartItemId) {
      return res.status(400).json({error: "Missing required fields"});
    }

    const cartItemRef = admin.firestore().collection("users").doc(uid).collection("cart").doc(cartItemId);
    await cartItemRef.delete();

    res.status(200).json({message: "Item removed from cart successfully"});
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({error: "Failed to remove item from cart"});
  }
});

// Get cart items
router.get("/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const cartRef = admin.firestore().collection("users").doc(uid).collection("cart");
    const snapshot = await cartRef.get();

    const cartItems = [];
    snapshot.forEach((doc) => {
      cartItems.push({id: doc.id, ...doc.data()});
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({error: "Failed to fetch cart items"});
  }
});

// Update cart item
router.put("/update/:cartItemId", async (req, res) => {
  try {
    const {uid, quantity, color, size, height} = req.body;
    const {cartItemId} = req.params;

    if (!uid || !cartItemId) {
      return res.status(400).json({error: "Missing required fields"});
    }

    const cartItemRef = admin.firestore().collection("users").doc(uid).collection("cart").doc(cartItemId);

    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (color !== undefined) updateData.color = color;
    if (size !== undefined) updateData.size = size;
    if (height !== undefined) updateData.height = height;
    updateData.updatedAt = new Date();

    await cartItemRef.update(updateData);

    const updatedDoc = await cartItemRef.get();

    if (!updatedDoc.exists) {
      return res.status(404).json({error: "Cart item not found"});
    }

    res.status(200).json({id: updatedDoc.id, ...updatedDoc.data()});
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({error: "Failed to update cart item"});
  }
});

module.exports = router;
