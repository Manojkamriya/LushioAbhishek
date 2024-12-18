/* eslint-disable max-len */
const {initializeApp} = require("firebase-admin/app");
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
initializeApp({
  storageBucket: "lushio-fitness.appspot.com",
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CORS pre-flight handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

// ENV setup
const envPath = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
require("dotenv-safe").config({
  path: envPath,
  allowEmptyValues: true,
  example: ".env",
});

// Mini Debugging
// console.log("Loaded NODE_ENV:", process.env.NODE_ENV);
// console.log("Using env file:", path);
// console.log("Loaded API URL:", process.env.REACT_APP_API_URL);
// console.log("Loaded Frontend URL:", process.env.REACT_APP_FRONTEND_URL);

// Extreme Debugging
// console.log("Loaded environment variables:", process.env);

// Import routes
const userRoutes = require("./routes/users.js");
const productsRoute = require("./routes/products.js");
const reviewRoute = require("./routes/reviews.js");
const walletRoute = require("./routes/wallet.js");
const cartRoute = require("./routes/cart.js");
const wishlistRoute = require("./routes/wishlist.js");
const productFilterRoute = require("./routes/productFilters.js");
const getQtyRoute = require("./routes/getQty.js");
const couponRoute = require("./routes/coupons.js");
const subscribeRoute = require("./routes/subscribe.js");
const getCategoriesRoute = require("./routes/categories.js");
const ordersRoute = require("./routes/orders/orders.js");
const pickupRoute = require("./routes/orders/pickups.js");
const paymentRoute = require("./routes/payment.js");

// Use routes
app.use("/user", userRoutes);
app.use("/products", productsRoute);
app.use("/filters", productFilterRoute);
app.use("/getQty", getQtyRoute);
app.use("/reviews", reviewRoute);
app.use("/wallet", walletRoute);
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);
app.use("/coupon", couponRoute);
app.use("/subscribe", subscribeRoute);
app.use("/subCategories", getCategoriesRoute);
app.use("/orders", ordersRoute);
app.use("/pickup", pickupRoute);
app.use("/payment", paymentRoute);

// Export API
exports.api = onRequest(
    {
      region: "us-central1", // Default region
      timeoutSeconds: 60, // Increase timeout if needed
      maxInstances: 10, // Prevent scaling issues
    },
    app,
);

// Import and export cloud functions
exports.generateReferralCode = require("./cloudFunctions/generateReferralCode.js");

// Import and export cron jobs
exports.assignBirthdayCoins = require("./cronjobs/birthdayAnniversaryCoins.js").assignBirthdayCoins;
exports.assignAnniversaryCoins = require("./cronjobs/birthdayAnniversaryCoins.js").assignAnniversaryCoins;
exports.assignAccountAgeCoins = require("./cronjobs/accountAgeCoins.js");
exports.removeExpiredCoins = require("./cronjobs/expireCoins.js");


// /* eslint-disable max-len */
// const {initializeApp} = require("firebase-admin/app");
// // const {getStorage} = require("firebase-admin/storage");
// const {onRequest} = require("firebase-functions/v2/https");
// // const {onSchedule} = require("firebase-functions/v2/scheduler");
// const express = require("express");
// const cors = require("cors");

// // Initialize Firebase Admin
// initializeApp({
//   storageBucket: "lushio-fitness.appspot.com",
// });

// const app = express();

// app.use(cors({origin: true}));

// // CORS pre-flight handeling
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   if (req.method === "OPTIONS") {
//     return res.status(200).json({});
//   }
//   next();
// });

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

// // ENV setup
// const path = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

// require("dotenv-safe").config({
//   path,
//   allowEmptyValues: true,
//   example: ".env",
// });

// // Mini Debugging
// // console.log("Loaded NODE_ENV:", process.env.NODE_ENV);
// // console.log("Using env file:", path);
// // console.log("Loaded API URL:", process.env.REACT_APP_API_URL);
// // console.log("Loaded Frontend URL:", process.env.REACT_APP_FRONTEND_URL);

// // Extreme Debugging
// // console.log("Loaded environment variables:", process.env);

// // Import cron jobs
// const {assignBirthdayCoins, assignAnniversaryCoins} = require("./cronjobs/birthdayAnniversaryCoins.js");
// const {removeExpiredCoins} = require("./cronjobs/expireCoins.js");
// const {assignAccountAgeCoins} = require("./cronjobs/accountAgeCoins.js");

// // Import routes
// const userRoutes = require("./routes/users.js");
// const productsRoute = require("./routes/products.js");
// const reviewRoute = require("./routes/reviews.js");
// const walletRoute = require("./routes/wallet.js");
// const cartRoute = require("./routes/cart.js");
// const wishlistRoute = require("./routes/wishlist.js");
// const productFilterRoute = require("./routes/productFilters.js");
// const getQtyRoute = require("./routes/getQty.js");
// const couponRoute = require("./routes/coupons.js");
// const subscribeRoute = require("./routes/subscribe.js");
// const getCategoriesRoute = require("./routes/categories.js");
// const ordersRoute = require("./routes/orders.js");
// const paymentRoute = require("./routes/payment.js");

// // Import cloud functions
// const generateReferralCode = require("./cloudFunctions/generateReferralCode.js");
// const checkDuplicateUser = require("./cloudFunctions/checkDuplicateUser.js");

// // Export cloud functions
// exports.generateReferralCode = generateReferralCode;
// exports.checkDuplicateUser = checkDuplicateUser;

// // User routes
// app.use("/user", userRoutes);

// // Products routes
// app.use("/products", productsRoute);

// // Products Filter routes
// app.use("/filters", productFilterRoute);

// // getQty routes
// app.use("/getQty", getQtyRoute);

// // Review routes
// app.use("/reviews", reviewRoute);

// // Wallet routes
// app.use("/wallet", walletRoute);

// // Cart routes
// app.use("/cart", cartRoute);

// // Whishlist routes
// app.use("/wishlist", wishlistRoute);

// // Coupon routes
// app.use("/coupon", couponRoute);

// // Subscribe routes
// app.use("/subscribe", subscribeRoute);

// // Search routes
// app.use("/subCategories", getCategoriesRoute);

// // Orders routes
// app.use("/orders", ordersRoute);

// // Payment routes
// app.use("/payment", paymentRoute);

// // Main API function
// exports.api = onRequest((req, res) => {
//   // CORS handling
//   res.set("Access-Control-Allow-Origin", "*");

//   // Delegate to Express app
//   app(req, res);
// });

// // Export the cron job

// // birthday
// exports.assignBirthdayCoins = assignBirthdayCoins;

// // anniversary
// exports.assignAnniversaryCoins = assignAnniversaryCoins;

// // account age
// exports.assignAccountAgeCoins = assignAccountAgeCoins;

// // expire coins
// exports.removeExpiredCoins = removeExpiredCoins;
