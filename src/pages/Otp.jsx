import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../components/firebase';
const emailApiKey = "";
const REACT_APP_SENDINBLUE_API_KEY = "";
import checkEmailExists from '../utils/checkEmailExists';


const Otp = () => {
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [enteredOTP, setEnteredOTP] = useState('');
    const [showEmailForm, setShowEmailForm] = useState(true);
    const navigate = useNavigate();
    const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const otpEmail = localStorage.getItem("tempEmail")

    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);  

        try {
            const lowerCaseEmail = email.toLowerCase();

            if (email === "" || !isEmailValid(lowerCaseEmail)) {
                toast.error('Please enter a valid email address.');
                return;
            }

            const userId = await checkEmailExists(lowerCaseEmail);
            const otpGenerated = generateOTP();

            await axios.post('https://api.sendinblue.com/v3/smtp/email', {
                sender: { email: 'info@coinmath.org' },
                to: [{ email: lowerCaseEmail }],
                subject: 'Your CoinMath OTP Verification',
                htmlContent: `<p>Your OTP for verification is: <strong>${otpGenerated}</strong></p>`,
            }, {
                headers: {
                    'api-key': emailApiKey,
                    'Content-Type': 'application/json',
                }
            });

            setOTP(otpGenerated);
            localStorage.setItem('tempEmail', lowerCaseEmail);
            toast.success('OTP sent successfully. Please check your email.');
            setShowEmailForm(false);
        } catch (error) {
            console.error('Error sending OTP:', error.response?.data || error.message);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);  
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true); 

        try {
            if (otp === '' || otp !== enteredOTP) {
                toast.error('OTP does not match. Please enter the correct OTP.');
                return;
            }

            const tempEmail = localStorage.getItem('tempEmail');
            if (!tempEmail) throw new Error('Email not found in temporary storage.');

            const result = await checkEmailExists(tempEmail.toLowerCase());
            if (result) {
                localStorage.setItem('userId', result.userId);
                localStorage.removeItem('tempEmail');
                toast.success('OTP verified successfully. Logging you in.');
                navigate('/');
            } else {
                navigate('/signup', { state: { email: tempEmail } });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);  
        }
    };


    return (
        <div className="background">
            <ToastContainer />
            {showEmailForm && (
                <form className='signinform' onSubmit={handleSendCode}>
                    <div className='flex justify-center'>
                        <img className="md:w-20 w-20 rounded-full" src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679" alt="logo" />
                    </div>
                    <h3 className='text-center pt-7 font-bold text-2xl lg:text-2xl'>Log in to CoinMath</h3>
                    <p className='py-6 text-center text-sm'>Please enter your email address</p>
                    <input
                        type="text"
                        placeholder='Enter Your Email...'
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 mt-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all"
                    />
                    <label className="flex items-center mt-3">
                        <div className="inline-flex items-center">
                            <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
                                <input
                                    type="checkbox"
                                    className="before:content[''] bg-[#CE9600] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-red transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full  before:bg-blue-gray-ka before:opacity-0 before:transition-opacity checked:border-[#ce9600] checked:bg-[#ce9600] checked:before:bg-[#ce9600] hover:before:opacity-10"
                                    id="check"
                                    onChange={() => setIsPrivacyPolicyChecked(!isPrivacyPolicyChecked)}
                                />
                                <span
                                    className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                            </label>
                            <label className="mt-px text-[12px] font-light text-white cursor-pointer select-none" htmlFor="check">
                                I have read and agree to the <Link className='cursor-pointer underline' target='_blank' to="https://coinmath.org/privacy-policy-2/">Privacy Policy</Link>
                            </label>
                        </div>
                    </label>
                    <div className='flex justify-center pb-5 pt-1'>
                    <button
                            type="submit"
                            disabled={!isPrivacyPolicyChecked || isLoading}
                            className={`bg-[#ce9600] w-full mt-4 py-2 rounded-lg text-white ${isPrivacyPolicyChecked && !isLoading ? 'hover:bg-[#ce9600]/90 cursor-pointer' : 'bg-[#ce9600]/60'} transition duration-200 ease-in-out`}
                        >
                            {isLoading ? 'Sending...' : 'Send Code'}
                        </button>
                    </div>
                </form>
            )}

            {!showEmailForm && (
                <form className='signinform' onSubmit={handleVerification}>
                    <div className='flex justify-center'>
                        <img className="md:w-20 w-20 rounded-full" src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679" alt="logo" />
                    </div>
                    <h3 className='text-center pt-7 font-bold text-2xl lg:text-2xl'>Log in to CoinMath</h3>
                    <p className='py-6 text-center text-sm'>We've sent a pin to {otpEmail}</p>
                    <input
                        type="text"
                        placeholder='Enter OTP...'
                        value={enteredOTP}
                        onChange={(e) => setEnteredOTP(e.target.value)}
                        className="w-full px-3 mt-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all"
                    />
                    <div className='flex justify-center pb-5 pt-1'>
                    <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-[#ce9600] px-20 mt-4 md:px-32 py-2 rounded-lg cursor-pointer text-white flex items-center gap-2 hover:bg-[#ce9600]/90 transition duration-200 ease-in-out ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            {isLoading ? 'Verifying...' : 'Continue'}
                        </button>
                    </div>
                    <div className='flex justify-center pt-3'>
                        <button
                            type="button"
                            onClick={handleSendCode}
                            className='text-sm text-[#CE9600] hover:underline'
                        >
                            Didn't get the OTP? Resend
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Otp;



