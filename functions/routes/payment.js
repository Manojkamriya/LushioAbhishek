/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const axios = require("axios");
const crypto = require("crypto");

// ENVs
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_URL = process.env.PHONEPE_API_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
const API_URL = process.env.REACT_APP_API_URL;

// Global variable to store order details
let globalOrderDetails = null;

router.post("/", async (req, res) => {
  try {
    const {
      name,
      transactionId,
      MUID,
      uid,
      modeOfPayment,
      totalAmount,
      payableAmount,
      discount,
      lushioCurrencyUsed,
      couponCode,
      address,
      orderedProducts,
    } = req.body;

    // Separate global order details
    globalOrderDetails = {
      uid,
      modeOfPayment,
      totalAmount,
      payableAmount,
      discount,
      lushioCurrencyUsed,
      couponCode,
      address,
      orderedProducts,
    };
    const data = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: uid,
      name: name,
      amount: payableAmount * 100,
      redirectUrl: `${API_URL}/payment/status?id=${transactionId}`,
      redirectMode: "POST",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    console.log("backend order", globalOrderDetails);
    console.log("data", data);
    const KeyIndex = 1;

    // Base64 encode the payload
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    // Generate X-VERIFY checksum
    const string = payloadMain + "/pg/v1/pay" + PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");

    const checksum = sha256 + "###" + KeyIndex;

    // const prod_URL = "http://api.phonepe.com/api/hermes/pg/v1/pay" // if you are live
    const prod_URL = `${PHONEPE_URL}/pay`;

    const option = {
      method: "POST",
      url: prod_URL,
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    axios.request(option).then((response) => {
      res.json(response.data);
    }).catch((error) => {
      console.log("Error in / route inner catch", error.message);

      res.status(500).json({error: error.message});
    });
  } catch (error) {
    console.log("Error in / route outer catch", error);
  }
});


router.post("/status", async (req, res) => {
  try {
    const merchantTransactionId = req.query.id;
    const merchantId = PHONEPE_MERCHANT_ID;

    const keyIndex = 1;

    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: "get",
      url: `${PHONEPE_URL}/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    // Await the API response
    const response = await axios(options);

    if (response.data.success === true) {
      const paymentDetails = {
        message: "Payment successful!",
        data: response.data,
      };

      console.log("Payment Details:", paymentDetails);

      try {
        // Combine orderDetails with paymentDetails under the key 'paymentData'
        const combinedDetails = {
          ...globalOrderDetails,
          paymentData: paymentDetails, // Nest paymentDetails under the key 'paymentData'
        };

        console.log("Combined Order and Payment Details:", combinedDetails);
        // Await order creation API call
        const orderResponse = await axios.post(
            `${API_URL}/orders/createOrder`,
            combinedDetails,
        );
        console.log("Order Creation Response:", orderResponse.data);
        const url = `${FRONTEND_URL}/paymentStatus`;
        return res.redirect(url);
      } catch (error) {
        console.error("Error while creating order:", error);
        const url = `${FRONTEND_URL}/cart`;
        return res.redirect(url);
      }
    } else {
      const url = `${FRONTEND_URL}/cart`;
      return res.redirect(url);
    }
  } catch (error) {
    console.error("Error in /status route:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

module.exports = router;
