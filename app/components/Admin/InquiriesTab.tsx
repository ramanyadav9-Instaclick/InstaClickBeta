'use client';

import React from 'react';

export interface ContactInquiry {
  id: string;
  name?: string;
  customerName?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  message?: string;
  status: 'Pending' | 'Info Given' | 'Reviewed' | string;
  spokenByMember?: string;
  reviewed_by?: string;
  reviewNote?: string;
  admin_notes?: string;
  reviewed_at?: string;
  is_reviewed?: boolean;
}

interface InquiriesTabProps {
  inquiries: ContactInquiry[];
  currentUserId: string;
  onUpdateInquiry: (id: string, name: string, note: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const InquiriesTab = ({
  inquiries,
  currentUserId,
  onUpdateInquiry,
  onRefresh,
  isLoading = false,
}: InquiriesTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">📩 Contact Forms & Customer Reviews</h2>
          <p className="text-gray-400 text-xs">
            View incoming customer forms, call them directly, and record talk review notes.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-[#00E5FF] text-black text-xs font-bold rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2 active:scale-95"
          >
            {isLoading ? 'Syncing...' : '🔄 Refresh Messages'}
          </button>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-20 bg-[#0a0a0a] border border-zinc-800 rounded-2xl text-gray-500 font-mono text-sm">
          No contact inquiries found in database.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((iq) => {
            const customerName = iq.name || iq.customerName || 'Unknown Customer';
            const customerPhone = iq.phone || iq.mobile || 'No Phone';
            const notes = iq.admin_notes || iq.reviewNote || '';
            const reviewer = iq.reviewed_by || iq.spokenByMember || 'Admin/Member';
            const isLocked = Boolean(iq.is_reviewed || notes || iq.status === 'Info Given' || iq.status === 'Reviewed');

            return (
              <div key={iq.id} className="bg-[#18181b] border border-gray-800 p-6 rounded-2xl space-y-4 shadow-lg">
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {customerName} <span className="text-[#00E5FF] font-mono text-sm">({customerPhone})</span>
                    </h3>
                    {iq.email && <p className="text-xs text-gray-400 font-mono">✉️ {iq.email}</p>}
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold font-mono border ${
                      isLocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {isLocked ? '✓ Info Provided & Locked' : '⌛ Pending Review'}
                  </span>
                </div>

                {iq.message && (
                  <div className="bg-[#0f0f11] p-4 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Customer Message:</span>
                    <p className="text-sm text-gray-200 italic">"{iq.message}"</p>
                  </div>
                )}

                {/* Review & Lock Block */}
                <div className="bg-[#0f0f11] p-4 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono font-bold text-gray-400 block">
                      👨‍💼 Call Review & Discussion Notes:
                    </label>
                    {isLocked && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/30">
                        🔒 REVIEW LOCKED
                      </span>
                    )}
                  </div>

                  {isLocked ? (
                    <div className="bg-black/60 p-3.5 rounded-lg border border-zinc-800 text-xs text-gray-300 space-y-2">
                      <p className="italic text-cyan-300 font-medium">"{notes}"</p>
                      <div className="text-[10px] text-gray-500 font-mono flex justify-between border-t border-zinc-800/60 pt-2">
                        <span>Submitted by: <strong className="text-white">{reviewer}</strong></span>
                        <span>Date: {iq.reviewed_at ? new Date(iq.reviewed_at).toLocaleString() : 'Recorded'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        id={`notes-${iq.id}`}
                        placeholder="Type discussion details (e.g. Talked on call, quoted ₹20k for Wedding shoot)..."
                        className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        rows={2}
                      />
                      <button
                        onClick={() => {
                          const notesVal = (document.getElementById(`notes-${iq.id}`) as HTMLTextAreaElement).value;
                          onUpdateInquiry(iq.id, customerName, notesVal);
                        }}
                        className="px-4 py-2 bg-[#00E5FF] text-black font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors"
                      >
                        Save Review & Lock Entry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InquiriesTab;