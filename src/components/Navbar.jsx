import React, { useEffect, useState } from "react";
import {
  IoLogOutOutline,
  IoNewspaperOutline,
  IoWalletSharp,
} from "react-icons/io5";
import { LuCoins, LuWallet } from "react-icons/lu";
import { MdRoomPreferences } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import BottomNav from "./BottomNav";
import { TbSmartHome } from "react-icons/tb";
import { GiTwoCoins } from "react-icons/gi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const { pathname } = useLocation();
  // console.log("home",HomeIcon);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const docRef = doc(db, "profiles", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user ID found in localStorage.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-[#171717] border border-[#262626]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/">
            <div className="flex gap-2 items-center cursor-pointer">
              <img
                className="w-6"
                src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-b8b74b04-83a5-46d6-a2cc-25e0559d33df.png%3Falt%3Dmedia%26token%3D633ff17b-72a8-49f5-8f96-a06e64af4679"
                alt="logo"
              />
              <span className="text-white">CoinMath</span>
            </div>
          </Link>
          {isSmallScreen ? (
            <>
              <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                {/* <button
                        type="button"
                        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        id="user-menu-button"
                        aria-expanded={isDropdownOpen}
                        onClick={toggleDropdown}
                    >
                        <span className="sr-only">Open user menu</span>
                        {profileData ? (
                            <img className="w-8 h-8 rounded-full" src={profileData.profileImage} alt="user photo" />
                        ) : (
                            <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="default user photo" />
                        )}
                    </button> */}
                {isDropdownOpen && (
                  <div
                    className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                    id="user-dropdown"
                  >
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>
                        <Link
                          to="/profile"
                          onClick={closeDropdown}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Profile
                        </Link>
                      </li>
                      <li onClick={handleLogout}>
                        <div className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-red-500/10 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                          Log Out
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
                <button
                  type="button"
                  className="text-white block md:hidden"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? (
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded={isDropdownOpen}
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                {profileData && profileData.profileImage ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={profileData.profileImage}
                    alt="user photo"
                  />
                ) : (
                  <FaRegUserCircle className="text-white text-3xl" />
                )}
              </button>
              {isDropdownOpen && (
                <div
                  className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="user-dropdown"
                >
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link
                        to="/profile"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Profile
                      </Link>
                    </li>
                    <li onClick={handleLogout}>
                      <div className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-red-500/10 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        Log Out
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <div
            className={`items-center justify-between ${
              isMenuOpen ? "block" : "hidden"
            } w-full md:flex md:w-auto md:order-1`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <Link
                to="/"
                className={`cursor-pointer py-2 px-2 text-white rounded-lg  lg:px-2 md:dark:text-blue-500 flex gap-1 lg:gap-2 items-center ${
                  location.pathname === "/"
                    ? "bg-[#363636]"
                    : "hover:bg-[#363636]"
                }`}
                aria-current="page"
              >
                <TbSmartHome className="lg:text-xl" />
                {/* <HomeIcon className="w-3" fill="#ce9600" />
                                <img src='../assets/images/home.svg' alt="Home" />  */}
                <span className="text-sm lg:text-base">Home</span>
              </Link>
              <Link
                to="/mine"
                className={` cursor-pointer py-2 px-2 md:py-2 flex gap-1 lg:gap-2 items-center lg:px-2 md:rounded-lg text-white rounded ${
                  location.pathname === "/mine"
                    ? "bg-[#363636]"
                    : "bg-transparent"
                }   dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:hover:bg-[#363636] dark:border-gray-700`}
              >
                <LuCoins className="lg:text-xl" />
                <span className="text-sm lg:text-base">COIM Gen</span>
              </Link>
              <Link
                to="/wallet"
                className={`cursor-pointer py-2 px-2 md:py-2 flex gap-1 lg:gap-2 items-center lg:px-2 md:rounded-lg text-white rounded ${
                  location.pathname === "/wallet"
                    ? "bg-[#363636]"
                    : "bg-transparent"
                }   dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:hover:bg-[#363636] dark:border-gray-700`}
              >
                <LuWallet className="lg:text-xl" />
                <span className="text-sm lg:text-base">Wallet</span>
              </Link>
              <Link
                to="/ref"
                className={`cursor-pointer py-2 px-2 md:py-2 flex gap-1 lg:gap-2 items-center lg:px-2 md:rounded-lg text-white rounded ${
                  location.pathname === "/ref"
                    ? "bg-[#363636]"
                    : "bg-transparent"
                }   dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:hover:bg-[#363636] dark:border-gray-700`}
              >
                <MdRoomPreferences className="lg:text-xl" />
                <span className="text-sm lg:text-base">Referrals</span>
              </Link>
              <Link
                to="/earn"
                className={`cursor-pointer py-2 px-2 md:py-2 flex gap-1 lg:gap-2 items-center lg:px-2 md:rounded-lg text-white rounded ${
                  location.pathname === "/earn"
                    ? "bg-[#363636]"
                    : "bg-transparent"
                }   dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:hover:bg-[#363636] dark:border-gray-700`}
              >
                <GiTwoCoins className="lg:text-xl" />
                <span className="text-sm lg:text-base">Earn</span>
              </Link>
              <Link
                to="/blogs"
                className={`cursor-pointer py-2 px-2 md:py-2 flex gap-1 lg:gap-2 items-center  lg:px-2 md:rounded-lg text-white rounded ${
                  location.pathname === "/blogs"
                    ? "bg-[#363636]"
                    : "bg-transparent"
                }   dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:hover:bg-[#363636] dark:border-gray-700`}
              >
                <IoNewspaperOutline className="lg:text-xl" />
                <span className="text-sm lg:text-base">News</span>
              </Link>
              {isSmallScreen && (
                <>
                  <Link
                    to="/profile"
                    className={`cursor-pointer py-2 px-2 md:py-2 flex gap-1 lg:gap-2 items-center lg:px-2 md:rounded-lg text-white rounded ${
                      location.pathname === "/profile"
                        ? "bg-[#363636]"
                        : "bg-transparent"
                    }   dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:hover:bg-[#363636] dark:border-gray-700`}
                  >
                    <CgProfile className="lg:text-xl" />
                    <span className="text-sm lg:text-base">Profile</span>
                  </Link>
                  <Link
                    onClick={handleLogout}
                    className={`cursor-pointer py-2 px-2 md:py-2 flex gap-1 lg:gap-2 items-center  lg:px-2 md:rounded-lg text-white rounded ${
                      location.pathname === "#"
                        ? "bg-[#363636]"
                        : "bg-transparent"
                    }   dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:hover:bg-[#363636] dark:border-gray-700`}
                  >
                    <IoLogOutOutline className="lg:text-xl" />
                    <span className="text-sm lg:text-base">Logout</span>
                  </Link>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <BottomNav />
    </>
  );
};

export default Navbar;
