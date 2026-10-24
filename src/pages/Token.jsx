import React, { useEffect, useState } from 'react';
import { LuCoins } from 'react-icons/lu';
import banner from '../../public/banner.webp';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PopupAd from '../components/PopupAd';
import { useLocation } from 'react-router-dom';

const Token = () => {
  const [showStartButton, setShowStartButton] = useState(true);
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionEndTime, setSessionEndTime] = useState(null);
  const [progress, setProgress] = useState(0);
  const [COIM, setCOIM] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState(null);
  const [showPopupAd, setShowPopupAd] = useState(false);
  const { pathname } = useLocation();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (!userId) {
          console.error('User ID not found in local storage.');
          return;
        }
  
        const userRef = doc(db, 'profiles', userId);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserData(userData);
          const referralsCount = userData.referralCount || 0;
          setTotalReferrals(referralsCount);
          const rate = calculateHourlyRate(referralsCount);
          setHourlyRate(rate);
  
          if (userData.sessionStartTime && userData.sessionEndTime) {
            calculateProgress(userData.sessionStartTime, userData.sessionEndTime);
            const generatedCOIM = calculateGeneratedCOIM(userData.sessionStartTime, userData.sessionEndTime, rate);
            setCOIM(generatedCOIM);
          } else {
            setCOIM(userData.generatedCOIM || 0);
          }
        } else {
          console.error('User document not found.');
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
  
    if (userId) {
      fetchInitialData();
    }
  }, [userId]);
  

  const calculateHourlyRate = (referrals) => {
    let rate;

    if (referrals == 0) {
      rate = 0.14 + (0.10 * referrals * 0.1);
    } else {
      rate = 0.14 * (referrals * 1.1);
    }

    setHourlyRate(rate);
    saveHourlyRate(rate);

    return rate;
  };

  const saveHourlyRate = async (rate) => {
    try {
      if (!userId) {
        console.error('User ID not found.');
        return;
      }

      const userRef = doc(db, 'profiles', userId);
      await updateDoc(userRef, { hourlyRate: rate });
    } catch (error) {
      console.error('Error updating hourly rate:', error);
    }
  };

  const calculateGeneratedCOIM = (sessionStartTime, sessionEndTime, rate) => {
    if (!sessionStartTime || !sessionEndTime) {
      return 0;
    }
  
    const startTime = new Date(sessionStartTime).getTime();
    const endTime = new Date(sessionEndTime).getTime();
    const currentTime = new Date().getTime();
  
    const effectiveEndTime = currentTime > endTime ? endTime : currentTime;
  
    const elapsedTimeInMillis = effectiveEndTime - startTime;
    const elapsedTimeInHours = elapsedTimeInMillis / (1000 * 60 * 60);
  
    if (elapsedTimeInHours < 0) {
      return 0;
    }
  
    const generatedCOIM = rate * elapsedTimeInHours;
    return parseFloat(generatedCOIM.toFixed(3));
  };
  


  const startMining = async () => {
    try {
      setIsMining(true);
      setShowStartButton(false);
      setShowPopupAd(true);

      const startTime = new Date().toISOString();
      setSessionStartTime(startTime);

      // const endTime = new Date(Date.now() + 1 * 60 * 1000).toISOString();
      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      setSessionEndTime(endTime);

      const userRef = doc(db, 'profiles', userId);
      await updateDoc(userRef, {
        sessionStartTime: startTime,
        sessionEndTime: endTime,
        isMining: true,
        generatedCOIM: 0,  
      });

      toast.success('Mining started successfully!');
    } catch (error) {
      console.error('Error starting mining:', error);
      toast.error('Failed to start mining.');
    }
  };

  const claimCOIM = async () => {
    try {
      const userRef = doc(db, 'profiles', userId);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        const currentCoins = parseFloat(userData.coins) || 0;  
        const newCoins = currentCoins + parseFloat(COIM); 
        
        setProgress(0);
  
        await updateDoc(userRef, {
          coins: newCoins, 
          sessionStartTime: null,
          sessionEndTime: null,
          isMining: false,
          generatedCOIM: 0, 
        });
  
        setCOIM(0);
        toast.success('COIM claimed successfully!');
      } else {
        console.error('User document not found.');
        toast.error('Failed to claim COIM.');
      }
  
      setShowClaimButton(false);
      setShowStartButton(true);
    } catch (error) {
      console.error('Error claiming COIM:', error);
      toast.error('Failed to claim COIM.');
    }
  };
  

  const handlePopupAdClose = () => {
    setShowPopupAd(false);
  };

  const handlePopupAdConfirm = () => {
    setShowPopupAd(false);
    // startMining(); 
  };

  const calculateProgress = (startTime, endTime) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const current = new Date().getTime();

    const totalDuration = end - start;
    const elapsed = current - start;
    const progressPercentage = (elapsed / totalDuration) * 100;
    const progressValue = progressPercentage > 100 ? 100 : progressPercentage;

    setProgress(progressValue);
    if (progressValue >= 100) {
      setShowClaimButton(true);
      setIsMining(false);
    }
  };

  const formatSessionTime = (time) => {
    if (!time) return 'NA';

    const formattedTime = new Date(time).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formattedTime;
  };


  return (
    <div className='px-3 lg:px-20 mt-5 pb-5 md:pb-0'>
      <ToastContainer />
      <div className='rounded-b-xl overflow-hidden border border-[#262626]'>
        <img src={banner} className='md:w-full md:h-56' alt='banner' />
        <div className='bg-[#1F1F1F] flex gap-4 px-10 h-24'>
          <div className='mt-[-40px] lg:mt-[-45px]'>
            <div className='overflow-hidden rounded-2xl border border-black'>
              <img
                className='w-32'
                src='https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679'
                alt='logo'
              />
            </div>
          </div>
          <div className='flex justify-between w-full mt-2'>
            <div>
              <h2 className='text-white font-bold md:text-2xl'>COIM Generate</h2>
              <p className='text-white md:text-[12px] text-[14px] mt-1'>
                Generate COIM Tokens!
              </p>
            </div>
          </div>
        </div>
      </div>

      {progress === 0 && (
        <button className='w-full' onClick={startMining}>
          <div className='bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 pt-4 p-3 px-3 md:px-10 border border-[#262626]'>
            <div className='flex items-center text-[#ce9600] justify-between hover:bg-[#262626] pr-1 pl-2 py-1.5 cursor-pointer rounded-lg transition-colors duration-100'>
              <h6 className='text-white text-[14px]'>Start Generation!</h6>
              <div className='bg-[#2c281d] rounded-2xl px-3 py-1.5 flex gap-2 items-center'>
                <div>
                  <LuCoins />
                </div>
                <span className='text-[12px]'>Start Mining</span>
              </div>
            </div>
          </div>
        </button>
      )}

      {progress === 100 && (
        <button className='w-full' onClick={claimCOIM}>
          <div className='bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 py-4 p-3 px-3 md:px-10 border border-[#262626]'>
            <div className='flex items-center text-[#ce9600] justify-between hover:bg-[#262626] pr-1 pl-2 py-1.5 cursor-pointer rounded-lg transition-colors duration-100'>
              <h6 className='text-white text-[14px]'>Claim Now</h6>
              <div className='bg-[#2c281d] rounded-2xl px-3 py-1.5 flex gap-2 items-center'>
                <div>
                  <LuCoins />
                </div>
                <span className='text-[12px]'>Claim COIM</span>
              </div>
            </div>
          </div>
        </button>
      )}

      <div className='bg-[#1F1F1F] rounded-xl mt-8 mb-16 py-4 px-10 border border-[#262626]'>
        <div className='flex justify-between w-full text-white'>
          <p className='text-[12px]'>Generation Progress</p>
          <span className='text-[12px]'>{progress !== null ? `${(progress).toFixed(2)}%` : '0.00%'}</span>
        </div>
        <div className='mt-4'>
          <div className='bg-[#2c281d] overflow-hidden rounded-md h-2'>
            <div
              className='bg-[#ce9600] h-2'
              style={{ width: progress !== null ? `${progress}%` : '0%' }}
            ></div>
          </div>
        </div>
        <div className='flex flex-col gap-8 md:flex md:flex-row lg:items-center mt-7'>


          <div className='lg:pr-40'>
            <span className='text-[13px] text-white'>Session Start</span>
            {userData && (
              <p className='text-[14px] text-white'>{formatSessionTime(userData.sessionStartTime) || 'NA'}</p>
            )}
          </div>

          <div className='lg:pr-40'>
            <span className='text-[13px] text-white'>Session End</span>
            {userData && (
              <p className='text-[14px] text-white'>  {formatSessionTime(userData.sessionEndTime) || 'NA'}</p>
            )}
          </div>


          <div className='lg:pr-40'>
            <span className='text-[13px] text-white'>COIM Generated</span>
            <p className='text-[14px] text-white'>{`${COIM} COIM`}</p>
          </div>
        </div>
        <div className='flex items-center mt-4'>
          <div className='lg:pr-40'>
            <span className='text-[13px] text-white'>Hourly Rate</span>
            <p className='text-[14px] text-white'>{`${hourlyRate.toFixed(3)} COIM`}</p>
          </div>
        </div>
      </div>

      {/* PopupAd component */}
      {showPopupAd && (
        <PopupAd onClose={handlePopupAdClose} onConfirm={handlePopupAdConfirm} />
      )}
    </div>
  );
};

export default Token;
