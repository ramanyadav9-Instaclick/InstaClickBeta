'use client';

import React, { useState } from 'react';
import { Lock, Send } from 'lucide-react';

export interface ContactInquiry {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  admin_notes?: string;
  review_note?: string;
  spoken_by_member?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  is_reviewed?: boolean;
  created_at?: string;
}

interface InquiriesTabProps {
  inquiries: ContactInquiry[];
  onReviewSubmit: (contactId: string | number, clientName: string, note: string) => void;
  onRefresh: () => void;
  searchQuery?: string;
}

export const InquiriesTab = ({
  inquiries,
  onReviewSubmit,
  onRefresh,
  searchQuery = '',
}: InquiriesTabProps) => {
  const [reviewInputMap, setReviewInputMap] = useState<{ [key: string]: string }>({});

  const filterBySearch = (textArray: (string | number | undefined | null)[]) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return textArray.some((t) => t !== undefined && t !== null && t.toString().toLowerCase().includes(query));
  };

  const filteredInquiries = inquiries.filter((iq) =>
    filterBySearch([
      iq.name,
      iq.phone,
      iq.email,
      iq.message,
      iq.spoken_by_member,
      iq.reviewed_by,
      iq.admin_notes,
      iq.review_note,
    ])
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>📩 Contact Forms & Calls Review</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            Call clients, write discussion review notes, and submit to permanently lock.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold cursor-pointer hover:bg-cyan-500/30 font-mono transition"
        >
          🔄 Refresh Inquiries
        </button>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="text-center py-10 border border-gray-800 rounded-2xl text-gray-500 font-mono">
          No inquiries found.
        </div>
      ) : (
        filteredInquiries.map((iq) => {
          const noteValue = iq.admin_notes || iq.review_note || '';
          const isReviewed = Boolean(iq.is_reviewed || noteValue.trim());
          const reviewerName = iq.spoken_by_member || iq.reviewed_by || 'Staff';

          return (
            <div
              key={iq.id}
              className="bg-[#18181b] border border-gray-800 hover:border-cyan-500/30 p-5 rounded-2xl space-y-3 transition shadow-lg"
            >
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {iq.name} <span className="text-cyan-400 font-mono">({iq.phone})</span>
                  </h3>
                  {iq.email && <p className="text-xs text-gray-400 font-mono">📧 {iq.email}</p>}
                  <p className="text-xs text-gray-300 mt-1">
                    Message: <span className="italic text-gray-200">"{iq.message}"</span>
                  </p>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border font-mono flex items-center gap-1.5 ${
                    isReviewed
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isReviewed ? '✓ Recorded' : '⏳ Pending Review'}
                </span>
              </div>

              {isReviewed ? (
                <div className="p-3 bg-[#0a0d14] border border-cyan-500/30 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-white/5 pb-1">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Lock className="w-3 h-3" /> Reviewed by: <strong className="text-white">{reviewerName}</strong>
                    </span>
                    {iq.reviewed_at && <span>{iq.reviewed_at}</span>}
                  </div>
                  <p className="text-xs text-cyan-300 font-mono pt-1">
                    Review Note: <span className="text-white font-semibold">"{noteValue}"</span>
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <label className="text-[11px] font-mono text-gray-400 block">
                    Write Discussion / Call Note:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reviewInputMap[iq.id] || ''}
                      onChange={(e) => setReviewInputMap({ ...reviewInputMap, [iq.id]: e.target.value })}
                      placeholder="e.g. Discussed packages, client requested quotes..."
                      className="flex-1 bg-[#0f0f11] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                    />
                    <button
                      onClick={() => {
                        const note = reviewInputMap[iq.id]?.trim();
                        if (note) onReviewSubmit(iq.id, iq.name, note);
                      }}
                      className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit & Lock
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default InquiriesTab;