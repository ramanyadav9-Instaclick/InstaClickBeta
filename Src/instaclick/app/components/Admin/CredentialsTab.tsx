'use client';

import React, { useState } from 'react';

export interface Member {
  id: string;
  name: string;
  role: 'SUPER_ADMIN' | 'MEMBER';
  userId: string;
  password: string;
  mobile: string;
  gmail: string;
}

interface CredentialsTabProps {
  members: Member[];
  onUpdateMember: (updatedMember: Member) => void;
}

export const CredentialsTab = ({ members, onUpdateMember }: CredentialsTabProps) => {
  const [memberList, setMemberList] = useState<Member[]>(members);

  const handleChange = (id: string, field: keyof Member, value: string) => {
    setMemberList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = (member: Member) => {
    onUpdateMember(member);
    alert(`Credentials for ${member.name} updated successfully!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">🔐 Members Credentials & Passwords</h2>
      <p className="text-gray-400 text-xs mb-6">
        Manage User IDs, Passwords, Mobile Numbers, and Gmail IDs for all team members.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {memberList.map((m) => (
          <div key={m.id} className="bg-[#18181b] border border-gray-800 p-5 rounded-2xl space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">{m.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                m.role === 'SUPER_ADMIN' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-300'
              }`}>
                {m.role}
              </span>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">User ID</label>
              <input
                type="text"
                value={m.userId}
                onChange={(e) => handleChange(m.id, 'userId', e.target.value)}
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <input
                type="password"
                value={m.password}
                onChange={(e) => handleChange(m.id, 'password', e.target.value)}
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Mobile</label>
                <input
                  type="text"
                  value={m.mobile}
                  onChange={(e) => handleChange(m.id, 'mobile', e.target.value)}
                  className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2 text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Gmail</label>
                <input
                  type="email"
                  value={m.gmail}
                  onChange={(e) => handleChange(m.id, 'gmail', e.target.value)}
                  className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2 text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => handleSave(m)}
              className="w-full bg-[#27272a] hover:bg-gray-700 text-white text-xs font-bold py-2.5 rounded-xl transition"
            >
              Save Credentials
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CredentialsTab;