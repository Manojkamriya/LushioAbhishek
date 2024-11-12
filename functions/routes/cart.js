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

    const productsRef = admin.firestore().collection("products").doc(productId);
    const productSnapshot = await productsRef.get();

    // Check if the product exists
    if (!productSnapshot.exists) {
      return res.status(400).json({message: "Invalid product ID"});
    }

    const cartRef = admin.firestore().collection("users").doc(uid).collection("cart");

    // Check for an identical item in the cart
    const identicalItemSnapshot = await cartRef
        .where("productId", "==", productId)
        .where("color", "==", color || null)
        .where("size", "==", size || null)
        .where("height", "==", height || null)
        .limit(1)
        .get();

    if (!identicalItemSnapshot.empty) {
      // If an identical item exists, increase the quantity
      const identicalItemDoc = identicalItemSnapshot.docs[0];
      const existingQuantity = identicalItemDoc.data().quantity;

      await cartRef.doc(identicalItemDoc.id).update({
        quantity: Number(existingQuantity) + Number(quantity),
      });

      return res.status(200).json({message: "Quantity updated for identical item in cart"});
    } else {
      // If no identical item exists, add the new item to the cart
      const cartItem = {
        productId,
        quantity,
        color: color || null,
        size: size || null,
        height: height || null,
        createdAt: new Date(),
      };

      const newCartItemRef = await cartRef.add(cartItem);

      res.status(201).json({id: newCartItemRef.id, ...cartItem});
    }
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

// Get cart items with product details
router.get("/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const cartRef = admin.firestore().collection("users").doc(uid).collection("cart");
    const snapshot = await cartRef.get();

    let productsRemoved = false;

    // Fetch product details while filtering out missing products
    const cartItems = (await Promise.all(snapshot.docs.map(async (doc) => {
      const cartItem = {id: doc.id, ...doc.data()};

      // Fetch product details using the productId from the cart item
      const productRef = admin.firestore().collection("products").doc(cartItem.productId);
      const productSnapshot = await productRef.get();

      if (productSnapshot.exists) {
        // Attach product data if it exists
        cartItem.product = {id: productSnapshot.id, ...productSnapshot.data()};
        return cartItem;
      } else {
        // If the product does not exist, mark productsRemoved as true and delete the cart item
        productsRemoved = true;
        await doc.ref.delete();
        return null; // Filter out this item
      }
    }))).filter((item) => item !== null); // Remove null items (deleted products)

    // Send response with a flag indicating if products were removed
    res.status(200).json({cartItems, productsRemoved});
  } catch (error) {
    console.error("Error fetching cart items with product details:", error);
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

// Cart count
router.get("/count/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const cartRef = admin.firestore().collection("users").doc(uid).collection("cart");
    const snapshot = await cartRef.count().get();

    res.status(200).json({count: snapshot.data().count});
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({error: "Failed to fetch cart count"});
  }
});

module.exports = router;
