import React, { useState } from "react";
import { MdOutlineCancelScheduleSend, MdLockOutline, MdClose, MdVisibility, MdVisibilityOff } from "react-icons/md";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebase";

const ResetPasswordModal = ({ closeResetPasswordModal }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const user = auth.currentUser;

  const handlePasswordReset = async () => {
    if (!user) {
      toast.error("No user is logged in.");
      return;
    }

    if (!oldPassword || !newPassword) {
      toast.error("Please enter both old and new passwords.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
      closeResetPasswordModal();
    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast.error("Old password is incorrect.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative w-full max-w-lg mx-auto mt-6 transition-transform transform translate-x-full slide-in">
          <div className="relative flex flex-col w-full px-4 bg-[#1F1F1F] rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-solid">
              <h3 className="text-xl font-semibold text-center text-white w-full">
                Reset My Password
              </h3>
              <button
                className="p-1 ml-auto text-3xl font-semibold text-white bg-transparent border-0 outline-none focus:outline-none"
                onClick={closeResetPasswordModal}
              >
                <MdClose />
              </button>
            </div>

            {/* Old Password Input */}
            <div className="relative px-6 pt-6">
              <h6 className="font-bold text-[16px] text-white pb-2">Old Password</h6>
              <div className="relative flex items-center">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 text-white bg-[#363636] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 transition-all ease-in-out"
                  placeholder="Enter Old Password"
                />
                <button
                  type="button"
                  className="absolute right-3 text-white"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            {/* New Password Input */}
            <div className="relative px-6 pt-6">
              <h6 className="font-bold text-[16px] text-white pb-2">New Password</h6>
              <div className="relative flex items-center">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-white bg-[#363636] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 transition-all ease-in-out"
                  placeholder="Enter New Password"
                />
                <button
                  type="button"
                  className="absolute right-3 text-white"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="mb-14 mt-10 px-6">
              <div
                onClick={!loading ? handlePasswordReset : null}
                className={`flex items-center w-full ${
                  loading ? "bg-[#CE9600] cursor-not-allowed" : "bg-[#CE9600] hover:bg-[#CE9600]/90"
                } justify-center my-3 rounded-lg cursor-pointer border-solid border-blueGray-200`}
              >
                <button
                  className="text-white flex gap-2 items-center font-bold uppercase py-2.5 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
                  disabled={loading}
                >
                  {loading ? "Saving..." : <><MdOutlineCancelScheduleSend /> Save</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordModal;
