import React, { useState, useEffect } from "react";
import coin from "../assets/images/star.png";
import { FaTimes } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Card = ({ title, icon, onClose, link, reward }) => {
  const [isClaimed, setIsClaimed] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const processedTitle = title.trim().toLowerCase().replace(/\s+/g, "");
  const userId = localStorage.getItem("userId");

  const handleFollowClick = () => {
    window.open(link, "_blank");
    const currentTime = new Date().getTime();
    localStorage.setItem(processedTitle, currentTime);
    setShowWaitMessage(true);
  };

  const handleClaimClick = async () => {
    setIsClaimed(true);
    setShowWaitMessage(false);

    if (userId) {
      try {
        const docRef = doc(db, "profiles", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentCoins = parseFloat(docSnap.data().coins);
          const newCoins = (currentCoins + reward).toFixed(5);

          await updateDoc(docRef, { coins: newCoins });
          if (title === "Daily Reward") {
            localStorage.setItem(processedTitle + "claimed", "true");
          }
          localStorage.setItem(processedTitle + "claimedcoin", "true");
          toast.success("Coin Claimed successfully!");
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          console.error("User document does not exist.");
        }
      } catch (error) {
        console.error("Error updating coins: ", error);
      }
    } else {
      console.error("User ID not found in localStorage.");
    }
  };

  useEffect(() => {
    const lastActionTime = localStorage.getItem(processedTitle);
    if (lastActionTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - lastActionTime;
      const oneHour = 60 * 60 * 1000;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      // const twentyFourHours = 220 * 1000;
      if (elapsedTime >= oneHour) {
        setCanClaim(true);
        setShowWaitMessage(false);
      } else {
        setShowWaitMessage(true);
        setCanClaim(false);
      }
      const task = localStorage.getItem("dailyreward");

      if (task) {
        if (elapsedTime >= twentyFourHours) {
          window.location.reload();
          localStorage.removeItem("dailyreward");
          localStorage.removeItem("dailyreward" + "claimed");
          localStorage.removeItem("dailyreward" + "claimedcoin");
          setCanClaim(false);
        }
      } else {
        console.log("No daily task found in localStorage");
      }

    }
  }, []);

  const isVisited = localStorage.getItem(processedTitle);
  const claimed = localStorage.getItem(processedTitle + "claimedcoin");

  let dailyTask;
  if (title === "Daily Reward") {
    dailyTask = localStorage.getItem("dailyreward" + "claimed");
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1D1F25] bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <ToastContainer />
      <div className="relative bg-[#1F1F1F] rounded-3xl p-6 w-full max-w-md mx-auto border-solid border-t border-[#ce9600] shadow-[0_-6px_8px_-2px_#ce9600]">
        <buttonimport
          onClick={onClose}
          className="absolute p-1 hover:cursor-pointer top-4 right-4 bg-[#3B3E41] rounded-full text-[#1F1F1F] text-xl"
        >
          <FaTimes className="text-sm" />
        </buttonimport>
        <div className="flex justify-center pb-5">
          <img src={icon} alt={title} className="h-20" />
        </div>
        <h2 className="text-2xl text-white font-semibold mb-4 text-center py-3">
          {title}
        </h2>
        <div className="flex justify-center px-5">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-[#4249B9] text-white rounded-xl px-8 py-2 hover:bg-[#4249B9]/80 transition font-bold ${isVisited ? "cursor-not-allowed opacity-50" : ""
              }`}
            onClick={(e) => {
              e.preventDefault();
              handleFollowClick();
            }}
            disabled={isVisited}
          >
            Join
          </a>
        </div>
        {!isVisited && (
          <div className="flex items-center justify-center py-8 gap-2">
            <img src={coin} className="w-7" alt="coin" />
            <h6 className="text-white text-xl font-bold">+{reward}</h6>
          </div>
        )}
        {showWaitMessage && !isClaimed && (
          <div className="flex justify-center py-8 text-white">
            <p>Wait for 1 hour to claim coin</p>
          </div>
        )}
        {claimed && (
          <div className="flex justify-center py-8 text-white">
            <p className="text-center px-10">
              You have claimed your coin!
            </p>
          </div>
        )}
        {dailyTask && (
          <div className="flex justify-center py-8 text-white">
            <p className="text-center px-10">
              Wait for 24 hour to earn coin again!
            </p>
          </div>
        )}
        {!dailyTask ? (
          canClaim && !claimed && (
            <div className="flex justify-center py-8 text-white">
              <p>You can claim your coins now!</p>
            </div>
          )
        ) : ""}
        {!isVisited && (
          <div className="flex justify-center mb-5">
            <button
              onClick={
                canClaim
                  ? handleClaimClick
                  : (e) => {
                    e.preventDefault();
                    handleFollowClick();
                  }
              }
              className={`bg-[#4249B9] text-white text-lg rounded-xl px-28 md:px-36 py-4 hover:bg-[#4249B9]/80 transition font-bold ${isVisited ? "cursor-not-allowed opacity-50" : ""
                }`}
              disabled={isVisited}
            >
              Follow
            </button>
          </div>
        )}
        {!dailyTask && (canClaim && !claimed && (
          <div className="flex justify-center mb-5">
            <button
              onClick={
                canClaim
                  ? handleClaimClick
                  : (e) => {
                    e.preventDefault();
                    handleFollowClick();
                  }
              }
              className={`bg-[#4249B9] text-white text-lg rounded-xl px-28 md:px-36 py-4 hover:bg-[#4249B9]/80 transition font-bold `}
            >
              Claim
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
