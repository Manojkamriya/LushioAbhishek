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
      imageUrls,
      height,
      aboveHeight,
      belowHeight,
      colorOptions,
      sizeOptions,
      quantities,
    } = req.body;

    // validation checks
    if (!name || !displayName || !description || !price || !gst || !discount || !categories || !imageUrls) {
      return res.status(400).json({error: "All required fields must be filled"});
    }

    // Prepare the new product data
    const productData = {
      name: name.trim(),
      displayName: displayName.trim(),
      description: description.trim(),
      price: parseFloat(price),
      gst: parseFloat(gst),
      discount: parseFloat(discount),
      categories: typeof categories === "string" ? categories.split(",").map((cat) => cat.trim()) : categories,
      imageUrls: imageUrls,
      rating: 0, // Default rating
    };

    // Add height-based classification if present
    if (height) {
      productData.height = height;
      productData.aboveHeight = {
        ...aboveHeight,
        quantities: aboveHeight.quantities,
      };
      productData.belowHeight = {
        ...belowHeight,
        quantities: belowHeight.quantities,
      };
    } else {
      productData.colorOptions = colorOptions;
      productData.sizeOptions = sizeOptions;
      productData.quantities = quantities;
    }

    // Add the product to the "products" collection in Firestore
    const productRef = await db.collection("products").add(productData);

    // Create a subcollection for reviews
    await productRef.collection("reviews").add({
      // add an initial review here if needed, or leave it empty
    });

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

// Get all products
router.get("/allProducts", async (req, res) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({message: "No products found"});
    }

    const products = [];
    snapshot.forEach((doc) => {
      products.push({id: doc.id, ...doc.data()});
    });

    // Return the list of products
    return res.status(200).json({products});
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({error: "Failed to fetch products"});
  }
});

// Get a specific product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productRef = db.collection("products").doc(productId);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({error: "Product not found"});
    }

    const productData = doc.data();

    // Fetch review references
    const reviewRefsSnapshot = await productRef.collection("reviews").get();
    const reviewIds = reviewRefsSnapshot.docs.map((doc) => doc.id);

    // Fetch actual reviews from the reviews collection
    const reviewsPromises = reviewIds.map((id) =>
      db.collection("reviews").doc(id).get(),
    );
    const reviewDocs = await Promise.all(reviewsPromises);
    const reviews = reviewDocs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the product data along with its reviews
    return res.status(200).json({
      id: doc.id,
      ...productData,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({error: "Failed to fetch product"});
  }
});

// Delete a product by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productRef = db.collection("products").doc(productId);

    // Check if the product exists
    const doc = await productRef.get();
    if (!doc.exists) {
      return res.status(404).json({error: "Product not found"});
    }

    // Get review references
    const reviewRefsSnapshot = await productRef.collection("reviews").get();
    const reviewIds = reviewRefsSnapshot.docs.map((doc) => doc.id);

    // Delete the reviews from the reviews collection
    const batch = db.batch();
    reviewIds.forEach((reviewId) => {
      const reviewRef = db.collection("reviews").doc(reviewId);
      batch.delete(reviewRef);
    });

    // Delete the review references subcollection
    reviewRefsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the product document
    batch.delete(productRef);

    // Commit the batch
    await batch.commit();

    return res.status(200).json({message: "Product and associated reviews successfully deleted"});
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({error: "Failed to delete product"});
  }
});

// Update a product by ID
router.put("/update/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;

    const productRef = db.collection("products").doc(productId);

    // Check if the product exists
    const doc = await productRef.get();
    if (!doc.exists) {
      return res.status(404).json({error: "Product not found"});
    }

    // Update the product
    await productRef.update(updatedData);

    return res.status(200).json({message: "Product updated successfully"});
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({error: "Failed to update product"});
  }
});

module.exports = router;
