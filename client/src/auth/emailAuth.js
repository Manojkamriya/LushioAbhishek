import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail, sendEmailVerification } from "firebase/auth";
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

    const finalReferralCode = (referralCode).trim() || "";

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      referredBy: finalReferralCode,
      lastSignInTime: null,
    });

    // Configure verification email settings
    const actionCodeSettings = {
      url: `${FRONTEND_URL}/finishSignIn`,
      handleCodeInApp: true,
    };

    // Send verification email with custom settings
    await sendEmailVerification(user, actionCodeSettings);

    // Sign out the user immediately after sending verification
    await auth.signOut();

    alert("Verification email sent! Please verify your account before logging in.");

    return null;
  } catch (error) {
    console.error("Error signing up with email and password", error);
    alert(error.message);
    throw error;
  }
};

const handleEmailLogin = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Check if email is verified
    if (!user.emailVerified) {
      await auth.signOut();
      alert("Verify your email first.");
      throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
    }

    const userDoc = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      await updateDoc(userDoc, {
        lastSignInTime: new Date(),
      });
    }
    return user;
  } catch (error) {
    console.error("Error during email login", error);
    throw error;
  }
};

const sendEmailSignInLink = async (email) => {
  try {
    // First check if user exists and is verified
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("No account found with this email. Please sign up first.");
    }

    const actionCodeSettings = {
      url: `${FRONTEND_URL}/finishSignIn`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    alert("Login link sent to your email!");
  } catch (error) {
    console.error("Error sending email sign-in link", error);
    alert(error.message);
    throw error;
  }
};

export { handleEmailSignUp, handleEmailLogin, sendEmailSignInLink };
