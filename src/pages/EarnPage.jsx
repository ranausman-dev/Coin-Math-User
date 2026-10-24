import React, { useEffect, useState } from "react";
const banner = "/banner.webp";
import { FaArrowRight } from "react-icons/fa";
import Card from "../components/Card";
import fb from "../assets/images/facebook.png";
import twitter from "../assets/images/twitter.png";
import coin from "../assets/images/star.png";
import insta from "../assets/images/social.png";
import medium from "../assets/images/medium.png";
import tele from "../assets/images/telegram.png";
import { db } from "../components/firebase";
import ut from "../assets/images/youtube.png";
import check from "../assets/images/check.png";
import { collection, getDocs } from "firebase/firestore";

const EarnPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    icon: "",
    link: "",
    reward: ""
  });
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [dailyTaskLink, setDailyTaskLink] = useState([]);

  const fetchYoutubeData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "youtubeLink"));
      const youtubeData = querySnapshot.docs.map((doc) => doc.data());

      setYoutubeLinks(youtubeData);
    } catch (error) {
      console.error("Error fetching YouTube links:", error);
    }
  };


  const fetchDailyReward = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "dailyTaskLink"));
      const taskLink = querySnapshot.docs.map((doc) => doc.data());
      console.log(taskLink);

      setDailyTaskLink(taskLink);
    } catch (error) {
      console.error("Error fetching Daily Task Link:", error);
    }
  };

  useEffect(() => {
    fetchYoutubeData();
    fetchDailyReward()
  }, []);


  const processTitle = (title) => {
    return title.trim().toLowerCase().replace(/\s+/g, "");
  };

  const isVisited = (taskTitle) => {
    const processedTaskTitle = processTitle(taskTitle);
    return !!localStorage.getItem(processedTaskTitle);
  };

  const handleDialogOpen = (title, icon, link,reward) => {
    setDialogContent({ title, icon, link, reward });
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <div className="px-3 lg:px-20 mt-5 pb-5 md:pb-0">
      <div className="rounded-b-xl overflow-hidden border border-[#262626]">
        <img src={banner} className="md:w-full md:h-56" alt="banner" />
        <div className="bg-[#1F1F1F] flex gap-4 px-10 h-24">
          <div className="mt-[-40px] lg:mt-[-45px]">
            <div className="overflow-hidden rounded-2xl border border-black">
              <img
                className="w-32"
                src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679"
                alt="logo"
              />
            </div>
          </div>
          <div className="flex justify-between w-full mt-2">
            <div>
              <h2 className="text-white font-bold md:text-2xl">COIM Earn</h2>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold mt-16">CoinMath YouTube</h4>
      </div>
      <div className="bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 mb-5 py-8 px-1 md:px-10 border border-[#262626]">
        <div
          onClick={() =>
            handleDialogOpen(
              youtubeLinks.length > 0 ? youtubeLinks[0].title1 : "",
              ut,
              youtubeLinks.length > 0 ? youtubeLinks[0].link1 : "",
              250
            )
          }
          className="flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100"
        >
          <div className="rounded-2xl px-2 py-2 flex gap-5 items-center">
            <img src={ut} className="w-10" alt="Youtube" /> 
            <div>
              <h6 className="text-white">
                {youtubeLinks.length > 0 ? youtubeLinks[0].title1 : ""}
              </h6>
              <div className="flex items-center gap-2">
                <img src={coin} className="w-5" alt="coin" />
                <h6 className="text-white">+250</h6>
              </div>
            </div>
          </div>
          <div className="rounded-2xl px-2 py-2 flex gap-2 items-center">
            {isVisited(
              youtubeLinks.length > 0 ? youtubeLinks[0].title1 : ""
            ) ? ( 
              <img src={check} className="w-5" alt="check" />
            ) : (
              <FaArrowRight />
            )}
          </div>
        </div>
        <div
          onClick={() =>
            handleDialogOpen(
              youtubeLinks.length > 0 ? youtubeLinks[0].title2 : "",
              ut,
              youtubeLinks.length > 0 ? youtubeLinks[0].link2 : "",
              250
            )
          }
          className="mt-5 flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100"
        >
          <div className="rounded-2xl px-2 py-2 flex gap-5 items-center">
            <img src={ut} className="w-10" alt="Youtube" />
            <div>
              <h6 className="text-white">
                {youtubeLinks.length > 0 ? youtubeLinks[0].title2 : ""}
              </h6>
              <div className="flex items-center gap-2">
                <img src={coin} className="w-5" alt="coin" />
                <h6 className="text-white">+250</h6>
              </div>
            </div>
          </div>
          <div className="rounded-2xl px-2 py-2 flex gap-2 items-center">
            {isVisited(
              youtubeLinks.length > 0 ? youtubeLinks[0].title2 : ""
            ) ? (
              <img src={check} className="w-5" alt="check" />
            ) : (
              <FaArrowRight />
            )}
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold">Daily Tasks</h4>
      </div>
      <div className="bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 mb-5 py-8 px-1 md:px-10 border border-[#262626]">
        <div
          onClick={() =>
            handleDialogOpen(
              "Daily Reward",
              coin,
              dailyTaskLink.length > 0 ? dailyTaskLink[0].taskLink : "",
              100
            )
          }
          className="flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100"
        >
          <div className="rounded-2xl px-2 py-2 flex gap-5 items-center">
            <img src={coin} className="w-10" alt="facebook" />
            <div>
              <h6 className="text-white">Daily Reward</h6>
              <div className="flex items-center gap-2">
                <img src={coin} className="w-5" alt="coin" />
                <h6 className="text-white">+100</h6>
              </div>
            </div>
          </div>
          <div className="rounded-2xl px-2 py-2 flex gap-2 items-center">
            {isVisited("Daily Reward") ? (
              <img src={check} className="w-5" alt="check" />
            ) : (
              <FaArrowRight />
            )}
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold">Tasks list</h4>
      </div>
      <div className="bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 mb-16 md:mb-5 py-8 px-1 md:px-10 border border-[#262626]">
        <div
          onClick={() =>
            handleDialogOpen(
              "Follow us on Facebook",
              fb,
              "https://www.facebook.com/coinmathapp",
              100
            )
          }
          className="flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100"
        >
          <div className="rounded-2xl px-2 py-2 flex gap-5 items-center">
            <img src={fb} className="w-10" alt="facebook" />
            <div>
              <h6 className="text-white">Follow us on Facebook</h6>
              <div className="flex items-center gap-2">
                <img src={coin} className="w-5" alt="coin" />
                <h6 className="text-white">+100</h6>
              </div>
            </div>
          </div>
          <div className="rounded-2xl px-2 py-2 flex gap-2 items-center">
            {isVisited("Follow us on Facebook") ? (
              <img src={check} className="w-5" alt="check" />
            ) : (
              <FaArrowRight />
            )}
          </div>
        </div>
        <div
          onClick={() =>
            handleDialogOpen(
              "Follow us on Twitter",
              twitter,
              "https://x.com/coinmath_app",
              100
            )
          }
          className="flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100 mt-4"
        >
          <div className="rounded-2xl px-2 py-2 flex gap-5 items-center">
            <img src={twitter} className="w-10" alt="twitter" />
            <div>
              <h6 className="text-white">Follow us on Twitter</h6>
              <div className="flex items-center gap-2">
                <img src={coin} className="w-5" alt="coin" />
                <h6 className="text-white">+100</h6>
              </div>
            </div>
          </div>
          <div className="rounded-2xl px-2 py-2 flex gap-2 items-center">
            {isVisited("Follow us on Twitter") ? (
              <img src={check} className="w-5" alt="check" />
            ) : (
              <FaArrowRight />
            )}
          </div>
        </div>
        <div
          onClick={() =>
            handleDialogOpen(
              "Follow us on Instagram",
              insta,
              "https://instagram.com/coinmathapp",
              100
            )
          }
          className="flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100 mt-4"
        >
          <div className="rounded-2xl px-2 py-2 flex gap-5 items-center">
            <img src={insta} className="w-10" alt="instagram" />
            <div>
              <h6 className="text-white">Follow us on Instagram</h6>
              <div className="flex items-center gap-2">
                <img src={coin} className="w-5" alt="coin" />
                <h6 className="text-white">+100</h6>
              </div>
            </div>
          </div>
          <div className="rounded-2xl px-2 py-2 flex gap-2 items-center">
            {isVisited("Follow us on Instagram") ? (
              <img src={check} className="w-5" alt="check" />
            ) : (
              <FaArrowRight />
            )}
          </div>
        </div>
        <div
          onClick={() =>
            handleDialogOpen(
              "Follow us on Medium",
              medium,
              "https://medium.com/@coinmath",
              100
            )
          }
          className="flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100 mt-4"
        >
          <div className="rounded-2xl px-2 py-2 flex gap-5 items-center">
            <img src={medium} className="w-10" alt="medium" />
            <div>
              <h6 className="text-white">Follow us on Medium</h6>
              <div className="flex items-center gap-2">
                <img src={coin} className="w-5" alt="coin" />
                <h6 className="text-white">+100</h6>
              </div>
            </div>
          </div>
          <div className="rounded-2xl px-2 py-2 flex gap-2 items-center">
            {isVisited("Follow us on Medium") ? (
              <img src={check} className="w-5" alt="check" />
            ) : (
              <FaArrowRight />
            )}
          </div>
        </div>
        <div
          onClick={() =>
            handleDialogOpen(
              "Follow us on Telegram",
              tele,
              "https://t.me/CoinMath_app",
              100
            )
          }
          className="flex items-center justify-between hover:bg-[#262626] cursor-pointer pr-1 pl-2 py-1 rounded-lg transition-colors duration-100 mt-4"
        >
          <div className="rounded-2xl px-2 py-2 flex gap-5 items-center">
            <img src={tele} className="w-10" alt="telegram" />
            <div>
              <h6 className="text-white">Follow us on Telegram</h6>
              <div className="flex items-center gap-2">
                <img src={coin} className="w-5" alt="coin" />
                <h6 className="text-white">+100</h6>
              </div>
            </div>
          </div>
          <div className="rounded-2xl px-2 py-2 flex gap-2 items-center">
            {isVisited("Follow us on Telegram") ? (
              <img src={check} className="w-5" alt="check" />
            ) : (
              <FaArrowRight />
            )}
          </div>
        </div>
        {showDialog && (
          <Card
            title={dialogContent.title}
            icon={dialogContent.icon}
            onClose={handleDialogClose}
            link={dialogContent.link}
            isVisible={showDialog}
            reward={dialogContent.reward}
          />
        )}
      </div>
    </div>
  );
};

export default EarnPage;
