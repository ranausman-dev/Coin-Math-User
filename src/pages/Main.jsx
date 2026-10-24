import React, { useEffect, useState } from "react";
const banner = "/banner.webp";
import { FaArrowRight } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

import { FaFacebookF } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { RiYoutubeFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { TbArrowGuide } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { db } from '../components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import GuideModal from '../components/modals/GuideModal'
import { FaMediumM } from "react-icons/fa";
const uniswap = "/uniswap.png";
import BalanceModal from "../components/BalanceModal";
import Fb from "../components/Fb";
import { GiTwoCoins } from "react-icons/gi";
import Card from "../components/Card";

const Main = () => {
  const [profileData, setProfileData] = useState(null);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const userId = localStorage.getItem("userId");
  const [showSideModal, setShowSideModal] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [isConverted, setIsConverted] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const openBalanceModal = () => setShowBalanceModal(true);
  const closeBalanceModal = () => setShowBalanceModal(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const openSideModal = () => setShowSideModal(true);
  const closeSideModal = () => setShowSideModal(false);
  const [airBalance, setAirBalance] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  // console.log()


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userRef = doc(db, "profiles", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfileData(userData);
          const referralsCount = userData.referralCount || 0;
          setTotalReferrals(referralsCount);
          setHourlyRate(0.14 * referralsCount * 1.1);
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (userId) fetchInitialData();
  }, [userId]);




  const sanitizeAndFormatCoins = (coinsString) => {
    const str = String(coinsString);

    const firstValidDecimalIndex = str.indexOf(".");

    let sanitizedCoins = str;

    if (firstValidDecimalIndex !== -1) {
      sanitizedCoins =
        str.slice(0, firstValidDecimalIndex + 1) +
        str.slice(firstValidDecimalIndex + 1).replace(/\./g, "");
    }

    const numberValue = Number(sanitizedCoins);
    return isNaN(numberValue) ? "0.00" : numberValue.toFixed(3);
  };

  const sanitizeAndFormatAirDeopCoins = (coinsString) => {
    const str = String(coinsString);

    const firstValidDecimalIndex = str.indexOf(".");

    let sanitizedCoins = str;

    if (firstValidDecimalIndex !== -1) {
      sanitizedCoins =
        str.slice(0, firstValidDecimalIndex + 1) +
        str.slice(firstValidDecimalIndex + 1).replace(/\./g, "");
    }

    const numberValue = Number(sanitizedCoins);
    return isNaN(numberValue) ? "0.00" : numberValue.toFixed(6);
  };


  return (
    <>
      <div className="px-3 lg:px-20 mt-5">
        <div className="rounded-b-xl overflow-hidden border border-[#262626]">
          <div className="">
            <img src={banner} className="w-full md:h-56" alt="banner" />
          </div>
          <div className="bg-[#1F1F1F] flex flex-col md:flex md:flex-row gap-4 px-10 ">
            <div className="mt-[-40px] lg:mt-[-60px]">
              <div className="overflow-hidden md:rounded-2xl  md:border border-black">
                <img
                  className="md:w-32 w-20"
                  src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679"
                  alt="logo"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex md:flex-row justify-between pb-9 w-full  mt-2 lg:mt-6">
              <div className="">
                <h2 className="text-white font-bold text-2xl">CoinMath</h2>
              </div>
              <div className="mt-5 md:mt-0">
                <div className="flex gap-2 md:mt-2">
                  <Link to="/about">
                    <button className="bg-[#ce9600] px-3 py-2 rounded-lg cursor-pointer text-white flex items-center gap-2 hover:bg-[#ce9600]/90 transition duration-200 ease-in-out">
                      <AiOutlineQuestionCircle className="text-xl" />
                      About
                    </button>
                  </Link>
                  <button
                    onClick={openSideModal}
                    className="bg-transparent border border-gray-500 px-3 py-1 rounded-lg flex items-center gap-2 text-white cursor-pointer hover:bg-white/10 transition duration-200 ease-in-out"
                  >
                    <TbArrowGuide className="text-xl" />
                    Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-col items-center gap-6 bg-[#1F1F1F] rounded-xl my-7 py-8 px-10 border border-[#262626]">
          <div className=" flex justify-between  md:mb-0">
            <div className="overflow-hidden rounded-full mr-5">
              <img
                className="w-20 h-20"
                src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679"
                alt="logo"
              />
            </div>
            <div className="md:flex md:flex-row items-center lg:justify-between lg:w-[100%] md:gap-[280px] flex-col">
              <div>
                <span className="text-[12px] text-[#ce9600]">
                  WALLET BALANCE
                </span>
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
                <p className="text-sm text-gray-800">COIM</p>
              </div>
            </div>
          </div>
          {/* <div className="block md:hidden">
            {profileData && !isConverted && profileData.coins > 5000 ? (
              <button
                className="text-white bg-[#ce9600] py-2 px-3 rounded-lg  md:block"
                onClick={openBalanceModal}
              >
                Convert into AirDrop
              </button>
            ) : (
              <div className="flex justify-center items-center">
                <div>
                  <span className="text-[12px] text-[#ce9600]">
                    AIRDROP BALANCE
                  </span>
                  {profileData && (
                    <>
                      <h3 className="text-2xl font-bold text-[#fff]">
                        {sanitizeAndFormatCoins(
                          (profileData.coins || 0) 
                        )}
                      </h3>
                    </>
                  )}
                  <p className="text-sm text-gray-800">COIM</p>
                </div>
              </div>
            )}
          </div> */}
        </div>
        <div className=" bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 mb-5 py-8 px-10 border border-[#262626]">
          <Link to="/mine">
            <div className="flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100">
              <h6 className="text-white">COIM Generation</h6>
              <div className=" bg-[#2c281d] rounded-2xl px-2 py-2  flex gap-2 items-center">
                <div>
                  <FaArrowRight />
                </div>
                <span className="hidden md:block">Mining</span>
              </div>
            </div>
          </Link>
          <Link to="/wallet">
            <div className="flex items-center text-[#ce9600] justify-between mt-7  hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100">
              <h6 className="text-white">Wallet</h6>
              <div className=" bg-[#2c281d] rounded-2xl px-2 py-2  flex gap-2 items-center">
                <div>
                  <FaArrowRight />
                </div>
                <span className="hidden md:block">Wallet</span>
              </div>
            </div>
          </Link>
          <Link to="/ref">
            <div className="flex items-center text-[#ce9600] justify-between mt-7  hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100">
              <h6 className="text-white">Refferals</h6>
              <div className=" bg-[#2c281d] rounded-2xl px-2 py-2  flex gap-2 items-center">
                <div>
                  <FaArrowRight />
                </div>
                <span className="hidden md:block">Refferals</span>
              </div>
            </div>
          </Link>
          <Link to="/earn">
            <div className="flex items-center text-[#ce9600] justify-between mt-7  hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100">
              <h6 className="text-white">Earn</h6>
              <div className=" bg-[#2c281d] rounded-2xl px-2 py-2  flex gap-2 items-center">
                <div>
                  <FaArrowRight />
                </div>
                <span className="hidden md:block">Earn</span>
              </div>
            </div>
          </Link>
          <Link to="/blogs">
            <div className="flex items-center text-[#ce9600] justify-between mt-7  hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100">
              <h6 className="text-white">News</h6>
              <div className=" bg-[#2c281d] rounded-2xl px-2 py-2  flex gap-2 items-center">
                <div>
                  <FaArrowRight />
                </div>
                <span className="hidden md:block">News</span>
              </div>
            </div>
          </Link>
          <Link to="/profile">
            <div className="flex items-center text-[#ce9600] justify-between mt-7  hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100">
              <h6 className="text-white">My Profile</h6>
              <div className=" bg-[#2c281d] rounded-2xl px-2 py-2  flex gap-2 items-center">
                <div>
                  <FaArrowRight />
                </div>
                <span className="hidden md:block">My Profile</span>
              </div>
            </div>
          </Link>
        </div>
        <div>
          <div className="flex items-center justify-center gap-3 md:gap-5 pb-10">
            <a
              href="https://x.com/coinmath_app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-[#2c281d] rounded-full md:rounded-2xl cursor-pointer md:pl-2 p-2 md:pr-6 text-[#ce9600]">
                <FaXTwitter />
              </div>
            </a>
            <a
              href="https://www.facebook.com/coinmathapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-[#2c281d] rounded-2xl cursor-pointer p-2 md:pr-6 text-[#ce9600]">
                <FaFacebookF />
              </div>
            </a>

            <a
              href="https://medium.com/@coinmath"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-[#2c281d] rounded-2xl cursor-pointer md:pl-2 p-2 md:pr-6 text-[#ce9600]">
                <FaMediumM />
              </div>
            </a>
            <a
              href="https://www.youtube.com/channel/UCuvgpL093TMgdw6u5g_8Obw"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-[#2c281d] rounded-2xl cursor-pointer md:pl-2 p-2 md:pr-6 text-[#ce9600]">
                <RiYoutubeFill />
              </div>
            </a>
            <a
              href="https://app.uniswap.org/swap?outputCurrency=0xd2237d9fe0c36721220e4bd88aa85b55ffda0e84&chain=base"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-[#2c281d] rounded-full md:rounded-3xl cursor-pointer md:pl-2  md:p-2 md:pr-7 text-[#ce9600]">
                <img
                  className="md:h-5 w-8 p-2 md:p-0 md:w-auto"
                  src={uniswap}
                  alt="uniswap"
                />
              </div>
            </a>
            <a
              href="https://t.me/CoinMath_app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-[#2c281d] rounded-2xl cursor-pointer md:pl-2 p-2 md:pr-6 text-[#ce9600] flex items-center gap-2">
                <FaTelegramPlane />
                <span className="hidden md:block">Telegram</span>
              </div>
            </a>
          </div>
          <div className="flex justify-center pb-24 md:pb-10">
            <p className="text-white text-sm">Version 0.1.4</p>
          </div>
        </div>
      </div>

      {showSideModal && <GuideModal closeSideModal={closeSideModal} />}
    </>
  );
};

export default Main;
