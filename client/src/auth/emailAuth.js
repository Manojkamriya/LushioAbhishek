import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

// Determine the frontend URL dynamically from environment variables
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const handleEmailSignUp = async (email, password, referralCode) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const finalReferralCode = referralCode || "";

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      referralCode: finalReferralCode,
      lastSignInTime: new Date(),
    });

    const actionCodeSettings = {
      url: `${FRONTEND_URL}/finishSignIn?cartId=1234`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    alert("Verification email sent! \nPlease Verify the account first!");

    window.localStorage.setItem("emailForSignIn", email);

    console.log(user);
    return user;

  } catch (error) {
    console.error("Error signing up with email and password", error);
    alert(error.message);
  }
};

const handleEmailLogin = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const userDoc = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      await updateDoc(userDoc, {
        lastSignInTime: new Date(),
      });
    }

    console.log(user);

    return user;
  } catch (error) {
    console.error("Error during email login", error);
  }
};

const sendEmailSignInLink = async (email) => {
  try {
    const actionCodeSettings = {
      url: `${FRONTEND_URL}/finishSignIn`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    alert("Login link sent to your email!");
  } catch (error) {
    console.error("Error sending email sign-in link", error);
  }
};

export { handleEmailSignUp, handleEmailLogin, sendEmailSignInLink };
