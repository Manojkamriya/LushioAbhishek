/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();
const db = admin.firestore();

// Helper function to combine results and remove duplicates
function combineUniqueProducts(products1, products2) {
  const map = new Map();
  [...products1, ...products2].forEach((product) => {
    map.set(product.id, product);
  });
  return Array.from(map.values());
}

// Helper function to find intersection of products by ID
function intersectProducts(products1, products2) {
  const map = new Map();
  products1.forEach((product) => map.set(product.id, product));
  return products2.filter((product) => map.has(product.id));
}

// GET /getByCategory
router.post("/getByCategory", async (req, res) => {
  try {
    const {categories} = req.body;
    if (!categories || !Array.isArray(categories) || categories.length === 0 || categories.length > 2) {
      return res.status(400).json({message: "Please provide 1 or 2 categories."});
    }

    const productsRef = db.collection("products");
    const results = [];

    // Perform separate queries for each category
    for (const category of categories) {
      const snapshot = await productsRef.where("categories", "array-contains", category).limit(20).get();
      snapshot.forEach((doc) => {
        results.push({id: doc.id, ...doc.data()});
      });
    }

    // Remove duplicates and limit to top 20 products
    const uniqueProducts = combineUniqueProducts(results, []);

    if (uniqueProducts.length === 0) {
      return res.status(404).json({message: "No products found."});
    }

    res.status(200).json(uniqueProducts.slice(0, 20)); // Return top 20 unique products
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});


// GET /featuredMen
router.get("/featuredMen", async (req, res) => {
  try {
    const productsRef = db.collection("products");

    // First query for 'featured'
    const featuredSnapshot = await productsRef.where("categories", "array-contains", "featured").get();
    const featuredProducts = [];
    featuredSnapshot.forEach((doc) => {
      featuredProducts.push({id: doc.id, ...doc.data()});
    });

    // Second query for 'men'
    const menSnapshot = await productsRef.where("categories", "array-contains", "men").get();
    const menProducts = [];
    menSnapshot.forEach((doc) => {
      menProducts.push({id: doc.id, ...doc.data()});
    });
    // Combine and remove duplicates
    const combinedProducts = intersectProducts(featuredProducts, menProducts);

    if (combinedProducts.length === 0) {
      return res.status(404).json({message: "No featured men's products found."});
    }

    res.status(200).json(combinedProducts.slice(0, 4)); // Return only top 4 products
  } catch (error) {
    console.error("Error fetching featured men's products:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});


// GET /featuredWomen
router.get("/featuredWomen", async (req, res) => {
  try {
    const productsRef = db.collection("products");

    // First query for 'featured'
    const featuredSnapshot = await productsRef.where("categories", "array-contains", "featured").get();
    const featuredProducts = [];
    featuredSnapshot.forEach((doc) => {
      featuredProducts.push({id: doc.id, ...doc.data()});
    });

    // Second query for 'women'
    const womenSnapshot = await productsRef.where("categories", "array-contains", "women").get();
    const womenProducts = [];
    womenSnapshot.forEach((doc) => {
      womenProducts.push({id: doc.id, ...doc.data()});
    });

    // Combine and remove duplicates
    const combinedProducts = intersectProducts(featuredProducts, womenProducts);

    if (combinedProducts.length === 0) {
      return res.status(404).json({message: "No featured women's products found."});
    }

    res.status(200).json(combinedProducts.slice(0, 4)); // Return only top 4 products
  } catch (error) {
    console.error("Error fetching featured women's products:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});


// GET /featuredAccessories
router.get("/featuredAccessories", async (req, res) => {
  try {
    const productsRef = db.collection("products");

    // First query for 'featured'
    const featuredSnapshot = await productsRef.where("categories", "array-contains", "featured").get();
    const featuredProducts = [];
    featuredSnapshot.forEach((doc) => {
      featuredProducts.push({id: doc.id, ...doc.data()});
    });

    // Second query for 'accessories'
    const accessoriesSnapshot = await productsRef.where("categories", "array-contains", "accessories").get();
    const accessoriesProducts = [];
    accessoriesSnapshot.forEach((doc) => {
      accessoriesProducts.push({id: doc.id, ...doc.data()});
    });

    // Combine and remove duplicates
    const combinedProducts = intersectProducts(featuredProducts, accessoriesProducts);

    if (combinedProducts.length === 0) {
      return res.status(404).json({message: "No featured accessories found."});
    }

    res.status(200).json(combinedProducts.slice(0, 4)); // Return only top 4 products
  } catch (error) {
    console.error("Error fetching featured accessories products:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});

module.exports = router;
