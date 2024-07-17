// src/auth/phoneAuth.js

import { auth, db } from '../firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    console.log("Initializing RecaptchaVerifier...");
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        console.log("Recaptcha solved:", response);
      }
    });
  } else {
    console.log("RecaptchaVerifier already initialized");
  }
};

const sendOtp = async (formattedPhoneNumber) => {
  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier;

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
    console.log("OTP sent successfully:", confirmationResult);
    return confirmationResult;
  } catch (error) {
    console.error("Error during OTP sending", error);
    throw error;
  }
};

const verifyOtp = async (confirmationResult, otp, formattedPhoneNumber) => {
  try {
    const result = await confirmationResult.confirm(otp);
    console.log("OTP verified successfully:", result);

    // Save user data in Firestore
    await setDoc(doc(db, "users", result.user.uid), {
      phoneNumber: formattedPhoneNumber,
      createdAt: new Date(),
    });

    return result.user;
  } catch (error) {
    console.error("Error during OTP verification", error);
    throw error;
  }
};

const verifyOtpForLogin = async (confirmationResult, otp) => {
  try {
    await confirmationResult.confirm(otp);
  } catch (error) {
    console.error("Error verifying OTP for login", error);
  }
};

export { sendOtp, verifyOtp, verifyOtpForLogin };