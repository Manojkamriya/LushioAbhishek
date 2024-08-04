import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const FinishEmailSignUp = () => {
  const navigate = useNavigate();
  const auth = getAuth();

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
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem("emailForSignIn");
          navigate("/user"); // Redirect to home page after successful sign-in
        } catch (error) {
          console.error("Error signing in with email link", error);
        }
      }
    };

    handleSignIn();
  }, [auth, navigate]);

  return (
    <div>
      <h2>Finishing Sign Up...</h2>
    </div>
  );
};

export default FinishEmailSignUp;
