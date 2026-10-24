import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaRegUserCircle } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineShareAlt } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import {
  collection,
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  increment,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../components/firebase";
import Modal from "../components/modals/Modal";
import SideModal from "../components/modals/SideModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";
import ModalComponent from "../components/modals/ModalComponent";
import ResetPasswordModal from "../components/modals/ResetPasswordModal";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSideModal, setShowSideModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const navigate = useNavigate();
  const [showDelModal, setShowDelModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openSideModal = () => setShowSideModal(true);
  const closeSideModal = () => setShowSideModal(false);

  const openResetPasswordModal = () => setShowResetPasswordModal(true);
  const closeResetPasswordModal = () => setShowResetPasswordModal(false);

  const openDelModal = () => setShowDelModal(true);
  const closeDelModal = () => setShowDelModal(false);
  const { pathname } = useLocation();

  // console.log(profileData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReferralCode = (newCode) => {
    setProfileData((prevData) => ({
      ...prevData,
      referralCode: newCode,
    }));
  };

  const deleteUserHandler = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const userRef = doc(db, "profiles", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("User not found");
        return;
      }
      const userReferralCode = userDoc.data().referralCode;
      const referrerID = userDoc.data().referrerID;

      await deleteDoc(userRef);
      localStorage.removeItem("userId");
      navigate("/email");
      if (referrerID) {
        const referrerDocRef = doc(db, "profiles", referrerID);
        await updateDoc(referrerDocRef, {
          referralCount: increment(-1),
        });
      }
      const q = query(
        collection(db, "profiles"),
        where("referralByCode", "==", userReferralCode)
      );
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);
      querySnapshot.forEach((userDoc) => {
        batch.update(userDoc.ref, {
          referralByCode: "",
          referrerID: "",
        });
      });

      await batch.commit();
      toast.success("User deleted successfully");

      fetchUserProfile();
    } catch (error) {
      console.error("Error deleting user or updating referrals:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-3 lg:px-20 mt-5 pb-7">
      <ToastContainer />
      {profileData && (
        <>
          <div className="rounded-xl border border-[#262626] bg-[#1F1F1F]">
            <div className="text-[130px] flex justify-center items-center mt-14 mb-3">
              <div>
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    className="rounded-full w-32 h-32"
                    alt="user"
                  />
                ) : (
                  <FaRegUserCircle className="text-white" />
                )}
              </div>
            </div>
            <div className="mb-8">
              <div className="pb-4">
                <h2 className="text-white font-bold text-2xl text-center ">
                  {profileData.firstName} {profileData.surname}
                </h2>
              </div>
              <div className="flex justify-center items-center">
                <div className="flex gap-2 md:mt-2">
                  <Link to="/update-profile">
                    <button className="bg-[#ce9600] px-3 py-2 rounded-lg cursor-pointer text-white flex items-center gap-2 hover:bg-[#ce9600]/90 transition duration-200 ease-in-out">
                      <MdOutlineModeEdit className="text-xl" />
                      Update
                    </button>
                  </Link>
                  <button
                    onClick={openDelModal}
                    className="bg-transparent border border-gray-500 px-3 py-1 flex items-center gap-2 rounded-lg text-white cursor-pointer hover:bg-white/10 transition duration-200 ease-in-out"
                  >
                    <RxCross2 className="text-xl" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#1F1F1F] rounded-xl mt-8 py-4 px-6 border border-[#262626]">
            <div className="text-white">
              <p className="text-2xl font-bold">Details</p>
            </div>
            <div className="flex flex-col gap-8 lg:gap-0 md:flex md:flex-row lg:items-center mt-7">
              <div className="lg:pr-32">
                <span className="text-[13px] text-white font-semibold">
                  Email
                </span>
                <p className="text-[14px] text-[#ce9600]">
                  {profileData.email}
                </p>
              </div>
              <div className="lg:pr-40">
                <span className="text-[13px] text-white font-semibold">
                  Base Wallet Address
                </span>
                <p className="text-[14px] text-white">
                  {profileData.baseWalletAddress}
                </p>
              </div>
              <div className="lg:pr-40">
                <span className="text-[13px] text-white font-semibold">
                  First Name
                </span>
                <p className="text-[14px] text-white">
                  {profileData.firstName}
                </p>
              </div>
              <div className="lg:pr-40">
                <span className="text-[13px] text-white font-semibold">
                  Surname
                </span>
                <p className="text-[14px] text-white">{profileData.surname}</p>
              </div>
            </div>
            <div className="flex flex-col gap-8 md:flex md:flex-row lg:items-center mt-4">
              <div className="lg:pr-40">
                <span className="text-[13px] text-white font-semibold">
                  Phone Number
                </span>
                <p className="text-[14px] text-white">{profileData.phone}</p>
              </div>
              <div className="lg:pr-40">
                <span className="text-[13px] text-white font-semibold">
                  Referral Code
                </span>
                <p className="text-[14px] text-white">
                  {profileData.referralCode}
                </p>
              </div>
              <div className="lg:pr-40">
                <span className="text-[13px] text-white font-semibold">
                  Total Referrals
                </span>
                <p className="text-[14px] text-white">
                  {profileData.referralCount || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 mb-5 py-8 px-10 border border-[#262626]">
            <div className="flex md:items-center gap-5 px-5 py-3 rounded-xl bg-[#443919]">
              <div className="mt-1 md:mt-0">
                <AiOutlineShareAlt />
              </div>
              <h6 className="text-white">
                Want to change the referral code that your friends will receive?
              </h6>
            </div>
            <div
              onClick={openModal}
              className="flex md:items-center text-[#ce9600] justify-between mt-7 hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100"
            >
              <h6 className="text-white">Change my referral code</h6>
              <div className="bg-[#2c281d] rounded-2xl px-2 py-2 h-8 flex gap-2 items-center">
                <div>
                  <AiOutlineShareAlt className="mr-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 mb-5 py-8 px-10 border border-[#262626]">
            <div className="flex md:items-center gap-5 px-5 py-3 rounded-xl bg-[#443919]">
              <div className="mt-1 md:mt-0">
                <FaArrowRight />
              </div>
              <h6 className="text-white">
                Forgot to include a referral code during onboarding? No problem!
              </h6>
            </div>
            <div
              onClick={openSideModal}
              className="flex items-center text-[#ce9600] justify-between mt-7 hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100"
            >
              <h6 className="text-white">Update Referral Code</h6>
              <div className="bg-[#2c281d] rounded-2xl px-2 py-2 flex gap-2 items-center">
                <div>
                  <FaArrowRight className="mr-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#1F1F1F] text-[#ce9600] rounded-xl mt-7 mb-5 py-8 px-10 border border-[#262626]">
            <div className="flex md:items-center gap-5 px-5 py-3 rounded-xl bg-[#443919]">
              <div className="mt-1 md:mt-0">
                <FaArrowRight />
              </div>
              <h6 className="text-white">
                Secure your account—update your password with ease!
              </h6>
            </div>
            <div
              onClick={openResetPasswordModal}
              className="flex items-center text-[#ce9600] justify-between mt-7 hover:bg-[#262626] pr-1 pl-2 py-1 cursor-pointer rounded-lg transition-colors duration-100"
            >
              <h6 className="text-white">Update Your Password</h6>
              <div className="bg-[#2c281d] rounded-2xl px-2 py-2 flex gap-2 items-center">
                <div>
                  <FaArrowRight className="mr-4" />
                </div>
              </div>
            </div>
          </div>
          {showModal && (
            <Modal
              closeModal={closeModal}
              updateReferralCode={updateReferralCode}
            />
          )}
          {showResetPasswordModal && (
            <ResetPasswordModal
              closeResetPasswordModal={closeResetPasswordModal}
            />
          )}
          {showSideModal && <SideModal closeSideModal={closeSideModal} />}
          <ModalComponent
            showDelModal={showDelModal}
            closeDelModal={closeDelModal}
            deleteUserHandler={deleteUserHandler}
          />
        </>
      )}
    </div>
  );
};

export default Profile;
