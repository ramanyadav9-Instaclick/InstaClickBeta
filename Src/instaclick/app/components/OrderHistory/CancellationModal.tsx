"use client";
import React, { useState } from "react";
import { X, CheckSquare, SendHorizontal, Building } from "lucide-react";
import { motion } from "framer-motion";

interface CancellationModalProps {
  bookingId: string;
  onClose: () => void;
  onConfirmCancellation: (details: any) => void;
}

export default function CancellationModal({ bookingId, onClose, onConfirmCancellation }: CancellationModalProps) {
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
    if (!bankName || !accountNumber || !confirmAccountNumber || !ifscCode || !accountHolderName || !cancellationReason) {
      setFormError("All fields are strictly mandatory.");
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      setFormError("Account Number mismatch coordinates.");
      return;
    }

    const cancellationDetails = {
      bookingId,
      cancellationReason,
      bankDetails: { bankName, accountNumber, ifscCode, accountHolderName }
    };

    onConfirmCancellation(cancellationDetails);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }} 
        className="bg-[#F7F4EB] p-8 md:p-10 rounded-2xl max-w-2xl w-full border-4 border-rose-200 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200">
          <X className="w-5 h-5 text-neutral-500" />
        </button>
        
        <h3 className="text-2xl font-bold mb-1 text-black flex items-center space-x-2">
          <Building className="w-7 h-7 text-rose-500" />
          <span>Cancel Booking #{bookingId} Ledger</span>
        </h3>
        <p className="text-xs text-gray-500 mb-8 border-b pb-4">Provide valid bank credentials to dispatch your processed refund token nodes.</p>

        {formError && (
          <div className="mb-6 p-3 rounded bg-rose-50 text-rose-700 text-xs font-bold text-center">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Reason Section */}
          <div className="space-y-4">
            <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">CANCELLATION CONTEXT NODE</label>
            {reasons.map(reason => (
              <div 
                key={reason} 
                onClick={() => setCancellationReason(reason)} 
                className={`p-3 rounded-lg border cursor-pointer text-xs flex justify-between items-center transition-all ${cancellationReason === reason ? "border-[#C5A880] bg-white font-bold" : "bg-neutral-50"}`}
              >
                <span>{reason}</span>
                <CheckSquare className={`w-4 h-4 ${cancellationReason === reason ? "text-[#C5A880]" : "text-gray-300"}`} />
              </div>
            ))}
          </div>

          {/* Bank Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-inner space-y-4">
            <h4 className="text-sm font-bold text-neutral-800 border-b pb-3">Refund Mode Framework (NEFT/IMPS)</h4>
            <input type="text" required placeholder="Bank Branch Name" value={bankName} onChange={e=>setBankName(e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm focus:outline-none" />
            <input type="text" required placeholder="Account Holder Full Name" value={accountHolderName} onChange={e=>setAccountHolderName(e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm focus:outline-none" />
            <input type="number" required placeholder="Bank Account Number Node" value={accountNumber} onChange={e=>setAccountNumber(e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm focus:outline-none" />
            <input type="number" required placeholder="Confirm Account Number Node" value={confirmAccountNumber} onChange={e=>setConfirmAccountNumber(e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm focus:outline-none" />
            <input type="text" required placeholder="Bank IFSC Code Node" value={ifscCode} onChange={e=>setIfscCode(e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm focus:outline-none font-mono tracking-wider uppercase" />
          </div>
        </div>

        <button 
          onClick={handleSubmitCancellation} 
          className="w-full mt-10 py-4 bg-rose-600 hover:bg-black text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-3"
        >
          <SendHorizontal className="w-5 h-5" />
          <span>Strict Submission: WIPE Ledger & Dispatch Refund Now</span>
        </button>

      </motion.div>
    </div>
  );
}