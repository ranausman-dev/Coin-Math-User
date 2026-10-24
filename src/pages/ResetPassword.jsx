import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!oldPassword || !newPassword) {
        toast.error("Please enter both old and new passwords.");
        setIsLoading(false);
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("No user is signed in.");
        setIsLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background">
      <ToastContainer />
      <form className="signinform" onSubmit={handlePasswordUpdate}>
        <h3 className="text-center pb-7 font-bold text-2xl lg:text-2xl">
          Update Password
        </h3>
        <p className="py-6 text-center text-sm">
          Enter your old password and new password to update.
        </p>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-3 mt-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 mt-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all"
        />
        <div className="flex justify-center pb-5 pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#ce9600] w-full mt-4 py-2 rounded-lg text-white ${
              isLoading ? "bg-[#ce9600]/60" : "hover:bg-[#ce9600]/90 cursor-pointer"
            } transition duration-200 ease-in-out`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
        <p className="text-[11px] md:text-[13px] text-center my-2">
          Remember your password? {" "}
          <Link to="/login">
            <span className="text-gray-700 hover:underline cursor-pointer font-bold">
              Sign In
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
