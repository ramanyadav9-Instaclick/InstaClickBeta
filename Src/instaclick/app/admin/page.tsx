'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Models
interface Member {
  id: string;
  name: string;
  role: 'SUPER_ADMIN' | 'MEMBER';
  user_id: string;
  password: string;
  mobile: string;
  gmail: string;
}

interface Booking {
  id: string;
  user_name: string;
  phone: string;
  package_name: string;
  amount: number;
  event_date: string;
  start_time: string;
  end_time: string;
  address: string;
  status: string;
  status_step: number;
  tracker_status: string;
}

interface ContactInquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  spoken_by_member?: string;
  review_note?: string;
}

interface ActivityLog {
  id: string;
  member_name: string;
  action_performed: string;
  created_at: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'MEMBER'>('SUPER_ADMIN');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data States
  const [members, setMembers] = useState<Member[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState('revenue');
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'TODAY' | 'COMPLETED' | 'PENDING'>('ALL');

  // Security: Prevent Right Click & DevTools
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
        (e.ctrlKey && e.keyCode === 85) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch Supabase Data after Login
  const fetchSupabaseData = async () => {
    const { data: bData } = await supabase.from('bookings').select('*');
    if (bData) setBookings(bData);

    const { data: mData } = await supabase.from('members').select('*');
    if (mData) setMembers(mData);

    const { data: iData } = await supabase.from('inquiries').select('*');
    if (iData) setInquiries(iData);

    const { data: lData } = await supabase.from('activity_logs').select('*');
    if (lData) setLogs(lData);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSupabaseData();
    }
  }, [isLoggedIn]);

  // Login Handler using Supabase Database
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Default Owner Login Check Fallback
    if (adminId === 'owner_instaclick' && password === 'Owner#Pass2026') {
      setUserRole('SUPER_ADMIN');
      setIsLoggedIn(true);
      setActiveTab('revenue');
      return;
    }

    // Check Database for Member Credentials
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', adminId)
      .eq('password', password)
      .single();

    if (error || !data) {
      setLoginError('Invalid User ID or Password');
      return;
    }

    setUserRole(data.role as 'SUPER_ADMIN' | 'MEMBER');
    setIsLoggedIn(true);
    setActiveTab(data.role === 'SUPER_ADMIN' ? 'revenue' : 'bookings');
  };

  // Update Full Member Profile (Name, Pass, Mobile, Gmail, Role) in Supabase
  const handleUpdateMemberFullProfile = async (id: string, updatedMemberObj: Partial<Member>) => {
    const { error } = await supabase
      .from('members')
      .update(updatedMemberObj)
      .eq('id', id);

    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updatedMemberObj } : m))
      );
      // Log Action
      await supabase.from('activity_logs').insert([
        {
          member_name: adminId,
          action_performed: `Updated full credentials profile for Member ID #${id}`,
        },
      ]);
      alert('Member credentials & details updated successfully in database!');
      fetchSupabaseData();
    } else {
      alert('Error updating credentials. Please check your network or inputs.');
    }
  };

  // Update Tracker Status in Supabase & Log Action
  const handleTrackerUpdate = async (bookingId: string, newTrackerStatus: string, customerName: string) => {
    let stepNumber = 1;
    if (newTrackerStatus === 'Dispatched') stepNumber = 2;
    if (newTrackerStatus === 'In Transit') stepNumber = 3;
    if (newTrackerStatus === 'Assets Delivered') stepNumber = 5;

    const { error } = await supabase
      .from('bookings')
      .update({ tracker_status: newTrackerStatus, status_step: stepNumber })
      .eq('id', bookingId);

    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, tracker_status: newTrackerStatus, status_step: stepNumber } : b))
      );

      // Save Log to Supabase
      const logMsg = `Updated Dot Tracker for ${customerName} to ${newTrackerStatus}`;
      await supabase.from('activity_logs').insert([{ member_name: adminId, action_performed: logMsg }]);
      alert('Tracker status updated!');
      fetchSupabaseData();
    } else {
      alert('Error updating tracker status');
    }
  };

  // Mark Inquiry Call & Review in Supabase
  const handleMarkInfoGiven = async (id: number) => {
    const note = prompt('Enter Information/Review note provided to customer:');
    if (!note) return;

    const { error } = await supabase
      .from('inquiries')
      .update({ status: 'Info Given', spoken_by_member: adminId || 'Member', review_note: note })
      .eq('id', id);

    if (!error) {
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'Info Given', spoken_by_member: adminId || 'Member', review_note: note }
            : item
        )
      );
      // Log Action
      await supabase.from('activity_logs').insert([{ member_name: adminId, action_performed: `Submitted review note for Inquiry ID #${id}` }]);
      alert('Review note submitted!');
      fetchSupabaseData();
    }
  };

  const todayDate = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings
    .filter((b) => {
      if (bookingFilter === 'TODAY') return b.event_date === todayDate;
      if (bookingFilter === 'COMPLETED') return b.status === 'Completed';
      if (bookingFilter === 'PENDING') return b.status === 'Pending';
      return true;
    })
    .sort((a, b) => (a.user_name || '').localeCompare(b.user_name || ''));

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4">
        <div className="bg-[#18181b] border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white text-center mb-6">Instaclick Login 🔒</h1>
          {loginError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono text-center">
              ⚠️ {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">USER ID</label>
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="owner_instaclick or team_rohan"
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-sm"
              />
            </div>
            <button type="submit" className="w-full bg-cyan-400 text-black font-bold py-3 rounded-xl hover:bg-cyan-300">
              Login to Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#141416] border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-black text-cyan-400 mb-6">INSTACLICK.</h1>

          <div className="bg-[#1c1c1f] p-3 rounded-xl mb-6">
            <p className="text-xs text-gray-400">User:</p>
            <p className="text-sm font-bold text-white">{adminId}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-2 inline-block ${userRole === 'SUPER_ADMIN' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-800 text-gray-300'}`}>
              {userRole === 'SUPER_ADMIN' ? '👑 SUPER ADMIN' : '👤 MEMBER'}
            </span>
          </div>

          <nav className="space-y-2 text-sm font-semibold text-gray-300">
            {/* SUPER ADMIN OPTIONS (8 TOTAL) */}
            {userRole === 'SUPER_ADMIN' ? (
              <>
                <button onClick={() => setActiveTab('revenue')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'revenue' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📊 1. Revenue & Net Profit
                </button>
                <button onClick={() => setActiveTab('bookings')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'bookings' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📅 2. All Bookings (Filtered A-Z)
                </button>
                <button onClick={() => setActiveTab('tracker')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'tracker' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📍 3. Live Dot Tracker System
                </button>
                <button onClick={() => setActiveTab('payments')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'payments' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  💳 4. Customer Payments & Dues
                </button>
                <button onClick={() => setActiveTab('credentials')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'credentials' ? 'bg-cyan-400 text-black font-bold' : 'hover:bg-gray-800 text-cyan-400'}`}>
                  🔐 5. Members Credentials & Full Edit
                </button>
                <button onClick={() => setActiveTab('logs')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'logs' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📜 6. View Member Activity Log
                </button>
                <button onClick={() => setActiveTab('inquiries')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'inquiries' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📩 7. Contact Forms & Review Status
                </button>
              </>
            ) : (
              /* MEMBER OPTIONS */
              <>
                <button onClick={() => setActiveTab('bookings')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'bookings' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📅 1. Assigned Bookings
                </button>
                <button onClick={() => setActiveTab('tracker')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'tracker' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📍 2. Live Dot Tracker Update
                </button>
                <button onClick={() => setActiveTab('payments')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'payments' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  💳 3. Customer Payments & Dues Check
                </button>
                <button onClick={() => setActiveTab('inquiries')} className={`w-full text-left p-2.5 rounded-lg ${activeTab === 'inquiries' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📞 4. Contact Forms & Customer Calls
                </button>
              </>
            )}
          </nav>
        </div>

        <button onClick={() => setIsLoggedIn(false)} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-2.5 rounded-xl text-xs font-bold">
          🔒 Lock Panel
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* 1. REVENUE */}
        {activeTab === 'revenue' && userRole === 'SUPER_ADMIN' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📊 Weekly Revenue & Net Profit</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-400 font-mono">Total Revenue Collected</p>
                <p className="text-2xl font-bold text-green-400">₹{bookings.reduce((a, b) => a + (Number(b.amount) || 0), 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-400 font-mono">Total Bookings Count</p>
                <p className="text-2xl font-bold text-cyan-400">{bookings.length}</p>
              </div>
              <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-400 font-mono">Estimated Net Profit</p>
                <p className="text-2xl font-bold text-emerald-300">₹{Math.round(bookings.reduce((a, b) => a + (Number(b.amount) || 0), 0) * 0.4).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. BOOKINGS */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📅 Bookings Management (Alphabetical A-Z)</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button onClick={() => setBookingFilter('ALL')} className={`p-4 rounded-xl border text-left transition ${bookingFilter === 'ALL' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-gray-400">ALL Bookings (Click)</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </button>
              <button onClick={() => setBookingFilter('TODAY')} className={`p-4 rounded-xl border text-left transition ${bookingFilter === 'TODAY' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-gray-400">Today's Bookings (Click)</p>
                <p className="text-2xl font-bold text-cyan-400">{bookings.filter((b) => b.event_date === todayDate).length}</p>
              </button>
              <button onClick={() => setBookingFilter('COMPLETED')} className={`p-4 rounded-xl border text-left transition ${bookingFilter === 'COMPLETED' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-gray-400">Completed (Click)</p>
                <p className="text-2xl font-bold text-green-400">{bookings.filter((b) => b.status === 'Completed').length}</p>
              </button>
              <button onClick={() => setBookingFilter('PENDING')} className={`p-4 rounded-xl border text-left transition ${bookingFilter === 'PENDING' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-gray-400">Pending (Click)</p>
                <p className="text-2xl font-bold text-yellow-400">{bookings.filter((b) => b.status === 'Pending' || !b.status).length}</p>
              </button>
            </div>

            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div key={b.id} className="bg-[#18181b] border border-gray-800 p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-white">{b.user_name} ({b.phone})</h3>
                    <p className="text-xs text-gray-400">Package: {b.package_name} | Date: {b.event_date}</p>
                    <p className="text-xs text-cyan-400 font-bold mt-1">Amount: ₹{b.amount}</p>
                  </div>
                  <div className="text-xs bg-[#0f0f11] p-3 rounded-xl border border-gray-800">
                    <p className="text-gray-400">Tracker Status:</p>
                    <p className="text-cyan-400 font-bold">{b.tracker_status || 'Order Placed'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. LIVE DOT TRACKER */}
        {activeTab === 'tracker' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📍 Live Dot Tracker System</h2>
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="bg-[#18181b] border border-gray-800 p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-lg">{b.user_name} ({b.package_name})</h3>
                    <p className="text-xs text-cyan-400">Current: {b.tracker_status || 'Order Placed'}</p>
                  </div>
                  <select
                    value={b.tracker_status || 'Order Placed'}
                    onChange={(e) => handleTrackerUpdate(b.id, e.target.value, b.user_name)}
                    className="bg-[#0f0f11] text-xs p-2.5 rounded-xl border border-gray-700 text-white"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Dispatched">Team Dispatched</option>
                    <option value="In Transit">On Location</option>
                    <option value="Assets Delivered">Assets Delivered</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PAYMENTS & DUES */}
        {activeTab === 'payments' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💳 Customer Payments & Dues Check</h2>
            <div className="bg-[#18181b] border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#141416] text-gray-400 text-xs uppercase border-b border-gray-800">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-800">
                      <td className="p-4 font-bold text-white">{b.user_name}</td>
                      <td className="p-4">{b.phone}</td>
                      <td className="p-4">{b.package_name}</td>
                      <td className="p-4 text-green-400 font-semibold">₹{b.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. MEMBERS CREDENTIALS & ALL DETAILS EDIT (SUPER ADMIN SPECIAL) */}
        {activeTab === 'credentials' && userRole === 'SUPER_ADMIN' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">🔐 All Members Credentials & Live Edit Control</h2>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1.5 rounded-xl border border-cyan-500/30 font-mono">
                Super Admin Master Control
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {members.map((m) => (
                <div key={m.id} className="bg-[#18181b] border border-cyan-500/20 p-6 rounded-2xl space-y-4 shadow-xl relative">
                  
                  {/* Header Badge */}
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      {m.role === 'SUPER_ADMIN' ? '👑 OWNER (SUPER ADMIN)' : '👤 TEAM MEMBER'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">ID: {m.id.substring(0, 8)}...</span>
                  </div>

                  {/* Form Controls for Editable Member Data */}
                  <div className="space-y-3">
                    
                    {/* Name */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">FULL NAME</label>
                      <input
                        type="text"
                        defaultValue={m.name}
                        id={`name-${m.id}`}
                        className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2.5 text-xs text-white font-bold focus:border-cyan-400 outline-none"
                      />
                    </div>

                    {/* User ID */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">USER ID (LOGIN KEY)</label>
                      <input
                        type="text"
                        defaultValue={m.user_id}
                        id={`userid-${m.id}`}
                        className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2.5 text-xs text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">PASSWORD</label>
                      <input
                        type="text"
                        defaultValue={m.password}
                        id={`pass-${m.id}`}
                        className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2.5 text-xs text-amber-400 font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">MOBILE NUMBER</label>
                      <input
                        type="text"
                        defaultValue={m.mobile || '9999999999'}
                        id={`mobile-${m.id}`}
                        className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2.5 text-xs text-gray-200 font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    {/* Gmail / Email */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">EMAIL / GMAIL ID</label>
                      <input
                        type="email"
                        defaultValue={m.gmail || 'user@instaclick.com'}
                        id={`gmail-${m.id}`}
                        className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2.5 text-xs text-gray-200 font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    {/* Role Dropdown */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">SYSTEM ROLE</label>
                      <select
                        defaultValue={m.role}
                        id={`role-${m.id}`}
                        className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-2.5 text-xs text-cyan-400 font-bold focus:border-cyan-400 outline-none"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                        <option value="MEMBER">MEMBER (Restricted Access)</option>
                      </select>
                    </div>

                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => {
                      const updatedName = (document.getElementById(`name-${m.id}`) as HTMLInputElement)?.value;
                      const updatedUserId = (document.getElementById(`userid-${m.id}`) as HTMLInputElement)?.value;
                      const updatedPass = (document.getElementById(`pass-${m.id}`) as HTMLInputElement)?.value;
                      const updatedMobile = (document.getElementById(`mobile-${m.id}`) as HTMLInputElement)?.value;
                      const updatedGmail = (document.getElementById(`gmail-${m.id}`) as HTMLInputElement)?.value;
                      const updatedRole = (document.getElementById(`role-${m.id}`) as HTMLSelectElement)?.value as 'SUPER_ADMIN' | 'MEMBER';

                      handleUpdateMemberFullProfile(m.id, {
                        name: updatedName,
                        user_id: updatedUserId,
                        password: updatedPass,
                        mobile: updatedMobile,
                        gmail: updatedGmail,
                        role: updatedRole,
                      });
                    }}
                    className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] mt-2"
                  >
                    💾 Save Member Changes
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ACTIVITY LOGS (SUPER ADMIN) */}
        {activeTab === 'logs' && userRole === 'SUPER_ADMIN' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📜 Team Activity Logs</h2>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="bg-[#18181b] border border-gray-800 p-4 rounded-xl flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-cyan-400">{log.member_name}</span>
                    <p className="text-gray-300 text-xs mt-1">{log.action_performed}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. CONTACT FORMS & REVIEWS */}
        {activeTab === 'inquiries' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📩 Contact Forms & Call Status</h2>
            <div className="space-y-4">
              {inquiries.map((iq) => (
                <div key={iq.id} className="bg-[#18181b] border border-gray-800 p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-lg">{iq.name} ({iq.phone})</h3>
                    <p className="text-xs text-gray-400 mt-1">Message: "{iq.message}"</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Status: <span className={`font-bold ${iq.status === 'Info Given' ? 'text-green-400' : 'text-yellow-400'}`}>{iq.status || 'Pending'}</span>
                    </p>
                    {iq.status === 'Info Given' && (
                      <div className="mt-2 text-xs bg-[#0f0f11] p-2.5 rounded-lg border border-gray-800">
                        <p className="text-cyan-400 font-bold">Talked By: {iq.spoken_by_member}</p>
                        <p className="text-gray-300">Review Note: "{iq.review_note}"</p>
                      </div>
                    )}
                  </div>
                  <div>
                    {iq.status !== 'Info Given' ? (
                      <button
                        onClick={() => handleMarkInfoGiven(iq.id)}
                        className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs px-4 py-2 rounded-xl"
                      >
                        📞 Call & Submit Review
                      </button>
                    ) : (
                      <span className="text-xs bg-green-500/20 text-green-400 font-bold px-3 py-1.5 rounded-lg">
                        ✓ Info Provided
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}