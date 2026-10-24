import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const Ad = () => {
    const [adLoaded, setAdLoaded] = useState(false);
    const [adLink, setAdLink] = useState('');
    const [adImage, setAdImage] = useState('');

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'ad'));
                if (!querySnapshot.empty) {
                    const adDoc = querySnapshot.docs[0];
                    setAdLink(adDoc.data().link);
                    setAdImage(adDoc.data().blogImage);
                    setAdLoaded(true);

                    // setTimeout(() => {
                    //     setAdLoaded(false);
                    // }, 3000);
                } else {
                    console.log('No ad found in database.');
                }
            } catch (error) {
                console.error('Error fetching ad:', error);
            }
        };

        fetchAd();

        return () => {
        };
    }, []);

    return (
        <>
            {adLoaded && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg z-50">
                    <a href={adLink} target="_blank" rel="noopener noreferrer">
                        <div className="flex justify-center items-center">
                            <img
                                src={adImage} 
                                alt="Advertisement"
                                className="w-auto h-auto"
                            />
                        </div>
                    </a>
                </div>
            )}
        </>
    );
};

export default Ad;
