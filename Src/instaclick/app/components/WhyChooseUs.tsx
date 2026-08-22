"use client";
import React from "react";
import { Award, Zap, ShieldCheck } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#050505] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* 100% Payment Safety */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 p-5 hover:bg-neutral-900/40 rounded-2xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-white text-[#00E5FF] border border-neutral-800 rounded-xl flex items-center justify-center shadow-md group-hover:border-[#00E5FF] transition-colors duration-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-white">100% Secure Booking</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">🔒 Book trusted photography & videography professionals with secure payments and transparent pricing.</p>
        </div>

        {/* Premium Quality & Instant Service without any company names */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 p-5 hover:bg-neutral-900/40 rounded-2xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-white text-[#00E5FF] border border-neutral-800 rounded-xl flex items-center justify-center shadow-md group-hover:border-[#00E5FF] transition-colors duration-300">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-white">Instant Booking & Fast Response</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">⚡ Urgent emergency booking? Find and book the right photographer or videographer quickly for your event, shoot or special occasion!</p>
        </div>

        {/* Rapid Assets Dispatch */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 p-5 hover:bg-neutral-900/40 rounded-2xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-white text-[#00E5FF] border border-neutral-800 rounded-xl flex items-center justify-center shadow-md group-hover:border-[#00E5FF] transition-colors duration-300">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-white">Professional Quality & On-Time Delivery</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">⚡ Enjoy professionally captured and edited photos and videos, delivered within the promised timeline.</p>
        </div>

      </div>
    </section>
  );
}