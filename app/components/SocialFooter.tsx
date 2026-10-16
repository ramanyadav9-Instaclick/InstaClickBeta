"use client";
import React from "react";
import Link from "next/link";

export default function SocialFooter() {
  return (
    <footer className="w-full bg-[#0a0d14] text-gray-300 border-t border-white/10 pt-12">
      
      {/* 1️⃣ TOP DIRECTORY GRID (FLIPKART STYLE COLUMNS) */}
      <div className="w-full max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-[13px] leading-relaxed">
        
        {/* Col 1: ABOUT */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">About</p>
          <ul className="space-y-2">
            <li><Link href="#about" className="hover:text-[#00E5FF] transition-colors">About InstaClick</Link></li>
            <li><Link href="#portfolio" className="hover:text-[#00E5FF] transition-colors">Featured Portfolio</Link></li>
            <li><Link href="#how-it-works" className="hover:text-[#00E5FF] transition-colors">How It Works</Link></li>
            <li><Link href="#partner-join" className="hover:text-[#00E5FF] transition-colors">Careers & Hiring</Link></li>
            <li><Link href="#services" className="hover:text-[#00E5FF] transition-colors">Our Network</Link></li>
          </ul>
        </div>

        {/* Col 2: SERVICES */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Services</p>
          <ul className="space-y-2">
            <li><Link href="#services" className="hover:text-[#00E5FF] transition-colors">Wedding Photography</Link></li>
            <li><Link href="#services" className="hover:text-[#00E5FF] transition-colors">Pre-Wedding Shoot</Link></li>
            <li><Link href="#services" className="hover:text-[#00E5FF] transition-colors">Event Coverage</Link></li>
            <li><Link href="#services" className="hover:text-[#00E5FF] transition-colors">Product Shoots</Link></li>
            <li><Link href="#services" className="hover:text-[#00E5FF] transition-colors">Reels & Short Video</Link></li>
            <li><Link href="#services" className="hover:text-[#00E5FF] transition-colors">Drone Cinematography</Link></li>
          </ul>
        </div>

        {/* Col 3: HELP & SUPPORT */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Help</p>
          <ul className="space-y-2">
            <li><Link href="#contact" className="hover:text-[#00E5FF] transition-colors">Payments & Token</Link></li>
            <li><Link href="#contact" className="hover:text-[#00E5FF] transition-colors">Shoot Scheduling</Link></li>
            <li><Link href="/cancellation-refund" className="hover:text-[#00E5FF] transition-colors">Cancellation & Returns</Link></li>
            <li><Link href="#faq" className="hover:text-[#00E5FF] transition-colors">FAQ</Link></li>
            <li><Link href="#contact" className="hover:text-[#00E5FF] transition-colors">Report an Issue</Link></li>
          </ul>
        </div>

        {/* Col 4: CONSUMER POLICY */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Consumer Policy</p>
          <ul className="space-y-2">
            <li><Link href="/cancellation-refund" className="hover:text-[#00E5FF] transition-colors">Cancellation & Refund</Link></li>
            <li><Link href="/terms" className="hover:text-[#00E5FF] transition-colors">Terms Of Use</Link></li>
            <li><Link href="/privacy" className="hover:text-[#00E5FF] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/partner-terms" className="hover:text-[#00E5FF] transition-colors">Partner Code & NDA</Link></li>
            <li><Link href="#contact" className="hover:text-[#00E5FF] transition-colors">Grievance Redressal</Link></li>
          </ul>
        </div>

        {/* Col 5: MAIL US & SOCIAL */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Mail Us:</p>
          <div className="text-gray-300 text-xs space-y-1 leading-relaxed">
            <p>instaclick Platform Inc.,</p>
            <p>Customer Support Desk,</p>
            <p>Email: <a href="mailto:info@instaclick.co.in" className="text-[#00E5FF] hover:underline">info@instaclick.co.in</a></p>
            <p>Support: +91 7982776458</p>
          </div>

          <div className="pt-2">
            <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs mb-2">Social:</p>
            <div className="flex items-center space-x-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/instaclick.co.in?igsh=MW12NWRvaHYwM3pmNA==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Col 6: REGISTERED OFFICE ADDRESS */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Registered Office:</p>
          <div className="text-gray-300 text-xs space-y-1 leading-relaxed">
            <p>instaclick Registered Office,</p>
            <p></p>
            <p>Sector 10, Vikas Nagar,</p>
            <p>Gurgaon, Haryana - 122001,</p>
            <p>India</p>
            <p className="pt-1 text-gray-400">Telephone: <span className="text-[#00E5FF]">+91 7982776458</span></p>
          </div>
        </div>

      </div>

      {/* 2️⃣ FLIPKART STYLE HORIZONTAL BOTTOM BAR */}
      <div className="w-full bg-[#05070a] border-t border-white/10 py-5">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col xl:flex-row items-center justify-between gap-6 text-[13px]">
          
          {/* Quick Action Links with Icons */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 font-medium">
            <Link href="#partner-join" className="flex items-center gap-2 hover:text-[#00E5FF] transition-colors">
              <span className="text-[#00E5FF]">💼</span>
              <span>Become a Partner</span>
            </Link>

            <Link href="#pricing" className="flex items-center gap-2 hover:text-[#00E5FF] transition-colors">
              <span className="text-amber-400">🎁</span>
              <span>Shoot Packages</span>
            </Link>

            <Link href="#contact" className="flex items-center gap-2 hover:text-[#00E5FF] transition-colors">
              <span className="text-emerald-400">❓</span>
              <span>Help Center</span>
            </Link>
          </div>

          {/* Copyright Notice */}
          <div className="text-gray-400 text-xs sm:text-[13px] tracking-wide text-center">
            © 2026 InstaClick Platform Inc. All rights reserved.
          </div>

          {/* Flipkart Style White Badge Payment Icons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {/* VISA */}
            <span className="px-2 py-0.5 bg-white text-[#1a1f71] font-black text-[10px] tracking-tight rounded shadow-sm border border-gray-200">
              VISA
            </span>
            {/* MASTERCARD */}
            <span className="px-2 py-0.5 bg-white rounded shadow-sm border border-gray-200 flex items-center gap-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eb001b] inline-block -mr-1"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#f79e1b] inline-block opacity-90"></span>
            </span>
            {/* RUPAY */}
            <span className="px-2 py-0.5 bg-white text-[#097939] font-black text-[10px] tracking-tight rounded shadow-sm border border-gray-200">
              RuPay<span className="text-[#09477e]">❯</span>
            </span>
            {/* UPI */}
            <span className="px-2 py-0.5 bg-white text-[#0f7c41] font-bold text-[10px] tracking-tight rounded shadow-sm border border-gray-200">
              UPI
            </span>
            {/* NET BANKING */}
            <span className="px-2 py-0.5 bg-white text-[#333] font-semibold text-[9px] uppercase tracking-tighter rounded shadow-sm border border-gray-200">
              NetBanking
            </span>
            {/* SECURE CALL */}
            <span className="px-2 py-0.5 bg-[#00E5FF]/10 text-[#00E5FF] font-medium text-[10px] rounded border border-[#00E5FF]/30">
              Masked Calling
            </span>
          </div>

        </div>
      </div>

    </footer>
  );
}