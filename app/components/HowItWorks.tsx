"use client";
import React from "react";
import { Camera, Calendar, Award, ArrowRight } from "lucide-react";

interface HowItWorksProps {
  scrollToServices: () => void;
}

export default function HowItWorks({ scrollToServices }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="w-full py-12 px-6 bg-[#050505] text-gray-300">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Compact Heading */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-bold text-[#00E5FF] tracking-[0.2em] uppercase">
            Simplified Booking Process
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Your Shoot in 3 Simple Steps
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto">
            Skip traditional studio delays. Lock verified professionals at transparent pricing within 60 seconds.
          </p>
        </div>

        {/* 3 Step Cards - Compact & Clean */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-neutral-950/80 border border-white/10 p-6 rounded-2xl space-y-3 hover:border-[#00E5FF]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest block">Step 01</span>
            <h3 className="text-base font-bold text-white">Choose Your Service</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Pick photography, videography, cinematic reels, or drone shoots. Custom tailor hours and deliverables.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-neutral-950/80 border border-white/10 p-6 rounded-2xl space-y-3 hover:border-[#00E5FF]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest block">Step 02</span>
            <h3 className="text-base font-bold text-white">Select Date & Venue</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Pick your preferred time slot and input your location. Our dispatch engine matches verified nearby talent.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-neutral-950/80 border border-white/10 p-6 rounded-2xl space-y-3 hover:border-[#00E5FF]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest block">Step 03</span>
            <h3 className="text-base font-bold text-white">Capture & Download</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your shooter arrives equipped. Track live status, verify completion with OTP, and receive digital deliverables.
            </p>
          </div>

        </div>

        {/* CTA Button */}
        <div className="text-center pt-2">
          <button
            onClick={scrollToServices}
            className="px-6 py-2.5 bg-[#00E5FF] text-black font-bold rounded-lg text-xs tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            Start Your Booking <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}