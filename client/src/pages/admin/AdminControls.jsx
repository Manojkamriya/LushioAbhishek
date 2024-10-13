import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig'; // Import Firestore instance
import './AdminControls.css'; // Import the CSS file

const AdminControls = () => {
  const [engine, setEngine] = useState(false);
  const [dobCoins, setDobCoins] = useState(0);
  const [dobMessage, setDobMessage] = useState('');
  const [dobExpiry, setDobExpiry] = useState(30);
  const [doaCoins, setDoaCoins] = useState(0);
  const [doaMessage, setDoaMessage] = useState('');
  const [doaExpiry, setDoaExpiry] = useState(30);

  const docRef = doc(db, "controls", "admin");

  useEffect(() => {
    // Fetching initial data from Firestore
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEngine(data.engine);
          setDobCoins(data.dobCoins);
          setDobMessage(data.dobMessage);
          setDobExpiry(data.dobExpiry);
          setDoaCoins(data.doaCoins);
          setDoaMessage(data.doaMessage);
          setDoaExpiry(data.doaExpiry);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateDoc(docRef, {
        engine,
        dobCoins: Number(dobCoins), // Ensure number type
        dobMessage,
        dobExpiry: Number(dobExpiry), // Ensure number type
        doaCoins: Number(doaCoins), // Ensure number type
        doaMessage,
        doaExpiry: Number(doaExpiry), // Ensure number type
      });
      alert("Data successfully updated!");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update data.");
    }
  };

  return (
    <div className="admin-controls">
      <h2>Admin Controls</h2>
      
      <div className="control-item">
        <label>Keep Website Alive:</label>
        <input
          type="checkbox"
          checked={engine}
          onChange={(e) => setEngine(e.target.checked)}
        />
      </div>
      
      <div className="control-item">
        <label>Coins for DOB:</label>
        <input
          type="number"
          value={dobCoins}
          onChange={(e) => setDobCoins(e.target.value)} // Correctly updating dobCoins
        />
      </div>

      <div className="control-item">
        <label>Message for DOB:</label>
        <input
          type="text"
          value={dobMessage}
          onChange={(e) => setDobMessage(e.target.value)}
        />
      </div>

      <div className="control-item">
        <label>Expiry for DOB:</label>
        <input
          type="number"
          value={dobExpiry}
          onChange={(e) => setDobExpiry(e.target.value)} // Correctly updating dobExpiry
        />
      </div>

      <div className="control-item">
        <label>Coins for DOA:</label>
        <input
          type="number"
          value={doaCoins}
          onChange={(e) => setDoaCoins(e.target.value)} // Correctly updating doaCoins
        />
      </div>

      <div className="control-item">
        <label>Message for DOA:</label>
        <input
          type="text"
          value={doaMessage}
          onChange={(e) => setDoaMessage(e.target.value)}
        />
      </div>

      <div className="control-item">
        <label>Expiry for DOA:</label>
        <input
          type="number"
          value={doaExpiry}
          onChange={(e) => setDoaExpiry(e.target.value)} // Correctly updating doaExpiry
        />
      </div>

      <button className="update-btn" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
};

export default AdminControls;
