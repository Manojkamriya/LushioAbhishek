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

// Import routes
const userRoutes = require("./routes/users.js");
const productsRoute = require("./routes/products.js");

// User routes
app.use("/user", userRoutes);

// Products routes
app.use("/products", productsRoute);

// Export the API
exports.api = functions.https.onRequest(app);
