import React, { useState, useEffect } from "react";
import { GiTwoCoins } from "react-icons/gi";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuCoins, LuWallet } from "react-icons/lu";
import { MdOutlineHome, MdRoomPreferences } from "react-icons/md";
import { TbSmartHome } from "react-icons/tb";

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setActiveTab(window.location.pathname);
  }, []);

  return (
    <div className="fixed bottom-0 border-t-2 border-[#262626] inset-x-0 bg-[#1F1F1F] shadow md:hidden block z-50">
      <div className="flex justify-between" id="tabs">
        <a
          href="/"
          className={`w-full justify-center inline-block text-center pt-2 pb-1 ${
            activeTab === "/"
              ? "text-[#ce9600]"
              : "text-white hover:text-[#ce9600]"
          }`}
          onClick={() => setActiveTab("/")}
        >
          <TbSmartHome className="text-2xl inline-block mb-1" />
          <span className="tab tab-home block text-xs">Home</span>
        </a>
        <a
          href="/mine"
          className={`w-full justify-center inline-block text-center pt-2 pb-1 ${
            activeTab === "/mine"
              ? "text-[#ce9600]"
              : "text-white hover:text-[#ce9600]"
          }`}
          onClick={() => setActiveTab("/mine")}
        >
          <LuCoins className="text-2xl inline-block mb-1" />
          <span className="tab tab-home block text-xs">COIM</span>
        </a>
        <a
          href="/wallet"
          className={`w-full justify-center inline-block text-center pt-2 pb-1 ${
            activeTab === "/wallet"
              ? "text-[#ce9600]"
              : "text-white hover:text-[#ce9600]"
          }`}
          onClick={() => setActiveTab("/wallet")}
        >
          <LuWallet className="text-2xl inline-block mb-1" />
          <span className="tab tab-home block text-xs">Wallet</span>
        </a>
        <a
          href="/ref"
          className={`w-full justify-center inline-block text-center pt-2 pb-1 ${
            activeTab === "/ref"
              ? "text-[#ce9600]"
              : "text-white hover:text-[#ce9600]"
          }`}
          onClick={() => setActiveTab("/ref")}
        >
          <MdRoomPreferences className="text-2xl inline-block mb-1" />
          <span className="tab tab-home block text-xs">Referrals</span>
        </a>
        <a
          href="/earn"
          className={`w-full justify-center inline-block text-center pt-2 pb-1 ${
            activeTab === "/earn"
              ? "text-[#ce9600]"
              : "text-white hover:text-[#ce9600]"
          }`}
          onClick={() => setActiveTab("/earn")}
        >
          <GiTwoCoins className="text-2xl inline-block mb-1" />
          <span className="tab tab-home block text-xs">Earn</span>
        </a>
        <a
          href="/blogs"
          className={`w-full justify-center inline-block text-center pt-2 pb-1 ${
            activeTab === "/blogs"
              ? "text-[#ce9600]"
              : "text-white hover:text-[#ce9600]"
          }`}
          onClick={() => setActiveTab("/blogs")}
        >
          <IoNewspaperOutline className="text-2xl inline-block mb-1" />
          <span className="tab tab-home block text-xs">News</span>
        </a>
      </div>
    </div>
  );
};

export default BottomNav;
