/* eslint-disable max-len */
const {getFirestore} = require("firebase-admin/firestore");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");

// Initialize Firestore
const db = getFirestore();

// Maximum number of orders to process in a single batch
const BATCH_SIZE = 500;
// Maximum number of batches to process in a single function execution
// Adjust based on your function timeout settings and expected volume
const MAX_BATCHES = 10;

// Cloud function that runs on a schedule (e.g., every hour)
const autoCompleteOrders = onSchedule("every 1 hours", async (event) => {
  const now = new Date();
  let lastDocumentSnapshot = null;
  let batchCount = 0;
  let totalUpdated = 0;

  try {
    // Process batches until we either:
    // 1. Run out of orders to process
    // 2. Reach MAX_BATCHES limit to avoid timeout
    while (batchCount < MAX_BATCHES) {
      // Create the initial query
      let query = db.collection("orders")
          .where("status", "!=", "completed")
          .where("returnExchangeExpiresOn", "<", now)
          .limit(BATCH_SIZE);

      // If we have a last document from previous batch, start after it
      if (lastDocumentSnapshot) {
        query = query.startAfter(lastDocumentSnapshot);
      }

      // Execute the query
      const ordersToComplete = await query.get();

      // If no more orders to process, break the loop
      if (ordersToComplete.empty) {
        logger.log(`Completed processing all eligible orders. Total updated: ${totalUpdated}`);
        break;
      }

      // Save the last document for the next iteration
      lastDocumentSnapshot = ordersToComplete.docs[ordersToComplete.docs.length - 1];

      // Create a batch to update multiple orders efficiently
      const batch = db.batch();
      let batchUpdateCount = 0;

      ordersToComplete.forEach((doc) => {
        batch.update(doc.ref, {
          status: "completed",
          autoCompletedAt: new Date(),
          autoCompleted: true, // Optional flag to identify auto-completed orders
        });
        batchUpdateCount++;
      });

      // Commit the batch
      await batch.commit();

      // Update counters
      totalUpdated += batchUpdateCount;
      batchCount++;

      logger.log(`Processed batch ${batchCount}: Updated ${batchUpdateCount} orders`);

      // If the batch wasn't full, we've processed all orders
      if (ordersToComplete.size < BATCH_SIZE) {
        logger.log(`Completed processing all eligible orders. Total updated: ${totalUpdated}`);
        break;
      }
    }

    // If we've hit the MAX_BATCHES limit but there might be more to process
    if (batchCount >= MAX_BATCHES) {
      logger.log(`Reached maximum batch limit (${MAX_BATCHES}). Processed ${totalUpdated} orders. Remaining orders will be processed in the next execution.`);
    }
  } catch (error) {
    logger.error(`Error auto-completing orders after processing ${totalUpdated} orders:`, error);
  }
});

module.exports = autoCompleteOrders;
