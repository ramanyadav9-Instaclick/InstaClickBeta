import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Smartphone, Server } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | instaclick",
  description: "Official privacy policy and customer data protection standards for instaclick platform.",
};

export default function PrivacyPage() {
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
            Data Protection & Privacy Architecture
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Last Updated: October 2026 | Governing instaclick Platform Inc.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
          
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
              <h2>1. Commitment to User Privacy</h2>
            </div>
            <p className="text-xs text-gray-400">
              At instaclick, we respect the personal nature of on-location photography and videography. This policy outlines how your contact data, venue location coordinates, and digital shoot media are protected under enterprise-grade encryption and access controls.
            </p>
          </section>

          {/* Section 2: Virtual Call Masking & Data Obfuscation */}
          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <h2>2. Zero-Exposure Call Masking & Identity Protection</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              To safeguard both customers and partners from unwanted direct solicitation or identity disclosure:
            </p>
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#00E5FF] font-semibold block flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4" /> Masked Calling Telephony
                </span>
                <p className="text-xs text-gray-400">
                  When a photographer connects with a customer regarding shoot arrival, calls are routed through a secure cloud virtual number bridge. Neither party sees the other’s real personal phone number.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#00E5FF] font-semibold block flex items-center gap-1.5">
                  <Lock className="w-4 h-4" /> Booking ID Obfuscation
                </span>
                <p className="text-xs text-gray-400">
                  Customer identities on partner scheduling screens appear strictly as system references (e.g., #INSTA-XXXX) rather than displaying personal contact profiles.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Information We Collect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Server className="w-5 h-5 text-amber-400" />
              <h2>3. Information We Collect & Why</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400">
              <li>
                <strong className="text-gray-200">Account & Verification Data:</strong> Mobile phone number and email address verified via One-Time Password (OTP) for account safety and shoot delivery notifications.
              </li>
              <li>
                <strong className="text-gray-200">Shoot Venue Information:</strong> Street address, city, and event timing solely used to route assigned professionals to your preferred shoot location.
              </li>
              <li>
                <strong className="text-gray-200">Transactional History:</strong> Package tier, token advance payment status, and invoicing records. instaclick does not store complete debit/credit card numbers or UPI MPINs.
              </li>
            </ul>
          </section>

          {/* Section 4: Media Confidentiality & Copyright */}
          <section className="space-y-3">
            <h2 className="text-white font-semibold text-base">4. Raw Assets & Media Confidentiality</h2>
            <p className="text-xs text-gray-400">
              All raw footage and edited media captured during your booking are hosted in encrypted cloud vaults accessible solely by authorized production team members and the client. instaclick and its partners do not sell, license, or publish private family, personal, or corporate shoot media to third parties without prior written consent.
            </p>
          </section>

          {/* Section 5: Data Retention & User Rights */}
          <section className="space-y-3">
            <h2 className="text-white font-semibold text-base">5. Account Deletion & Data Rights</h2>
            <p className="text-xs text-gray-400">
              Users maintain full control over their stored profile details. Customers can delete their account directly through the profile settings menu, triggering removal of saved addresses and non-statutory booking records.
            </p>
          </section>

        </div>

        {/* Footer Support Box */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            <p className="text-white font-semibold">Have a privacy or data security question?</p>
            <p className="text-gray-400">Reach our dedicated data compliance desk</p>
          </div>
          <a 
            href="mailto:info@instaclick.co.in" 
            className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#00E5FF]/80 transition-all"
          >
            info@instaclick.co.in
          </a>
        </div>

      </div>
    </main>
  );
}