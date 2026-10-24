import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './firebase';

const PopupAd = ({ onClose, onConfirm }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [adLink, setAdLink] = useState('');

  useEffect(() => {
    const fetchAdLink = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ad'));
        if (!querySnapshot.empty) {
          const adDoc = querySnapshot.docs[0];
          setAdLink(adDoc.data().link);
          setTimeout(() => {
            setIsVisible(false);
          }, 300000);
        } else {
          console.log('No ad link found in database.');
        }
      } catch (error) {
        console.error('Error fetching ad link:', error);
      }
    };

    fetchAdLink();

    return () => {};
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    onConfirm();
    window.location.reload();
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 px-6 pb-6 shadow-lg z-50 ${isVisible ? '' : 'hidden'}`}>
 <button
        className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
        onClick={handleConfirm}
      >
        ×
      </button>
      <div className="text-white text-center h-full">
        <h2 className="text-xl mt-2 mb-4">CoinMath Ad</h2>
        {adLink && (
          <iframe 
            src={adLink} 
            width="100%" 
            height="100%" 
            frameBorder="0"
            title="Advertisement"
            className="w-full h-full rounded-lg pb-12"
          />
        )}
      </div>
    </div>
  );
};

export default PopupAd;
