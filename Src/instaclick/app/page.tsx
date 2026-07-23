"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, CheckCircle2, Circle } from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Scheduler from "./components/Scheduler";
import CartPage from "./components/CartPage";
import AuthPopup from "./components/AuthPopup";
import SocialFooter from "./components/SocialFooter";
import WhyChooseUs from "./components/WhyChooseUs";
import FloatingWidgets from "./components/FloatingWidgets";
import ContactModal from "./components/ContactModal";

import { slides, mainServices, subPackages } from "./components/DataStore";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const servicesSectionRef = useRef<HTMLElement>(null);

  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToastBubble, setShowToastBubble] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [paymentMode, setPaymentMode] = useState<"full" | "advance">("advance");
  const [gatewayOption, setGatewayOption] = useState<any>("gpay");

  const [addresses, setAddresses] = useState<string[]>(["House 45, Sector 12, Noida, India"]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [newAddress, setNewAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [checkDate, setCheckDate] = useState("");
  const [checkTime, setCheckTime] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "available" | "booked">("idle");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; phone: string } | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup" | "deleteAccount">("login");

  const [usersList, setUsersList] = useState<any[]>([
    { name: "Rahul Sharma", phone: "9876543210" }
  ]);

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupAddress, setSignupAddress] = useState("");

  const TRACKING_STEPS = [
    { key: "booked", label: "Booked" },
    { key: "dispatched", label: "Team Dispatched" },
    { key: "location", label: "On Location" },
    { key: "completed", label: "Shoot Completed" },
    { key: "delivered", label: "Assets Delivered" },
  ];

  const [bookings, setBookings] = useState<any[]>([
    {
      id: "INSTA-8821",
      userName: "Rahul Sharma",
      phone: "9876543210",
      packageName: "Pre Wedding Photography",
      amount: 25000,
      eventDate: "2026-08-01",
      startTime: "10:00 AM",
      endTime: "06:00 PM",
      address: "House 45, Sector 12, Noida",
      statusStep: 2,
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSoftAddToCart = (pkg: { name: string; price: number; img: string }) => {
    if (!cart.find((i) => i.name === pkg.name)) setCart([...cart, { ...pkg, days: 1 }]);
    setShowToastBubble(true);
  };

  const resetAuthFields = () => {
    setPhone(""); setOtp(""); setOtpSent(false); setAuthError(null);
    setSignupName(""); setSignupEmail(""); setSignupAddress("");
  };

  const openAuthPopup = (view: "login" | "signup" | "deleteAccount" = "login") => {
    setAuthView(view);
    setShowAuthPopup(true);
  };

  // Helper Function for Checkout Booking Creation
  const processBookingOrder = (user: { name: string; phone: string }) => {
    if (!eventDate) { alert("Please select event date"); return; }

    const newBookingObj = {
      id: `INSTA-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: user?.name || "Customer",
      phone: user?.phone || "Phone",
      packageName: cart[0]?.name || "Shoot Package",
      amount: paymentMode === "advance" ? Math.round(cart[0]?.price * 0.2) : cart[0]?.price,
      eventDate, startTime, endTime,
      address: addresses[selectedAddressIndex],
      statusStep: 1,
    };

    setBookings([newBookingObj, ...bookings]);
    alert("Booking confirmed successfully!");
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white antialiased relative overflow-x-hidden">
      
      <Navbar 
        cartCount={cart.length} 
        setIsCartOpen={setIsCartOpen} 
        isLoggedIn={isLoggedIn} 
        userProfile={userProfile}
        isProfileMenuOpen={isProfileMenuOpen} 
        setIsProfileMenuOpen={setIsProfileMenuOpen} 
        setShowHistoryModal={setShowHistoryModal}
        openContactModal={() => setIsContactModalOpen(true)}
        setIsLoggedIn={setIsLoggedIn} 
        setUserProfile={setUserProfile} 
        openLoginPopup={() => openAuthPopup("login")}
        openDeleteAccountModal={() => openAuthPopup("deleteAccount")}
        scrollToServices={() => servicesSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      <Hero slides={slides} currentSlide={currentSlide} direction={direction} handlePrev={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} handleNext={() => setCurrentSlide(p => (p + 1) % slides.length)} setIsGalleryOpen={() => {}} scrollToServices={() => servicesSectionRef.current?.scrollIntoView({ behavior: "smooth" })} />

      <section ref={servicesSectionRef} className="w-full">
        <Services mainServices={mainServices} subPackages={subPackages} activeCategory={activeCategory} setActiveCategory={setActiveCategory} handleSoftAddToCart={handleSoftAddToCart} />
      </section>

      <section className="py-20 bg-neutral-950 border-t border-b border-white/5 text-center">
        <Scheduler checkDate={checkDate} setCheckDate={setCheckDate} checkTime={checkTime} setCheckTime={setCheckTime} availabilityStatus={availabilityStatus} setAvailabilityStatus={setAvailabilityStatus} />
      </section>

      <WhyChooseUs />
      <SocialFooter />

      {/* 📜 ORDER HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#00E5FF]/30 w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,229,255,0.2)] space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-2xl font-black text-white">Your <span className="text-[#00E5FF]">Live Shoot Tracking</span></h3>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 bg-neutral-900 border border-white/10 rounded-xl text-white hover:bg-[#00E5FF] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {bookings.map((b) => {
                const currentStepIndex = b.statusStep || 1;
                return (
                  <div key={b.id} className="bg-neutral-950 border border-white/10 p-6 rounded-2xl space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#00E5FF]">{b.id}</span>
                        <h4 className="text-lg font-bold text-white mt-0.5">{b.packageName}</h4>
                      </div>
                      <span className="text-sm font-black text-[#00E5FF] font-mono">Paid: ₹{b.amount.toLocaleString()}</span>
                    </div>

                    <div className="py-4 px-2">
                      <div className="relative flex items-center justify-between w-full">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-800 w-full z-0" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#00E5FF] transition-all duration-500 z-0" style={{ width: `${((currentStepIndex - 1) / (TRACKING_STEPS.length - 1)) * 100}%` }} />

                        {TRACKING_STEPS.map((step, idx) => {
                          const isPassed = idx + 1 <= currentStepIndex;
                          const isCurrent = idx + 1 === currentStepIndex;

                          return (
                            <div key={step.key} className="relative z-10 flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                isPassed ? "bg-[#00E5FF] border-[#00E5FF] text-black shadow-[0_0_15px_#00E5FF]" : "bg-black border-neutral-700 text-gray-600"
                              }`}>
                                {isPassed ? <CheckCircle2 className="w-5 h-5 font-bold" /> : <Circle className="w-4 h-4" />}
                              </div>
                              <span className={`text-[10px] font-mono font-bold mt-2 text-center max-w-[70px] ${
                                isCurrent ? "text-[#00E5FF] scale-105" : isPassed ? "text-gray-300" : "text-gray-600"
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 font-mono space-y-1 bg-black/40 p-3 rounded-xl border border-white/5">
                      <p>📅 Date & Time: {b.eventDate} ({b.startTime} - {b.endTime})</p>
                      <p>📍 Location: {b.address}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cart Page Modal */}
      <CartPage 
        isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} cart={cart} setCart={setCart} eventDate={eventDate} setEventDate={setEventDate}
        startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} paymentMode={paymentMode} setPaymentMode={setPaymentMode} 
        gatewayOption={gatewayOption} setGatewayOption={setGatewayOption} addresses={addresses} setAddresses={setAddresses} selectedAddressIndex={selectedAddressIndex} 
        setSelectedAddressIndex={setSelectedAddressIndex} showAddressForm={showAddressForm} setShowAddressForm={setShowAddressForm} newAddress={newAddress} setNewAddress={setNewAddress}
        openContactModal={() => setIsContactModalOpen(true)}
        openLoginPopup={() => openAuthPopup("login")}
        isLoggedIn={isLoggedIn}
        handleCheckoutPayment={() => {
          if (!isLoggedIn) { 
            openAuthPopup("login");
            return; 
          }
          if (userProfile) {
            processBookingOrder(userProfile);
          }
        }}
      />

      {/* Auth Modal */}
      <AuthPopup 
        isOpen={showAuthPopup} onClose={() => setShowAuthPopup(false)} authView={authView} setAuthView={setAuthView} authError={authError}
        phone={phone} setPhone={setPhone} otpSent={otpSent} otp={otp} setOtp={setOtp} signupName={signupName} setSignupName={setSignupName}
        signupEmail={signupEmail} setSignupEmail={setSignupEmail} signupAddress={signupAddress} setSignupAddress={setSignupAddress}
        handleLoginRequestOtp={() => {
          const found = usersList.find(u => u.phone === phone);
          if (found) setOtpSent(true);
          else setAuthError("User not registered, please sign up");
        }}
        handleLoginVerifySubmit={(e: any) => { 
          e.preventDefault(); 
          const found = usersList.find(u => u.phone === phone); 
          const loggedUser = { name: found?.name || "Rahul Sharma", phone };
          setIsLoggedIn(true); 
          setUserProfile(loggedUser); 
          setShowAuthPopup(false); 
          resetAuthFields(); 

          if (isCartOpen && cart.length > 0) {
            processBookingOrder(loggedUser);
          }
        }}
        handleSignupRequestOtp={() => setOtpSent(true)}
        handleSignupVerifySubmit={(e: any) => { 
          e.preventDefault(); 
          const newUser = { name: signupName, phone }; 
          setUsersList([...usersList, newUser]); 
          setIsLoggedIn(true); 
          setUserProfile(newUser); 
          setShowAuthPopup(false); 
          resetAuthFields(); 

          if (isCartOpen && cart.length > 0) {
            processBookingOrder(newUser);
          }
        }}
        handleDeleteAccountSubmit={(e: any) => { e.preventDefault(); setIsLoggedIn(false); setUserProfile(null); setShowAuthPopup(false); resetAuthFields(); alert("Account permanently deleted!"); }}
        resetAuthFields={resetAuthFields}
      />

      {/* 📞 CONTACT US MODAL */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      {/* Floating Capsule Widget */}
      <FloatingWidgets cartCount={cart.length} showToastBubble={showToastBubble} setShowToastBubble={setShowToastBubble} setIsCartOpen={setIsCartOpen} />

    </main>
  );
}