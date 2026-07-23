"use client";
import React, { useState } from "react";
import { CalendarCheck, ShieldAlert, Sparkles, Clock } from "lucide-react";

export default function Scheduler({ checkDate, setCheckDate, checkTime, setCheckTime, availabilityStatus, setAvailabilityStatus }: any) {
  
  const handleCheckAvailability = () => {
    if (!checkDate) {
      alert("Please specify a valid operational date node.");
      return;
    }

    // 🚀 Simulated allocation count logic (Simulating if bookings cross 8 slots limit)
    // You can replace this random generator logic with your real database booking array count later
    const simulatedBookingsCount = Math.floor(Math.random() * 15); 

    if (simulatedBookingsCount >= 8) {
      setAvailabilityStatus("booked"); // Triggers ALL SLOTS BOOKED structural layout
    } else {
      setAvailabilityStatus("available"); // Triggers Slots Available layout
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 text-left">
      
      {/* Dynamic Main Headline */}
      <div className="text-center mb-10 space-y-2">
        <h3 className="text-4xl font-black text-white tracking-tight">
          Check Shooting <span className="text-[#00E5FF] font-serif italic font-normal drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">Availability</span>
        </h3>
        <p className="text-xs text-gray-500 font-mono">Select your plan date and time ranges to verify instant open slots framework.</p>
      </div>

      {/* 🛠️ ENHANCED CYBER TEXTURED INPUT FORM CONTAINER */}
      <div className="bg-neutral-900/60 border border-white/5 backdrop-blur-xl p-6 rounded-[24px] shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Date Node Selector Input */}
        <div className="w-full relative">
          <input 
            type="date" 
            value={checkDate}
            onChange={(e) => { setCheckDate(e.target.value); setAvailabilityStatus("idle"); }}
            className="w-full p-3.5 pl-4 bg-black border border-neutral-800 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-[#00E5FF] transition-all [color-scheme:dark]" 
          />
        </div>

        {/* Time Selector Selector Dropdown Input */}
        <div className="w-full">
          <select 
            value={checkTime}
            onChange={(e) => { setCheckTime(e.target.value); setAvailabilityStatus("idle"); }}
            className="w-full p-3.5 bg-black border border-neutral-800 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-[#00E5FF] transition-all cursor-pointer"
          >
            <option value="" className="text-gray-500">Select Shooting Hour Slot</option>
            {Array.from({ length: 24 }, (_, i) => {
              const h = i + 1;
              const val = h < 10 ? `0${h}:00` : `${h}:00`;
              const label = h <= 12 ? `${h}:00 AM` : `${h - 12}:00 PM`;
              return <option key={val} value={val} className="bg-neutral-950 text-white">{label}</option>;
            })}
          </select>
        </div>

        {/* Submit Verification Button */}
        <button 
          onClick={handleCheckAvailability}
          className="w-full md:w-auto px-8 py-3.5 bg-[#00E5FF] text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-102 transition-all shrink-0 uppercase tracking-wider"
        >
          Check Slot
        </button>

      </div>

      {/* 📊 DYNAMIC RESULTS SHEET INFRASTRUCTURE LAYOUT */}
      <div className="mt-8">
        {availabilityStatus === "available" && (
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center space-x-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <CalendarCheck className="w-6 h-6 shrink-0 animate-bounce" />
            <div className="text-xs font-mono">
              <span className="font-black uppercase tracking-wider text-white block mb-0.5">Slots Available Node Confirmed ✅</span>
              Our camera gears & crew allocation pipelines are fully vacant. Proceed to secure instant deployment now.
            </div>
          </div>
        )}

        {/* 🚨 CRITICAL FIX: IF COUNT CROSSES 8 BOOKINGS / LIMIT */}
        {availabilityStatus === "booked" && (
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center space-x-4 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.1)]">
            <ShieldAlert className="w-6 h-6 shrink-0 text-rose-500 animate-pulse" />
            <div className="text-xs font-mono">
              <span className="font-black uppercase tracking-wider text-rose-500 block mb-0.5">All Slots Booked ❌</span>
              Daily booking capacity allocation index limits (Max 8 Shoots/Day) reached for this timeline node. Try picking another operational date interface.
            </div>
          </div>
        )}
      </div>

    </div>
  );
}