/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const {getFirestore} = require("firebase-admin/firestore");
const db = getFirestore();
const logger = require("firebase-functions/logger");

// Get carousel banners
router.get("/carouselBanners", async (req, res) => {
  try {
    const adminDocRef = db.collection("controls").doc("admin");
    const adminDoc = await adminDocRef.get();

    if (!adminDoc.exists) {
      return res.status(404).json({error: "Admin document not found"});
    }

    const data = adminDoc.data();
    const carouselBanners = data.carouselBanners || [];

    // Extract only the URLs for the frontend
    const bannerUrls = carouselBanners.map((banner) => banner.url);

    return res.status(200).json(bannerUrls);
  } catch (error) {
    logger.error("Error fetching carousel banners:", error);
    return res.status(500).json({error: "Failed to fetch carousel banners"});
  }
});

// Get navbar posters
router.get("/navbarPosters", async (req, res) => {
  try {
    const adminDocRef = db.collection("controls").doc("admin");
    const adminDoc = await adminDocRef.get();

    if (!adminDoc.exists) {
      return res.status(404).json({error: "Admin document not found"});
    }

    const data = adminDoc.data();
    const navbarPosters = data.navbarPosters || {
      men: "",
      women: "",
      accessories: "",
    };

    return res.status(200).json(navbarPosters);
  } catch (error) {
    logger.error("Error fetching navbar posters:", error);
    return res.status(500).json({error: "Failed to fetch navbar posters"});
  }
});

// Get highlight posters
router.get("/highlightPosters", async (req, res) => {
  try {
    const adminDocRef = db.collection("controls").doc("admin");
    const adminDoc = await adminDocRef.get();

    if (!adminDoc.exists) {
      return res.status(404).json({error: "Admin document not found"});
    }

    const data = adminDoc.data();
    const highlightPosters = data.highlightPosters || {
      highlight: {image: "", heading: "", category: ["", ""]},
      bestSeller: {image: ""},
      sale: {image: ""},
    };

    return res.status(200).json(highlightPosters);
  } catch (error) {
    logger.error("Error fetching highlight posters:", error);
    return res.status(500).json({error: "Failed to fetch highlight posters"});
  }
});

module.exports = router;
