/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const admin = require("firebase-admin");
const db = admin.firestore();

const router = express.Router();

// Add a new product
router.post("/addProduct", async (req, res) => {
  try {
    console.log("Received product data:", req.body);

    // Extract form data sent from the frontend
    const {
      name,
      displayName,
      description,
      price,
      gst,
      discount,
      categories,
      colorOptions,
      sizeOptions,
      imageUrls,
    } = req.body;

    // Simplified validation checks
    if (!name || !displayName || !description || !price || !gst || !discount || !categories || !colorOptions || !sizeOptions || !imageUrls) {
      return res.status(400).json({error: "All fields are required"});
    }

    // Prepare the new product data
    const productData = {
      name: name.trim(),
      displayName: displayName.trim(),
      description: description.trim(),
      price: parseFloat(price),
      gst: parseFloat(gst),
      discount: parseFloat(discount),
      categories: categories.split(",").map((cat) => cat.trim()), // Split categories by commas
      colorOptions: colorOptions, // Directly use colorOptions as it's already an array
      sizeOptions: sizeOptions, // Directly use sizeOptions as it's already an object
      imageUrls: imageUrls, // Directly use imageUrls as it's already an array
    };

    // Add the product to the "products" collection in Firestore
    const productRef = await db.collection("products").add(productData);

    // Return a success response with the product ID
    return res.status(201).json({
      message: "Product added successfully!",
      productId: productRef.id,
      productData,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({error: "Failed to add product"});
  }
});

module.exports = router;
