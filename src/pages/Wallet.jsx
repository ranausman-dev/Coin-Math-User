import React, { useEffect, useState } from 'react';
const banner = '/banner.webp';
const rate = '/rate.png';
import { db } from '../components/firebase';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import { CiWallet } from 'react-icons/ci';
import { Link, useLocation } from 'react-router-dom';
import BalanceModal from '../components/BalanceModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Wallet = () => {
    const [profileData, setProfileData] = useState(null);
    const [totalReferrals, setTotalReferrals] = useState(0);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const { pathname } = useLocation();
    const [isConverted, setIsConverted] = useState(false);
    // const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showConvertButton, setShowConvertButton] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [airBalance, setAirBalance] = useState(0);
    const hasAddress = profileData && profileData.baseWalletAddress;
    const [coins, setCoins] = useState(0);
    // const openBalanceModal = () => setShowConvertButton(true);
    // const closeBalanceModal = () => setShowConvertButton(false);
    const [modalType, setModalType] = useState(""); // "convert" or "withdraw"
    const [showBalanceModal, setShowBalanceModal] = useState(false);

    const openBalanceModal = (type) => {
        setModalType(type);
        setShowBalanceModal(true);
    };

    const closeBalanceModal = () => {
        setShowBalanceModal(false);
        setModalType("");
    };


    const WalletContent = () => (
        <div className='flex flex-col-reverse md:flex-row items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100'>
            <div className='mb-5 md:mb-0'>
                {hasAddress ? (
                    <p className='text-white '>
                        Your Base Wallet Address is:{" "}
                        {profileData.baseWalletAddress.length > 30 ? (
                            <>
                                {profileData.baseWalletAddress.slice(0, 30)}
                                <br className='lg:hidden' />
                                {profileData.baseWalletAddress.slice(30)}
                            </>
                        ) : (
                            profileData.baseWalletAddress
                        )}
                    </p>
                ) : (
                    <h6 className='text-white '>Please update your Base Wallet Address here.</h6>
                )}
            </div>
            <div className='bg-[#2c281d] rounded-2xl px-2 py-2 flex gap-2 items-center mb-4 md:mb-0'>
                <div><CiWallet /></div>
                <span>Wallet</span>
            </div>
        </div>
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userRef = doc(db, 'profiles', userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setProfileData(userData);
                    const referralsCount = userData.referralCount || 0;
                    setTotalReferrals(referralsCount);
                } else {
                    console.error('User document not found.');
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchInitialData();
    }, [userId]);

    const sanitizeAndFormatCoins = (coinsString) => {
        const str = String(coinsString);

        const firstValidDecimalIndex = str.indexOf('.');

        let sanitizedCoins = str;

        if (firstValidDecimalIndex !== -1) {
            sanitizedCoins = str.slice(0, firstValidDecimalIndex + 1) +
                str.slice(firstValidDecimalIndex + 1).replace(/\./g, '');
        }

        const numberValue = Number(sanitizedCoins);
        return isNaN(numberValue) ? '0.00' : numberValue.toFixed(3);
    };

    const handleConvert = async () => {
        try {
            const coins = parseFloat(profileData?.coins || 0);
            const existingAirdropBalance = parseFloat(profileData?.airdropBalance || 0);

            if (coins < 5) {
                toast.error("You need at least 1000 coins to convert.");
                setShowBalanceModal(false)
                return;
            }

            const updatedAirdropBalance = existingAirdropBalance + coins;

            const userRef = doc(db, 'profiles', userId);

            await updateDoc(userRef, {
                coins: 0,
                airdropBalance: updatedAirdropBalance,
            });

            const updatedProfileSnap = await getDoc(userRef);
            if (updatedProfileSnap.exists()) {
                const updatedProfileData = updatedProfileSnap.data();

                setProfileData(updatedProfileData);
                setCoins(0);
                setAirBalance(updatedProfileData.airdropBalance);
                setShowConvertButton(false);
                setIsConverted(true);
                toast.success("Your balance is successfully converted in to airdrop.");
            }
            setShowBalanceModal(false)
        } catch (error) {
            console.error("Error during conversion:", error);
        }
    };

    const handleWithdraw = async () => {
        try {
            const airdropBalance = parseFloat(profileData?.airdropBalance || 0);
            const coins = parseFloat(profileData?.coins || 0);

            if (airdropBalance < 5) {
                toast.error("You need at least 1000 airdrop coins to withdraw.");
                setShowBalanceModal(false)
                return;
            }

            const updatedCoins = coins + airdropBalance;

            const userRef = doc(db, 'profiles', userId);

            await updateDoc(userRef, {
                coins: updatedCoins,
                airdropBalance: 0,
            });

            const updatedProfileSnap = await getDoc(userRef);
            if (updatedProfileSnap.exists()) {
                const updatedProfileData = updatedProfileSnap.data();

                setProfileData(updatedProfileData);
                setCoins(updatedProfileData.coins);
                setAirBalance(updatedProfileData.airdropBalance);

                toast.success("Withdrawal successful! All airdrop coins have been transferred to your account.");
            }
            setShowBalanceModal(false)
        } catch (error) {
            console.error("Error during withdrawal:", error);
            toast.error("Something went wrong during the withdrawal process.");
        }
    };




    return (
        <div className='px-3 lg:px-20 mt-5 pb-16 md:pb-0'>
            <ToastContainer />
            <div className='rounded-b-xl overflow-hidden border border-[#262626]'>
                <img src={banner} className='md:w-full md:h-56' alt="banner" />
                <div className='bg-[#1F1F1F] flex gap-4 px-10 h-32 m:h-26'>
                    <div className='mt-[-40px] lg:mt-[-45px]'>
                        <div className='overflow-hidden rounded-2xl border border-black'>
                            <img className="w-32" src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679" alt="logo" />
                        </div>
                    </div>
                    <div className='flex flex-col md:flex md:flex-row justify-between pb-9 w-full  mt-2 lg:mt-6'>
                        <div>
                            <h2 className='text-white font-bold md:text-2xl'>My Wallet</h2>
                            <p className='text-white md:text-[12px] text-[14px] mt-1'>Check your $COIM balance.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-[#1F1F1F] rounded-xl mt-8 mb-8 py-8 px-10 border border-[#262626]'>
                {loading ? (
                    <Spinner />
                ) : (
                    profileData && (
                        <>
                            <div className='flex gap-6 items-center mb-5'>
                                <div className='overflow-hidden rounded-full'>
                                    <img className="md:w-20 md:h-20 h-16" src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679" alt="logo" />
                                </div>
                                <div className='md:flex md:flex-row md:justify-between md:items-center md:w-full'>
                                    <div>
                                        <span className='text-[12px] text-[#ce9600]'>TOTAL OF</span>
                                        <h3 className='text-2xl font-bold text-white'> {sanitizeAndFormatCoins(profileData.coins || 0)}</h3>
                                        <p className='text-sm text-gray-800'>COIM</p>
                                    </div>
                                    <div className="mt-5 md:mt-0">

                                        <span className="text-[12px] text-[#ce9600]">AIRDROP BALANCE</span>
                                        {profileData && (
                                            <>
                                                <h3 className="text-2xl font-bold text-[#fff]">
                                                    {sanitizeAndFormatCoins(profileData.airdropBalance || 0)}
                                                </h3>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                            <div className='border-t-2 border-[#262626] '>
                                <div className='flex gap-6 items-center mt-5'>
                                    <div className='overflow-hidden rounded-md'>
                                        <img className="w-20 md:w-20 md:h-20 h-16" src={rate} alt="logo" />
                                    </div>
                                    <div className='md:flex md:flex-row md:justify-between flex-col w-full items-center'>
                                        <div>
                                            <span className='text-[12px] text-[#ce9600]'>CURRENT RATE</span>
                                            <h3 className='text-2xl font-bold text-[#fff]'> {sanitizeAndFormatCoins(profileData.hourlyRate || 0)}</h3>
                                            <p className='text-sm text-gray-800'>COIM per hour</p>
                                        </div>

                                        {/* {profileData && ( */}
                                        <div className='mt-5 md:mt-0'>
                                            <button
                                                className="text-white bg-[#ce9600] py-2 px-3 rounded-lg"
                                                onClick={
                                                    profileData.airdropBalance > 1
                                                        ? () => openBalanceModal("withdraw")
                                                        : () => openBalanceModal("convert")
                                                }
                                            >
                                                {profileData.airdropBalance > 5 ? "Withdraw Coins" : "Convert into AirDrop"}
                                            </button>
                                        </div>
                                        {/* )} */}


                                    </div>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
            <div className=' bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 mb-5 py-8 px-10 border border-[#262626]'>
                <div>
                    {hasAddress ? (
                        <WalletContent />
                    ) : (
                        <Link to="/update-profile">
                            <WalletContent />
                        </Link>
                    )}
                </div>
            </div>
            <BalanceModal
                showBalanceModal={showBalanceModal}
                closeBalanceModal={closeBalanceModal}
                message={
                    modalType === "convert"
                        ? "You are going to convert your Balance into AirDrop."
                        : "You are going to withdraw your coins."
                }
                balanceHandler={
                    modalType === "convert"
                        ? handleConvert
                        : handleWithdraw
                }
            />

        </div>
    );
};

export default Wallet;
