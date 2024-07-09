import { auth, db } from '../firebaseConfig';
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const facebookProvider = new FacebookAuthProvider();

const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
    console.log(user);

    // Check if the user already exists in Firestore
    const userDoc = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      // Save new user data to Firestore
      await setDoc(userDoc, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date()
      });
    }

  } catch (error) {
    console.error("Error during sign-in with Facebook", error);
  }
};

export default signInWithFacebook;
