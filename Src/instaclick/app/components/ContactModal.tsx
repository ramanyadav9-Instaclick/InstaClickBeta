"use client";
import React, { useState } from "react";
import { X, Send, Phone, Mail, User, MessageSquare } from "lucide-react";

export default function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[350] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="bg-[#0A0D14] border border-[#00E5FF]/30 w-full max-w-md rounded-3xl p-6 md:p-8 space-y-5 shadow-[0_0_80px_rgba(0,229,255,0.2)] relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Contact <span className="text-[#00E5FF]">Us</span>
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Get custom packages & full pricing quotes instantly.
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-[#00E5FF]/20 text-[#00E5FF] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <p className="text-sm font-bold text-white font-mono">Message Sent Successfully!</p>
            <p className="text-xs text-gray-400">Our team will reach out to you within 30 mins.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="text-[11px] font-bold text-gray-300 block mb-1 font-mono">YOUR NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full p-2.5 pl-9 bg-black border border-white/10 rounded-xl text-white text-xs font-bold focus:border-[#00E5FF] outline-none"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-[11px] font-bold text-gray-300 block mb-1 font-mono">MOBILE NUMBER</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "") })}
                  placeholder="10 digit mobile number"
                  className="w-full p-2.5 pl-9 bg-black border border-white/10 rounded-xl text-white text-xs font-mono font-bold focus:border-[#00E5FF] outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-bold text-gray-300 block mb-1 font-mono">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full p-2.5 pl-9 bg-black border border-white/10 rounded-xl text-white text-xs font-bold focus:border-[#00E5FF] outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-[11px] font-bold text-gray-300 block mb-1 font-mono">YOUR MESSAGE / QUERY</label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ask for custom shoot package, pricing, etc."
                  className="w-full p-2.5 pl-9 bg-black border border-white/10 rounded-xl text-white text-xs font-bold focus:border-[#00E5FF] outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00E5FF] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-102 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <span>Submit Inquiry</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}