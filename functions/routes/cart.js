/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// Add to cart
router.post("/add", async (req, res) => {
  try {
    const {uid, productId, quantity, color, size, height} = req.body;

    if (!uid || !productId || !quantity) {
      return res.status(400).json({error: "Missing required fields"});
    }

    const productsRef = db.collection("products").doc(productId);
    const productSnapshot = await productsRef.get();

    // Check if the product exists
    if (!productSnapshot.exists) {
      return res.status(400).json({message: "Invalid product ID"});
    }

    // Create a new cart document if it doesn't exist
    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    const userCartSnapshot = await userCartRef.get();

    if (!userCartSnapshot.exists) {
      await userCartRef.set({
        cartCoupon: null,
        cartAddress: null,
        createdAt: new Date(),
      });
    }

    // Reference to cartItems subcollection
    const cartItemsRef = userCartRef.collection("cartItems");

    // Check for an identical item in the cart
    const identicalItemSnapshot = await cartItemsRef
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

      await identicalItemDoc.ref.update({
        quantity: Number(existingQuantity) + Number(quantity),
        updatedAt: new Date(),
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
        updatedAt: new Date(),
      };

      const newCartItemRef = await cartItemsRef.add(cartItem);

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

    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    const cartItemRef = userCartRef.collection("cartItems").doc(cartItemId);
    await cartItemRef.delete();

    res.status(200).json({message: "Item removed from cart successfully"});
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({error: "Failed to remove item from cart"});
  }
});

// Debug api
router.post("/debug-cart", async (req, res) => {
  try {
    const {uid} = req.body;
    const results = {
      cartDocument: null,
      cartItems: [],
      paths: {
        cartPath: null,
        itemsPath: null,
      },
      exists: {
        cartExists: false,
        hasItems: false,
      },
    };

    // Check cart document
    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    results.paths.cartPath = userCartRef.path;

    const cartSnapshot = await userCartRef.get();
    results.exists.cartExists = cartSnapshot.exists;
    if (cartSnapshot.exists) {
      results.cartDocument = cartSnapshot.data();
    }

    // Check cart items
    const cartItemsCollection = userCartRef.collection("cartItems");
    results.paths.itemsPath = cartItemsCollection.path;

    const itemsSnapshot = await cartItemsCollection.get();
    results.exists.hasItems = !itemsSnapshot.empty;

    itemsSnapshot.forEach((doc) => {
      results.cartItems.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Cart debug error:", error);
    res.status(500).json({
      error: "Failed to debug cart",
      details: error.message,
    });
  }
});

// Batch delete items from cart
router.post("/batch-delete", async (req, res) => {
  try {
    const {uid, itemIds} = req.body;
    console.log("\n=== Starting batch delete operation ===");
    console.log("Input received:", {uid, itemIds});

    // Input validation
    if (!uid || !itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      console.error("Invalid input:", {uid, itemIds});
      return res.status(400).json({
        error: "Invalid input",
        details: "Must provide uid and non-empty array of itemIds",
      });
    }

    // Reference to the user's active cart
    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    console.log("Cart reference path:", userCartRef.path);

    // First verify the cart exists and log its contents
    const cartSnapshot = await userCartRef.get();
    console.log("\n=== Cart Verification ===");
    console.log(`Cart exists: ${cartSnapshot.exists}`);
    if (cartSnapshot.exists) {
      console.log("Cart data:", cartSnapshot.data());
    }

    // Get all items in the cart for verification
    const cartItemsCollection = userCartRef.collection("cartItems");
    const allCartItems = await cartItemsCollection.get();

    console.log("\n=== Current Cart Contents ===");
    console.log(`Total items in cart: ${allCartItems.size}`);
    const existingItems = new Map();

    allCartItems.forEach((doc) => {
      console.log(`Found item - ID: ${doc.id}`);
      console.log(`Item data:`, doc.data());
      existingItems.set(doc.id, doc.data());
    });

    // Process deletions
    const batch = db.batch();
    const failedDeletions = [];
    const successfulDeletions = [];
    let successCount = 0;

    // Check each requested item
    console.log("\n=== Processing Requested Deletions ===");
    for (const itemId of itemIds) {
      console.log(`\nProcessing item: ${itemId}`);
      console.log(`Checking if item exists in cart items map...`);

      if (existingItems.has(itemId)) {
        console.log(`✓ Found item ${itemId} in cart`);
        const itemRef = cartItemsCollection.doc(itemId);
        batch.delete(itemRef);
        successfulDeletions.push({
          itemId,
          data: existingItems.get(itemId),
        });
        successCount++;
      } else {
        console.log(`✗ Item ${itemId} not found in cart`);
        failedDeletions.push({
          itemId,
          reason: "Item not found in cart",
          path: `${cartItemsCollection.path}/${itemId}`,
          availableIds: Array.from(existingItems.keys()),
        });
      }
    }

    // Execute batch if there are items to delete
    if (successCount > 0) {
      console.log(`\n=== Executing batch deletion for ${successCount} items ===`);
      await batch.commit();
      console.log("Batch deletion completed");
    } else {
      console.log("No items to delete");
    }

    // Final verification
    console.log("\n=== Final Verification ===");
    const updatedCartItems = await cartItemsCollection.get();
    const remainingItems = [];
    updatedCartItems.forEach((doc) => {
      remainingItems.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    // Prepare response
    const response = {
      message: `Batch deletion processed`,
      debug: {
        cartExists: cartSnapshot.exists,
        totalItemsBeforeDeletion: allCartItems.size,
        totalItemsAfterDeletion: updatedCartItems.size,
        requestedIds: itemIds,
        availableItemIds: Array.from(existingItems.keys()),
      },
      summary: {
        totalRequested: itemIds.length,
        successfullyDeleted: successCount,
        failed: failedDeletions.length,
      },
      successfulDeletions: successfulDeletions.length > 0 ? successfulDeletions : undefined,
      failedDeletions: failedDeletions.length > 0 ? failedDeletions : undefined,
      remainingItems: remainingItems,
    };

    console.log("\n=== Operation complete ===");
    console.log("Final response:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("\n=== Error in batch delete operation ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Failed to process batch deletion",
      details: error.message,
      stack: error.stack,
    });
  }
});

// Get cart items with product details
router.get("/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    const userCartSnapshot = await userCartRef.get();

    // Get cart details including coupon and address
    const cartDetails = userCartSnapshot.exists ?
      {id: userCartSnapshot.id, ...userCartSnapshot.data()} :
      null;

    const cartItemsRef = userCartRef.collection("cartItems");
    const snapshot = await cartItemsRef.get();

    let productsRemoved = false;

    // Fetch product details while filtering out missing products
    const cartItems = (await Promise.all(snapshot.docs.map(async (doc) => {
      const cartItem = {id: doc.id, ...doc.data()};

      // Fetch product details using the productId from the cart item
      const productRef = db.collection("products").doc(cartItem.productId);
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

    // Send response with cart details, cart items, and a flag indicating if products were removed
    res.status(200).json({
      cart: cartDetails,
      cartItems,
      productsRemoved,
    });
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

    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    const cartItemRef = userCartRef.collection("cartItems").doc(cartItemId);

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

// Get cart address
router.get("/address/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    const cartSnapshot = await userCartRef.get();

    if (!cartSnapshot.exists) {
      return res.status(404).json({error: "Cart not found"});
    }

    const cartData = cartSnapshot.data();
    res.status(200).json({cartAddress: cartData.cartAddress});
  } catch (error) {
    console.error("Error fetching cart address:", error);
    res.status(500).json({error: "Failed to fetch cart address"});
  }
});

// Set cart address
router.post("/address/:uid", async (req, res) => {
  try {
    const {uid} = req.params;
    const {
      areaDetails,
      contactNo,
      country,
      flatDetails,
      isDefault,
      landmark,
      name,
      pinCode,
      state,
      townCity,
    } = req.body;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    // Validate required address fields
    const missingFields = [];
    const requiredFields = {
      name: name,
      contactNo: contactNo,
      flatDetails: flatDetails,
      areaDetails: areaDetails,
      pinCode: pinCode,
      townCity: townCity,
      state: state,
      country: country,
    };

    // Check each required field and add to missingFields if empty
    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value || value.trim() === "") {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required address fields",
        missingFields: missingFields,
      });
    }

    // Process and validate phone number
    const processPhoneNumber = (phoneNumber) => {
      // Remove any non-digit characters
      const cleanNumber = phoneNumber.replace(/\D/g, "");

      // Check if number starts with country code '91'
      const hasCountryCode = cleanNumber.startsWith("91");

      // Extract the actual phone number (last 10 digits)
      const actualNumber = cleanNumber.slice(-10);

      // If number doesn't have country code 91, add it
      const countryCode = hasCountryCode ? "91" : "91";

      return {
        fullNumber: `${countryCode}${actualNumber}`,
        isValid: /^[6-9]\d{9}$/.test(actualNumber),
      };
    };

    const phoneDetails = processPhoneNumber(contactNo);

    if (!phoneDetails.isValid) {
      return res.status(400).json({
        error: "Invalid contact number format",
        details: "Contact number must be a valid 10-digit Indian mobile number",
      });
    }

    // Validate pincode format (6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pinCode)) {
      return res.status(400).json({
        error: "Invalid pincode format",
        details: "Pincode must be a 6-digit number",
      });
    }

    const cartAddress = {
      areaDetails,
      contactNo: phoneDetails.fullNumber, // Store the full number with country code
      country,
      flatDetails,
      isDefault: isDefault || false,
      landmark: landmark || "",
      name,
      pinCode,
      state,
      townCity,
    };

    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    await userCartRef.set({
      cartAddress,
      updatedAt: new Date(),
    }, {merge: true});

    res.status(200).json({cartAddress});
  } catch (error) {
    console.error("Error setting cart address:", error);
    res.status(500).json({error: "Failed to set cart address"});
  }
});

// Get cart coupon
router.get("/coupon/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    const cartSnapshot = await userCartRef.get();

    if (!cartSnapshot.exists) {
      return res.status(404).json({error: "Cart not found"});
    }

    const cartData = cartSnapshot.data();
    res.status(200).json({cartCoupon: cartData.cartCoupon});
  } catch (error) {
    console.error("Error fetching cart coupon:", error);
    res.status(500).json({error: "Failed to fetch cart coupon"});
  }
});

// Set cart coupon
router.post("/coupon/:uid", async (req, res) => {
  try {
    const {uid} = req.params;
    const {couponCode} = req.body;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    if (!couponCode) {
      return res.status(400).json({error: "Missing coupon code"});
    }

    // Check if coupon exists in the coupon collection
    const couponRef = db.collection("coupons").doc(couponCode);
    const couponSnapshot = await couponRef.get();

    if (!couponSnapshot.exists) {
      return res.status(404).json({error: "Invalid coupon code"});
    }

    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    await userCartRef.set({
      cartCoupon: couponCode,
      updatedAt: new Date(),
    }, {merge: true});

    // Return both coupon code and coupon details
    res.status(200).json({
      cartCoupon: couponCode,
      couponDetails: couponSnapshot.data(),
    });
  } catch (error) {
    console.error("Error setting cart coupon:", error);
    res.status(500).json({error: "Failed to set cart coupon"});
  }
});

// Cart count
router.get("/count/:uid", async (req, res) => {
  try {
    const {uid} = req.params;

    if (!uid) {
      return res.status(400).json({error: "Missing user ID"});
    }

    const userCartRef = db.collection("users").doc(uid).collection("carts").doc("activeCart");
    const cartItemsRef = userCartRef.collection("cartItems");
    const snapshot = await cartItemsRef.count().get();

    res.status(200).json({count: snapshot.data().count});
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({error: "Failed to fetch cart count"});
  }
});

module.exports = router;

// /* eslint-disable new-cap */
// /* eslint-disable max-len */
// const express = require("express");
// const router = express.Router();
// const admin = require("firebase-admin");

// // Add to cart
// router.post("/add", async (req, res) => {
//   try {
//     const {uid, productId, quantity, color, size, height} = req.body;

//     if (!uid || !productId || !quantity) {
//       return res.status(400).json({error: "Missing required fields"});
//     }

//     const productsRef = admin.firestore().collection("products").doc(productId);
//     const productSnapshot = await productsRef.get();

//     // Check if the product exists
//     if (!productSnapshot.exists) {
//       return res.status(400).json({message: "Invalid product ID"});
//     }

//     const cartRef = admin.firestore().collection("users").doc(uid).collection("cart");

//     // Check for an identical item in the cart
//     const identicalItemSnapshot = await cartRef
//         .where("productId", "==", productId)
//         .where("color", "==", color || null)
//         .where("size", "==", size || null)
//         .where("height", "==", height || null)
//         .limit(1)
//         .get();

//     if (!identicalItemSnapshot.empty) {
//       // If an identical item exists, increase the quantity
//       const identicalItemDoc = identicalItemSnapshot.docs[0];
//       const existingQuantity = identicalItemDoc.data().quantity;

//       await cartRef.doc(identicalItemDoc.id).update({
//         quantity: Number(existingQuantity) + Number(quantity),
//       });

//       return res.status(200).json({message: "Quantity updated for identical item in cart"});
//     } else {
//       // If no identical item exists, add the new item to the cart
//       const cartItem = {
//         productId,
//         quantity,
//         color: color || null,
//         size: size || null,
//         height: height || null,
//         createdAt: new Date(),
//       };

//       const newCartItemRef = await cartRef.add(cartItem);

//       res.status(201).json({id: newCartItemRef.id, ...cartItem});
//     }
//   } catch (error) {
//     console.error("Error adding item to cart:", error);
//     res.status(500).json({error: "Failed to add item to cart"});
//   }
// });

// // Delete from cart
// router.delete("/delete/:cartItemId", async (req, res) => {
//   try {
//     const {uid} = req.body;
//     const {cartItemId} = req.params;

//     if (!uid || !cartItemId) {
//       return res.status(400).json({error: "Missing required fields"});
//     }

//     const cartItemRef = admin.firestore().collection("users").doc(uid).collection("cart").doc(cartItemId);
//     await cartItemRef.delete();

//     res.status(200).json({message: "Item removed from cart successfully"});
//   } catch (error) {
//     console.error("Error removing item from cart:", error);
//     res.status(500).json({error: "Failed to remove item from cart"});
//   }
// });

// // Get cart items with product details
// router.get("/:uid", async (req, res) => {
//   try {
//     const {uid} = req.params;

//     if (!uid) {
//       return res.status(400).json({error: "Missing user ID"});
//     }

//     const cartRef = admin.firestore().collection("users").doc(uid).collection("cart");
//     const snapshot = await cartRef.get();

//     let productsRemoved = false;

//     // Fetch product details while filtering out missing products
//     const cartItems = (await Promise.all(snapshot.docs.map(async (doc) => {
//       const cartItem = {id: doc.id, ...doc.data()};

//       // Fetch product details using the productId from the cart item
//       const productRef = admin.firestore().collection("products").doc(cartItem.productId);
//       const productSnapshot = await productRef.get();

//       if (productSnapshot.exists) {
//         // Attach product data if it exists
//         cartItem.product = {id: productSnapshot.id, ...productSnapshot.data()};
//         return cartItem;
//       } else {
//         // If the product does not exist, mark productsRemoved as true and delete the cart item
//         productsRemoved = true;
//         await doc.ref.delete();
//         return null; // Filter out this item
//       }
//     }))).filter((item) => item !== null); // Remove null items (deleted products)

//     // Send response with a flag indicating if products were removed
//     res.status(200).json({cartItems, productsRemoved});
//   } catch (error) {
//     console.error("Error fetching cart items with product details:", error);
//     res.status(500).json({error: "Failed to fetch cart items"});
//   }
// });

// // Update cart item
// router.put("/update/:cartItemId", async (req, res) => {
//   try {
//     const {uid, quantity, color, size, height} = req.body;
//     const {cartItemId} = req.params;

//     if (!uid || !cartItemId) {
//       return res.status(400).json({error: "Missing required fields"});
//     }

//     const cartItemRef = admin.firestore().collection("users").doc(uid).collection("cart").doc(cartItemId);

//     const updateData = {};
//     if (quantity !== undefined) updateData.quantity = quantity;
//     if (color !== undefined) updateData.color = color;
//     if (size !== undefined) updateData.size = size;
//     if (height !== undefined) updateData.height = height;
//     updateData.updatedAt = new Date();

//     await cartItemRef.update(updateData);

//     const updatedDoc = await cartItemRef.get();

//     if (!updatedDoc.exists) {
//       return res.status(404).json({error: "Cart item not found"});
//     }

//     res.status(200).json({id: updatedDoc.id, ...updatedDoc.data()});
//   } catch (error) {
//     console.error("Error updating cart item:", error);
//     res.status(500).json({error: "Failed to update cart item"});
//   }
// });

// // Cart count
// router.get("/count/:uid", async (req, res) => {
//   try {
//     const {uid} = req.params;

//     if (!uid) {
//       return res.status(400).json({error: "Missing user ID"});
//     }

//     const cartRef = admin.firestore().collection("users").doc(uid).collection("cart");
//     const snapshot = await cartRef.count().get();

//     res.status(200).json({count: snapshot.data().count});
//   } catch (error) {
//     console.error("Error fetching cart count:", error);
//     res.status(500).json({error: "Failed to fetch cart count"});
//   }
// });

// module.exports = router;
