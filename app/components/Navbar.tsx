"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, User, ScrollText, Trash2, LogOut, PhoneCall, UserCheck } from "lucide-react";

export default function Navbar({
  cartCount,
  setIsCartOpen,
  isLoggedIn,
  userProfile,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  setShowHistoryModal,
  openContactModal,
  setIsLoggedIn,
  setUserProfile,
  openLoginPopup,
  openDeleteAccountModal,
  scrollToServices,
  openEditProfileModal,
}: any) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/85 backdrop-blur-xl border-b border-white/5 px-6 lg:px-8 py-3 flex items-center justify-between transition-all duration-300">
      
      {/* 1️⃣ Brand Logo */}
      <div 
        className="flex items-center space-x-2 cursor-pointer shrink-0" 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] shrink-0">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <span className="text-2xl font-bold tracking-tighter text-white">
          <span className="text-[#00E5FF]">i</span>nstaclick
        </span>
      </div>

      {/* 2️⃣ Center Navigation Links (Dedicated Route Navigation) */}
      <div className="hidden lg:flex items-center space-x-7 text-xs font-medium text-gray-300 tracking-wide">
        <Link 
          href="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="hover:text-[#00E5FF] transition-colors"
        >
          Home
        </Link>
        <button 
          onClick={scrollToServices} 
          className="hover:text-[#00E5FF] transition-colors cursor-pointer"
        >
          Services
        </button>
        <Link href="/portfolio" className="hover:text-[#00E5FF] transition-colors">
          Portfolio
        </Link>
        <Link href="/how-it-works" className="hover:text-[#00E5FF] transition-colors">
          How It Works
        </Link>
        <Link href="/about" className="hover:text-[#00E5FF] transition-colors">
          About Us
        </Link>
        <button 
          onClick={openContactModal} 
          className="hover:text-[#00E5FF] transition-colors cursor-pointer"
        >
          Contact
        </button>
      </div>

      {/* 3️⃣ Right Actions */}
      <div className="flex items-center space-x-4">
        
        {/* Cart Icon */}
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="relative p-2 text-white hover:text-[#00E5FF] transition-colors shrink-0"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#00E5FF] text-black text-[10px] font-black px-1.5 rounded-full shadow-[0_0_10px_#00E5FF]">
              {cartCount}
            </span>
          )}
        </button>

        {/* Book a Shoot Primary Button */}
        <button
          onClick={scrollToServices}
          className="px-5 py-2 bg-[#00E5FF] text-black font-black rounded-lg text-xs shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:scale-105 transition-all"
        >
          Book a Shoot
        </button>

        {/* User Login / Profile Dropdown Menu */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 text-xs font-bold text-[#00E5FF] bg-white/5 border border-[#00E5FF]/30 px-4 py-2 rounded-lg hover:bg-[#00E5FF]/10 transition-all"
            >
              <User className="w-4 h-4" />
              <span>👋 {userProfile?.name || "User"}</span>
            </button>

            {/* Profile Dropdown Options */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0D121F] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                
                {/* 1. Edit Profile & Address Vault */}
                <button
                  onClick={() => {
                    if (openEditProfileModal) openEditProfileModal();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-bold text-gray-200 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-all flex items-center space-x-2.5"
                >
                  <UserCheck className="w-4 h-4 text-[#00E5FF]" />
                  <span>Edit Profile</span>
                </button>

                {/* 2. Order History */}
                <button
                  onClick={() => {
                    setShowHistoryModal(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-bold text-gray-200 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-all flex items-center space-x-2.5"
                >
                  <ScrollText className="w-4 h-4 text-[#00E5FF]" />
                  <span>Order History</span>
                </button>

                {/* 3. Contact Us */}
                <button
                  onClick={() => {
                    openContactModal();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-bold text-gray-200 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-all flex items-center space-x-2.5"
                >
                  <PhoneCall className="w-4 h-4 text-[#00E5FF]" />
                  <span>Contact Us</span>
                </button>

                {/* 4. Delete Account */}
                <button
                  onClick={() => {
                    openDeleteAccountModal();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all flex items-center space-x-2.5"
                >
                  <Trash2 className="w-4 h-4 text-amber-400" />
                  <span>Delete Account</span>
                </button>

                <div className="border-t border-white/10 my-1" />

                {/* 5. Logout */}
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setUserProfile(null);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all flex items-center space-x-2.5"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Logout</span>
                </button>

              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openLoginPopup}
            className="px-5 py-2 border border-[#00E5FF]/50 text-white hover:text-black rounded-lg text-xs font-bold hover:bg-[#00E5FF] transition-all"
          >
            Login / Sign Up
          </button>
        )}

      </div>
    </nav>
  );
}