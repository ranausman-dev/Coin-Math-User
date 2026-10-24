import { Firestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const EmailChecker = () => {
    const [otp, setOTP] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleVerification = async (e) => {
        e.preventDefault();

        const expectedOTP = localStorage.getItem('otp');

        if (otp === expectedOTP) {
            console.log('OTP matched. Redirecting to details page...');

            try {
                const docRef = await setDoc(doc(Firestore, 'profiles', email), {
                    email: email,
                    verified: true, 
                });

                console.log('Email saved to Firestore:', email);
                localStorage.removeItem('otp'); 
                navigate('/details'); 
            } catch (error) {
                console.error('Error saving email to Firestore:', error);
            }
        } else {
            console.log('OTP does not match. Please enter correct OTP.');
        }
    };

    return (
        <div className="background">
            <form className='signinform' onSubmit={handleVerification}>
                <h3 className='text-center py-7 font-bold text-2xl lg:text-2xl'>Log in to CoinMath</h3>
                <div className='flex justify-center'>
                    <img className="md:w-20 w-20 rounded-full" src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679" alt="logo" />
                </div>
                <p className='py-6 text-center text-sm'>Please enter OTP here</p>
                <input
                    type="text"
                    placeholder='Enter OTP...'
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    className="w-full px-3 mt-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all"
                />
                <div className='flex justify-center pb-5 pt-1'>
                    <button
                        type="submit"
                        className={`bg-[#ce9600] px-20 mt-4 md:px-32 py-2 rounded-lg cursor-pointer text-white flex items-center gap-2 hover:bg-[#ce9600]/90 transition duration-200 ease-in-out `}
                    >
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmailChecker;
