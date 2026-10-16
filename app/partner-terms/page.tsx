import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, AlertTriangle, Camera, CheckCircle2, Lock } from "lucide-react";

export const metadata = {
  title: "Partner Code of Conduct & NDA | instaclick",
  description: "Operational guidelines, non-disclosure agreement, and service standards for instaclick photography network partners.",
};

export default function PartnerTermsPage() {
  return (
    <main className="min-h-screen bg-[#05070a] text-gray-300 font-sans px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#00E5FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>

        {/* Page Header */}
        <div className="border-b border-white/10 pb-6 space-y-2">
          <span className="text-[11px] font-mono text-[#00E5FF] tracking-widest uppercase">
            Professional Network Guidelines
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Partner Code of Conduct & NDA
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Last Updated: October 2026 | Governing instaclick Platform Inc.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
          
          {/* Section 1: Non-Solicitation / Direct Deal Ban */}
          <section className="bg-neutral-900/60 border border-red-500/20 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2>1. Non-Solicitation & Platform Integrity Policy</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              instaclick invests in marketing, client trust, dispute insurance, and dispatch infrastructure. Partners agree to strict non-solicitation guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400">
              <li>
                <strong className="text-gray-200">No Offline Cash Deals:</strong> Partners shall never offer personal contact numbers, personal visiting cards, or off-platform direct bookings to instaclick clients.
              </li>
              <li>
                <strong className="text-gray-200">Penalty & Account Termination:</strong> Attempting to bypass the platform results in immediate de-activation, forfeiture of pending assignment payouts, and permanent blacklisting from the network.
              </li>
            </ul>
          </section>

          {/* Section 2: Non-Disclosure Agreement (Client Media) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Lock className="w-5 h-5 text-[#00E5FF]" />
              <h2>2. Client Confidentiality & Media NDA</h2>
            </div>
            <p className="text-xs text-gray-400">
              Photographers and videographers capture intimate family gatherings, high-value corporate products, and personal events. Partners strictly agree:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-400">
              <li>Not to publish raw or finished assets on personal social media handles (Instagram, YouTube, personal websites) without written approval from instaclick and the client.</li>
              <li>Not to disclose client venue addresses, VIP attendee identities, or private conversations overheard during assignments.</li>
              <li>To retain raw card footage securely until digital cloud submission is approved by the quality desk.</li>
            </ul>
          </section>

          {/* Section 3: Professional Equipment & Arrival SLA */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Camera className="w-5 h-5 text-amber-400" />
              <h2>3. On-Location Standards & Equipment Readiness</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400">
              <li>
                <strong className="text-gray-200">Punctuality:</strong> Partners must arrive at the assigned venue 15 minutes prior to the scheduled shoot time to survey lighting, setups, and meet client liaisons.
              </li>
              <li>
                <strong className="text-gray-200">Gear Redundancy:</strong> Partners must carry secondary backup batteries, high-speed memory cards, and adequate lighting gear appropriate for the booked category.
              </li>
              <li>
                <strong className="text-gray-200">Professional Etiquette:</strong> Clean, unobtrusive attire, courteous communication, and respectful behavior towards clients and guests are mandatory.
              </li>
            </ul>
          </section>

          {/* Section 4: Status Updates & Verification Loop */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2>4. Operational Triggers & Verification</h2>
            </div>
            <p className="text-xs text-gray-400">
              Partners trigger milestones ("Reached Location", "Shoot Started", "Raw Assets Uploaded") through their dedicated partner portal. All milestones route directly to the instaclick operations desk for admin verification before live tracking updates reflect to the customer.
            </p>
          </section>

          {/* Section 5: Payouts & Settlement Cycles */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
              <h2>5. Payout Settlement & Quality Desk Sign-Off</h2>
            </div>
            <p className="text-xs text-gray-400">
              Shoot earnings are settled via direct bank transfer or UPI within scheduled weekly disbursement cycles, following successful upload and quality verification of raw capture assets.
            </p>
          </section>

        </div>

        {/* Footer Support Box */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            <p className="text-white font-semibold">Questions about partner terms or onboarding?</p>
            <p className="text-gray-400">Contact the instaclick Partner Operations Desk</p>
          </div>
          <a 
            href="mailto:info@instaclick.co.in" 
            className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-bold  tracking-wider hover:bg-[#00E5FF]/80 transition-all"
          >
            info@instaclick.co.in
          </a>
        </div>

      </div>
    </main>
  );
}