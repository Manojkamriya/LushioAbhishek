/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();

// Helper function to find intersection of products by ID
function intersectProducts(products1, products2) {
  const map = new Map();
  products1.forEach((product) => map.set(product.id, product));
  return products2.filter((product) => map.has(product.id));
}

// Helper function to get pagination query
function getPaginationQuery(query, lastDocId, limit = 20) {
  let paginatedQuery = query.orderBy("createdAt", "desc").limit(limit);

  if (lastDocId) {
    // Get the last document
    const lastDocRef = db.collection("products").doc(lastDocId);
    paginatedQuery = paginatedQuery.startAfter(lastDocRef);
  }

  return paginatedQuery;
}

// POST /getByCategory
router.post("/getByCategory", async (req, res) => {
  try {
    const {categories, lastDocId, limit = 20} = req.body;
    if (!categories || !Array.isArray(categories) || categories.length === 0 || categories.length > 2) {
      return res.status(400).json({message: "Please provide 1 or 2 categories."});
    }

    const productsRef = db.collection("products");
    let baseQuery = productsRef
        .where("categories", "array-contains", categories[0])
        .where("toDisplay", "==", true);

    let paginatedQuery = getPaginationQuery(baseQuery, lastDocId, limit);
    const snapshot1 = await paginatedQuery.get();

    let results = [];
    snapshot1.forEach((doc) => {
      results.push({id: doc.id, ...doc.data()});
    });

    if (categories.length === 2) {
      const results2 = [];
      baseQuery = productsRef
          .where("categories", "array-contains", categories[1])
          .where("toDisplay", "==", true);

      paginatedQuery = getPaginationQuery(baseQuery, lastDocId, limit);
      const snapshot2 = await paginatedQuery.get();

      snapshot2.forEach((doc) => {
        results2.push({id: doc.id, ...doc.data()});
      });

      results = intersectProducts(results, results2);
    }

    if (results.length === 0) {
      return res.status(404).json({message: "No products found."});
    }

    const hasMore = results.length === limit;
    res.status(200).json({
      products: results,
      hasMore,
      lastDocId: results[results.length - 1]?.id,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});

// GET /featuredMen
router.get("/featuredMen", async (req, res) => {
  try {
    const productsRef = db.collection("products");

    // Query for 'featured'
    const featuredSnapshot = await productsRef
        .where("categories", "array-contains", "featured")
        .where("toDisplay", "==", true)
        .orderBy("createdAt", "desc")
        .get();
    const featuredProducts = [];
    featuredSnapshot.forEach((doc) => {
      featuredProducts.push({id: doc.id, ...doc.data()});
    });

    // Query for 'men'
    const menSnapshot = await productsRef
        .where("categories", "array-contains", "men")
        .where("toDisplay", "==", true)
        .orderBy("createdAt", "desc")
        .get();
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

    // Query for 'featured'
    const featuredSnapshot = await productsRef
        .where("categories", "array-contains", "featured")
        .where("toDisplay", "==", true)
        .orderBy("createdAt", "desc")
        .get();
    const featuredProducts = [];
    featuredSnapshot.forEach((doc) => {
      featuredProducts.push({id: doc.id, ...doc.data()});
    });

    // Query for 'women'
    const womenSnapshot = await productsRef
        .where("categories", "array-contains", "women")
        .where("toDisplay", "==", true)
        .orderBy("createdAt", "desc")
        .get();
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

    // Query for 'featured'
    const featuredSnapshot = await productsRef
        .where("categories", "array-contains", "featured")
        .where("toDisplay", "==", true)
        .orderBy("createdAt", "desc")
        .get();
    const featuredProducts = [];
    featuredSnapshot.forEach((doc) => {
      featuredProducts.push({id: doc.id, ...doc.data()});
    });

    // Query for 'accessories'
    const accessoriesSnapshot = await productsRef
        .where("categories", "array-contains", "accessories")
        .where("toDisplay", "==", true)
        .orderBy("createdAt", "desc")
        .get();
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

// GET /men
router.get("/men", async (req, res) => {
  try {
    let {lastDocId, limit = 20} = req.query;
    limit = parseInt(limit, 10);
    const productsRef = db.collection("products");
    const baseQuery = productsRef
        .where("categories", "array-contains", "men")
        .where("toDisplay", "==", true);

    const paginatedQuery = getPaginationQuery(baseQuery, lastDocId, limit);
    const snapshot = await paginatedQuery.get();

    const results = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    if (results.length === 0) {
      return res.status(404).json({message: "No products found for men."});
    }
    const hasMore = results.length === limit;
    res.status(200).json({
      products: results,
      hasMore,
      lastDocId: results[results.length - 1]?.id,
    });
  } catch (error) {
    console.error("Error fetching men products:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});

// GET /women
router.get("/women", async (req, res) => {
  try {
    let {lastDocId, limit = 20} = req.query;
    limit = parseInt(limit, 10);
    const productsRef = db.collection("products");
    const baseQuery = productsRef
        .where("categories", "array-contains", "women")
        .where("toDisplay", "==", true);

    const paginatedQuery = getPaginationQuery(baseQuery, lastDocId, limit);
    const snapshot = await paginatedQuery.get();

    const results = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    if (results.length === 0) {
      return res.status(404).json({message: "No products found for women."});
    }
    const hasMore = results.length === limit;
    res.status(200).json({
      products: results,
      hasMore,
      lastDocId: results[results.length - 1]?.id,
    });
  } catch (error) {
    console.error("Error fetching women products:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});

// GET /accessories
router.get("/accessories", async (req, res) => {
  try {
    let {lastDocId, limit = 20} = req.query;
    limit = parseInt(limit, 10);
    const productsRef = db.collection("products");
    const baseQuery = productsRef
        .where("categories", "array-contains", "accessories")
        .where("toDisplay", "==", true);

    const paginatedQuery = getPaginationQuery(baseQuery, lastDocId, limit);
    const snapshot = await paginatedQuery.get();

    const results = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    if (results.length === 0) {
      return res.status(404).json({message: "No products found for accessories."});
    }
    const hasMore = results.length === limit;
    res.status(200).json({
      products: results,
      hasMore,
      lastDocId: results[results.length - 1]?.id,
    });
  } catch (error) {
    console.error("Error fetching accessories products:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});

// GET /topRated
router.get("/topRated", async (req, res) => {
  try {
    let {lastDocId, limit = 20} = req.query;
    limit = parseInt(limit, 10);
    const productsRef = db.collection("products");

    // Base query to ensure only displayable products
    const baseQuery = productsRef
        .where("toDisplay", "==", true)
        .orderBy("rating", "desc")
        .orderBy("createdAt", "desc");

    // Create paginated query
    let paginatedQuery = baseQuery.limit(limit);

    // If lastDocId is provided, start after that document
    if (lastDocId) {
      const lastDocRef = db.collection("products").doc(lastDocId);
      const lastDocSnapshot = await lastDocRef.get();

      // Ensure the last document exists and has the data we need
      if (lastDocSnapshot.exists) {
        const lastDoc = lastDocSnapshot.data();
        paginatedQuery = baseQuery
            .startAfter(lastDoc.rating, lastDoc.createdAt)
            .limit(limit);
      }
    }

    // Execute the query
    const snapshot = await paginatedQuery.get();

    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (results.length === 0) {
      return res.status(404).json({message: "No top-rated products found."});
    }

    const hasMore = results.length === limit;
    res.status(200).json({
      products: results,
      hasMore,
      lastDocId: results[results.length - 1]?.id,
    });
  } catch (error) {
    console.error("Error fetching top-rated products:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});

// GET /topDiscounts
router.get("/topDiscounts", async (req, res) => {
  try {
    let {lastDocId, limit = 10} = req.query;
    limit = parseInt(limit, 10);
    const productsRef = db.collection("products");

    // Fetch all products that can be displayed
    const snapshot = await productsRef
        .where("toDisplay", "==", true)
        .get();

    // Process products and calculate discount percentages
    const productsWithDiscounts = snapshot.docs
        .map((doc) => {
          const productData = doc.data();

          // Expanded calculation logic with more robust error handling
          let discountPercentage = 0;
          if (
            productData.price &&
          productData.discountedPrice &&
          productData.price > 0 &&
          productData.discountedPrice < productData.price
          ) {
            discountPercentage = Math.round(
                ((productData.price - productData.discountedPrice) / productData.price) * 100,
            );
          }

          return {
            id: doc.id,
            ...productData,
            discountPercentage,
            originalPrice: productData.price,
            discountedPrice: productData.discountedPrice,
          };
        })
    // Only sort and filter if you want to show only products with discounts
        .sort((a, b) => b.discountPercentage - a.discountPercentage);

    // Apply pagination
    const startIndex = lastDocId ?
      productsWithDiscounts.findIndex((product) => product.id === lastDocId) + 1 :
      0;

    const results = productsWithDiscounts.slice(startIndex, startIndex + limit);

    if (results.length === 0) {
      return res.status(404).json({message: "No products found."});
    }

    const hasMore = startIndex + limit < productsWithDiscounts.length;
    res.status(200).json({
      products: results,
      hasMore,
      totalProducts: productsWithDiscounts.length,
      lastDocId: results[results.length - 1]?.id,
    });
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    res.status(500).json({message: "Error fetching products"});
  }
});

module.exports = router;
