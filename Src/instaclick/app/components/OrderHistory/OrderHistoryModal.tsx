"use client";
import React from "react";
import { X, CheckCircle, History } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TrackingStepper from "./TrackingStepper";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  activeBooking: { id: string; timestamp: Date; status: "booked" | "dispatch" | "location" | "completed" } | null;
  isBookingCancelled: boolean;
  canUserCancelBooking: (timestamp: Date | undefined, status: string | undefined) => boolean;
  setShowCancellationForm: (show: boolean) => void;
}

export default function OrderHistoryModal({
  isOpen,
  onClose,
  isLoggedIn,
  activeBooking,
  isBookingCancelled,
  canUserCancelBooking,
  setShowCancellationForm
}: OrderHistoryModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB] overflow-y-auto p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center border-b border-[#E5D5C5] pb-6 mb-10">
          <h2 className="text-3xl font-serif font-bold tracking-tight">Booking Profile Ledger</h2>
          <button onClick={onClose} className="p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoggedIn ? (
          <div>
            {activeBooking && !isBookingCancelled ? (
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-stretch space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <div className="text-xl font-black text-black">Order ID: {activeBooking.id}</div>
                    <div className="text-xs text-amber-900 font-mono">Timestamp Ledger: {activeBooking.timestamp.toLocaleString()}</div>
                  </div>
                  
                  {canUserCancelBooking(activeBooking.timestamp, activeBooking.status) ? (
                    <button onClick={() => setShowCancellationForm(true)} className="px-5 py-2.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-100 transition-colors">⚠️ Cancel Booking Framework Now</button>
                  ) : (
                    <div className="px-5 py-2.5 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl border border-gray-200">Cancellation Period Wiped ❌</div>
                  )}
                </div>
                
                <TrackingStepper currentStatus={activeBooking.status} />

                <div className="text-xs bg-[#F7F4EB]/60 p-4 rounded-xl font-medium text-neutral-600">
                  * Cancellation coordinate is strictly submitted within **12 hours** of booking timestamp and strictly **before team allocation** coordinate frameworks.
                </div>
              </div>
            ) : isBookingCancelled ? (
              <div className="text-center py-20 p-6 rounded-2xl bg-white border border-gray-100 text-black">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                Booking Wiped & Cancellation Submission Confirmed ✅ <br/>
                Refund will dispatch within 3 bank working days configuration framework.
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">Your profile has no active allocation tokens.</div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">Wipe configuration node. Proceed to log-in state framework.</div>
        )}
      </div>
    </div>
  );
}