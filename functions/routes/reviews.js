/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const admin = require("firebase-admin");
const db = admin.firestore();
const storage = admin.storage();
const router = express.Router();

// Allowed values for quality and fit
const allowedQualities = ["Poor", "Fair", "Good", "Excellent"];
const allowedFits = ["Too Small", "Slightly Small", "True to Size", "Slightly Large", "Too Large"];

// Add a review
router.post("/:productId", async (req, res) => {
  try {
    const {productId} = req.params;
    const {userId, starRating, review, quality, fit, media} = req.body;

    // Validate input
    if (!userId || !starRating || starRating > 5 || starRating < 0) {
      return res.status(400).json({error: "Missing required fields"});
    }

    // Validate quality and fit values
    if (!allowedQualities.includes(quality) || !allowedFits.includes(fit)) {
      return res.status(400).json({error: "Invalid quality or fit value"});
    }

    // Validate media as an array
    if (!Array.isArray(media)) {
      return res.status(400).json({error: "Media should be an array of URLs"});
    }

    // Create the review document
    const reviewData = {
      userId,
      productId,
      rating: Number(starRating),
      review,
      quality,
      fit,
      media,
      timestamp: new Date(),
    };

    // Add the review to the reviews collection
    const reviewRef = await db.collection("reviews").add(reviewData);

    // Add a reference to the review in the product's reviews subcollection
    const productRef = db.collection("products").doc(productId);
    // console.log(productRef);
    await productRef.collection("reviews").doc(reviewRef.id).set({});

    // Check if the product document exists
    const productDoc = await productRef.get();
    if (!productDoc.exists) {
      return res.status(404).json({error: "Product not found"});
    }

    // Get product data and calculate the new average rating
    const productData = productDoc.data();
    const oldRating = productData.rating || 0;
    const oldReviewCount = productData.reviewCount || 0;
    const newReviewCount = oldReviewCount + 1;
    const newRating = ((oldRating * oldReviewCount) + starRating) / newReviewCount;

    // Update the product's rating and review count
    await productRef.update({
      rating: newRating,
      reviewCount: newReviewCount,
    });

    return res.status(201).json({
      message: "Review added successfully",
      reviewId: reviewRef.id,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({error: "Failed to add review"});
  }
});

// Get reviews for a product
router.get("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const productRef = db.collection("products").doc(id);
    const reviewsRef = productRef.collection("reviews");

    const reviewsSnapshot = await reviewsRef.get();

    if (reviewsSnapshot.empty) {
      return res.status(404).json({message: "No reviews found for this product"});
    }

    const reviewIds = reviewsSnapshot.docs.map((doc) => doc.id);

    const reviewsData = await Promise.all(
        reviewIds.map(async (reviewId) => {
          const reviewDoc = await db.collection("reviews").doc(reviewId).get();
          const reviewData = reviewDoc.data();

          let formattedTimestamp = "Timestamp not available";

          // Check if timestamp exists and is valid before formatting
          if (reviewData && reviewData.timestamp && reviewData.timestamp.toDate) {
            const timestamp = reviewData.timestamp.toDate();
            formattedTimestamp = timestamp.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
              timeZoneName: "short",
            });
          }

          return {
            id: reviewId,
            ...reviewData,
            timestamp: formattedTimestamp,
          };
        }),
    );

    return res.status(200).json(reviewsData);
  } catch (error) {
    console.error("Error getting reviews:", error);
    return res.status(500).json({error: "Failed to get reviews"});
  }
});

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviewsSnapshot = await db.collection("reviews").get();

    if (reviewsSnapshot.empty) {
      return res.status(404).json({message: "No reviews found"});
    }

    const reviewsData = await Promise.all(
        reviewsSnapshot.docs.map(async (reviewDoc) => {
          const reviewData = reviewDoc.data();

          // Format the timestamp if it exists
          let formattedTimestamp = "Timestamp not available";
          if (reviewData && reviewData.timestamp && reviewData.timestamp.toDate) {
            const timestamp = reviewData.timestamp.toDate();
            formattedTimestamp = timestamp.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
              timeZoneName: "short",
            });
          }

          return {
            id: reviewDoc.id,
            ...reviewData,
            timestamp: formattedTimestamp,
          };
        }),
    );

    return res.status(200).json(reviewsData);
  } catch (error) {
    console.error("Error getting reviews:", error);
    return res.status(500).json({error: "Failed to get reviews"});
  }
});

// Delete a review
router.delete("/delete/:reviewId", async (req, res) => {
  try {
    const {reviewId} = req.params;
    const reviewRef = db.collection("reviews").doc(reviewId);

    // Check if the review exists
    const reviewDoc = await reviewRef.get();
    if (!reviewDoc.exists) {
      return res.status(404).json({error: "Review not found"});
    }

    const reviewData = reviewDoc.data();
    const {productId, rating, media} = reviewData;

    // Helper function to delete image from Firebase Storage
    const deleteImage = async (imageUrl) => {
      if (imageUrl) {
        try {
          const path = imageUrl.split("/o/")[1].split("?")[0];
          const decodedPath = decodeURIComponent(path);
          const fileRef = storage.bucket().file(decodedPath);
          await fileRef.delete();
        } catch (error) {
          if (error.code === 404 || error.message.includes("404")) {
            console.warn(`Image not found (404), skipping deletion: ${imageUrl}`);
            // Do not re-throw; continue with review deletion
          } else {
            console.error(`Failed to delete image: ${imageUrl}`, error);
            throw error; // Re-throw if it’s any other error
          }
        }
      }
    };

    // Delete media files from storage if they exist
    if (media && media.length > 0) {
      const deletePromises = media.map((mediaUrl) =>
        deleteImage(mediaUrl).catch((error) => {
          console.warn(`Failed to delete media file: ${mediaUrl}`, error);
        }),
      );

      // Wait for all media files to be deleted
      await Promise.all(deletePromises);
    }

    // Delete the review
    await reviewRef.delete();

    // Remove the reference from the product's reviews subcollection
    const productRef = db.collection("products").doc(productId);
    const productDoc = await productRef.get();
    if (productDoc.exists) {
      await productRef.collection("reviews").doc(reviewId).delete();

      // Update the product's rating and review count
      const productData = productDoc.data();
      const oldRating = productData.rating || 0;
      const oldReviewCount = productData.reviewCount || 0;
      const newReviewCount = oldReviewCount - 1;
      const newRating = newReviewCount > 0 ?
        ((oldRating * oldReviewCount) - rating) / newReviewCount :
        0;

      await productRef.update({
        rating: newRating,
        reviewCount: newReviewCount,
      });
    } else {
      console.warn(`Product with ID ${productId} does not exist; skipping subcollection and rating update.`);
    }

    return res.status(200).json({message: "Review and associated media successfully deleted"});
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({error: "Failed to delete review"});
  }
});

// Review approve route
router.post("/approve/:reviewId", async (req, res) => {
  const {reviewId} = req.params;
  const {approved} = req.body;

  try {
    // Fetch the review document to get userId
    const reviewRef = db.collection("reviews").doc(reviewId);
    const reviewSnap = await reviewRef.get();

    if (!reviewSnap.exists) {
      return res.status(404).send("Review not found.");
    }

    const reviewData = reviewSnap.data();
    const userId = reviewData.userId;

    // Check if the review is already approved
    if (!reviewData.approved && approved) {
      // Fetch admin controls data
      const controlsRef = db.collection("controls").doc("admin");
      const controlsSnap = await controlsRef.get();

      if (!controlsSnap.exists) {
        return res.status(404).send("Admin controls not found.");
      }

      const controlsData = controlsSnap.data();
      const reviewApprovedCoins = controlsData.reviewApprovedCoins;
      const reviewApprovedMessage = controlsData.reviewApprovedMessage;
      const reviewApprovedExpiry = controlsData.reviewApprovedExpiry;

      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + reviewApprovedExpiry);

      // Add a new document to the user's coins subcollection
      const coinsCollectionRef = db.collection(`users/${userId}/coins`);
      await coinsCollectionRef.add({
        amount: reviewApprovedCoins,
        expiry: expiryDate,
        message: reviewApprovedMessage,
      });

      // Update the review document with the approved value from the frontend
      await reviewRef.update({
        approved: approved,
      });

      res.status(200).send("Review approved and coins awarded successfully.");
    } else {
      return res.status(400).send("This review is already approved");
    }
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).send("Failed to approve review.");
  }
});

module.exports = router;
