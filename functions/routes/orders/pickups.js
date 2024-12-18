/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const axios = require("axios");
const {generateToken, destroyToken} = require("./shipRocketAuth");

const router = express.Router();
const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;

// Route to get all pickup locations
router.get("/pickup-locations", async (req, res) => {
  try {
    // Generate the bearer token
    const token = await generateToken();

    // API call to get pickup locations
    const response = await axios.get(`${SHIPROCKET_API_URL}/settings/company/pickup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Destroy the token
    await destroyToken(token);

    // Return the response data
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching pickup locations:", error);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal server error",
    });
  }
});

// Route to add a new pickup location
router.post("/add", async (req, res) => {
  try {
    // Extract pickup location data from the request body
    const pickupLocationData = req.body;

    // Generate the bearer token
    const token = await generateToken();

    // API call to add a new pickup location
    const response = await axios.post(`${SHIPROCKET_API_URL}/settings/company/addpickup`, pickupLocationData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Destroy the token
    await destroyToken(token);

    // Return the response data
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error adding pickup location:", error);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal server error",
    });
  }
});

module.exports = router;
