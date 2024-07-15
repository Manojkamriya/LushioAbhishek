// src/auth/phoneAuth.js

import { auth } from '../firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

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

export const sendOtp = async (formattedPhoneNumber) => {
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

export const verifyOtp = async (confirmationResult, otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    console.log("OTP verified successfully:", result);
    return result.user;
  } catch (error) {
    console.error("Error during OTP verification", error);
    throw error;
  }
};
