"use client";
import React, { useState } from "react";
import { X, CheckSquare, SendHorizontal, Building, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface CancellationModalProps {
  bookingId: string;
  onClose: () => void;
  onConfirmCancellation: (details: any) => void;
}

export default function CancellationModal({ bookingId, onClose, onConfirmCancellation }: CancellationModalProps) {
  const [refundMode, setRefundMode] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const reasons = [
    "Plan changed / Event rescheduled",
    "Found cheaper alternative",
    "Mistake in booking configuration",
    "Other reasons",
  ];

  const handleSubmitCancellation = () => {
    setFormError(null);

    if (!cancellationReason) {
      setFormError("Please select a cancellation reason.");
      return;
    }

    if (refundMode === "upi") {
      if (!upiId.trim()) {
        setFormError("UPI ID is strictly mandatory for refund.");
        return;
      }
    } else {
      if (!bankName || !accountNumber || !confirmAccountNumber || !ifscCode || !accountHolderName) {
        setFormError("All bank fields are strictly mandatory.");
        return;
      }
      if (accountNumber !== confirmAccountNumber) {
        setFormError("Account Number mismatch coordinates.");
        return;
      }
    }

    const cancellationDetails = {
      bookingId,
      cancellationReason,
      refundMode,
      refundDetails: refundMode === "upi" 
        ? { upiId: upiId.trim() }
        : { bankName, accountNumber, ifscCode, accountHolderName }
    };

    onConfirmCancellation(cancellationDetails);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }} 
        className="bg-[#0A0D14] p-6 md:p-8 rounded-3xl max-w-2xl w-full border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)] relative text-left text-white"
      >
        <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-[#18181b] border border-gray-800 rounded-full hover:bg-gray-800 transition">
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
        
        <h3 className="text-xl md:text-2xl font-black mb-1 text-white flex items-center space-x-2">
          <Building className="w-6 h-6 text-rose-500" />
          <span>Cancel Booking <span className="text-rose-400">#{bookingId}</span></span>
        </h3>
        <p className="text-xs text-gray-400 mb-6 border-b border-gray-800 pb-3">
          Provide valid UPI ID or bank credentials to dispatch your processed refund.
        </p>

        {formError && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
            ⚠️ {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Reason Section */}
          <div className="space-y-3">
            <label className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider font-mono">
              CANCELLATION REASON
            </label>
            {reasons.map(reason => (
              <div 
                key={reason} 
                onClick={() => setCancellationReason(reason)} 
                className={`p-3 rounded-xl border cursor-pointer text-xs flex justify-between items-center transition-all ${
                  cancellationReason === reason 
                    ? "border-rose-500 bg-rose-500/10 font-bold text-white shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                    : "bg-[#18181b] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                <span>{reason}</span>
                <CheckSquare className={`w-4 h-4 ${cancellationReason === reason ? "text-rose-400" : "text-gray-600"}`} />
              </div>
            ))}
          </div>

          {/* Refund Mode Selection & Input Details */}
          <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <h4 className="text-xs font-bold text-gray-300 font-mono uppercase">Refund Receiving Mode</h4>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRefundMode("upi")}
                className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  refundMode === "upi"
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                    : "bg-black/50 border-gray-800 text-gray-500 hover:text-gray-300"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>UPI ID</span>
              </button>
              <button
                type="button"
                onClick={() => setRefundMode("bank")}
                className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  refundMode === "bank"
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                    : "bg-black/50 border-gray-800 text-gray-500 hover:text-gray-300"
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Bank (NEFT)</span>
              </button>
            </div>

            {/* Form Inputs based on Mode */}
            {refundMode === "upi" ? (
              <div className="space-y-2 pt-1">
                <label className="text-[10px] text-gray-400 block font-mono">Instant Refund UPI ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. mobile@upi / name@okicici" 
                  value={upiId} 
                  onChange={e => setUpiId(e.target.value)} 
                  className="w-full p-2.5 border border-gray-800 rounded-xl bg-[#0f0f11] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono" 
                />
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <input 
                  type="text" 
                  placeholder="Bank Branch Name" 
                  value={bankName} 
                  onChange={e => setBankName(e.target.value)} 
                  className="w-full p-2.5 border border-gray-800 rounded-xl bg-[#0f0f11] text-xs text-white focus:outline-none focus:border-cyan-400" 
                />
                <input 
                  type="text" 
                  placeholder="Account Holder Name" 
                  value={accountHolderName} 
                  onChange={e => setAccountHolderName(e.target.value)} 
                  className="w-full p-2.5 border border-gray-800 rounded-xl bg-[#0f0f11] text-xs text-white focus:outline-none focus:border-cyan-400" 
                />
                <input 
                  type="number" 
                  placeholder="Bank Account Number" 
                  value={accountNumber} 
                  onChange={e => setAccountNumber(e.target.value)} 
                  className="w-full p-2.5 border border-gray-800 rounded-xl bg-[#0f0f11] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono" 
                />
                <input 
                  type="number" 
                  placeholder="Confirm Account Number" 
                  value={confirmAccountNumber} 
                  onChange={e => setConfirmAccountNumber(e.target.value)} 
                  className="w-full p-2.5 border border-gray-800 rounded-xl bg-[#0f0f11] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono" 
                />
                <input 
                  type="text" 
                  placeholder="Bank IFSC Code" 
                  value={ifscCode} 
                  onChange={e => setIfscCode(e.target.value)} 
                  className="w-full p-2.5 border border-gray-800 rounded-xl bg-[#0f0f11] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono tracking-wider uppercase" 
                />
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleSubmitCancellation} 
          className="w-full mt-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <SendHorizontal className="w-4 h-4" />
          <span>Confirm & Submit Cancellation Request</span>
        </button>

      </motion.div>
    </div>
  );
}