import React, { useEffect, useState } from "react";
import Media from "./data";
import Carousel from "./Carousel";
import Card from "./Card";
import ProductCards from "./ProductCards";
import { auth } from "../../firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("User ID:", user.uid);
      } else {
        setCurrentUser(null);
        console.log("No user is currently logged in.");
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Carousel images={Media} />
      <ProductCards />
      <div className="mycard-container">
        <Card
          image="./LushioFitness/Images/assets/card-image-7.webp"
          name="SHIRTS"
        />
        <Card
          image="./LushioFitness/Images/assets/card-image-5.webp"
          name="BEST SELLERS"
        />
        <Card
          image="./LushioFitness/Images/assets/card-image-6.webp"
          name="SALE"
        />
      </div>
      <br></br> <br></br>
    </>
  );
}
