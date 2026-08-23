"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle, CreditCard, Banknote, ShieldCheck, AlertTriangle, Lock, RefreshCw } from "lucide-react";
import TrackingStepper from "./TrackingStepper";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  currentUser?: { id?: string; phone?: string; email?: string };
  activeBooking: {
    id: string;
    timestamp: Date;
    status: "booked" | "dispatch" | "location" | "completed";
    packageName?: string;
    totalAmount?: number;
    advancePaid?: number;
    remainingAmount?: number;
    paymentStatus?: "20_advance" | "100_full" | "on_site_pending";
    event_date?: string;
    address?: string;
  } | null;
  isBookingCancelled: boolean;
  canUserCancelBooking: (timestamp: Date | undefined, status: string | undefined) => boolean;
  setShowCancellationForm: (show: boolean) => void;
}

export default function OrderHistoryModal({
  isOpen,
  onClose,
  isLoggedIn,
  currentUser,
  activeBooking: propsActiveBooking,
  isBookingCancelled,
  canUserCancelBooking,
  setShowCancellationForm
}: OrderHistoryModalProps) {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<"online" | "onsite" | null>(null);
  
  // Real-time Database Orders State
  const [liveBooking, setLiveBooking] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔄 Supabase Real-Time Order Syncing Engine
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchUserLiveOrders();
    }
  }, [isOpen, isLoggedIn]);

  const fetchUserLiveOrders = async () => {
    setLoading(true);
    try {
      // API call to fetch actual logged-in user orders from Supabase DB
      const userIdParam = currentUser?.id ? `?userId=${currentUser.id}` : "";
      const res = await fetch(`/api/orders${userIdParam}`);
      const data = await res.json();

      if (data.success && data.bookings && data.bookings.length > 0) {
        // Take the latest order
        const latestOrder = data.bookings[0];
        
        // Map Database structure to Component expected structure
        setLiveBooking({
          id: latestOrder.booking_id || latestOrder.id,
          timestamp: new Date(latestOrder.created_at || Date.now()),
          status: latestOrder.shoot_status || "booked",
          packageName: latestOrder.package_name,
          totalAmount: Number(latestOrder.total_amount),
          advancePaid: Number(latestOrder.advance_paid),
          remainingAmount: Number(latestOrder.remaining_amount),
          paymentStatus: latestOrder.payment_status,
          event_date: latestOrder.event_date,
          address: latestOrder.address,
        });
      } else {
        // Fallback to prop booking if DB fetch empty
        setLiveBooking(propsActiveBooking);
      }
    } catch (err) {
      console.error("Failed to fetch live orders from API:", err);
      setLiveBooking(propsActiveBooking);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Active Target Order (Prefer Live DB fetched order, fallback to props)
  const activeBooking = liveBooking || propsActiveBooking;

  // Amount & Dues Calculations
  const total = activeBooking?.totalAmount || 0;
  
  // Rule Check: अगर ₹40001 से कम है या 100% full payment हो चुका है -> No Dues
  const isUnder40001Limit = total < 40001;
  const isFullyPaid = activeBooking?.paymentStatus === "100_full" || isUnder40001Limit || (activeBooking?.remainingAmount === 0);

  const advance = isFullyPaid ? total : (activeBooking?.advancePaid || Math.round(total * 0.2));
  const remaining = isFullyPaid ? 0 : (activeBooking?.remainingAmount ?? (total - advance));

  // Check Cancellation Eligibility (12 Hours & Before Dispatch)
  const isEligibleToCancel = activeBooking
    ? canUserCancelBooking(activeBooking.timestamp, activeBooking.status)
    : false;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f11] text-white overflow-y-auto p-4 md:p-10 flex flex-col justify-between font-sans">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Your <span className="text-cyan-400">Live Shoot Tracking</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Real-time status, payments & booking controls</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchUserLiveOrders}
              title="Refresh Status"
              className="p-2.5 bg-[#18181b] border border-gray-800 rounded-full text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transition active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2.5 bg-[#18181b] border border-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoggedIn ? (
          <div>
            {loading ? (
              <div className="text-center py-20 text-cyan-400 font-mono text-sm bg-[#18181b] rounded-3xl border border-gray-800 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span>Syncing live order tracking with server...</span>
              </div>
            ) : activeBooking && !isBookingCancelled ? (
              <div className="bg-[#18181b] p-6 md:p-8 rounded-3xl border border-gray-800 space-y-6 shadow-2xl">
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-800 gap-2">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{activeBooking.id}</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {activeBooking.packageName || "Photography Shoot Package"}
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-gray-400 block font-mono">
                      Paid: <strong className="text-emerald-400">₹{advance.toLocaleString()}</strong>
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Booked: {activeBooking.timestamp ? new Date(activeBooking.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                    </span>
                  </div>
                </div>

                {/* 5-Step Live Tracking Stepper */}
                <div className="py-2">
                  <TrackingStepper currentStatus={activeBooking.status} />
                </div>

                {/* Payment & Dues Status Box */}
                <div className="bg-[#0f0f11] p-5 rounded-2xl border border-gray-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Total Booking Cost</span>
                      <span className="text-lg font-bold text-white">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                        {isFullyPaid ? "Paid Amount" : "Advance Paid (20%)"}
                      </span>
                      <span className="text-sm font-bold text-emerald-400">₹{advance.toLocaleString()}</span>
                    </div>
                  </div>

                  <hr className="border-gray-800" />

                  {/* Agar Full Payment ho chuka hai ya ₹2001 se kam hai -> NO DUES */}
                  {isFullyPaid ? (
                    <div className="flex items-center justify-between text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>✓ 100% Full Payment Completed (No Dues Pending)</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                        PAID IN FULL
                      </span>
                    </div>
                  ) : (
                    /* Agar 20% Advance दिया है -> Remaining Dues & Buttons */
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-400">Remaining Amount Due:</span>
                        <span className="text-lg font-black text-amber-400">₹{remaining.toLocaleString()}</span>
                      </div>

                      {/* 2 Payment Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <button
                          onClick={() => {
                            setSelectedPaymentMode("online");
                            alert(`Redirecting to Online Payment Gateway for ₹${remaining}...`);
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            selectedPaymentMode === "online"
                              ? "bg-cyan-400 text-black border-cyan-400"
                              : "bg-[#18181b] text-cyan-400 border-gray-800 hover:border-cyan-500/50"
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay Remaining Online (₹{remaining})
                        </button>

                        <button
                          onClick={() => {
                            setSelectedPaymentMode("onsite");
                            alert(`Selection Saved: You can pay ₹${remaining} on site via Cash / QR code.`);
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            selectedPaymentMode === "onsite"
                              ? "bg-amber-500 text-black border-amber-500"
                              : "bg-[#18181b] text-amber-400 border-gray-800 hover:border-amber-500/50"
                          }`}
                        >
                          <Banknote className="w-4 h-4" />
                          Pay on Site (Cash / QR)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CANCEL BOOKING BUTTON */}
                <div className="pt-2 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-[11px] text-gray-400">
                    * Free cancellation permitted within <strong>12 hours</strong> of booking & strictly <strong>before team dispatch</strong>.
                  </p>

                  {isEligibleToCancel ? (
                    <button
                      onClick={() => setShowCancellationForm(true)}
                      className="w-full sm:w-auto px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-wider rounded-xl border border-rose-500/30 transition-all flex items-center justify-center gap-2 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.15)] cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Cancel Booking
                    </button>
                  ) : (
                    <button
                      disabled
                      title="Cancellation window closed (12 hours completed or team dispatched)"
                      className="w-full sm:w-auto px-6 py-3 bg-gray-900/80 text-gray-500 text-xs font-black uppercase tracking-wider rounded-xl border border-gray-800 flex items-center justify-center gap-2 shrink-0 cursor-not-allowed opacity-60 select-none"
                    >
                      <Lock className="w-4 h-4 text-gray-500" />
                      Cancel Booking (Expired)
                    </button>
                  )}
                </div>

              </div>
            ) : isBookingCancelled ? (
              <div className="text-center py-16 p-6 rounded-3xl bg-[#18181b] border border-gray-800 text-white">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Booking Cancellation Confirmed</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Your cancellation request has been submitted. The advance refund will be processed back to your original payment method within 3-5 bank working days.
                </p>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 bg-[#18181b] rounded-3xl border border-gray-800">
                You have no active booking tracking right now.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-[#18181b] rounded-3xl border border-gray-800">
            Please log in to view your live shoot tracking.
          </div>
        )}

      </div>
    </div>
  );
}