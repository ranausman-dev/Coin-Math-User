import "./App.css";
import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Main from "./pages/Main";
import Wallet from "./pages/Wallet";
import Referrals from "./pages/Referrals";
import News from "./pages/News";
import Profile from "./pages/Profile";
import Token from "./pages/Token";
import ProfileDetail from "./pages/ProfileDetail";
import AllReferrals from "./components/AllReferrals";
import UpdateProfile from "./components/UpdateProfile";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import PageNotFound from "./pages/PageNotFound";
import Loading from "./components/Loading";
import SignIn from "./pages/SignIn";
import PopupAd from "./components/PopupAd";
import Card from "./components/Card";
import EarnPage from "./pages/EarnPage";
import CoinToAirdrop from "./pages/CoinToAirdrop";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function NavbarControl() {
  const location = useLocation();
  const isProtectedRoute = ![
    "/signin",
    "/signup",
    "/check",
    "/details",
    "/user-info",
    "/register",
    "/login",
    "/forgot-password",
  ].includes(location.pathname);
  return isProtectedRoute && <Navbar />;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Router>
      <div className="App">
        <Suspense>
          <NavbarControl />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ref"
              element={
                <ProtectedRoute>
                  <Referrals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-referrals"
              element={
                <ProtectedRoute>
                  <AllReferrals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mine"
              element={
                <ProtectedRoute>
                  <Token />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-profile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ad"
              element={
                <ProtectedRoute>
                  <PopupAd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/card"
              element={
                <ProtectedRoute>
                  <Card />
                </ProtectedRoute>
              }
            />
            <Route
              path="/earn"
              element={
                <ProtectedRoute>
                  <EarnPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/convert"
              element={
                <ProtectedRoute>
                  <CoinToAirdrop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ad"
              element={
                <ProtectedRoute>
                  <PopupAd />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reset-password"
              element={
                <ProtectedRoute>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/ad" element={<ProtectedRoute><PopupAd /></ProtectedRoute>} /> */}
            {/* <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} /> */}
            <Route element={<GuestRoute />}>
              {/* <Route path="/email" element={<Otp />} /> */}
              <Route path="/user-info" element={<ProfileDetail />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
