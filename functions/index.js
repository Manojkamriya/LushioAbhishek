const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const {Timestamp} = require("firebase-admin/firestore");

admin.initializeApp();

const db = admin.firestore();
const app = express();

app.use(cors({origin: true}));
app.use(express.json());


// code here

exports.api = functions.https.onRequest(app);
