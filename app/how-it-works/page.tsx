"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HowItWorks from "../components/HowItWorks";
import SocialFooter from "../components/SocialFooter";
import { useRouter } from "next/navigation";

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      
      {/* Sleek Top Header Bar */}
      <div className="w-full bg-black/90 backdrop-blur-xl border-b border-white/5 px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => router.push("/")}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 p-0.5 shadow-[0_0_12px_rgba(0,229,255,0.4)]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            <span className="text-[#00E5FF]">i</span>nstaclick
          </span>
        </div>

        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-[#00E5FF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO HOME
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-6">
        <HowItWorks scrollToServices={() => router.push("/#services")} />
      </div>

      {/* Footer */}
      <SocialFooter />
    </main>
  );
}