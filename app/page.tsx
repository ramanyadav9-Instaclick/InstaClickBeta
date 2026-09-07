"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, CheckCircle2, Circle, AlertTriangle, XCircle, ShieldAlert } from "lucide-react";

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
import { supabase } from "@/lib/supabaseClient";

const generateValidUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "123e4567-e89b-12d3-a456-426614174000";
};

// ⏱️ 1 Hour in Milliseconds (Auto Logout after 1 Hour)
const SESSION_EXPIRY_MS = 1 * 60 * 60 * 1000;

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

  // Address State
  const [addresses, setAddresses] = useState<string[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [checkDate, setCheckDate] = useState("");
  const [checkTime, setCheckTime] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "available" | "booked">("idle");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup" | "deleteAccount">("login");

  // OTP & Message Central States
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<string>("");
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

  const [bookings, setBookings] = useState<any[]>([]);

  // 🚀 Dynamic Slide Interval: 1st slide stays for 30s (from DataStore duration), others for 5s
  useEffect(() => {
    const duration = (slides[currentSlide] as any)?.duration || (currentSlide === 0 ? 30000 : 5000);
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // 📥 Fetch User Bookings from Supabase (With cancelled_by Mapping)
  const fetchUserBookings = useCallback(async (userPhone: string) => {
    if (!userPhone) return;
    const cleanPhone = userPhone.replace(/\D/g, "").slice(-10);

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const userMatched = data.filter((b) => {
          const rawBookingPhone = (b.phone || b.customer_phone || "").toString().replace(/\D/g, "").slice(-10);
          return rawBookingPhone === cleanPhone;
        });

        const formatted = userMatched.map((b) => {
          let step = 1;
          const status = (b.tracker_status || b.shoot_status || b.status || "").toLowerCase();
          const isCancelled = status === "cancelled";

          if (status.includes("dispatch")) step = 2;
          else if (status.includes("location") || status.includes("transit")) step = 3;
          else if (status.includes("complete") || status.includes("framework")) step = 4;
          else if (status.includes("deliver") || status.includes("assets")) step = 5;
          else if (b.status_step) step = Number(b.status_step);

          return {
            id: b.booking_id || b.id,
            db_id: b.id,
            userName: b.user_name || b.customer_name,
            phone: b.phone || b.customer_phone,
            packageName: b.package_name || b.packageName,
            amount: b.amount || b.advance_paid || b.total_amount,
            eventDate: b.event_date || b.eventDate,
            startTime: b.start_time,
            endTime: b.end_time,
            address: b.address,
            statusStep: step,
            trackerStatus: isCancelled ? "Cancelled" : (b.tracker_status || b.shoot_status || "Booked"),
            isCancelled: isCancelled,
            cancelledBy: b.cancelled_by || (isCancelled ? "User (Customer)" : null),
            cancelReason: b.cancel_reason || null,
            createdAt: b.created_at || new Date().toISOString(),
          };
        });

        setBookings(formatted);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  }, []);

  // 🔄 Auto Load User Session & 1-HOUR EXPIRY CHECK on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedLoginTime = localStorage.getItem("user_login_time");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const currentTime = Date.now();
        const loginTimestamp = savedLoginTime ? parseInt(savedLoginTime, 10) : 0;

        if (!loginTimestamp || currentTime - loginTimestamp > SESSION_EXPIRY_MS) {
          localStorage.removeItem("user");
          localStorage.removeItem("user_login_time");
          setIsLoggedIn(false);
          setUserProfile(null);
          setBookings([]);
        } else if (parsed && parsed.phone) {
          setIsLoggedIn(true);
          setUserProfile(parsed);
          fetchUserBookings(parsed.phone);
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
        localStorage.removeItem("user_login_time");
      }
    }
  }, [fetchUserBookings]);

  // 🔴 Realtime Listener
  useEffect(() => {
    if (!userProfile?.phone) return;

    const channel = supabase
      .channel("realtime_user_bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          fetchUserBookings(userProfile.phone);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile, fetchUserBookings]);

  // 🛑 USER CANCELLATION LOGIC
  const handleCancelBookingByUser = async (b: any) => {
    const bookingTime = new Date(b.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursElapsed = (currentTime - bookingTime) / (1000 * 60 * 60);
    const isDispatchedOrMore = b.statusStep >= 2 || (b.trackerStatus && b.trackerStatus.toLowerCase().includes("dispatch"));

    if (hoursElapsed > 12 || isDispatchedOrMore) {
      alert("Time limit exceeded");
      return;
    }

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking #${b.id} (${b.packageName})?\n\nOnce cancelled, tracking will be terminated.`
    );
    if (!confirmCancel) return;

    setBookings((prev) =>
      prev.map((item) =>
        item.id === b.id
          ? { ...item, isCancelled: true, trackerStatus: "Cancelled", cancelledBy: "User (Customer)" }
          : item
      )
    );

    try {
      await supabase
        .from("bookings")
        .update({
          tracker_status: "Cancelled",
          shoot_status: "cancelled",
          status: "Cancelled",
          status_step: 0,
          cancelled_by: "User (Customer)",
          cancel_reason: "Cancelled by User within 12-hour window",
        })
        .eq("id", b.db_id);

      await supabase.from("activity_logs").insert([
        {
          member_name: `Customer (${b.userName})`,
          action_performed: `Cancelled Shoot Booking #${b.id} within 12 hours window`,
        },
      ]);

      alert("✓ Your shoot booking is cancelled.");
      if (userProfile?.phone) fetchUserBookings(userProfile.phone);
    } catch (err) {
      console.error("Cancellation Error:", err);
    }
  };

  const handleSoftAddToCart = (pkg: { name: string; price: number; img: string }) => {
    if (!cart.find((i) => i.name === pkg.name)) setCart([...cart, { ...pkg, days: 1 }]);
    setShowToastBubble(true);
  };

  const resetAuthFields = () => {
    setPhone("");
    setOtp("");
    setVerificationId("");
    setOtpSent(false);
    setAuthError(null);
    setSignupName("");
    setSignupEmail("");
    setSignupAddress("");
  };

  const openAuthPopup = (view: "login" | "signup" | "deleteAccount" = "login") => {
    setAuthView(view);
    setShowAuthPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_login_time");
    setIsLoggedIn(false);
    setUserProfile(null);
    setBookings([]);
    setIsProfileMenuOpen(false);
  };

  // 📩 1. Message Central LOGIN REQUEST OTP
  const handleLoginRequestOtp = async () => {
    setAuthError(null);
    const cleanNum = phone.replace(/\D/g, "").slice(-10);
    if (!cleanNum || cleanNum.length !== 10) {
      setAuthError("Please enter a valid 10-digit mobile number!");
      return;
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", cleanNum)
      .single();

    if (error || !user) {
      setAuthError("⚠️ User not registered! Please click 'NEW SIGN UP' first.");
      return;
    }

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanNum }),
      });

      const result = await res.json();
      if (result.success) {
        setVerificationId(result.verificationId || "");
        setOtpSent(true);
        alert("📲 Login OTP sent to your mobile number via SMS!");
      } else {
        setAuthError(result.error || "Failed to send SMS OTP.");
      }
    } catch {
      setAuthError("Server connection error while sending OTP.");
    }
  };

  // 🔐 2. Message Central VERIFY LOGIN OTP
  const handleLoginVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanNum = phone.replace(/\D/g, "").slice(-10);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanNum, otp, verificationId }),
      });

      const result = await res.json();

      if (!result.success) {
        setAuthError(result.error || "❌ Incorrect OTP entered! Please try again.");
        return;
      }

      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("phone", cleanNum)
        .single();

      if (user) {
        const loggedUser = { id: user.id, name: user.name, phone: user.phone };
        setIsLoggedIn(true);
        setUserProfile(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("user_login_time", Date.now().toString());
        setShowAuthPopup(false);
        resetAuthFields();

        fetchUserBookings(user.phone);
        alert("🎉 Logged in successfully!");
      } else {
        setAuthError("User record not found in database.");
      }
    } catch {
      setAuthError("Failed to verify OTP with server.");
    }
  };

  // 📩 3. Message Central SIGNUP REQUEST OTP
  const handleSignupRequestOtp = async () => {
    setAuthError(null);
    const cleanNum = phone.replace(/\D/g, "").slice(-10);
    if (!signupName.trim() || !cleanNum || cleanNum.length !== 10 || !signupEmail.trim() || !signupAddress.trim()) {
      setAuthError("Please fill all mandatory details correctly!");
      return;
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("phone", cleanNum)
      .single();

    if (existingUser) {
      setAuthError("⚠️ Account already exists with this phone number! Please LOGIN.");
      return;
    }

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanNum }),
      });

      const result = await res.json();
      if (result.success) {
        setVerificationId(result.verificationId || "");
        setOtpSent(true);
        alert("📲 Signup OTP sent to your mobile number via SMS!");
      } else {
        setAuthError(result.error || "Failed to send SMS OTP.");
      }
    } catch {
      setAuthError("Server connection error while sending OTP.");
    }
  };

  // 🔐 4. Message Central VERIFY SIGNUP OTP & SAVE TO SUPABASE
  const handleSignupVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanNum = phone.replace(/\D/g, "").slice(-10);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanNum, otp, verificationId }),
      });

      const result = await res.json();

      if (!result.success) {
        setAuthError(result.error || "❌ Incorrect OTP entered! Please try again.");
        return;
      }

      const newUserId = generateValidUUID();

      const { data: newUser, error } = await supabase
        .from("users")
        .insert([
          { id: newUserId, name: signupName, phone: cleanNum, email: signupEmail, address: signupAddress },
        ])
        .select()
        .single();

      if (!error && newUser) {
        const createdUser = { id: newUser.id, name: newUser.name, phone: newUser.phone };
        setIsLoggedIn(true);
        setUserProfile(createdUser);
        localStorage.setItem("user", JSON.stringify(createdUser));
        localStorage.setItem("user_login_time", Date.now().toString());
        setShowAuthPopup(false);
        resetAuthFields();

        if (signupAddress) {
          setAddresses([signupAddress]);
          setSelectedAddressIndex(0);
        }

        alert("🎉 Account created & logged in successfully!");
      } else {
        setAuthError("Error creating user account in database.");
      }
    } catch {
      setAuthError("Failed to verify OTP with server.");
    }
  };

  // 🗑️ DELETE ACCOUNT
  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = phone.replace(/\D/g, "").slice(-10);
    if (!cleanNum || cleanNum.length !== 10) {
      setAuthError("Enter valid 10-digit phone number");
      return;
    }

    const { error } = await supabase.from("users").delete().eq("phone", cleanNum);

    if (!error) {
      setIsLoggedIn(false);
      setUserProfile(null);
      localStorage.removeItem("user");
      localStorage.removeItem("user_login_time");
      setShowAuthPopup(false);
      resetAuthFields();
      setBookings([]);
      alert("Account permanently deleted!");
    } else {
      setAuthError("Failed to delete account from database.");
    }
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
        setShowHistoryModal={() => {
          if (userProfile?.phone) fetchUserBookings(userProfile.phone);
          setShowHistoryModal(true);
        }}
        openContactModal={() => setIsContactModalOpen(true)}
        setIsLoggedIn={setIsLoggedIn}
        setUserProfile={setUserProfile}
        openLoginPopup={() => openAuthPopup("login")}
        openDeleteAccountModal={() => openAuthPopup("deleteAccount")}
        scrollToServices={() => servicesSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
        handleLogout={handleLogout}
      />

      <Hero
        slides={slides}
        currentSlide={currentSlide}
        direction={direction}
        handlePrev={() => {
          setDirection(-1);
          setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);
        }}
        handleNext={() => {
          setDirection(1);
          setCurrentSlide((p) => (p + 1) % slides.length);
        }}
        setIsGalleryOpen={() => {}}
        scrollToServices={() => servicesSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      <section ref={servicesSectionRef} className="w-full">
        <Services
          mainServices={mainServices}
          subPackages={subPackages}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          handleSoftAddToCart={handleSoftAddToCart}
        />
      </section>

      <section className="py-20 bg-neutral-950 border-t border-b border-white/5 text-center">
        <Scheduler
          checkDate={checkDate}
          setCheckDate={setCheckDate}
          checkTime={checkTime}
          setCheckTime={setCheckTime}
          availabilityStatus={availabilityStatus}
          setAvailabilityStatus={setAvailabilityStatus}
        />
      </section>

      <WhyChooseUs />
      <SocialFooter />

      {/* 📜 ORDER HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#00E5FF]/30 w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,229,255,0.2)] space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-2xl font-black text-white">
                  Your <span className="text-[#00E5FF]">Live Shoot Tracking</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Track live shoot status or cancel booking within 12 hours (before dispatch).
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 bg-neutral-900 border border-white/10 rounded-xl text-white hover:bg-[#00E5FF] hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-mono">
                  No active bookings found for your phone number.
                </div>
              ) : (
                bookings.map((b) => {
                  const currentStepIndex = b.statusStep || 1;
                  const isCancelled = b.isCancelled || b.trackerStatus === "Cancelled";
                  
                  const isOfficialCancellation = isCancelled && Boolean(b.cancelledBy && !b.cancelledBy.includes("User"));

                  return (
                    <div key={b.id} className={`p-6 rounded-2xl space-y-6 border transition-all ${
                      isCancelled ? "bg-rose-950/20 border-rose-500/40" : "bg-neutral-950 border-white/10"
                    }`}>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#00E5FF]">{b.id}</span>
                            {isCancelled && (
                              <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                                CANCELLED
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-white mt-0.5">{b.packageName}</h4>
                        </div>
                        <span className="text-sm font-black text-[#00E5FF] font-mono">
                          Paid: ₹{b.amount?.toLocaleString()}
                        </span>
                      </div>

                      {/* 🛑 CANCELLED ALERT BANNER */}
                      {isCancelled ? (
                        <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl flex items-center gap-3">
                          <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400">
                            {isOfficialCancellation ? <ShieldAlert className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-rose-400 font-mono uppercase">
                              {isOfficialCancellation 
                                ? `Your booking was cancelled   ⚠️` 
                                : "Your shoot booking is cancelled ❌"}
                            </h5>
                            <p className="text-xs text-gray-300 mt-0.5">
                              {isOfficialCancellation
                                ? `Notice: ${b.cancelReason || 'Cancelled by our operations team. Any advance paid will be refunded.'}`
                                : "This booking has been cancelled and live tracking is terminated."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 px-2">
                          <div className="relative flex items-center justify-between w-full">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-800 w-full z-0" />
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#00E5FF] transition-all duration-500 z-0"
                              style={{
                                width: `${((currentStepIndex - 1) / (TRACKING_STEPS.length - 1)) * 100}%`,
                              }}
                            />

                            {TRACKING_STEPS.map((step, idx) => {
                              const isPassed = idx + 1 <= currentStepIndex;
                              const isCurrent = idx + 1 === currentStepIndex;

                              return (
                                <div key={step.key} className="relative z-10 flex flex-col items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                      isPassed
                                        ? "bg-[#00E5FF] border-[#00E5FF] text-black shadow-[0_0_15px_#00E5FF]"
                                        : "bg-black border-neutral-700 text-gray-600"
                                    }`}
                                  >
                                    {isPassed ? (
                                      <CheckCircle2 className="w-5 h-5 font-bold" />
                                    ) : (
                                      <Circle className="w-4 h-4" />
                                    )}
                                  </div>
                                  <span
                                    className={`text-[10px] font-mono font-bold mt-2 text-center max-w-[75px] ${
                                      isCurrent
                                        ? "text-[#00E5FF] scale-105"
                                        : isPassed
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs text-gray-400 font-mono bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="space-y-0.5">
                          <p>📅 Date & Time: {b.eventDate} ({b.startTime || "Morning"} - {b.endTime || "Evening"})</p>
                          <p>📍 Location: {b.address}</p>
                        </div>

                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelBookingByUser(b)}
                            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" /> Cancel Shoot Booking
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🛒 Cart Page Modal */}
      <CartPage
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        setCart={setCart}
        eventDate={eventDate}
        setEventDate={setEventDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        gatewayOption={gatewayOption}
        setGatewayOption={setGatewayOption}
        addresses={addresses}
        setAddresses={setAddresses}
        selectedAddressIndex={selectedAddressIndex}
        setSelectedAddressIndex={setSelectedAddressIndex}
        showAddressForm={showAddressForm}
        setShowAddressForm={setShowAddressForm}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        openContactModal={() => setIsContactModalOpen(true)}
        setIsLoginModalOpen={() => openAuthPopup("login")}
        currentUser={userProfile}
        handleCheckoutPayment={() => {
          if (userProfile?.phone) {
            fetchUserBookings(userProfile.phone);
          }
        }}
      />

      {/* 🔐 Auth Modal */}
      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        authView={authView}
        setAuthView={setAuthView}
        authError={authError}
        phone={phone}
        setPhone={setPhone}
        otpSent={otpSent}
        otp={otp}
        setOtp={setOtp}
        signupName={signupName}
        setSignupName={setSignupName}
        signupEmail={signupEmail}
        setSignupEmail={setSignupEmail}
        signupAddress={signupAddress}
        setSignupAddress={setSignupAddress}
        handleLoginRequestOtp={handleLoginRequestOtp}
        handleLoginVerifySubmit={handleLoginVerifySubmit}
        handleSignupRequestOtp={handleSignupRequestOtp}
        handleSignupVerifySubmit={handleSignupVerifySubmit}
        handleDeleteAccountSubmit={handleDeleteAccountSubmit}
        resetAuthFields={resetAuthFields}
      />

      {/* 📞 Contact Us Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      {/* Floating Capsule Widget */}
      <FloatingWidgets
        cartCount={cart.length}
        showToastBubble={showToastBubble}
        setShowToastBubble={setShowToastBubble}
        setIsCartOpen={setIsCartOpen}
      />
    </main>
  );
}