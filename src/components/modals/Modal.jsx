import React, { useState, useEffect } from "react";
import { MdOutlineCancelScheduleSend } from "react-icons/md";
import { doc, getDoc, setDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from "../firebase";

const Modal = ({ closeModal }) => {
    const [referralCode, setReferralCode] = useState('');
    const [newReferralCode, setNewReferralCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchReferralCode = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const docRef = doc(db, 'profiles', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setReferralCode(userData.referralCode);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching referral code:', error);
        }
    };

    const handleNewReferralCodeChange = (e) => {
        setNewReferralCode(e.target.value);
    };

    const handleSaveNewReferralCode = async () => {
        if (!newReferralCode) {
            toast.error("New referral code cannot be empty.");
            setError('New referral code cannot be empty.');
            return;
        }

        setLoading(true);

        try {
            const q = query(collection(db, 'profiles'), where('referralCode', '==', newReferralCode));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast.error("This referral code is already taken. Please choose another one.");
                setError('This referral code is already taken. Please choose another one.');
                setLoading(false);
                return;
            }

            const batch = writeBatch(db);
            const userId = localStorage.getItem('userId');
            const userRef = doc(db, 'profiles', userId);

            batch.set(userRef, { referralCode: newReferralCode }, { merge: true });

            const referredUsersQuery = query(collection(db, 'profiles'), where('referralByCode', '==', referralCode));
            const referredUsersSnapshot = await getDocs(referredUsersQuery);

            referredUsersSnapshot.forEach((docSnapshot) => {
                const referredUserRef = doc(db, 'profiles', docSnapshot.id);
                batch.update(referredUserRef, { referralByCode: newReferralCode });
            });

            await batch.commit();

            toast.success("Referral code updated successfully.");
            setReferralCode(newReferralCode);
            setNewReferralCode('');
            setError('');
            fetchReferralCode();
            closeModal();
        } catch (error) {
            console.error('Error updating referral code:', error);
            setError('An error occurred while updating the referral code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferralCode();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative my-6 mx-auto w-[300px] md:w-[650px] lg:w-[900px]">
                    <div className="px-4 rounded-lg shadow-lg relative flex flex-col w-full bg-[#1F1F1F] outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-solid">
                            <h3 className="text-xl text-center w-full text-white font-semibold">
                                Change my referral code
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={closeModal}
                            >x
                            </button>
                        </div>
                        <div className="relative flex flex-col px-6 md:flex md:flex-row text-white">
                            <h6 className="font-semibold text-[15px] pr-2">Your current referral code:</h6>
                            <p className="mt-3 md:mt-0">{referralCode}</p>
                        </div>
                        <div className="relative px-6 pt-6 mb-3 flex text-white">
                            <h6 className="font-bold text-[16px]">New Code</h6>
                        </div>
                        <div className="pb-5 px-6">
                            <input
                                type="text"
                                className="w-full px-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all"
                                value={newReferralCode}
                                onChange={handleNewReferralCodeChange}
                            />
                        </div>
                        <div className="mb-4">
                            <div onClick={handleSaveNewReferralCode} className={`flex items-center justify-center my-3 mx-20 lg:mx-64 md:mx-52 rounded-lg cursor-pointer border-solid border-blueGray-200 ${loading ? 'bg-opacity-50' : 'bg-[#CE9600] hover:bg-[#CE9600]/90'}`}>
                                <button
                                    className="text-white flex items-center gap-2 background-transparent font-bold uppercase px-6 py-2.5 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    disabled={loading} 
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default Modal;
