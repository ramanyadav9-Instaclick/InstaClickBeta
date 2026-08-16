"use client";
import React, { useState } from "react";
import { X, Calendar, MapPin, Plus, Check, Clock } from "lucide-react";

export default function CartPage({
  isCartOpen,
  setIsCartOpen,
  cart = [],
  setCart,
  eventDate,
  setEventDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  paymentMode = "advance",
  setPaymentMode,
  addresses = [],
  setAddresses,
  selectedAddressIndex,
  setSelectedAddressIndex,
  showAddressForm,
  setShowAddressForm,
  handleCheckoutPayment,
  currentUser: propsCurrentUser,
  setIsLoginModalOpen,
}: any) {
  // All States at top level
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  const [houseNo, setHouseNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressError, setAddressError] = useState("");

  if (!isCartOpen) return null;

  // Total Price & Calculations
  const totalPrice = (cart || []).reduce((acc: number, item: any) => acc + (item.price || 0), 0);
  const isAdvanceDisabled = totalPrice <= 2000;

  // Safe effective payment mode (No bad setState or Hook sequence mismatch)
  const currentPaymentMode = isAdvanceDisabled ? "full" : paymentMode;
  const advanceAmount = Math.round(totalPrice * 0.2);
  const payableAmount = currentPaymentMode === "advance" ? advanceAmount : totalPrice;

  // Handle Address Addition
  const handleAddAddress = () => {
    setAddressError("");

    if (!houseNo.trim() || !landmark.trim() || !city.trim() || !pincode.trim()) {
      setAddressError("Please fill all 4 address fields completely!");
      return;
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) {
      setAddressError("Pincode must be exactly 6 numeric digits!");
      return;
    }

    const completeFormattedAddress = `${houseNo.trim()}, ${landmark.trim()}, ${city.trim()} - ${pincode.trim()}`;
    const newAddressesList = [...addresses, completeFormattedAddress];

    if (setAddresses) setAddresses(newAddressesList);
    if (setSelectedAddressIndex) setSelectedAddressIndex(newAddressesList.length - 1);

    setHouseNo("");
    setLandmark("");
    setCity("");
    setPincode("");
    if (setShowAddressForm) setShowAddressForm(false);
  };

  // Checkout Processor
  const processCheckout = async () => {
    let activeUser = propsCurrentUser;

    if (!activeUser && typeof window !== "undefined") {
      try {
        const localUser = localStorage.getItem("user") || localStorage.getItem("sb-user") || sessionStorage.getItem("user");
        if (localUser) activeUser = JSON.parse(localUser);
      } catch (e) {
        console.error("Auth parse error:", e);
      }
    }

    if (!activeUser || (!activeUser.id && !activeUser.email && !activeUser.phone)) {
      alert("⚠️ Access Denied: Please Login or Signup before booking a shoot!");
      setIsCartOpen(false);
      if (setIsLoginModalOpen) setIsLoginModalOpen(true);
      return;
    }

    if (!cart || cart.length === 0) return;

    if (!addresses || addresses.length === 0 || selectedAddressIndex === null || selectedAddressIndex === undefined || !addresses[selectedAddressIndex]) {
      alert("⚠️ Please add and select a valid venue location address first!");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedAddr = addresses[selectedAddressIndex];

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUser.id || activeUser.phone || "user_" + Date.now(),
          customerName: activeUser.name || activeUser.email || activeUser.phone || "Registered Client",
          customerPhone: activeUser.phone || "",
          cartItems: cart,
          totalPrice: totalPrice,
          paymentMode: currentPaymentMode,
          eventDate: eventDate,
          startTime: startTime,
          endTime: endTime,
          address: selectedAddr,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setConfirmedBookingId(result.bookingId || "INSTA-" + Date.now());
        setShowConfirmPopup(true);

        if (handleCheckoutPayment) {
          handleCheckoutPayment(result.order);
        }

        setTimeout(() => {
          setShowConfirmPopup(false);
          if (setCart) setCart([]);
          setIsCartOpen(false);
        }, 60000);
      } else {
        alert(`❌ Checkout Failed: ${result.error || "Server Error"}`);
      }
    } catch (error: any) {
      console.error("Checkout submit error:", error);
      alert("❌ Server Connection Error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmPopup = () => {
    setShowConfirmPopup(false);
    if (setCart) setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto font-sans">
      {/* 1-Minute Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4">
          <div className="bg-[#0A0D14] border-2 border-[#00E5FF] w-full max-w-md rounded-3xl p-6 md:p-8 space-y-5 text-center shadow-[0_0_80px_rgba(0,229,255,0.4)] relative">
            <div className="w-16 h-16 bg-[#00E5FF]/20 border-2 border-[#00E5FF] text-[#00E5FF] rounded-full flex items-center justify-center mx-auto text-3xl font-black">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] px-3 py-1 rounded-full uppercase border border-[#00E5FF]/30">
                Booking ID: #{confirmedBookingId}
              </span>
              <h3 className="text-2xl font-black text-white tracking-wide pt-2">
                Booking Confirmed! 🎉
              </h3>
            </div>

            <p className="text-xs text-gray-300 font-mono leading-relaxed bg-neutral-950 p-4 rounded-2xl border border-white/10">
              Your shoot booking is confirmed <strong className="text-white">without payment</strong>! <br />
              <span className="text-[#00E5FF] font-bold block mt-1 text-sm">
                Our team will contact you shortly for pricing & details.
              </span>
            </p>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
              <span>This message will automatically close in 1 minute.</span>
            </div>

            <button
              onClick={handleCloseConfirmPopup}
              className="w-full py-3.5 bg-[#00E5FF] hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              Got it, Thank You!
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#0A0D14] border border-white/10 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 my-auto shadow-[0_0_80px_rgba(0,229,255,0.15)] relative text-left">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Your Cart <span className="text-[#00E5FF]">({cart.length})</span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 bg-neutral-900 border border-white/10 rounded-xl text-white hover:bg-[#00E5FF] hover:text-black transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-gray-400 font-mono text-sm">Your cart is currently empty.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. Cart Items */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-neutral-950 border border-white/10 p-3.5 rounded-2xl"
                >
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs font-mono font-bold text-[#00E5FF]">
                        ₹{item.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCart && setCart(cart.filter((_: any, i: number) => i !== idx))}
                    className="p-2 text-gray-500 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Date & Time */}
            <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 font-mono uppercase">
                <Calendar className="w-4 h-4 text-[#00E5FF]" />
                <span>Select Event Date & Hours</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-mono block mb-1">Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={eventDate}
                    onChange={(e) => setEventDate && setEventDate(e.target.value)}
                    className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-[#00E5FF] [color-scheme:dark] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-mono block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime && setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-[#00E5FF] [color-scheme:dark] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-mono block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime && setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-[#00E5FF] [color-scheme:dark] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 3. Address */}
            <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 font-mono uppercase">
                  <MapPin className="w-4 h-4 text-[#00E5FF]" />
                  <span>Venue Location Address</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressForm && setShowAddressForm(!showAddressForm)}
                  className="text-xs text-[#00E5FF] font-mono font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {showAddressForm && (
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      placeholder="House/Flat No, Building Name"
                      className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#00E5FF]"
                    />
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Landmark, Street, Sector"
                      className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City / District"
                      className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#00E5FF]"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPincode(val);
                      }}
                      placeholder="Pincode (6 Digits Only)"
                      className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs text-white font-mono outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  {addressError && (
                    <p className="text-rose-400 text-[11px] font-mono">{addressError}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="w-full py-2 bg-[#00E5FF] text-black font-bold text-xs rounded-xl hover:bg-cyan-300 transition-all cursor-pointer"
                  >
                    Save & Select Address
                  </button>
                </div>
              )}

              <div className="space-y-2 pt-1">
                {!addresses || addresses.length === 0 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                    <p className="text-xs text-amber-400 font-mono">
                      ⚠️ No venue address added yet. Please click <strong>"+ Add New Address"</strong> above to enter your event location.
                    </p>
                  </div>
                ) : (
                  addresses.map((addr: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedAddressIndex && setSelectedAddressIndex(idx)}
                      className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all flex items-center justify-between ${
                        selectedAddressIndex === idx
                          ? "bg-[#00E5FF]/10 border-[#00E5FF] text-white"
                          : "bg-black/50 border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <span>{addr}</span>
                      {selectedAddressIndex === idx && <Check className="w-4 h-4 text-[#00E5FF]" />}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 4. Payment Mode Selection */}
            <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isAdvanceDisabled}
                  onClick={() => !isAdvanceDisabled && setPaymentMode && setPaymentMode("advance")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isAdvanceDisabled
                      ? "opacity-40 border-neutral-800 bg-neutral-900 cursor-not-allowed"
                      : currentPaymentMode === "advance"
                      ? "bg-[#00E5FF]/10 border-[#00E5FF]"
                      : "bg-black border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold block text-gray-400 uppercase">
                    20% Advance
                  </span>
                  <span className={`text-sm font-black font-mono ${isAdvanceDisabled ? "text-gray-500" : "text-[#00E5FF]"}`}>
                    ₹{advanceAmount.toLocaleString()}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode && setPaymentMode("full")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentPaymentMode === "full"
                      ? "bg-[#00E5FF]/10 border-[#00E5FF]"
                      : "bg-black border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold block text-gray-400 uppercase">
                    Part Payment
                  </span>
                  <span className="text-sm font-black text-[#00E5FF] font-mono">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </button>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAgreed(!isAgreed)}
                  className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                    isAgreed
                      ? "bg-[#00E5FF] border-[#00E5FF] text-black shadow-[0_0_10px_#00E5FF]"
                      : "bg-black border-amber-500/50 hover:border-[#00E5FF]"
                  }`}
                >
                  {isAgreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <p
                  onClick={() => setIsAgreed(!isAgreed)}
                  className="text-[11px] font-mono text-amber-300 leading-tight cursor-pointer select-none"
                >
                  These are just token amounts for full pricing contact us. Cancellation valid only within 12 hours and before team dispatch.
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Total Payable Now</span>
                  <span className="text-xl font-black text-white font-mono">
                    ₹{payableAmount.toLocaleString()}
                  </span>
                </div>

                <button
                  disabled={!isAgreed || isSubmitting}
                  onClick={processCheckout}
                  className="px-8 py-3.5 bg-[#00E5FF] disabled:bg-neutral-800 disabled:text-gray-600 disabled:shadow-none disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 transition-all cursor-pointer"
                >
                  {isSubmitting ? "Processing... ⏳" : "Proceed to Pay"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}