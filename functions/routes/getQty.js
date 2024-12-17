/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
// const admin = require("firebase-admin");
// const db = admin.firestore();

const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();

// POST /getQty
router.post("/", async (req, res) => {
  try {
    const {pid, color, heightType, size} = req.body;

    // Input validation
    if (!pid || !color || !heightType || !size) {
      return res.status(400).json({message: "Missing required fields."});
    }

    // Fetch the product by ID
    const productRef = db.collection("products").doc(pid);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({message: "Product not found."});
    }

    const product = productDoc.data();
    let quantity;

    // Validate heightType
    const validHeightTypes = ["normal", "aboveHeight", "belowHeight"];
    if (!validHeightTypes.includes(heightType)) {
      return res.status(400).json({message: "Invalid height type."});
    }

    // Handle height types
    if (heightType === "normal") {
      if (product.quantities?.[color]?.[size] !== undefined) {
        quantity = product.quantities[color][size];
        return res.status(200).json({quantity});
      }
    } else {
      const targetArray =
        heightType === "aboveHeight" ?
          product.aboveHeight?.quantities :
          product.belowHeight?.quantities;

      if (targetArray?.[color]?.[size] !== undefined) {
        quantity = targetArray[color][size];
        return res.status(200).json({quantity});
      }
    }

    // If no quantity is found
    return res.status(404).json({message: "Quantity not found for the given criteria."});
  } catch (error) {
    console.error("Error fetching quantity:", error);
    return res.status(500).json({message: "Internal server error."});
  }
});

module.exports = router;


// /* eslint-disable new-cap */
// /* eslint-disable max-len */
// const express = require("express");
// const admin = require("firebase-admin");
// const router = express.Router();
// const db = admin.firestore();

// // POST /getQty
// router.post("/", async (req, res) => {
//   try {
//     const {pid, color, heightType, size} = req.body;

//     // Fetch the product by ID
//     const productRef = db.collection("products").doc(pid);
//     const productDoc = await productRef.get();

//     if (!productDoc.exists) {
//       return res.status(404).json({message: "Product not found."});
//     }

//     const product = productDoc.data();
//     let quantity;

//     // Validate heightType
//     const validHeightTypes = ["normal", "aboveHeight", "belowHeight"];
//     if (!validHeightTypes.includes(heightType)) {
//       return res.status(400).json({message: "Invalid height type."});
//     }

//     // Check if height is normal
//     if (heightType === "normal") {
//       // Check if color exists in quantities
//       if (product.quantities[color] && product.quantities[color][size] !== undefined) {
//         quantity = product.quantities[color][size];
//         return res.status(200).json({quantity});
//       }
//     } else {
//       // Check specific height arrays (aboveHeight or belowHeight)
//       const targetArray = heightType === "aboveHeight" ? product.aboveHeight.quantities : product.belowHeight.quantities;

//       // Check if color exists in target array
//       const qtyInfo = targetArray[color] && targetArray[color][size];
//       if (qtyInfo !== undefined) {
//         return res.status(200).json({quantity: qtyInfo});
//       }
//     }

//     // If no quantity is found
//     return res.status(404).json({message: "Quantity not found for the given criteria."});
//   } catch (error) {
//     console.error("Error fetching quantity:", error);
//     return res.status(500).json({message: "Error fetching quantity."});
//   }
// });

// module.exports = router;
