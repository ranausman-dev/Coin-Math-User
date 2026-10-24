import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../components/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import checkEmailExists from "../utils/checkEmailExists";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.toLowerCase(), pin)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const lowerCaseEmail = user.email.toLowerCase();
        const result = await checkEmailExists(lowerCaseEmail);

        if (result) {
          localStorage.setItem("userId", result.userId);
          localStorage.removeItem("tempEmail");
          toast.success("Login Successfully");
          navigate("/");
        } else {
          localStorage.setItem("tempEmail", lowerCaseEmail);
          toast.success("Login Successful!");
          navigate("/user-info", { state: { email: lowerCaseEmail } });
        }
      })
      .catch((error) => {
        if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/invalid-credential"
        ) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="background">
      <ToastContainer />
      <form className="signinform" onSubmit={handleSignIn}>
        <h3 className="text-center pb-7 font-bold text-2xl lg:text-2xl">
          Log in to CoinMath
        </h3>
        {/* <div className='flex justify-center'>
                    <img className="md:w-20 w-20 rounded-full" src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679" alt="logo" />
                </div> */}
        <p className="py-6 text-center text-sm">
          Please enter your email address and password
        </p>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 mt-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all"
        />
        <div className="relative w-full mt-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-3 rounded-lg py-2 text-white bg-[#363636] focus:outline-none focus:ring-2 focus:ring-[#CE9600] hover:ring-2 hover:ring-[#363636]/30 ease-in-out transition-all pr-10"
          />
          <span
            className="absolute right-3 top-3 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <Link to="/forgot-password">
          <p className="text-right text-sm text-gray-400 hover:underline cursor-pointer mt-2">
            Get or Forgot Password?
          </p>
        </Link>
        <label className="flex items-center mt-3">
          {/* Checkbox for privacy policy */}
        </label>
        <label className="flex items-center mt-3">
          <div className="inline-flex items-center">
            <label
              className="relative flex items-center p-3 rounded-full cursor-pointer"
              htmlFor="check"
            >
              <input
                type="checkbox"
                className="before:content[''] bg-[#CE9600] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-red transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full  before:bg-blue-gray-ka before:opacity-0 before:transition-opacity checked:border-[#ce9600] checked:bg-[#ce9600] checked:before:bg-[#ce9600] hover:before:opacity-10"
                id="check"
                onChange={() =>
                  setIsPrivacyPolicyChecked(!isPrivacyPolicyChecked)
                }
              />
              <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
            <label
              className="mt-px text-[12px] font-light text-white cursor-pointer select-none"
              htmlFor="check"
            >
              I have read and agree to the{" "}
              <Link
                className="cursor-pointer underline"
                target="_blank"
                to="https://coinmath.org/privacy-policy-2/"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        </label>
        <div className="flex justify-center pb-5 pt-1">
          <button
            type="submit"
            disabled={!isPrivacyPolicyChecked || isLoading}
            className={`bg-[#ce9600] w-full mt-4 py-2 rounded-lg text-white ${
              isPrivacyPolicyChecked && !isLoading
                ? "hover:bg-[#ce9600]/90 cursor-pointer"
                : "bg-[#ce9600]/60"
            } transition duration-200 ease-in-out`}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </div>
        <p className=" text-[11px] md:text-[13px] text-center my-2">
          Don't have an account yet?{" "}
          <Link to="/register">
            <span className="text-gray-700 hover:underline cursor-pointer font-bold">
              Sign Up
            </span>
          </Link>
        </p>
        <div className="flex justify-center items-center">
          <div className="bg-white w-20 h-[1px]"></div>
        </div>
        <p className=" text-[11px] md:text-[13px] text-center my-2">
          No password? Sign up with your existing email and create a password to
          log in. Your data remains unchanged and secure.
        </p>
      </form>
    </div>
  );
};

export default SignIn;
