import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendSignInLinkToEmail } from "firebase/auth";

const handleEmailSignUp = async (email, password) => {
  try {
    // Sign up the user with email and password
    await createUserWithEmailAndPassword(auth, email, password);

    // Send email link for verification
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'http://localhost:3000/finishSignUp?cartId=1234',
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    // Save the email locally to complete the sign-in flow later.
    window.localStorage.setItem('emailForSignIn', email);

    alert('Verification email sent!');
  } catch (error) {
    console.error('Error signing up with email and password', error);
    alert(error.message);
  }
};

export default handleEmailSignUp;
