// client/src/auth/googleAuth.js
import { auth, db } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
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
        createdAt: new Date(),
        lastSignInTime: new Date(user.metadata.lastSignInTime)
      });
    }

  } catch (error) {
    console.error("Error during sign-in with Google", error);
  }
};


export default signInWithGoogle;