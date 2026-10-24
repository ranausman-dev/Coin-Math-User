import React, { useState } from 'react';
import { doc, writeBatch, collection } from 'firebase/firestore';
import { db } from '../components/firebase';

const User = () => {
  const [profilesData, setProfilesData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setProfilesData(results.data); 
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
      },
    });
  };

  const saveProfiles = async () => {
    setIsUploading(true);
    const batchSize = 500; 
    let batch = writeBatch(db);
    let batchCount = 0;
    const totalDocs = profilesData.length;

    try {
      for (let i = 0; i < totalDocs; i++) {
        const profileData = profilesData[i];
        const docRef = doc(collection(db, 'profiles')); 
        batch.set(docRef, profileData);
        batchCount++;


        if (batchCount === batchSize || i === totalDocs - 1) {
          await batch.commit();
          console.log(`Batch ${Math.ceil((i + 1) / batchSize)} committed`);
          batch = writeBatch(db); 
          batchCount = 0;
        }
      }
    } catch (error) {
      console.error('Error adding documents: ', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={saveProfiles} disabled={profilesData.length === 0 || isUploading}>
        {isUploading ? 'Uploading...' : 'Save Data'}
      </button>
    </div>
  );
};

export default User;
