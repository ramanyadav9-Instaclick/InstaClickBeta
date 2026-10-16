'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, X, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import InactivityHandler from "../components/InactivityHandler";

// 🌟 ALL MODULAR COMPONENTS IMPORTED HERE
import RevenueTab from "../components/Admin/RevenueTab";
import BookingsTab, { Booking } from "../components/Admin/BookingsTab";
import ShootsScheduleTab from "../components/Admin/ShootsScheduleTab";
import LiveTrackerTab from "../components/Admin/LiveTrackerTab";
import CredentialsTab, { Member } from "../components/Admin/CredentialsTab";
import InquiriesTab, { ContactInquiry } from "../components/Admin/InquiriesTab";

interface ActivityLog {
  id: string;
  member_name: string;
  action_performed: string;
  created_at: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [currentMemberName, setCurrentMemberName] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'MEMBER'>('SUPER_ADMIN');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const [activeTab, setActiveTab] = useState('bookings');
  const [searchQuery, setSearchQuery] = useState('');

  const todayDate = new Date().toISOString().split('T')[0];
  const [selectedShootDate, setSelectedShootDate] = useState(todayDate);

  // Notifications & Modal States
  const [customNotification, setCustomNotification] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({ show: false, title: '', message: '', type: 'info' });
  const [cancelModalData, setCancelModalData] = useState<{ show: boolean; booking: Booking | null; reason: string }>({ show: false, booking: null, reason: '' });

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setCustomNotification({ show: true, title, message, type });
  };

  const fetchSupabaseData = async () => {
    const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (bData) setBookings(bData);

    const { data: mData } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (mData) setMembers(mData);

    const { data: cData } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (cData) setInquiries(cData);

    const { data: lData } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
    if (lData) setLogs(lData);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSupabaseData();
      const channel = supabase
        .channel('realtime_admin_bookings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
          fetchSupabaseData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (adminId === 'owner_instaclick' && password === 'Owner#Pass2026') {
      setUserRole('SUPER_ADMIN');
      setCurrentMemberName('Super Admin');
      setIsLoggedIn(true);
      setActiveTab('bookings');
      fetchSupabaseData();
      return;
    }

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
    setCurrentMemberName(data.name || data.user_id || 'Team Member');
    setIsLoggedIn(true);
    setActiveTab('bookings');
    fetchSupabaseData();
  };

  // 📝 Review Note Handler for Inquiries
  const handleReviewSubmit = async (contactId: string | number, clientName: string, note: string) => {
    const reviewer = userRole === 'SUPER_ADMIN' ? 'Super Admin' : (currentMemberName || adminId);
    const timeNow = new Date().toLocaleString();

    const { error } = await supabase
      .from('contacts')
      .update({
        admin_notes: note,
        review_note: note,
        spoken_by_member: reviewer,
        reviewed_by: reviewer,
        reviewed_at: timeNow,
        is_reviewed: true,
        status: 'Reviewed',
      })
      .eq('id', contactId);

    if (!error) {
      await supabase.from('activity_logs').insert([
        {
          member_name: reviewer,
          action_performed: `Submitted review note for inquiry from ${clientName}: "${note}"`,
        },
      ]);
      showToast('Review Saved', `Review recorded for ${clientName}`, 'success');
      fetchSupabaseData();
    } else {
      showToast('Error', 'Failed to save review note.', 'error');
    }
  };

  // 📍 5-Step Tracker Status Update Handler
  const handleTrackerUpdate = async (bookingId: string, newTrackerStatus: string, customerName: string) => {
    let stepNumber = 1;
    let normalizedShootStatus = "booked";

    if (newTrackerStatus === 'Dispatched' || newTrackerStatus === 'Team Dispatched') {
      stepNumber = 2;
      normalizedShootStatus = "dispatch";
    } else if (newTrackerStatus === 'In Transit' || newTrackerStatus === 'On Location') {
      stepNumber = 3;
      normalizedShootStatus = "location";
    } else if (newTrackerStatus === 'Shoot Completed') {
      stepNumber = 4;
      normalizedShootStatus = "shoot_done";
    } else if (newTrackerStatus === 'Assets Delivered') {
      stepNumber = 5;
      normalizedShootStatus = "delivered";
    } else if (newTrackerStatus === 'Cancelled') {
      stepNumber = 0;
      normalizedShootStatus = "cancelled";
    }

    const { data: updatedData, error } = await supabase
      .from('bookings')
      .update({ 
        tracker_status: newTrackerStatus, 
        shoot_status: normalizedShootStatus,
        status_step: stepNumber
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (!error) {
      const logMsg = `Updated Status for ${customerName} to ${newTrackerStatus}`;
      await supabase.from('activity_logs').insert([{ member_name: adminId, action_performed: logMsg }]);
      showToast('Status Updated', `Tracker status set to ${newTrackerStatus}`, 'success');

      if ((normalizedShootStatus === "shoot_done" || normalizedShootStatus === "delivered") && updatedData) {
        try {
          await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: updatedData.booking_id || updatedData.id,
              status: 'completed'
            })
          });
        } catch (err) {
          console.error("Failed to fire completion notification:", err);
        }
      }

      fetchSupabaseData();
    } else {
      showToast('Error', 'Failed to update status in database.', 'error');
    }
  };

  // 🔐 Member CRUD
  const handleSaveMember = async (mData: {
    id?: string | null;
    name: string;
    userId: string;
    password: string;
    mobile: string;
    gmail: string;
    role: 'SUPER_ADMIN' | 'MEMBER';
  }) => {
    if (mData.id) {
      const { error } = await supabase
        .from('members')
        .update({
          name: mData.name,
          user_id: mData.userId,
          password: mData.password,
          mobile: mData.mobile,
          gmail: mData.gmail,
          role: mData.role,
        })
        .eq('id', mData.id);

      if (!error) {
        showToast('Updated', `Member ${mData.name} updated successfully!`, 'success');
        fetchSupabaseData();
      }
    } else {
      const { error } = await supabase.from('members').insert([
        {
          name: mData.name,
          user_id: mData.userId,
          password: mData.password,
          mobile: mData.mobile,
          gmail: mData.gmail,
          role: mData.role,
        },
      ]);

      if (!error) {
        showToast('Created', `New member ${mData.name} added successfully!`, 'success');
        fetchSupabaseData();
      }
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (!error) {
      showToast('Deleted', `Member ${name} has been removed.`, 'success');
      fetchSupabaseData();
    }
  };

  // Cancellation Actions
  const initiateAdminCancel = (b: Booking) => {
    const bookingTime = new Date(b.created_at || '').getTime();
    const currentTime = new Date().getTime();
    const daysElapsed = (currentTime - bookingTime) / (1000 * 60 * 60 * 24);

    const isDispatched =
      (b.status_step && b.status_step >= 2) ||
      ['Dispatched', 'Team Dispatched', 'In Transit', 'On Location', 'Shoot Completed', 'Assets Delivered'].includes(
        b.tracker_status || ''
      );

    if (daysElapsed > 3 || isDispatched) {
      showToast('Policy Limit', 'Time limit exceeded / Team already dispatched.', 'error');
      return;
    }

    setCancelModalData({ show: true, booking: b, reason: '' });
  };

  const confirmAdminCancellation = async () => {
    if (!cancelModalData.booking) return;
    const b = cancelModalData.booking;
    const clientName = b.customer_name || b.user_name || 'Customer';
    const reasonText = cancelModalData.reason.trim() || 'Official cancellation by operations team';

    const cancellerTitle = userRole === 'SUPER_ADMIN' 
      ? 'Super Admin' 
      : `Team Member (${currentMemberName || adminId})`;

    setBookings((prev) =>
      prev.map((item) =>
        item.id === b.id
          ? { ...item, tracker_status: 'Cancelled', shoot_status: 'cancelled', status_step: 0, cancelled_by: cancellerTitle, cancel_reason: reasonText }
          : item
      )
    );

    const { error } = await supabase
      .from('bookings')
      .update({
        tracker_status: 'Cancelled',
        shoot_status: 'cancelled',
        status_step: 0,
        cancelled_by: cancellerTitle,
        cancel_reason: reasonText,
      })
      .eq('id', b.id);

    if (!error) {
      await supabase.from('activity_logs').insert([
        {
          member_name: adminId,
          action_performed: `Cancelled Shoot Booking for ${clientName}. Reason: ${reasonText}`,
        },
      ]);
      setCancelModalData({ show: false, booking: null, reason: '' });
      showToast('Booking Cancelled', `Booking #${b.id} cancelled successfully.`, 'success');
      fetchSupabaseData();
    } else {
      showToast('Error', 'Unable to cancel booking at this moment.', 'error');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4 font-sans">
        <div className="bg-[#18181b] border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl flex flex-col items-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] shrink-0">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <h1 className="text-2xl font-black lowercase tracking-tight">
              <span className="text-cyan-400">i</span>
              <span className="text-white">nstaclick</span>
              <span className="text-white ml-2 font-normal text-lg">login 🔒</span>
            </h1>
          </div>

          {loginError && (
            <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono text-center">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">USER ID</label>
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="owner_instaclick or team_rohan"
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-cyan-400 font-mono"
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
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <button type="submit" className="w-full bg-cyan-400 text-black font-extrabold py-3 rounded-xl hover:bg-cyan-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              Login to Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex font-sans">
      <InactivityHandler onLogout={() => setIsLoggedIn(false)} />  
      
      {/* Toast Notification */}
      {customNotification.show && (
        <div className="fixed top-5 right-5 z-[500] bg-[#18181b] border border-cyan-500/40 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in max-w-sm">
          {customNotification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00E5FF] shrink-0" />}
          {customNotification.type === 'error' && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
          {customNotification.type === 'info' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white uppercase font-mono">{customNotification.title}</h4>
            <p className="text-[11px] text-gray-300 font-mono mt-0.5">{customNotification.message}</p>
          </div>
          <button onClick={() => setCustomNotification({ ...customNotification, show: false })} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalData.show && cancelModalData.booking && (
        <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141416] border border-rose-500/40 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(244,63,94,0.2)]">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" /> Cancel Booking #{cancelModalData.booking.id}
              </h3>
              <button onClick={() => setCancelModalData({ show: false, booking: null, reason: '' })} className="p-1 rounded-lg hover:bg-neutral-800 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-300 font-mono">
              Cancelling for: <strong className="text-white">{cancelModalData.booking.customer_name || cancelModalData.booking.user_name}</strong>
            </p>

            <div>
              <label className="text-[11px] font-mono text-gray-400 block mb-1">Reason for cancellation:</label>
              <textarea
                value={cancelModalData.reason}
                onChange={(e) => setCancelModalData({ ...cancelModalData, reason: e.target.value })}
                placeholder="e.g. Schedule clash, Customer requested change..."
                className="w-full bg-[#0a0a0c] border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-rose-500 font-mono resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalData({ show: false, booking: null, reason: '' })}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-gray-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={confirmAdminCancellation}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.3)] cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-[#141416] border-r border-gray-800 p-6 flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] shrink-0">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <h1 className="text-xl font-black lowercase tracking-tight">
              <span className="text-cyan-400">i</span>
              <span className="text-white">nstaclick</span>
            </h1>
          </div>

          <div className="bg-[#1c1c1f] p-3 rounded-xl mb-6">
            <p className="text-xs text-gray-400">User:</p>
            <p className="text-sm font-bold text-white">{adminId}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-2 inline-block ${userRole === 'SUPER_ADMIN' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-800 text-gray-300'}`}>
              {userRole === 'SUPER_ADMIN' ? '👑 SUPER ADMIN' : '👤 MEMBER'}
            </span>
          </div>

          <nav className="space-y-2 text-sm font-semibold text-gray-300">
            {userRole === 'SUPER_ADMIN' ? (
              <>
                <button onClick={() => setActiveTab('revenue')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'revenue' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📊 1. Revenue & Net Profit
                </button>
                <button onClick={() => setActiveTab('bookings')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'bookings' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📅 2. All Bookings
                </button>
                <button onClick={() => setActiveTab('today_shoots')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'today_shoots' ? 'bg-cyan-400 text-black font-bold' : 'hover:bg-gray-800 text-cyan-400'}`}>
                  🎥 3. SHOOTS SCHEDULE & CALENDAR
                </button>
                <button onClick={() => setActiveTab('tracker')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'tracker' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📍 4. Live Dot Tracker System
                </button>
                <button onClick={() => { setActiveTab('credentials'); fetchSupabaseData(); }} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'credentials' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  🔐 5. Members Credentials & Full Edit
                </button>
                <button onClick={() => { setActiveTab('inquiries'); fetchSupabaseData(); }} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition flex justify-between items-center ${activeTab === 'inquiries' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  <span>📩 6. Contact Forms & Calls Review</span>
                  <span className="text-[10px] bg-cyan-400 text-black font-bold px-1.5 py-0.5 rounded-full font-mono">{inquiries.length}</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setActiveTab('bookings')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'bookings' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📅 1. Assigned Bookings
                </button>
                <button onClick={() => setActiveTab('today_shoots')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'today_shoots' ? 'bg-cyan-400 text-black font-bold' : 'hover:bg-gray-800 text-cyan-400'}`}>
                  🎥 2. SHOOTS SCHEDULE & CALENDAR
                </button>
                <button onClick={() => setActiveTab('tracker')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'tracker' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📍 3. Live Dot Tracker Update
                </button>
                <button onClick={() => { setActiveTab('inquiries'); fetchSupabaseData(); }} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition flex justify-between items-center ${activeTab === 'inquiries' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  <span>📞 4. Contact Forms & Calls Review</span>
                  <span className="text-[10px] bg-cyan-400 text-black font-bold px-1.5 py-0.5 rounded-full font-mono">{inquiries.length}</span>
                </button>
              </>
            )}
          </nav>
        </div>

        <button onClick={() => setIsLoggedIn(false)} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-2.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-red-500/20 transition">
          🔒 Lock Panel
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-8 overflow-y-auto h-screen space-y-6">
        {activeTab !== 'revenue' && (
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Universal Search: Type Mobile No, Name, Address, ID, Package, Tracker, Email or Keyword..."
              className="w-full bg-[#18181b] border border-cyan-500/30 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-cyan-400 outline-none font-mono shadow-xl placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* 📊 1. REVENUE TAB */}
        {activeTab === 'revenue' && userRole === 'SUPER_ADMIN' && (
          <RevenueTab bookings={bookings} isSuperAdmin={true} />
        )}

        {/* 📅 2. BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <BookingsTab
            bookings={bookings}
            todayDate={todayDate}
            onRefresh={fetchSupabaseData}
            onInitiateCancel={initiateAdminCancel}
            searchQuery={searchQuery}
          />
        )}

        {/* 🎥 3. SHOOTS SCHEDULE TAB */}
        {activeTab === 'today_shoots' && (
          <ShootsScheduleTab
            bookings={bookings}
            selectedDate={selectedShootDate}
            onDateChange={setSelectedShootDate}
            onTrackerUpdate={handleTrackerUpdate}
            searchQuery={searchQuery}
          />
        )}

        {/* 📍 4. LIVE TRACKER TAB */}
        {activeTab === 'tracker' && (
          <LiveTrackerTab
            bookings={bookings}
            onTrackerUpdate={handleTrackerUpdate}
            searchQuery={searchQuery}
          />
        )}

        {/* 🔐 5. MEMBERS CREDENTIALS TAB */}
        {activeTab === 'credentials' && userRole === 'SUPER_ADMIN' && (
          <CredentialsTab
            members={members}
            onSaveMember={handleSaveMember}
            onDeleteMember={handleDeleteMember}
            searchQuery={searchQuery}
          />
        )}

        {/* 📩 6. CONTACT FORMS & CALLS REVIEW TAB */}
        {activeTab === 'inquiries' && (
          <InquiriesTab
            inquiries={inquiries}
            onReviewSubmit={handleReviewSubmit}
            onRefresh={fetchSupabaseData}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}