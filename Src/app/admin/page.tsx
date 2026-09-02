
'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { XCircle, CheckCircle2, AlertTriangle, X, Plus, Edit2, Trash2, Key, UserCheck, Search, Send, Lock } from 'lucide-react';
import InactivityHandler from "../components/InactivityHandler";

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
  user_name?: string;
  customer_name?: string;
  phone?: string;
  customer_phone?: string;
  package_name?: string;
  packageName?: string;
  amount?: number;
  total_amount?: number;
  total_price?: number;
  advance_paid?: number;
  event_date?: string;
  eventDate?: string;
  start_time?: string;
  end_time?: string;
  address?: string;
  status?: string;
  status_step?: number;
  tracker_status?: string;
  shoot_status?: string;
  cancelled_by?: string;
  cancel_reason?: string;
  created_at?: string;
}

interface ContactInquiry {
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
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'TODAY' | 'COMPLETED' | 'PENDING' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const todayDate = new Date().toISOString().split('T')[0];
  const [selectedShootDate, setSelectedShootDate] = useState(todayDate);

  // Review Notes State for Contact Inquiries
  const [reviewInputMap, setReviewInputMap] = useState<{ [key: string]: string }>({});

  // Member Management Form States
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memName, setMemName] = useState('');
  const [memUserId, setMemUserId] = useState('');
  const [memPassword, setMemPassword] = useState('');
  const [memMobile, setMemMobile] = useState('');
  const [memGmail, setMemGmail] = useState('');
  const [memRole, setMemRole] = useState<'SUPER_ADMIN' | 'MEMBER'>('MEMBER');

  // Custom UI Modal States
  const [customNotification, setCustomNotification] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({ show: false, title: '', message: '', type: 'info' });
  const [cancelModalData, setCancelModalData] = useState<{ show: boolean; booking: Booking | null; reason: string }>({ show: false, booking: null, reason: '' });

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setCustomNotification({ show: true, title, message, type });
  };

  const fetchSupabaseData = async () => {
    const { data: bData } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (bData) setBookings(bData);

    const { data: mData } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (mData) setMembers(mData);

    const { data: cData } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (cData) setInquiries(cData);

    const { data: lData } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (lData) setLogs(lData);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSupabaseData();

      const channel = supabase
        .channel('realtime_admin_bookings')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          () => {
            fetchSupabaseData();
          }
        )
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

  // 📝 SUBMIT REVIEW NOTE FOR CONTACT INQUIRY
  const handleReviewSubmit = async (contactId: string | number, clientName: string) => {
    const note = reviewInputMap[contactId]?.trim();
    if (!note) {
      showToast('Validation', 'Please write a review note before submitting.', 'info');
      return;
    }

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

  // Member CRUD Actions
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memName || !memUserId || !memPassword) {
      showToast('Validation Error', 'Please fill name, user ID and password.', 'error');
      return;
    }

    if (editingMemberId) {
      const { error } = await supabase
        .from('members')
        .update({
          name: memName,
          user_id: memUserId,
          password: memPassword,
          mobile: memMobile,
          gmail: memGmail,
          role: memRole,
        })
        .eq('id', editingMemberId);

      if (!error) {
        showToast('Updated', `Member ${memName} updated successfully!`, 'success');
        resetMemberForm();
        fetchSupabaseData();
      } else {
        showToast('Error', 'Failed to update member in database.', 'error');
      }
    } else {
      const { error } = await supabase.from('members').insert([
        {
          name: memName,
          user_id: memUserId,
          password: memPassword,
          mobile: memMobile,
          gmail: memGmail,
          role: memRole,
        },
      ]);

      if (!error) {
        showToast('Created', `New member ${memName} added successfully!`, 'success');
        resetMemberForm();
        fetchSupabaseData();
      } else {
        showToast('Error', 'Failed to create member in database.', 'error');
      }
    }
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

  const handleDeleteMember = async (id: string, name: string) => {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (!error) {
      showToast('Deleted', `Member ${name} has been removed.`, 'success');
      fetchSupabaseData();
    } else {
      showToast('Error', 'Could not delete member.', 'error');
    }
  };

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

  const handleTrackerUpdate = async (bookingId: string, newTrackerStatus: string, customerName: string) => {
    let stepNumber = 1;
    if (newTrackerStatus === 'Dispatched' || newTrackerStatus === 'Team Dispatched') stepNumber = 2;
    if (newTrackerStatus === 'In Transit' || newTrackerStatus === 'On Location') stepNumber = 3;
    if (newTrackerStatus === 'Shoot Completed') stepNumber = 4;
    if (newTrackerStatus === 'Assets Delivered') stepNumber = 5;
    if (newTrackerStatus === 'Cancelled') stepNumber = 0;

    const { error } = await supabase
      .from('bookings')
      .update({ 
        tracker_status: newTrackerStatus, 
        shoot_status: newTrackerStatus.toLowerCase(),
        status_step: stepNumber
      })
      .eq('id', bookingId);

    if (!error) {
      const logMsg = `Updated Status for ${customerName} to ${newTrackerStatus}`;
      await supabase.from('activity_logs').insert([{ member_name: adminId, action_performed: logMsg }]);
      showToast('Status Updated', `Tracker status set to ${newTrackerStatus}`, 'success');
      fetchSupabaseData();
    }
  };

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

  const isCancelled = (b: Booking) => b.tracker_status === 'Cancelled' || b.shoot_status === 'cancelled' || b.status === 'Cancelled';
  const isCompleted = (b: Booking) => !isCancelled(b) && (b.tracker_status === 'Assets Delivered' || b.status === 'Completed');
  const isPending = (b: Booking) => !isCancelled(b) && !isCompleted(b);
  const isCreatedToday = (b: Booking) => b.created_at ? b.created_at.split('T')[0] === todayDate : false;

  // 🔍 Universal String Filter Helper
  const filterBySearch = (textArray: (string | number | undefined | null)[]) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return textArray.some((t) => (t !== undefined && t !== null) && t.toString().toLowerCase().includes(query));
  };

  // 1. Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'TODAY' && !isCreatedToday(b)) return false;
    if (bookingFilter === 'COMPLETED' && !isCompleted(b)) return false;
    if (bookingFilter === 'PENDING' && !isPending(b)) return false;
    if (bookingFilter === 'CANCELLED' && !isCancelled(b)) return false;

    return filterBySearch([
      b.customer_name,
      b.user_name,
      b.customer_phone,
      b.phone,
      b.id,
      b.package_name,
      b.packageName,
      b.address,
      b.event_date,
      b.eventDate,
      b.tracker_status,
      b.cancelled_by
    ]);
  });

  // 2. Filtered Scheduled Shoots
  const scheduledShootsForSelectedDate = bookings.filter((b) => {
    const eventDateVal = b.event_date || b.eventDate;
    if (eventDateVal !== selectedShootDate || isCancelled(b)) return false;
    return filterBySearch([b.customer_name, b.user_name, b.customer_phone, b.phone, b.id, b.package_name, b.address, b.tracker_status]);
  });

  // 3. Filtered Tracker Bookings
  const filteredTrackerBookings = bookings.filter((b) =>
    filterBySearch([b.customer_name, b.user_name, b.customer_phone, b.phone, b.id, b.package_name, b.tracker_status, b.address])
  );

  // 4. Filtered Payments Bookings
  const filteredPaymentBookings = bookings.filter((b) =>
    filterBySearch([b.customer_name, b.user_name, b.customer_phone, b.phone, b.id, b.package_name, b.amount, b.total_amount, b.tracker_status])
  );

  // 5. Filtered Members Credentials
  const filteredMembers = members.filter((m) =>
    filterBySearch([m.name, m.user_id, m.mobile, m.gmail, m.role])
  );

  // 6. Filtered Inquiries
  const filteredInquiries = inquiries.filter((iq) =>
    filterBySearch([iq.name, iq.phone, iq.email, iq.message, iq.spoken_by_member, iq.reviewed_by, iq.admin_notes, iq.review_note])
  );

  // 7. Filtered Logs
  const filteredLogs = logs.filter((l) =>
    filterBySearch([l.member_name, l.action_performed, l.created_at])
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4 font-sans">
        <div className="bg-[#18181b] border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl flex flex-col items-center">
          
          {/* 🌟 INSTACLICK LOGIN HEADER WITH LOGO */}
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
      {/* 🌟 Custom Theme Toast Notification */}
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

      {/* 🛑 Custom Theme Cancellation Reason Modal */}
      {cancelModalData.show && cancelModalData.booking && (
        <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141416] border border-rose-500/40 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(244,63,94,0.2)]">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" /> Cancel Booking #{cancelModalData.booking.id}
              </h3>
              <button onClick={() => setCancelModalData({ show: false, booking: null, reason: '' })} className="p-1 rounded-lg hover:bg-neutral-800 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
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
          {/* 🌟 INSTACLICK SIDEBAR HEADER WITH LOGO */}
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
                  📅 2. All Bookings (Filtered A-Z)
                </button>
                <button onClick={() => setActiveTab('today_shoots')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'today_shoots' ? 'bg-cyan-400 text-black font-bold' : 'hover:bg-gray-800 text-cyan-400'}`}>
                  🎥 3. SHOOTS SCHEDULE & CALENDAR
                </button>
                <button onClick={() => setActiveTab('tracker')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'tracker' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📍 4. Live Dot Tracker System
                </button>
                <button onClick={() => setActiveTab('payments')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'payments' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  💳 5. Customer Payments & Dues
                </button>
                <button onClick={() => { setActiveTab('credentials'); fetchSupabaseData(); }} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'credentials' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  🔐 6. Members Credentials & Full Edit
                </button>
                <button onClick={() => setActiveTab('logs')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'logs' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  📜 7. View Member Activity Log
                </button>
                <button onClick={() => { setActiveTab('inquiries'); fetchSupabaseData(); }} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition flex justify-between items-center ${activeTab === 'inquiries' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  <span>📩 8. Contact Forms & Calls Review</span>
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
                <button onClick={() => setActiveTab('payments')} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition ${activeTab === 'payments' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  💳 4. Customer Payments & Dues Check
                </button>
                <button onClick={() => { setActiveTab('inquiries'); fetchSupabaseData(); }} className={`w-full text-left p-2.5 rounded-lg cursor-pointer transition flex justify-between items-center ${activeTab === 'inquiries' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800'}`}>
                  <span>📞 5. Contact Forms & Calls Review</span>
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
        {/* 🔍 UNIVERSAL SEARCH BAR (ALWAYS VISIBLE IN EVERY TAB & ROLE) */}
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

        {/* 2. BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">📅 Bookings Management</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Cancellation Policy: Cancellable within 3 days and strictly before team dispatch.
                </p>
              </div>
              <button 
                onClick={fetchSupabaseData} 
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold cursor-pointer hover:bg-cyan-500/30"
              >
                🔄 Refresh Live Data
              </button>
            </div>

            {/* 5 FILTER CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              <button onClick={() => setBookingFilter('ALL')} className={`p-4 rounded-xl border text-left transition cursor-pointer ${bookingFilter === 'ALL' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-gray-400">ALL Bookings</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </button>

              <button onClick={() => setBookingFilter('TODAY')} className={`p-4 rounded-xl border text-left transition cursor-pointer ${bookingFilter === 'TODAY' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-gray-400">Booked Today</p>
                <p className="text-2xl font-bold text-cyan-400">{bookings.filter(isCreatedToday).length}</p>
              </button>

              <button onClick={() => setBookingFilter('COMPLETED')} className={`p-4 rounded-xl border text-left transition cursor-pointer ${bookingFilter === 'COMPLETED' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">{bookings.filter(isCompleted).length}</p>
              </button>

              <button onClick={() => setBookingFilter('PENDING')} className={`p-4 rounded-xl border text-left transition cursor-pointer ${bookingFilter === 'PENDING' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{bookings.filter(isPending).length}</p>
              </button>

              <button onClick={() => setBookingFilter('CANCELLED')} className={`p-4 rounded-xl border text-left transition cursor-pointer ${bookingFilter === 'CANCELLED' ? 'bg-rose-500/20 border-rose-500' : 'bg-[#18181b] border-gray-800'}`}>
                <p className="text-xs text-rose-400 font-bold">❌ Cancelled</p>
                <p className="text-2xl font-bold text-rose-400">{bookings.filter(isCancelled).length}</p>
              </button>
            </div>

            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-10 border border-gray-800 rounded-2xl text-gray-500 font-mono">
                  No matching bookings found in this filter.
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const clientName = b.customer_name || b.user_name || 'Client';
                  const clientPhone = b.customer_phone || b.phone || 'N/A';
                  const pkgName = b.package_name || b.packageName || 'Shoot Package';
                  const eventDateVal = b.event_date || b.eventDate || 'N/A';
                  const bookingAmt = b.total_amount || b.total_price || b.amount || 0;
                  const orderCancelled = isCancelled(b);

                  return (
                    <div key={b.id} className={`p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4 border transition ${
                      orderCancelled 
                        ? "bg-rose-950/20 border-rose-500/40" 
                        : "bg-[#18181b] border-gray-800 hover:border-cyan-500/40"
                    }`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-white">{clientName} ({clientPhone})</h3>
                          {orderCancelled && (
                            <span className="text-[10px] bg-rose-500 text-white font-mono font-bold px-2 py-0.5 rounded">
                              CANCELLED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Package: <span className="text-gray-200 font-semibold">{pkgName}</span> | Shoot Date: <span className="text-cyan-400 font-bold">{eventDateVal}</span>
                        </p>
                        {b.address && (
                          <p className="text-xs text-gray-300 mt-1">📍 Venue Location: {b.address}</p>
                        )}
                        <p className="text-xs text-green-400 font-bold mt-2">Amount: ₹{bookingAmt.toLocaleString()}</p>
                        
                        {orderCancelled && (
                          <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 font-mono">
                            Cancelled by: <strong className="text-white">{b.cancelled_by || 'User (Customer)'}</strong>
                            {b.cancel_reason && <span className="text-gray-400 text-[11px] block mt-0.5">Reason: {b.cancel_reason}</span>}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs bg-[#0f0f11] p-3 rounded-xl border border-gray-800 text-right">
                          <p className="text-gray-400">Tracker Status:</p>
                          <p className={`font-bold ${orderCancelled ? "text-rose-400" : "text-cyan-400"}`}>
                            {orderCancelled ? "Cancelled" : (b.tracker_status || 'Order Placed')}
                          </p>
                        </div>

                        {!orderCancelled && (
                          <button
                            onClick={() => initiateAdminCancel(b)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            ❌ Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 🔐 6. MEMBERS CREDENTIALS & FULL EDIT TAB */}
        {activeTab === 'credentials' && userRole === 'SUPER_ADMIN' && (
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

            {/* Member Form Modal / Panel */}
            {showMemberForm && (
              <form onSubmit={handleSaveMember} className="bg-[#18181b] border-2 border-cyan-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
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
              {/* Static Super Admin (Owner) Card */}
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

              {/* Dynamic Database Members */}
              {filteredMembers.length === 0 && !filterBySearch(['Super Admin', 'owner_instaclick']) ? (
                <div className="bg-[#18181b] border border-gray-800 p-8 rounded-2xl text-center text-gray-500 font-mono col-span-full">
                  No additional team members found in database. Click "+ Add New Member" above to create one.
                </div>
              ) : (
                filteredMembers.map((m) => (
                  <div key={m.id} className="bg-[#18181b] border border-gray-800 hover:border-cyan-500/40 p-5 rounded-2xl space-y-3 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${m.role === 'SUPER_ADMIN' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-800 text-gray-400'}`}>
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
                          onClick={() => handleDeleteMember(m.id, m.name)}
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
                ))
              )}
            </div>
          </div>
        )}

        {/* 1. REVENUE */}
        {activeTab === 'revenue' && userRole === 'SUPER_ADMIN' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📊 Weekly Revenue & Net Profit</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-400 font-mono">Total Revenue (Active)</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{bookings.filter(b => !isCancelled(b)).reduce((a, b) => a + (Number(b.total_amount || b.total_price || b.amount) || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-400 font-mono">Total Bookings (All)</p>
                <p className="text-2xl font-bold text-cyan-400">{bookings.length}</p>
              </div>
              <div className="bg-[#18181b] p-5 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-400 font-mono">Estimated Net Profit</p>
                <p className="text-2xl font-bold text-emerald-300">
                  ₹{Math.round(bookings.filter(b => !isCancelled(b)).reduce((a, b) => a + (Number(b.total_amount || b.total_price || b.amount) || 0), 0) * 0.4).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. SHOOTS SCHEDULE */}
        {activeTab === 'today_shoots' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-[#18181b] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  🎥 Shoots Schedule & Location Finder
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  Showing shoots for: <span className="text-white font-bold">{selectedShootDate === todayDate ? `TODAY (${todayDate})` : selectedShootDate}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={selectedShootDate}
                  onChange={(e) => setSelectedShootDate(e.target.value)}
                  className="bg-[#0f0f11] border border-cyan-400 text-cyan-300 font-bold text-xs p-2.5 rounded-xl outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              {scheduledShootsForSelectedDate.length === 0 ? (
                <div className="text-center py-12 border border-gray-800 rounded-2xl text-gray-500 font-mono">
                  No active shoots scheduled for {selectedShootDate}.
                </div>
              ) : (
                scheduledShootsForSelectedDate.map((b) => (
                  <div key={b.id} className="bg-[#18181b] border-2 border-cyan-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold bg-cyan-400 text-black px-2 py-0.5 rounded font-mono">
                          DATE: {b.event_date || b.eventDate}
                        </span>
                        <h3 className="text-xl font-extrabold text-white mt-1">{b.customer_name || b.user_name} ({b.customer_phone || b.phone})</h3>
                        <p className="text-xs text-gray-300">Package: <span className="font-bold text-cyan-300">{b.package_name}</span></p>
                      </div>
                      <span className="text-sm font-bold text-cyan-400">{b.tracker_status || 'Order Placed'}</span>
                    </div>

                    <div className="bg-[#0f0f11] p-3 rounded-xl border border-gray-800 text-xs text-gray-300">
                      📍 Venue: {b.address || 'Not specified'}
                    </div>

                    <div className="flex justify-between items-center bg-[#141416] p-3 rounded-xl border border-gray-800">
                      <span className="text-xs text-gray-300 font-bold">Update Tracker:</span>
                      <select
                        value={b.tracker_status || 'Order Placed'}
                        onChange={(e) => handleTrackerUpdate(b.id, e.target.value, b.customer_name || 'Client')}
                        className="bg-[#0f0f11] text-xs p-2 rounded-xl border border-cyan-500 text-cyan-300 font-bold cursor-pointer"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Dispatched">Team Dispatched</option>
                        <option value="In Transit">On Location</option>
                        <option value="Shoot Completed">Shoot Completed</option>
                        <option value="Assets Delivered">Assets Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. TRACKER SYSTEM */}
        {activeTab === 'tracker' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">📍 Live Dot Tracker System</h2>
            {filteredTrackerBookings.map((b) => (
              <div key={b.id} className="bg-[#18181b] border border-gray-800 p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-lg">{b.customer_name || b.user_name} ({b.package_name})</h3>
                  <p className="text-xs text-cyan-400">Current: {b.tracker_status || 'Order Placed'}</p>
                </div>
                <select
                  value={b.tracker_status || 'Order Placed'}
                  onChange={(e) => handleTrackerUpdate(b.id, e.target.value, b.customer_name || 'Client')}
                  className="bg-[#0f0f11] text-xs p-2.5 rounded-xl border border-gray-700 text-white cursor-pointer"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Dispatched">Team Dispatched</option>
                  <option value="In Transit">On Location</option>
                  <option value="Shoot Completed">Shoot Completed</option>
                  <option value="Assets Delivered">Assets Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* 5. PAYMENTS */}
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
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaymentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-800">
                      <td className="p-4 font-bold text-white">{b.customer_name || b.user_name}</td>
                      <td className="p-4">{b.customer_phone || b.phone}</td>
                      <td className="p-4">{b.package_name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${isCancelled(b) ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          {isCancelled(b) ? 'Cancelled' : (b.tracker_status || 'Active')}
                        </span>
                      </td>
                      <td className="p-4 text-green-400 font-semibold">
                        ₹{(b.total_amount || b.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. ACTIVITY LOGS */}
        {activeTab === 'logs' && userRole === 'SUPER_ADMIN' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">📜 Team & Admin Activity Logs</h2>
            <div className="bg-[#18181b] border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#141416] text-gray-400 text-xs uppercase border-b border-gray-800 font-mono">
                  <tr>
                    <th className="p-4">Member / Admin</th>
                    <th className="p-4">Action Performed</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((l) => (
                    <tr key={l.id} className="border-b border-gray-800/50 font-mono text-xs">
                      <td className="p-4 font-bold text-cyan-400">{l.member_name}</td>
                      <td className="p-4 text-white">{l.action_performed}</td>
                      <td className="p-4 text-gray-500">{new Date(l.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 📩 8. CONTACT FORMS & CALLS REVIEW (WITH INTERACTIVE REVIEW INPUT & PERMANENT LOCK) */}
        {activeTab === 'inquiries' && (
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
                onClick={fetchSupabaseData}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold cursor-pointer hover:bg-cyan-500/30 font-mono"
              >
                🔄 Refresh Inquiries
              </button>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="text-center py-10 border border-gray-800 rounded-2xl text-gray-500 font-mono">
                No inquiries matched "{searchQuery}".
              </div>
            ) : (
              filteredInquiries.map((iq) => {
                const noteValue = iq.admin_notes || iq.review_note || '';
                const isReviewed = Boolean(iq.is_reviewed || noteValue.trim());
                const reviewerName = iq.spoken_by_member || iq.reviewed_by || 'Staff';

                return (
                  <div key={iq.id} className="bg-[#18181b] border border-gray-800 hover:border-cyan-500/30 p-5 rounded-2xl space-y-3 transition shadow-lg">
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

                      {/* Status Badge */}
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border font-mono flex items-center gap-1.5 ${
                        isReviewed
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {isReviewed ? '✓ Recorded' : '⏳ Pending Review'}
                      </span>
                    </div>

                    {/* REVIEW SECTION */}
                    {isReviewed ? (
                      /* 🔒 LOCKED VIEW (ALREADY REVIEWED) */
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
                      /* ✍️ EDITABLE SUBMIT VIEW (UNREVIEWED) */
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <label className="text-[11px] font-mono text-gray-400 block">
                          Write Discussion / Call Note:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={reviewInputMap[iq.id] || ''}
                            onChange={(e) => setReviewInputMap({ ...reviewInputMap, [iq.id]: e.target.value })}
                            placeholder="e.g. Discussed packages, client requested wedding quotes..."
                            className="flex-1 bg-[#0f0f11] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                          />
                          <button
                            onClick={() => handleReviewSubmit(iq.id, iq.name)}
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
        )}
      </div>
    </div>
  );
}