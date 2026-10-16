"use client";
import React from "react";
import { Sparkles } from "lucide-react";

interface AboutUsProps {
  openPartnerSignup: () => void;
}

export default function AboutUs({ openPartnerSignup }: AboutUsProps) {
  return (
    <section id="about" className="w-full py-12 px-6 max-w-6xl mx-auto text-gray-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left Column: Brand Story & Metrics */}
        <div className="space-y-4">
          <span className="text-[11px] font-mono font-bold text-[#00E5FF] tracking-[0.2em] uppercase">
            About instaclick Network
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
            Reimagining On-Demand Visual Production
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            instaclick was engineered to replace unorganized local studio bookings with an instant, trustworthy technology network. We bring verified wedding cinematographers, commercial photographers, and DGCA drone operators directly to your venue with guaranteed equipment readiness.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/5 space-y-0.5">
              <span className="text-[#00E5FF] font-black text-lg">100%</span>
              <p className="text-gray-300 text-[11px]">Verified Shooters</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/5 space-y-0.5">
              <span className="text-[#00E5FF] font-black text-lg">48 Hrs</span>
              <p className="text-gray-300 text-[11px]">Raw Media Access</p>
            </div>
          </div>
        </div>

        {/* Right Column: Creative Network Partner Box */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 aspect-video lg:aspect-auto lg:h-[320px] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/10 via-transparent to-transparent" />
          <div className="relative z-10 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Join Our Creative Network</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              Are you a professional shooter with high-end camera gear? Join the instaclick partner ecosystem today.
            </p>
            <button
              onClick={openPartnerSignup}
              className="px-5 py-2 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#00E5FF] transition-all cursor-pointer"
            >
              Join as a Partner
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}