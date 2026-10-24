import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../components/firebase';
import { IoCheckmarkCircleOutline, IoCopyOutline } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import banner from '../../public/banner.webp';

const Referrals = () => {
    const [totalReferrals, setTotalReferrals] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    useEffect(() => {
        fetchTotalReferrals();
        fetchUserProfile();
    }, []);

    const fetchTotalReferrals = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const q = query(collection(db, 'profiles'), where('referrerID', '==', userId));
            const querySnapshot = await getDocs(q);
            setTotalReferrals(querySnapshot.size);
        } catch (error) {
            console.error('Error fetching total referrals:', error);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const docRef = doc(db, 'profiles', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfileData(docSnap.data());
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (profileData?.referralCode) {
            navigator.clipboard.writeText(profileData.referralCode);
            setCopied(true);
            toast.success('Referral code copied successfully.');
            setTimeout(() => {
                setCopied(false);
            }, 3000);
        }
    };

    return (
        <>
            <div className='px-3 lg:px-20 mt-5 pb-16 md:pb-0'>
                <div className='rounded-b-xl overflow-hidden border border-[#262626]'>
                    <div className=''>
                        <img src={banner} className='md:w-full md:h-56' alt="banner" />
                    </div>
                    <div className='bg-[#1F1F1F] flex gap-4 px-10 h-28 md:h-24'>
                        <div className='mt-[-40px] lg:mt-[-45px]'>
                            <div className='overflow-hidden rounded-2xl  border border-black'>
                                <img className="w-32 " src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679" alt="logo" />
                            </div>
                        </div>
                        <div className='flex justify-between  w-full  mt-2 '>
                            <div className=''>
                                <h2 className='text-white font-bold md:text-2xl'>My Referrals</h2>
                                <p className='text-white md:text-[12px] text-[14px] mt-1'>See how many people you've referred.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 p-3 px-3 md:px-10 border border-[#262626]'>
                    <div className='flex items-center text-[#ce9600] justify-between   hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100'>
                        <h6 className='text-white text-[14px]'>Copy Referral Code</h6>
                        <div
                            className=' bg-[#2c281d] rounded-2xl px-3 py-1.5  flex gap-2 items-center'
                            onClick={copyToClipboard}
                        >
                            {copied ? (
                                <>
                                    <IoCheckmarkCircleOutline className='text-green-500' />
                                    <span className='text-[12px] text-green-500'>Copied</span>
                                </>
                            ) : (
                                <>
                                    <IoCopyOutline />
                                    <span className='text-[12px]'>Copy</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col md:flex md:flex-row items-center gap-6 bg-[#1F1F1F] rounded-xl my-7 py-8 px-0 md:px-10 border border-[#262626]'>
                    <div className='overflow-hidden flex flex-col md:flex md:flex-row md:items-center justify-between rounded-lg border border-[#262626] px-6 w-[80%] md:w-[50%] py-2'>
                        <div>
                            <span className='text-white text-[12px]'>You've referred</span>
                            <h6 className='text-white text-xl font-bold'>{totalReferrals}</h6>
                            <span className='text-white text-[12px]'>people to CoinMath.</span>
                        </div>
                        <div className='mt-5 pb-2 md:mt-0 md:pb-0'>
                            <Link to="/all-referrals">
                                <button className='bg-[#ce9600] px-3 py-2 rounded-lg cursor-pointer text-white flex items-center gap-2 hover:bg-[#ce9600]/90 transition duration-200 ease-in-out'>
                                    View Referrals
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className='rounded-lg border border-[#262626] px-6 w-[80%] md:w-[50%] py-2'>
                        <span className='text-[12px] text-[#ce9600]'>Resulting in a</span>
                        <h3 className='text-2xl font-bold text-[#fff]'>0.00%</h3>
                        <p className='text-sm text-gray-800'>Rate multiplier</p>
                    </div>
                </div>
                <div className=' bg-[#1F1F1F]  rounded-xl my-7 pt-2 px-10 border border-[#262626]'>
                    <h2 className='text-center w-full text-blue-400 font-bold text-xl pt-2 pb-5'>Refer a Friend & Boost Your COIM Mining Rate!</h2>
                    <h6 className='text-[13px] text-white pb-5'>Maximise your <span className='font-bold'>COIM mining rate</span> effortlessly through our Refer a Friend program. Here's how:</h6>
                    <div className='text-white text-sm pb-5 pl-4 border-b bo border-dotted border-[#262626]' >
                        <p>1. Tap the <span className='text-blue-400'>Refer a friend</span> button to grab your unique referral code.</p>
                        <p>2. Paste and send this code in a message to a friend.</p>
                        <p>3. When your friend signs up with your code, your mining rate increases by 10% per hour!</p>
                    </div>
                    <p className='text-white text-center py-3 text-sm italic'>Start referring and boost your earnings today!</p>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default Referrals;
