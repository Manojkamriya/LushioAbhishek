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
  const [reviewApprovedCoins, setReviewApprovedCoins] = useState(0);
  const [reviewApprovedMessage, setReviewApprovedMessage] = useState('');
  const [reviewApprovedExpiry, setreviewApprovedExpiry] = useState(30);
  const [ageCoins, setAgeCoins] = useState({
    oneMonth: { coins: 0, message: '', expiry: 30 },
    oneYear: { coins: 0, message: '', expiry: 30 },
    twoYears: { coins: 0, message: '', expiry: 30 },
    fiveYears: { coins: 0, message: '', expiry: 30 },
  });

  const [referredCoins, setReferredCoins] = useState(0);
  const [referredMessage, setReferredMessage] = useState('');
  const [referredExpiry, setReferredExpiry] = useState(30);

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
          setAgeCoins(data.coinSettings || ageCoins);
          setReviewApprovedCoins(data.reviewApprovedCoins);
          setReviewApprovedMessage(data.reviewApprovedMessage);
          setreviewApprovedExpiry(data.reviewApprovedExpiry || reviewApprovedExpiry)
          setReferredCoins(data.referredCoins);
          setReferredMessage(data.referredMessage);
          setReferredExpiry(data.referredExpiry);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCoinSettingChange = (milestone, field, value) => {
    setAgeCoins(prevSettings => ({
      ...prevSettings,
      [milestone]: {
        ...prevSettings[milestone],
        [field]: field === 'coins' || field === 'expiry' ? Number(value) : value
      }
    }));
  };

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
        coinSettings: ageCoins,
        reviewApprovedCoins: Number(reviewApprovedCoins), // Ensure number type
        reviewApprovedMessage,
        reviewApprovedExpiry,
        referredCoins: Number(referredCoins), // Ensure number type
        referredMessage,
        referredExpiry: Number(referredExpiry), // Ensure number type
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
          onChange={(e) => setDoaExpiry(e.target.value)}
        />
      </div>

      <div className="control-item">
        <label>Coins for Refferal:</label>
        <input
          type="number"
          value={referredCoins}
          onChange={(e) => setReferredCoins(e.target.value)}
        />
      </div>

      <div className="control-item">
        <label>Message for Refferal:</label>
        <input
          type="text"
          value={referredMessage}
          onChange={(e) => setReferredMessage(e.target.value)}
        />
      </div>

      <div className="control-item">
        <label>Expiry for Refferal Coins:</label>
        <input
          type="number"
          value={referredExpiry}
          onChange={(e) => setReferredExpiry(e.target.value)}
        />
      </div>

      <div className="control-item">
        <label>Coins for Review Approval:</label>
        <input
          type="number"
          value={reviewApprovedCoins}
          onChange={(e) => setReviewApprovedCoins(e.target.value)}
        />
      </div>

      <div className="control-item">
        <label>Message for Review Approval:</label>
        <input
          type="text"
          value={reviewApprovedMessage}
          onChange={(e) => setReviewApprovedMessage(e.target.value)}
        />
      </div>

      <div className="control-item">
        <label>Expiry for Review Coins:</label>
        <input
          type="number"
          value={reviewApprovedExpiry}
          onChange={(e) => setreviewApprovedExpiry(e.target.value)}
        />
      </div>

      {Object.entries(ageCoins).map(([milestone, settings]) => (
        <div key={milestone} className="milestone-settings">
          <h3>{milestone.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
          <div className="control-item">
            <label>Coins:</label>
            <input
              type="number"
              value={settings.coins}
              onChange={(e) => handleCoinSettingChange(milestone, 'coins', e.target.value)}
            />
          </div>
          <div className="control-item">
            <label>Message:</label>
            <input
              type="text"
              value={settings.message}
              onChange={(e) => handleCoinSettingChange(milestone, 'message', e.target.value)}
            />
          </div>
          <div className="control-item">
            <label>Expiry (days):</label>
            <input
              type="number"
              value={settings.expiry}
              onChange={(e) => handleCoinSettingChange(milestone, 'expiry', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button className="update-btn" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
};

export default AdminControls;
