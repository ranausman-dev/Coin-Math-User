import React, { useState, useEffect } from "react";
import { MdOutlineCancelScheduleSend } from "react-icons/md";
import { collection, query, where, getDocs, updateDoc, doc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SideModel = ({ closeSideModal }) => {
    const [newRefBy, setNewRefBy] = useState('');
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const userDoc = doc(db, 'profiles', userId);
                    const userSnapshot = await getDoc(userDoc);
                    if (userSnapshot.exists()) {
                        setCurrentUser({ id: userId, ...userSnapshot.data() });
                    } else {
                        setError('User not found.');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setError('An error occurred while fetching user data.');
                }
            } else {
                setError('User ID not found in local storage.');
            }
        };

        fetchCurrentUser();
    }, []);

    const handleReferralChange = async () => {
        if (!newRefBy) {
            toast.error("Please enter a new referral code.")
            setError('Please enter a new referral code.');
            return;
        }
    
        if (currentUser.referralCode === newRefBy) {
            toast.error("You cannot enter your own referral code.")
            setError('You cannot enter your own referral code.');
            return;
        }
    
        try {
            const refCodeQuerySnapshot = await getDocs(query(collection(db, 'profiles'), where('referralCode', '==', newRefBy)));
            if (refCodeQuerySnapshot.empty) {
                toast.error("Friend Referral code does not exist.")
                setError('Friend Referral code does not exist.');
                return;
            }
    
            const newReferrerDoc = refCodeQuerySnapshot.docs[0];
            const newReferrerID = newReferrerDoc.id;
    
            const userDoc = doc(db, 'profiles', currentUser.id);
            await updateDoc(userDoc, {
                referralByCode: newRefBy,
                referrerID: newReferrerID
            });
    
            if (currentUser.referrerID && currentUser.referrerID !== newReferrerID) {
                const oldReferrerDoc = doc(db, 'profiles', currentUser.referrerID);
                await updateDoc(oldReferrerDoc, {
                    referralCount: increment(-1)
                });
            }
    
            await updateDoc(newReferrerDoc.ref, {
                referralCount: increment(1)
            });
    
            setError('');
            closeSideModal();
        } catch (error) {
            console.error('Error updating referral code:', error);
            setError('An error occurred while updating the referral code.');
        }
    };
    

    return (
        <>
        <ToastContainer/>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none ">
                <div className="fixed inset-0 bg-black opacity-50 "></div>
                <div className="relative w-full max-w-lg mx-auto mt-6 transition-transform transform translate-x-full slide-in">
                    <div className="relative flex flex-col w-full px-4 bg-[#1F1F1F] rounded-lg shadow-lg outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-solid">
                            <h3 className="text-xl font-semibold text-center text-white w-full">
                                Update Referred By Referral Code
                            </h3>
                            <button
                                className="p-1 ml-auto text-3xl font-semibold text-white bg-transparent border-0 opacity-5 outline-none focus:outline-none"
                                onClick={closeSideModal}
                            >
                                x
                            </button>
                        </div>
                        <div className="relative flex text-white px-6 pt-6 mb-2">
                            <h6 className="font-bold text-[16px] pb-2">New Friend Referral Code</h6>
                        </div>
                        <div className="pb-7 px-6">
                            <input
                                type="text"
                                value={newRefBy}
                                onChange={(e) => setNewRefBy(e.target.value)}
                                className="w-full px-3 py-2 text-white bg-[#363636] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 transition-all ease-in-out"
                            />
                        </div>
                        <div className="mb-24 px-6">
                            <div onClick={handleReferralChange} className="flex items-center w-full bg-[#CE9600] hover:bg-[#CE9600]/90 justify-center my-3 rounded-lg cursor-pointer border-solid border-blueGray-200">
                                <button
                                    className="text-white flex gap-2 items-center background-transparent font-bold uppercase py-2.5 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                >
                                    <MdOutlineCancelScheduleSend /> Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideModel;
