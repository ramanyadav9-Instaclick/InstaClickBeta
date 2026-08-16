"use client";
import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, ShieldCheck, Clock, AlertTriangle } from "lucide-react";

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  authView: "login" | "signup" | "deleteAccount";
  setAuthView: (view: "login" | "signup" | "deleteAccount") => void;
  authError: string | null;
  phone: string;
  setPhone: (val: string) => void;
  otpSent: boolean;
  otp: string;
  setOtp: (val: string) => void;
  signupName: string;
  setSignupName: (val: string) => void;
  signupEmail: string;
  setSignupEmail: (val: string) => void;
  signupAddress: string;
  setSignupAddress: (val: string) => void;
  handleLoginRequestOtp: () => void;
  handleLoginVerifySubmit: (e: React.FormEvent) => void;
  handleSignupRequestOtp: () => void;
  handleSignupVerifySubmit: (e: React.FormEvent) => void;
  handleDeleteAccountSubmit: (e: React.FormEvent) => void;
  resetAuthFields: () => void;
}

const MAX_DAILY_OTP = 5;

export default function AuthPopup({
  isOpen,
  onClose,
  authView,
  setAuthView,
  authError,
  phone,
  setPhone,
  otpSent,
  otp,
  setOtp,
  signupName,
  setSignupName,
  signupEmail,
  setSignupEmail,
  signupAddress,
  setSignupAddress,
  handleLoginRequestOtp,
  handleLoginVerifySubmit,
  handleSignupRequestOtp,
  handleSignupVerifySubmit,
  handleDeleteAccountSubmit,
  resetAuthFields,
}: AuthPopupProps) {
  // ⏱️ 60-Second Timer & Limit States
  const [countdown, setCountdown] = useState(0);
  const [dailyOtpCount, setDailyOtpCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Check Daily OTP Count for Entered Phone from LocalStorage
  useEffect(() => {
    if (!phone || phone.length < 10) return;
    const cleanNum = phone.replace(/\D/g, "").slice(-10);
    const today = new Date().toISOString().split("T")[0];
    const key = `otp_attempts_${cleanNum}_${today}`;
    const attempts = parseInt(localStorage.getItem(key) || "0", 10);
    setDailyOtpCount(attempts);
    setIsLimitReached(attempts >= MAX_DAILY_OTP);
  }, [phone, isOpen]);

  // Live Timer Countdown Effect
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Trigger Login OTP with Counter & Timer
  const onLoginOtpClick = () => {
    if (isLimitReached || countdown > 0) return;

    const cleanNum = phone.replace(/\D/g, "").slice(-10);
    const today = new Date().toISOString().split("T")[0];
    const key = `otp_attempts_${cleanNum}_${today}`;
    const newCount = dailyOtpCount + 1;

    localStorage.setItem(key, newCount.toString());
    setDailyOtpCount(newCount);
    if (newCount >= MAX_DAILY_OTP) setIsLimitReached(true);

    setCountdown(60);
    handleLoginRequestOtp();
  };

  // Trigger Signup OTP with Counter & Timer
  const onSignupOtpClick = () => {
    if (isLimitReached || countdown > 0) return;

    const cleanNum = phone.replace(/\D/g, "").slice(-10);
    const today = new Date().toISOString().split("T")[0];
    const key = `otp_attempts_${cleanNum}_${today}`;
    const newCount = dailyOtpCount + 1;

    localStorage.setItem(key, newCount.toString());
    setDailyOtpCount(newCount);
    if (newCount >= MAX_DAILY_OTP) setIsLimitReached(true);

    setCountdown(60);
    handleSignupRequestOtp();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#070b12] border border-[#00E5FF]/30 w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.15)] flex flex-col md:flex-row relative">
        
        {/* Left Side Banner */}
        <div className="w-full md:w-5/12 bg-gradient-to-b from-[#091522] to-[#04080e] p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              Hello!<br />
              <span className="text-[#00E5FF]">Welcome Back</span>
            </h2>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed font-mono">
              Sign in to manage your shoot bookings, live tracking & instant quotes.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5 mt-8">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
              INSTACLICK VERIFIED SECURE ACCESS
            </span>
          </div>
        </div>

        {/* Right Side Form Content */}
        <div className="w-full md:w-7/12 p-8 relative flex flex-col justify-between">
          
          {/* Close Button */}
          <button
            onClick={() => {
              resetAuthFields();
              setCountdown(0);
              onClose();
            }}
            className="p-2 w-9 h-9 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white hover:bg-[#00E5FF] hover:text-black transition-all absolute top-6 right-6 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Navigation Tabs */}
          {authView !== "deleteAccount" && (
            <div className="flex space-x-6 border-b border-white/10 pb-3 mb-6">
              <button
                onClick={() => {
                  resetAuthFields();
                  setCountdown(0);
                  setAuthView("login");
                }}
                className={`text-xs font-black tracking-wider uppercase pb-1 transition-all cursor-pointer ${
                  authView === "login"
                    ? "text-[#00E5FF] border-b-2 border-[#00E5FF]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                LOGIN
              </button>
              <button
                onClick={() => {
                  resetAuthFields();
                  setCountdown(0);
                  setAuthView("signup");
                }}
                className={`text-xs font-black tracking-wider uppercase pb-1 transition-all cursor-pointer ${
                  authView === "signup"
                    ? "text-[#00E5FF] border-b-2 border-[#00E5FF]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                NEW SIGN UP
              </button>
            </div>
          )}

          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
              ⚠️ {authError}
            </div>
          )}

          {/* 🛑 Limit Warning Alert */}
          {isLimitReached && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Daily limit reached ({dailyOtpCount}/{MAX_DAILY_OTP} OTPs). Please try after 24 hours.</span>
            </div>
          )}

          {/* 1. LOGIN VIEW */}
          {authView === "login" && (
            <form onSubmit={handleLoginVerifySubmit} className="space-y-4 my-auto">
              <div>
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  MOBILE NUMBER
                </label>
                <div className="flex space-x-2">
                  <span className="bg-black border border-white/10 text-xs text-gray-400 font-mono px-3 py-3 rounded-xl flex items-center">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10 digit number"
                      className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-gray-600 focus:border-[#00E5FF] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    ENTER OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6 digit OTP"
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder-gray-600 focus:border-[#00E5FF] outline-none font-mono tracking-widest"
                  />
                </div>
              )}

              {/* Countdown & Limit Protected Button */}
              {!otpSent ? (
                <button
                  type="button"
                  disabled={isLimitReached || countdown > 0}
                  onClick={onLoginOtpClick}
                  className="w-full bg-[#16202c] hover:bg-[#00E5FF] hover:text-black disabled:bg-neutral-900 disabled:text-gray-600 disabled:cursor-not-allowed text-gray-300 font-mono font-bold text-xs uppercase py-3.5 rounded-xl transition-all border border-white/5 mt-4 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {countdown > 0 ? (
                    <>
                      <Clock className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                      <span>Resend OTP in {countdown}s</span>
                    </>
                  ) : (
                    <span>SEND LOGIN OTP {dailyOtpCount > 0 && `(${dailyOtpCount}/${MAX_DAILY_OTP})`}</span>
                  )}
                </button>
              ) : (
                <div className="space-y-2 mt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#00E5FF] text-black font-mono font-extrabold text-xs uppercase py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    VERIFY & LOGIN
                  </button>

                  {/* Resend button with countdown inside OTP view */}
                  <div className="text-center pt-2">
                    {countdown > 0 ? (
                      <span className="text-xs text-gray-400 font-mono flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" /> Resend OTP in <strong className="text-[#00E5FF]">{countdown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isLimitReached}
                        onClick={onLoginOtpClick}
                        className="text-xs text-[#00E5FF] hover:underline font-mono font-bold cursor-pointer disabled:text-gray-600 disabled:cursor-not-allowed"
                      >
                        Didn't receive OTP? Resend Now
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* 2. SIGNUP VIEW */}
          {authView === "signup" && (
            <form onSubmit={handleSignupVerifySubmit} className="space-y-3 my-auto">
              <div>
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#00E5FF] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  MOBILE NUMBER
                </label>
                <div className="flex space-x-2">
                  <span className="bg-black border border-white/10 text-xs text-gray-400 font-mono px-3 py-2.5 rounded-xl flex items-center">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10 digit number"
                      className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#00E5FF] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  EMAIL ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#00E5FF] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  ADDRESS
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupAddress}
                    onChange={(e) => setSignupAddress(e.target.value)}
                    placeholder="House / Area / City"
                    className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#00E5FF] outline-none font-mono"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    ENTER OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6 digit OTP"
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#00E5FF] outline-none font-mono tracking-widest"
                  />
                </div>
              )}

              {/* Countdown & Limit Protected Button for Signup */}
              {!otpSent ? (
                <button
                  type="button"
                  disabled={isLimitReached || countdown > 0}
                  onClick={onSignupOtpClick}
                  className="w-full bg-[#16202c] hover:bg-[#00E5FF] hover:text-black disabled:bg-neutral-900 disabled:text-gray-600 disabled:cursor-not-allowed text-gray-300 font-mono font-bold text-xs uppercase py-3 rounded-xl transition-all border border-white/5 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {countdown > 0 ? (
                    <>
                      <Clock className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                      <span>Resend OTP in {countdown}s</span>
                    </>
                  ) : (
                    <span>SEND SIGN UP OTP {dailyOtpCount > 0 && `(${dailyOtpCount}/${MAX_DAILY_OTP})`}</span>
                  )}
                </button>
              ) : (
                <div className="space-y-2 mt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#00E5FF] text-black font-mono font-extrabold text-xs uppercase py-3 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    CREATE ACCOUNT
                  </button>

                  <div className="text-center pt-1">
                    {countdown > 0 ? (
                      <span className="text-xs text-gray-400 font-mono flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" /> Resend in <strong className="text-[#00E5FF]">{countdown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isLimitReached}
                        onClick={onSignupOtpClick}
                        className="text-xs text-[#00E5FF] hover:underline font-mono font-bold cursor-pointer disabled:text-gray-600 disabled:cursor-not-allowed"
                      >
                        Didn't receive OTP? Resend Now
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* 3. DELETE ACCOUNT VIEW */}
          {authView === "deleteAccount" && (
            <form onSubmit={handleDeleteAccountSubmit} className="space-y-4 my-auto">
              <h3 className="text-lg font-bold text-red-400">Delete Account Permanently</h3>
              <p className="text-xs text-gray-400 font-mono">
                Are you sure you want to delete your account? All your bookings & saved data will be removed.
              </p>

              <div>
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  CONFIRM MOBILE NUMBER
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter registered mobile"
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:border-red-500 outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase py-3 rounded-xl transition-all cursor-pointer"
              >
                CONFIRM PERMANENT DELETE
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}