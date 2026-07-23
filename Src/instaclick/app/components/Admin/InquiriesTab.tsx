'use client';

import React, { useState } from 'react';

export interface ContactInquiry {
  id: string;
  customerName: string;
  mobile: string;
  status: 'Pending' | 'Info Given';
  spokenByMember?: string;
  reviewNote?: string;
}

interface InquiriesTabProps {
  inquiries: ContactInquiry[];
  currentUserId: string;
  onUpdateInquiry: (updatedInquiry: ContactInquiry) => void;
}

export const InquiriesTab = ({ inquiries, currentUserId, onUpdateInquiry }: InquiriesTabProps) => {
  const [inquiryList, setInquiryList] = useState<ContactInquiry[]>(inquiries);

  const handleCallAndSubmitReview = (id: string) => {
    const note = prompt('Enter the information or review note provided to the customer:');
    if (!note) return;

    const updated = inquiryList.map((iq) =>
      iq.id === id
        ? {
            ...iq,
            status: 'Info Given' as const,
            spokenByMember: currentUserId || 'Member',
            reviewNote: note,
          }
        : iq
    );

    setInquiryList(updated);
    const targetItem = updated.find((item) => item.id === id);
    if (targetItem) {
      onUpdateInquiry(targetItem);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">📩 Contact Forms & Customer Reviews</h2>
      <p className="text-gray-400 text-xs mb-6">
        View incoming customer forms, call them directly, and record talk review notes.
      </p>

      <div className="space-y-4">
        {inquiryList.map((iq) => (
          <div key={iq.id} className="bg-[#18181b] border border-gray-800 p-5 rounded-2xl flex justify-between items-center shadow-lg">
            <div>
              <h3 className="font-bold text-white text-lg">
                {iq.customerName} <span className="text-gray-400 text-sm">({iq.mobile})</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Status:{' '}
                <span className={`font-bold ${iq.status === 'Info Given' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {iq.status}
                </span>
              </p>

              {iq.status === 'Info Given' && (
                <div className="mt-2 text-xs bg-[#0f0f11] p-3 rounded-xl border border-gray-800">
                  <p className="text-cyan-400 font-bold">Talked By: {iq.spokenByMember}</p>
                  <p className="text-gray-300 mt-0.5">Review Note: "{iq.reviewNote}"</p>
                </div>
              )}
            </div>

            <div>
              {iq.status === 'Pending' ? (
                <button
                  onClick={() => handleCallAndSubmitReview(iq.id)}
                  className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-cyan-500/10"
                >
                  📞 Call & Submit Review
                </button>
              ) : (
                <span className="text-xs bg-green-500/20 text-green-400 font-bold px-3 py-1.5 rounded-lg border border-green-500/30">
                  ✓ Info Provided
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquiriesTab;