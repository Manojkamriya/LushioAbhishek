/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp({
  storageBucket: "lushio-fitness.appspot.com",
});

const app = express();

app.use(cors({origin: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Import cron jobs
const {assignBirthdayCoins, assignAnniversaryCoins} = require("./cronjobs/birthdayAnniversaryCoins.js");
const {removeExpiredCoins} = require("./cronjobs/expireCoins.js");
const {assignAccountAgeCoins} = require("./cronjobs/accountAgeCoins.js");

// Import routes
const userRoutes = require("./routes/users.js");
const productsRoute = require("./routes/products.js");
const reviewRoute = require("./routes/reviews.js");
const walletRoute = require("./routes/wallet.js");

// User routes
app.use("/user", userRoutes);

// Products routes
app.use("/products", productsRoute);

// Review routes
app.use("/reviews", reviewRoute);

// Wallet routes
app.use("/wallet", walletRoute);

// Export the API
exports.api = functions.https.onRequest(app);

// Export the cron job

// birthday
exports.assignBirthdayCoins = assignBirthdayCoins;

// anniversary
exports.assignAnniversaryCoins = assignAnniversaryCoins;

// account age
exports.assignAccountAgeCoins = assignAccountAgeCoins;

// expire coins
exports.removeExpiredCoins = removeExpiredCoins;

