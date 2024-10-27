// import React, { createContext, useState, useEffect } from "react";
// import { getUser } from "../../firebaseUtils"; // Adjust the path accordingly

// export const UserContext = createContext();

// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const fetchUser = async () => {
//     try {
//       const userData = await getUser();
//       setUser(userData);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const contextValue = {
//     user,
//     // ...other user-related functions
//   };

//   return (
//     <UserContext.Provider value={contextValue}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Adjust the path accordingly

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Update user state when logged in
      } else {
        setUser(null); // Clear user state when logged out
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const contextValue = {
    user,

  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
