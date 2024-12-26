/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const axios = require("axios");
const {SHIPROCKET_API_URL, SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD} = process.env;

// Function to generate a token
async function generateToken() {
  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error("Error generating Shiprocket token:", error.message);
    throw new Error("Failed to generate token");
  }
}

// Function to destroy a token (if required by Shiprocket)
async function destroyToken(token) {
  try {
    await axios.post(`${SHIPROCKET_API_URL}/auth/logout`, {}, {
      headers: {Authorization: `Bearer ${token}`},
    });
  } catch (error) {
    console.error("Error destroying Shiprocket token:", error.message);
    throw new Error("Failed to destroy token");
  }
}

module.exports = {generateToken, destroyToken};
