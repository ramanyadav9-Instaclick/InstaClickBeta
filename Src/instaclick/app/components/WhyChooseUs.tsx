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
          <h4 className="font-serif font-bold text-lg text-white">100% Payment Safety</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">🔒 Your transactions are fully encrypted. Pay securely via advanced multi-UPI frameworks and trusted Razorpay merchant nodes.</p>
        </div>

        {/* Premium Quality & Instant Service without any company names */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 p-5 hover:bg-neutral-900/40 rounded-2xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-white text-[#00E5FF] border border-neutral-800 rounded-xl flex items-center justify-center shadow-md group-hover:border-[#00E5FF] transition-colors duration-300">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-white">Instant Service & Quality</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">⚡ Urgent emergency booking? We provide high-speed instant deployment nodes to arrive at your venue within 2-3 hours and commence shooting immediately!</p>
        </div>

        {/* Rapid Assets Dispatch */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 p-5 hover:bg-neutral-900/40 rounded-2xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-white text-[#00E5FF] border border-neutral-800 rounded-xl flex items-center justify-center shadow-md group-hover:border-[#00E5FF] transition-colors duration-300">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-white">Rapid Assets Dispatch</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">⚡ Industry-leading fast delivery timelines. Get your clean, formatted digital assets ready and dispatched within 15 days.</p>
        </div>

      </div>
    </section>
  );
}