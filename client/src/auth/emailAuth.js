import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// Determine the frontend URL dynamically from environment variables
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const checkEmailExists = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Failed to check email availability");
  }
};

const handleEmailSignUp = async (email, password, referralCode) => {
  try {
    // Check if email already exists in Firestore
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      throw new Error("This email is already registered. Please use a different email or try logging in.");
    }

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
    throw error; // Re-throw the error to be handled by the calling function
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
