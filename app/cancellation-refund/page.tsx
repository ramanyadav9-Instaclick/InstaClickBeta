import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy | InstaClick",
  description: "Official cancellation, reschedule and refund terms for InstaClick photography marketplace.",
};

export default function CancellationRefundPage() {
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
            Legal Compliance & Consumer Policy
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Last Updated: October 2026 | Governing InstaClick Platform Inc.
          </p>
        </div>

        {/* Core Rules Section */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
          
          {/* Rule 1: Step 1 vs Step 2+ */}
          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Clock className="w-5 h-5 text-[#00E5FF]" />
              <h2>1. Stage-Based Customer Cancellation Window</h2>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              InstaClick operates an on-demand verified shoot fulfillment network. To protect both customers and dispatched photography professionals, cancellation options are tied directly to real-time shoot tracker milestones:
            </p>
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 space-y-2">
                <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold block">
                  Stage 1: Shoot Booked (Allowed)
                </span>
                <p className="text-xs text-gray-400">
                  Customers may request cancellation directly through their Order History portal prior to team dispatch. Applicable advance refunds are processed within 3–5 banking business days.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 space-y-2">
                <span className="text-[11px] font-mono uppercase text-red-400 font-semibold block">
                  Stage 2+: Team Dispatched / On Location (Locked)
                </span>
                <p className="text-xs text-gray-400">
                  Once the shoot progresses to "Team Dispatched" or "On Location", in-app customer cancellation is strictly locked. The advance deposit is non-refundable due to mobilized travel and reserved crew time.
                </p>
              </div>
            </div>
          </section>

          {/* Rule 2: Admin Override & Audit Authority */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2>2. Administrative Verification & Force Majeure Overrides</h2>
            </div>
            <p>
              In extraordinary situations (including extreme weather, client emergencies, or venue restrictions), only the <strong>InstaClick Operations Team</strong> retains executive override authority.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400">
              <li>
                <strong className="text-gray-200">Mandatory Reason Logging:</strong> Every administrative status shift or cancellation requires verified audit documentation by the managing team member.
              </li>
              <li>
                <strong className="text-gray-200">Platform-Initiated Cancellations:</strong> If InstaClick cannot fulfill a booking due to partner unavailability or unforeseen equipment failure, the client is granted an immediate <strong>100% full refund</strong> without deduction.
              </li>
              <li>
                <strong className="text-gray-200">No Cancellations After Shoot Completion:</strong> Once raw media capture is concluded (Stage 4 - Shoot Completed), bookings cannot be cancelled under any circumstance.
              </li>
            </ul>
          </section>

          {/* Rule 3: Rescheduling & Slot Reassignment */}
          <section className="space-y-3">
            <h2 className="text-white font-semibold text-base">3. Rescheduling Terms</h2>
            <p className="text-xs text-gray-400">
              Clients wishing to adjust their shoot slot without penalty must notify the team at least 24 hours prior to the booked time. Slots are reassigned subject to photographer schedule availability.
            </p>
          </section>

          {/* Rule 4: Refund Channels */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" />
              <h2>4. Refund Settlement Method</h2>
            </div>
            <p className="text-xs text-gray-400">
              Approved refunds are credited back strictly to the original payment source (UPI, Credit/Debit Card, or Net Banking) within 3 to 5 business days, in compliance with standard RBI payment gateway settlement norms.
            </p>
          </section>

        </div>

        {/* Footer Contact Callout */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            <p className="text-white font-semibold">Need urgent cancellation assistance?</p>
            <p className="text-gray-400">Contact our 24/7 priority support helpline</p>
          </div>
          <a 
            href="mailto:info@instaclick.co.in" 
            className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-bold tracking-wider hover:bg-[#00E5FF]/80 transition-all"
          >
            info@instaclick.co.in
          </a>
        </div>

      </div>
    </main>
  );
}