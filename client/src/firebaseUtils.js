import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

export function getUser() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User ID:", user.uid);
        resolve(user);
      } else {
        console.log("No user is currently logged in.");
        resolve(null);
      }
    }, (error) => {
      reject(error);
    });
  });
}
