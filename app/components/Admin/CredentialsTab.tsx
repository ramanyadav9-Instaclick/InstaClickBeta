'use client';

import React, { useState } from 'react';
import { Key, Plus, Edit2, Trash2, UserCheck } from 'lucide-react';

export interface Member {
  id: string;
  name: string;
  role: 'SUPER_ADMIN' | 'MEMBER';
  user_id: string;
  password: string;
  mobile: string;
  gmail: string;
}

interface CredentialsTabProps {
  members: Member[];
  onSaveMember: (memberData: {
    id?: string | null;
    name: string;
    userId: string;
    password: string;
    mobile: string;
    gmail: string;
    role: 'SUPER_ADMIN' | 'MEMBER';
  }) => void;
  onDeleteMember: (id: string, name: string) => void;
  searchQuery?: string;
}

export const CredentialsTab = ({
  members,
  onSaveMember,
  onDeleteMember,
  searchQuery = '',
}: CredentialsTabProps) => {
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memName, setMemName] = useState('');
  const [memUserId, setMemUserId] = useState('');
  const [memPassword, setMemPassword] = useState('');
  const [memMobile, setMemMobile] = useState('');
  const [memGmail, setMemGmail] = useState('');
  const [memRole, setMemRole] = useState<'SUPER_ADMIN' | 'MEMBER'>('MEMBER');

  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMemName('');
    setMemUserId('');
    setMemPassword('');
    setMemMobile('');
    setMemGmail('');
    setMemRole('MEMBER');
    setShowMemberForm(false);
  };

  const startEditMember = (m: Member) => {
    setEditingMemberId(m.id);
    setMemName(m.name || '');
    setMemUserId(m.user_id || '');
    setMemPassword(m.password || '');
    setMemMobile(m.mobile || '');
    setMemGmail(m.gmail || '');
    setMemRole(m.role || 'MEMBER');
    setShowMemberForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMember({
      id: editingMemberId,
      name: memName,
      userId: memUserId,
      password: memPassword,
      mobile: memMobile,
      gmail: memGmail,
      role: memRole,
    });
    resetMemberForm();
  };

  const filterBySearch = (textArray: (string | number | undefined | null)[]) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return textArray.some((t) => t !== undefined && t !== null && t.toString().toLowerCase().includes(query));
  };

  const filteredMembers = members.filter((m) =>
    filterBySearch([m.name, m.user_id, m.mobile, m.gmail, m.role])
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-cyan-400" /> Members Credentials & Full Access Control
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Create, Edit User ID, Reset Passwords, or Delete Team Members.
          </p>
        </div>
        <button
          onClick={() => {
            resetMemberForm();
            setShowMemberForm(!showMemberForm);
          }}
          className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {showMemberForm ? 'Close Form' : 'Add New Member'}
        </button>
      </div>

      {showMemberForm && (
        <form onSubmit={handleSubmit} className="bg-[#18181b] border-2 border-cyan-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-cyan-400 font-mono">
            {editingMemberId ? '✏️ Edit Member Credentials' : '➕ Add New Team Member'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1">MEMBER FULL NAME *</label>
              <input
                type="text"
                required
                value={memName}
                onChange={(e) => setMemName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1">LOGIN USER ID *</label>
              <input
                type="text"
                required
                value={memUserId}
                onChange={(e) => setMemUserId(e.target.value)}
                placeholder="e.g. team_rohan"
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1">PASSWORD *</label>
              <input
                type="text"
                required
                value={memPassword}
                onChange={(e) => setMemPassword(e.target.value)}
                placeholder="Set Password"
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1">MOBILE NUMBER</label>
              <input
                type="text"
                value={memMobile}
                onChange={(e) => setMemMobile(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1">GMAIL / EMAIL</label>
              <input
                type="email"
                value={memGmail}
                onChange={(e) => setMemGmail(e.target.value)}
                placeholder="member@gmail.com"
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1">ROLE</label>
              <select
                value={memRole}
                onChange={(e) => setMemRole(e.target.value as any)}
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                <option value="MEMBER">👤 TEAM MEMBER</option>
                <option value="SUPER_ADMIN">👑 SUPER ADMIN</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetMemberForm}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-gray-400 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
            >
              {editingMemberId ? 'Save Changes' : 'Create Member'}
            </button>
          </div>
        </form>
      )}

      {/* Members Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filterBySearch(['Super Admin', 'owner_instaclick', 'SUPER_ADMIN']) && (
          <div className="bg-[#18181b] border border-cyan-500/30 p-5 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded uppercase">
                  👑 Primary Owner
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Super Admin</h3>
              </div>
              <UserCheck className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="bg-[#0f0f11] p-3 rounded-xl space-y-1 text-xs font-mono text-gray-300 border border-gray-800">
              <p><span className="text-gray-500">User ID:</span> <strong className="text-white">owner_instaclick</strong></p>
              <p><span className="text-gray-500">Password:</span> <strong className="text-cyan-400">Owner#Pass2026</strong></p>
              <p><span className="text-gray-500">Access:</span> <span className="text-green-400">Full System Control</span></p>
            </div>
          </div>
        )}

        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-[#18181b] border border-gray-800 hover:border-cyan-500/40 p-5 rounded-2xl space-y-3 transition">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                  m.role === 'SUPER_ADMIN' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-800 text-gray-400'
                }`}>
                  {m.role === 'SUPER_ADMIN' ? '👑 SUPER ADMIN' : '👤 TEAM MEMBER'}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{m.name}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditMember(m)}
                  className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl cursor-pointer transition"
                  title="Edit Credentials"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteMember(m.id, m.name)}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl cursor-pointer transition"
                  title="Delete Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-[#0f0f11] p-3 rounded-xl space-y-1 text-xs font-mono text-gray-300 border border-gray-800">
              <p><span className="text-gray-500">User ID:</span> <strong className="text-white">{m.user_id}</strong></p>
              <p><span className="text-gray-500">Password:</span> <strong className="text-cyan-400">{m.password}</strong></p>
              {m.mobile && <p><span className="text-gray-500">Mobile:</span> {m.mobile}</p>}
              {m.gmail && <p><span className="text-gray-500">Email:</span> {m.gmail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CredentialsTab;