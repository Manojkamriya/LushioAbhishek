/* eslint-disable new-cap */
/* eslint-disable max-len */
require('dotenv').config();
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const axios = require('axios')
const crypto = require('crypto');

// let salt_key = "96434309-7796-489d-8924-ab56988a6076"
// let merchant_id = "PGTESTPAYUAT86"
let salt_key = process.env.REACT_APP_PHONEPE_SALT_KEY
let merchant_id = process.env.REACT_APP_PHONEPE_MERCHANT_ID
router.post('/', async(req,res)=>{
try {
    let{
        MUID,
        amount,
        mobile,
        name,
        transactionId
    } = req.body

    const data = {
      merchantId: merchant_id,
      merchantTransactionId: transactionId,
      name: name,
      amount: amount * 100,
     redirectUrl: `${process.env.REACT_APP_API_URL}/payment/status?id=${transactionId}`,
     // redirectUrl:"http://localhost:3000/cart",
      redirectMode: "POST",
      mobileNumber: mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
      };

    const KeyIndex =1

    // Base64 encode the payload
    const payload = JSON.stringify(data)
    const payloadMain = Buffer.from(payload).toString("base64");

    // Generate X-VERIFY checksum
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')

    const checksum = sha256+ '###' + KeyIndex

// const prod_URL = "http://api.phonepe.com/api/hermes/pg/v1/pay" // if you are live
const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

const option = {
  method: 'POST',
  url:prod_URL,
  headers: {
      accept : 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum
  },
  data :{
      request : payloadMain
  }
}

axios.request(option).then((response) => {
  res.json(response.data)

}).catch(error =>{
  console.log(error.message)
  res.status(500).json({error: error.message})
})
    
} catch (error) {
    console.log(error)
}
})

router.post('/status', async (req,res) =>{
  try {
    const merchantTransactionId = req.query.id
    const merchantId = merchant_id

    const keyIndex =1

    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` +salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256+ '###' + keyIndex
    
    const options = {
      method: 'get',
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': merchantId
          },
    };

await axios(options).then(response =>{

  if (response.data.success === true) {

   // const url = 'http://localhost:3000/cart';
    const paymentDetails = {
      message: "Payment successful!",
      data: response.data,
    };
    console.log('paymentDetails console   : ',paymentDetails)
   // for showing details on crome browser(Black Screen)
    // res.json({                                
  //     message: "Payment successful!",
  //     data: response.data, 
  //   });
    // const url = `${process.env.REACT_APP_API_URL}/payment/success?transactionId=${paymentDetails.transactionId}&amount=${paymentDetails.amount}&status=${paymentDetails.status}&timestamp=${paymentDetails.timestamp}`;
    // return res.redirect(url);
    const url = "http://localhost:3000/cart"
    return res.redirect(url)

  } else {
    const url = "http://localhost:3000/order"
    return res.redirect(url)
  }
})
} catch (error) {
  console.log(error)
}
})
module.exports = router;
// await axios(options)
//   .then((response) => {
//     if (response.data.success === true) {
//       const paymentDetails = {
//         message: "Payment successful!",
//         // transactionId: response.data.transactionId,
//         // amount: response.data.amount,
//         // status: response.data.status,
//         // timestamp: response.data.timestamp,
//       data:  response.data,
//       };

//       console.log("Payment Details Console:", paymentDetails);

//       // Send payment details and URL to redirect on the frontend
//       res.status(200).send({
//         success: true,
//         paymentDetails,
//         redirectUrl: "http://localhost:3000/cart",
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         message: "Payment failed",
//         redirectUrl: "http://localhost:3000/order",
//       });
//     }
//   })
//   .catch((error) => {
//     console.error("Payment Error:", error);

//     res.status(500).send({
//       success: false,
//       message: "An error occurred during payment processing.",
//     });
//   });

 

// //listen server
// app.listen(8000, ()=>{
//     console.log("server is running on port 8000! :)")
// })


