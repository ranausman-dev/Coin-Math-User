import React, { useState, useEffect } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { db } from '../components/firebase';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import Spinner from './Spinner';

const AllReferrals = () => {
    const [profileData, setProfileData] = useState(null);
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        const fetchReferrals = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const q = query(collection(db, 'profiles'), where('referrerID', '==', userId));
                const querySnapshot = await getDocs(q);
                const referralsList = querySnapshot.docs.map(doc => doc.data());
                setReferrals(referralsList);
            } catch (error) {
                console.error('Error fetching referrals:', error);
            }
        };

        fetchUserProfile();
        fetchReferrals();
    }, []);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Spinner />
            </div>
        );
    }

    return (
        <div className='px-3 lg:px-20 mt-5'>
            {profileData && (
                <>
                    <div className='rounded-xl border border-[#262626] bg-[#1F1F1F]'>
                        <div className='text-[130px]  flex justify-center items-center mt-14 mb-3'>
                            <div>
                                {profileData.profileImage ? (
                                    <img src={profileData.profileImage} className='rounded-full w-32 h-32' alt="user" />
                                ) : (
                                    <FaRegUserCircle className='text-white' />
                                )}
                            </div>
                        </div>
                        <div className='mb-8'>
                            <div className='pb-4'>
                                <h2 className='text-white font-bold text-2xl text-center '>My Referrals</h2>
                            </div>
                        </div>
                    </div>
                    {referrals.length === 0 ? (
                            <h4 className="mb-6 mt-10 text-md font-semibold text-center text-white">
                                No Referrals Available
                            </h4>
                    ) : (
                        <div className='bg-[#1F1F1F] rounded-xl mt-8 pb-4 px-10 border border-[#262626]'>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                                {referrals.map((referral, index) => (
                                    <div key={index} className='bg-[#363636] rounded-xl p-2'>
                                        <div className='flex flex-col gap-4 md:flex md:flex-row lg:items-center'>
                                            <div className=''>
                                                {referral.profileImage ? (
                                                    <img src={referral.profileImage} className='w-10 h-10 rounded-full' alt="referral" />
                                                ) : (
                                                    <FaRegUserCircle className='text-white w-10 h-10' />
                                                )}
                                            </div>
                                            <div className='text-white flex flex-col gap-1'>
                                                <p>{referral.firstName}</p>
                                                <p className='text-sm'>{referral.surname}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllReferrals;
