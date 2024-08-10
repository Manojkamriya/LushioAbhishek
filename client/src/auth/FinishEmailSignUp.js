import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const FinishEmailSignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignIn = async () => {
      // Check if the URL is a sign-in link
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          // If email is not available in local storage, prompt the user for email
          email = window.prompt("Please provide your email for confirmation");
        }

        try {
          // Complete sign-in with email link
          const result = await signInWithEmailLink(auth, email, window.location.href);
          const user = result.user;

          // Update lastSignInTime in Firestore
          const userDoc = doc(db, "users", user.uid);
          await updateDoc(userDoc, {
            lastSignInTime: new Date()
          });

          window.localStorage.removeItem("emailForSignIn");
          navigate("/user"); // Redirect to user page after successful sign-in
        } catch (error) {
          console.error("Error signing in with email link", error);
        }
      }
    };

    handleSignIn();
  }, [navigate]);

  return (
    <div>
      <h2>Finishing Sign Up...</h2>
    </div>
  );
};

export default FinishEmailSignUp;
