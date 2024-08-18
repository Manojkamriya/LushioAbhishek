const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();

const app = express();

app.use(cors({origin: true}));
app.use(express.json());

// Import routes
const userRoutes = require("./routes/users.js");

// Use routes
app.use("/user", userRoutes);

// Export the API
exports.api = functions.https.onRequest(app);
