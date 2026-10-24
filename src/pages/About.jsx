import React, { useEffect } from 'react'
import banner from '../../public/banner.webp'
import { useLocation } from 'react-router-dom';


const About = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <>
            <div className='px-3 lg:px-20 mt-5 pb-10'>
                <div className='rounded-b-xl overflow-hidden'>
                    <div className='rounded-b-xl overflow-hidden border border-[#262626]'>
                        <div className=''>
                            <img src={banner} className='w-full md:h-56' alt="banner" />
                        </div>
                        <div className='bg-[#1F1F1F] flex flex-col md:flex md:flex-row gap-4 px-10 '>
                            <div className='mt-[-40px] lg:mt-[-60px]'>
                                <div className='overflow-hidden md:rounded-2xl  md:border border-black'>
                                    <img className="md:w-32 w-20" src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679" alt="logo" />
                                </div>
                            </div>
                            <div className='flex flex-col md:flex md:flex-row justify-between pb-9 w-full  mt-2 lg:mt-6'>
                                <div className=''>
                                    <h2 className='text-white font-bold text-2xl'>About CoinMath</h2>
                                    <p className='text-gray-800'>What is $COIM?</p>
                                </div>
                                {/* <div className='mt-5 md:mt-0'>
                                    <div className='flex gap-2 md:mt-2'>
                                        <button className='bg-[#ce9600] px-3 py-2 rounded-lg cursor-pointer text-white flex items-center gap-2 hover:bg-[#ce9600]/90 transition duration-200 ease-in-out'><AiOutlineQuestionCircle className='text-xl' />About</button>
                                        <button className='bg-transparent border border-gray-500 px-3 py-1 rounded-lg flex items-center gap-2 text-white cursor-pointer hover:bg-white/10 transition duration-200 ease-in-out'><TbArrowGuide className='text-xl' />
                                            Guide
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-6 bg-[#1F1F1F] rounded-xl my-7 py-8  border border-[#262626]'>
                        <div className='md:px-10'>
                            <div className=' items-center gap-6   rounded-xl my-7 py-8 px-10 boxShadow'>
                                <h2 className='text-[#0052FD] font-extrabold text-4xl w-full text-center pb-6'>Welcome to CoinMath</h2>
                                <p className='text-white pb-3'>Your gateway to the future of digital asset growth! At CoinMath, we believe in making digital assets accessible to everyone,
                                    regardless of their technical expertise or background. Our innovative protocol, built on the <span className='text-[#0052FD]' >Base blockchain</span>, empowers users to grow their assets with ease.
                                </p>
                                <p className='text-white pb-3'>
                                    With our user-friendly mobile app, growing CoinMath tokens has never been simpler. Whether you're a seasoned asset enthusiast or just starting,
                                    CoinMath makes it easy for you to start earning passive income. Our unique daily growth process allows users to earn rewards effortlessly,
                                    directly from their smartphones.
                                </p>
                                <p className='text-white pb-3'>
                                    CoinMath is more than just a protocol - it's a community-driven platform that values transparency, security, and inclusivity. We're dedicated to
                                    providing our users with a seamless and rewarding experience, backed by the robust infrastructure of the <span className='text-[#0052FD]'>Base blockchain</span>.
                                </p>
                                <p className='text-white text-center pb-3'>
                                    Stay updated with the latest news, updates, and developments from CoinMath by subscribing to our newsletter and following us on Twitter. Join the CoinMath community
                                    today and start your journey towards financial growth through digital assets.
                                </p>
                                <p className='text-white text-center pb-5'>For more information about CoinMath, check out our <span className='text-[#0052FD]'>Litepaper: CoinMath Litepaper</span></p>
                                <p className='text-[#0052FD] text-center'>Thank you for choosing CoinMath - where growth meets simplicity!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About
