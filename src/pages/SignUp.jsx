import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../components/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      localStorage.setItem("user_email", user.email);

      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background">
      <ToastContainer />
      <form className="signinform" onSubmit={handleSignUp}>
        <h3 className="text-center font-bold text-2xl lg:text-2xl mt-6">
          Register in to CoinMath
        </h3>
        <p className="py-6 text-center text-sm">
          Your journey starts with a single step!
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 mt-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 transition-all"
          required
        />
        <div className="relative w-full mt-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 transition-all"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
          >
            {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
          </span>
        </div>
        <div className="relative w-full mt-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 transition-all"
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
          >
             {showConfirmPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
          </span>
        </div>
        <div className="flex justify-center mt-5 pb-5 pt-1">
          <button
            type="submit"
            className={`bg-[#ce9600] px-20 mt-4 md:px-32 py-2 rounded-lg text-white flex items-center gap-2 hover:bg-[#ce9600]/90 transition duration-200 ease-in-out ${
              isLoading ? "opacity-50 pointer-events-none" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </div>
        <p className="text-[11px] md:text-[13px] text-center mt-10">
          Already have an account?{" "}
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

export default SignUp;
