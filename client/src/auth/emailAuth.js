import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const handleEmailSignUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
    });

    const actionCodeSettings = {
      url: 'http://localhost:3000/finishSignUp?cartId=1234',
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    window.localStorage.setItem('emailForSignIn', email);

    alert('Verification email sent!');
  } catch (error) {
    console.error('Error signing up with email and password', error);
    alert(error.message);
  }
};

const handleEmailLogin = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error during email login", error);
  }
};

const sendEmailSignInLink = async (email) => {
  try {
    const actionCodeSettings = {
      url: 'http://localhost:3000/finishSignIn',
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    alert('Login link sent to your email!');
  } catch (error) {
    console.error("Error sending email sign-in link", error);
  }
};

export { handleEmailSignUp, handleEmailLogin, sendEmailSignInLink };
