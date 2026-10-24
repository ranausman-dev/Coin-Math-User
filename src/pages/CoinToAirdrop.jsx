import { useState, useEffect } from 'react';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from "../components/firebase";

const CoinToAirdrop = ({ userId }) => {
  const [coinBalance, setCoinBalance] = useState(0);
  const [airdropBalance, setAirdropBalance] = useState(0);
  const [showConvertButton, setShowConvertButton] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isConverted, setIsConverted] = useState(false);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "profiles", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfileData(userData);

          const referralsCount = userData.referralCount || 0;
          const hourlyRate = 0.14 * referralsCount * 1.1;
          // Assuming you want to store totalReferrals and hourlyRate in some state
          // setTotalReferrals(referralsCount);
          // setHourlyRate(hourlyRate);

          // Set coin and airdrop balances
          setCoinBalance(userData.coinBalance || 0);
          setAirdropBalance(userData.airdropBalance || 0);

          // Show convert button if coin balance is 2000 or more
          if (userData.coinBalance >= 2000) {
            setShowConvertButton(true);
          } else {
            setShowConvertButton(false);
          }
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  // Handle the conversion of coins to airdrop balance
  const handleConvert = async () => {
    const userRef = doc(db, 'profiles', userId);
    const updatedAirdropBalance = airdropBalance + coinBalance;

    await updateDoc(userRef, {
      coinBalance: 0, // Reset coin balance to 0
      airdropBalance: updatedAirdropBalance, // Add coins to airdrop balance
    });

    // Update state after conversion
    setCoinBalance(0);
    setAirdropBalance(updatedAirdropBalance);
    setShowConvertButton(false); // Hide the button after conversion
    setIsConverted(true);
  };

  // Helper function to format coins
  const sanitizeAndFormatCoins = (coins) => {
    const numberValue = Number(coins);
    return isNaN(numberValue) ? "0.00" : numberValue.toFixed(3);
  };

  return (
    <div>
      {profileData && (
        <>
          {isConverted ? (
            <h3 className="text-2xl font-bold text-[#fff]">
              {sanitizeAndFormatCoins(0)}
            </h3>
          ) : (
            <h3 className="text-2xl font-bold text-[#fff]">
              {sanitizeAndFormatCoins(profileData.coins || 0)}
            </h3>
          )}
        </>
      )}
      <h3>Airdrop Balance: {sanitizeAndFormatCoins(airdropBalance)}</h3>

      {showConvertButton && (
        <button onClick={handleConvert} className='bg-yellow-400'>
          Convert to Airdrop
        </button>
      )}
    </div>
  );
};

export default CoinToAirdrop;
