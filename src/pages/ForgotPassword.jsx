import React, { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import checkEmailExists from "../utils/checkEmailExists";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email) {
        toast.error("Please enter your email.");
        setIsLoading(false);
        return;
      }

      const existingUser = localStorage.getItem("user_email")?.toLowerCase();

      if (existingUser !== email.toLowerCase()) {
        toast.error("No user found with this email.");
        return;
      }
      

      const user = await checkEmailExists(email.toLowerCase());
      if (user) {
        await sendPasswordResetEmail(auth, email.toLowerCase());
        toast.success("Reset link sent! Check your inbox.");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        toast.error("User with this email does not exist.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background">
      <ToastContainer />
      <form className="signinform" onSubmit={handlePasswordReset}>
        <h3 className="text-center py-7 font-bold text-2xl lg:text-2xl">
          Get Your Password
        </h3>

        <p className="py-6 text-center text-sm">
          Enter your email address, and we'll send you a link to reset your
          password.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 mt-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all"
          required
        />

        <div className="flex justify-center pb-5 pt-10">
          <button
            type="submit"
            className={`bg-[#ce9600] px-20 py-2 rounded-lg cursor-pointer text-white flex text-[12px] md:text-base items-center gap-2 hover:bg-[#ce9600]/90 transition duration-200 ease-in-out ${
              isLoading ? "opacity-50 pointer-events-none" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>

        <p className="text-[11px] md:text-[13px] text-center mt-10">
          Remembered your password?{" "}
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

export default ForgotPassword;
