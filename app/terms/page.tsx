import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, ShieldCheck, Camera } from "lucide-react";

export const metadata = {
  title: "Terms of Service | instaclick",
  description: "Official terms of service and client booking agreement for instaclick photography marketplace.",
};

export default function TermsPage() {
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
            Platform Agreement & Terms
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Last Updated: October 2026 | Governing instaclick Platform Inc.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
          
          {/* Section 1: Marketplace Overview */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <FileText className="w-5 h-5 text-[#00E5FF]" />
              <h2>1. Platform Role & Marketplace Model</h2>
            </div>
            <p className="text-xs text-gray-400">
              instaclick operates a technology-enabled marketplace connecting customers with verified, professional freelance photographers, videographers, and drone pilots. instaclick coordinates scheduling, secure advance tokens, virtual masked communication, and digital deliverable quality controls.
            </p>
          </section>

          {/* Section 2: Booking & Schedule Commitment */}
          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2>2. Shoot Slot Confirmation & Timing</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400">
              <li>
                <strong className="text-gray-200">Advance Token:</strong> A shoot booking is officially confirmed once the requisite token advance is paid and verified.
              </li>
              <li>
                <strong className="text-gray-200">Scheduled Punctuality:</strong> Professionals arrive at your designated location for the reserved time window. Clients are required to ensure the venue is accessible at the booked start time.
              </li>
              <li>
                <strong className="text-gray-200">Extension of Hours:</strong> Overtime shoot duration beyond the booked package is subject to photographer availability and additional hourly rates agreed beforehand.
              </li>
            </ul>
          </section>

          {/* Section 3: Venue Access & Permissions */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Camera className="w-5 h-5 text-amber-400" />
              <h2>3. Venue Permissions & Drone Clearances</h2>
            </div>
            <p className="text-xs text-gray-400">
              It is the client’s sole responsibility to secure all required venue entry passes, photography permits, and local permissions (including private resorts, heritage zones, or banquet halls). For drone cinematography, operations are subject to DGCA compliance, red-zone flight restrictions, and prevailing weather safety.
            </p>
          </section>

          {/* Section 4: Deliverables & Timeline */}
          <section className="space-y-3">
            <h2 className="text-white font-semibold text-base">4. Asset Delivery & Post-Production</h2>
            <p className="text-xs text-gray-400">
              Deliverables vary by selected package:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-400">
              <li><strong>Raw Photo Previews:</strong> Uploaded digitally for client selection within 24–48 hours post-shoot.</li>
              <li><strong>Edited Deliverables:</strong> Color-graded high-resolution photos, cinematic highlight reels, and edited assets are delivered digitally within the stipulated package timeline.</li>
              <li><strong>Archival Retention:</strong> Cloud backup links remain active for 30 days post-delivery. Clients are encouraged to download and save their assets upon notification.</li>
            </ul>
          </section>

          {/* Section 5: Platform Privacy & Non-Solicitation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
              <h2>5. Direct Deal & Platform Circumvention Restriction</h2>
            </div>
            <p className="text-xs text-gray-400">
              To ensure consumer protection, insurance, and quality guarantees, all payments and communications must flow through instaclick. Soliciting direct off-platform transactions with instaclick-assigned partners forfeits platform dispute resolution, delivery guarantees, and refund coverage.
            </p>
          </section>

        </div>

        {/* Footer Helpline Box */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            <p className="text-white font-semibold">Questions regarding these terms?</p>
            <p className="text-gray-400">Our legal and support desk is available daily</p>
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