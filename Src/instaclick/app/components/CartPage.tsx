"use client";
import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, Plus, Check, AlertTriangle } from "lucide-react";

export default function CartPage({
  isCartOpen,
  setIsCartOpen,
  cart,
  setCart,
  eventDate,
  setEventDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  paymentMode,
  setPaymentMode,
  gatewayOption,
  setGatewayOption,
  addresses,
  setAddresses,
  selectedAddressIndex,
  setSelectedAddressIndex,
  showAddressForm,
  setShowAddressForm,
  newAddress,
  setNewAddress,
  handleCheckoutPayment,
}: any) {
  const [isAgreed, setIsAgreed] = useState(false);

  if (!isCartOpen) return null;

  // Total Price Calculation
  const totalPrice = cart.reduce((acc: number, item: any) => acc + item.price, 0);

  // 🛑 Condition: If price <= 2000, 20% advance option is blocked
  const isAdvanceDisabled = totalPrice <= 2000;

  // Auto switch payment mode to full if advance gets disabled
  if (isAdvanceDisabled && paymentMode === "advance") {
    setPaymentMode("full");
  }

  const advanceAmount = Math.round(totalPrice * 0.2);
  const payableAmount = paymentMode === "advance" && !isAdvanceDisabled ? advanceAmount : totalPrice;

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setAddresses([...addresses, newAddress.trim()]);
      setSelectedAddressIndex(addresses.length);
      setNewAddress("");
      setShowAddressForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0D14] border border-white/10 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 my-auto shadow-[0_0_80px_rgba(0,229,255,0.15)] relative text-left">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Your Cart <span className="text-[#00E5FF]">({cart.length})</span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 bg-neutral-900 border border-white/10 rounded-xl text-white hover:bg-[#00E5FF] hover:text-black transition-all"
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
            
            {/* 1️⃣ CART ITEMS LIST (No /day) */}
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
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCart(cart.filter((_: any, i: number) => i !== idx))}
                    className="p-2 text-gray-500 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* 2️⃣ EVENT DATE & TIME */}
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
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-[#00E5FF] [color-scheme:dark] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-mono block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-[#00E5FF] [color-scheme:dark] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-mono block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-[#00E5FF] [color-scheme:dark] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 3️⃣ ADDRESS MANAGER */}
            <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 font-mono uppercase">
                  <MapPin className="w-4 h-4 text-[#00E5FF]" />
                  <span>Venue Location Address</span>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs text-[#00E5FF] font-mono font-bold flex items-center space-x-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {showAddressForm && (
                <div className="flex space-x-2 pt-2">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter new complete address"
                    className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#00E5FF]"
                  />
                  <button
                    onClick={handleAddAddress}
                    className="px-4 bg-[#00E5FF] text-black font-bold text-xs rounded-xl"
                  >
                    Save
                  </button>
                </div>
              )}

              <div className="space-y-2 pt-1">
                {addresses.map((addr: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all flex items-center justify-between ${
                      selectedAddressIndex === idx
                        ? "bg-[#00E5FF]/10 border-[#00E5FF] text-white"
                        : "bg-black/50 border-white/5 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <span>{addr}</span>
                    {selectedAddressIndex === idx && <Check className="w-4 h-4 text-[#00E5FF]" />}
                  </div>
                ))}
              </div>
            </div>

            {/* 4️⃣ PAYMENT BREAKDOWN */}
            <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* 20% Advance Button */}
                <button
                  type="button"
                  disabled={isAdvanceDisabled}
                  onClick={() => !isAdvanceDisabled && setPaymentMode("advance")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isAdvanceDisabled
                      ? "opacity-40 border-neutral-800 bg-neutral-900 cursor-not-allowed"
                      : paymentMode === "advance"
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

                {/* 100% Full Payment Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMode("full")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMode === "full"
                      ? "bg-[#00E5FF]/10 border-[#00E5FF]"
                      : "bg-black border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold block text-gray-400 uppercase">
                    Full Payment
                  </span>
                  <span className="text-sm font-black text-[#00E5FF] font-mono">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </button>
              </div>

              {/* ⚠️ CANCELLATION & TOKEN DISCLAIMER WITH INTERACTIVE CHECKBOX */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-3">
                {/* Clickable Tick Box */}
                <button
                  type="button"
                  onClick={() => setIsAgreed(!isAgreed)}
                  className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isAgreed
                      ? "bg-[#00E5FF] border-[#00E5FF] text-black shadow-[0_0_10px_#00E5FF]"
                      : "bg-black border-amber-500/50 hover:border-[#00E5FF]"
                  }`}
                >
                  {isAgreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Disclaimer Line Text */}
                <p 
                  onClick={() => setIsAgreed(!isAgreed)} 
                  className="text-[11px] font-mono text-amber-300 leading-tight cursor-pointer select-none"
                >
                  These are just token amounts for full pricing contact us. Cancellation valid only within 12 hours and before team dispatch.
                </p>
              </div>

              {/* Final Payable Checkout Row */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Total Payable Now</span>
                  <span className="text-xl font-black text-white font-mono">
                    ₹{payableAmount.toLocaleString()}
                  </span>
                </div>

                <button
                  disabled={!isAgreed}
                  onClick={handleCheckoutPayment}
                  className="px-8 py-3.5 bg-[#00E5FF] disabled:bg-neutral-800 disabled:text-gray-600 disabled:shadow-none disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 transition-all"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}