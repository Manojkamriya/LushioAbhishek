/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
// const admin = require("firebase-admin");
// const db = admin.firestore();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();

// categories arrays of men, women, accessories
router.get("/", async (req, res) => {
  try {
    // Initialize empty sets for unique subcategories
    const menSubcategories = new Set();
    const womenSubcategories = new Set();
    const accessoriesSubcategories = new Set();

    // Fetch all products
    const productsSnapshot = await db.collection("products").get();

    productsSnapshot.forEach((doc) => {
      const product = doc.data();
      const {categories} = product;

      // Classify subcategories by main category
      if (categories.includes("men")) {
        categories.forEach((category) => {
          if (category !== "men") {
            menSubcategories.add(category);
          }
        });
      }
      if (categories.includes("women")) {
        categories.forEach((category) => {
          if (category !== "women") {
            womenSubcategories.add(category);
          }
        });
      }
      if (categories.includes("accessories")) {
        categories.forEach((category) => {
          if (category !== "accessories") {
            accessoriesSubcategories.add(category);
          }
        });
      }
    });

    // Convert Sets to Arrays for response
    res.json({
      men: Array.from(menSubcategories),
      women: Array.from(womenSubcategories),
      accessories: Array.from(accessoriesSubcategories),
    });
  } catch (error) {
    console.error("Error fetching subcategories: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
