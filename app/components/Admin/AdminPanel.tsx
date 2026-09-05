"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import InquiriesTab from "./InquiriesTab";

// 1. टीम मेंबर्स क्रेडेंशियल्स
const INITIAL_TEAM = [
  { id: "owner_admin", name: "Client (Owner)", userId: "owner_instaclick", pass: "Owner#Pass2026", role: "super_admin" },
  { id: "member_1", name: "Team Member 1", userId: "team_rohan", pass: "Rohan@123", role: "member" },
  { id: "member_2", name: "Team Member 2", userId: "team_amit", pass: "Amit@456", role: "member" },
];

// 2. लाइव बुकिंग्स डेटा
const INITIAL_BOOKINGS = [
  {
    id: "INSTA-8942",
    customer_name: "Rahul Sharma",
    customer_phone: "+91 9876543210",
    package_name: "Wedding Cinematic Shoot",
    total_amount: 15000,
    advance_paid: 3000,
    remaining_amount: 12000,
    payment_status: "20_advance",
    shoot_status: "booked",
    event_date: "2026-08-10",
    address: "CP, New Delhi",
    cancellation_reason: "",
    refund_details: "",
    is_refunded: false
  },
  {
    id: "INSTA-4120",
    customer_name: "Ananya Roy",
    customer_phone: "+91 9123456789",
    package_name: "Birthday Party Photography",
    total_amount: 1800,
    advance_paid: 1800,
    remaining_amount: 0,
    payment_status: "100_full",
    shoot_status: "dispatch",
    event_date: "2026-08-05",
    address: "Noida Sector 62",
    cancellation_reason: "",
    refund_details: "",
    is_refunded: false
  },
  {
    id: "INSTA-1029",
    customer_name: "Vikram Malhotra",
    customer_phone: "+91 9988776655",
    package_name: "Corporate Event Shoot",
    total_amount: 8000,
    advance_paid: 1600,
    remaining_amount: 6400,
    payment_status: "20_advance",
    shoot_status: "cancelled",
    event_date: "2026-08-12",
    address: "Gurugram Cyber City",
    cancellation_reason: "Plan changed / Event rescheduled",
    refund_details: "UPI: vikram@okicici",
    is_refunded: false
  }
];

// OWNER TABS CONFIG
const OWNER_TABS = [
  { id: "dashboard", name: "📊 1. Revenue & Net Profit" },
  { id: "bookings", name: "📅 2. Active Bookings & Dues" },
  { id: "calendar", name: "🎥 3. SHOOTS SCHEDULE & CALENDAR" },
  { id: "tracker", name: "📍 4. Live Dot Tracker System" },
  { id: "cancelled", name: "❌ 5. Cancelled Orders & Refunds" },
  { id: "team", name: "🔐 6. Members Credentials & Full Edit" },
  { id: "logs", name: "📜 7. View Member Activity Log" },
  { id: "contact_reviews", name: "📩 8. Contact Forms & Calls Review" },
];

// MEMBER TABS CONFIG
const MEMBER_TABS = [
  { id: "bookings", name: "📋 1. Assigned Bookings" },
  { id: "calendar", name: "🎥 2. SHOOTS SCHEDULE & CALENDAR" },
  { id: "tracker", name: "📍 3. Live Dot Tracker Update" },
  { id: "dues", name: "💳 4. Customer Payments & Dues Check" },
  { id: "contact_reviews", name: "📞 5. Contact Forms & Calls Review" },
];

export default function AdminPanel() {
  const [inputUserId, setInputUserId] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<any>({ userId: "owner_instaclick", role: "super_admin" });
  const [activeTab, setActiveTab] = useState("contact_reviews");

  const [teamState, setTeamState] = useState(INITIAL_TEAM);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  // 📥 SUPABASE FETCH FUNCTION
  const fetchDataFromSupabase = async () => {
    setIsLoadingContacts(true);
    try {
      const { data: contactData, error: cErr } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (cErr) {
        console.error("Supabase Contacts Error:", cErr);
      } else if (contactData) {
        setContacts(contactData);
      }

      const { data: logsData } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (logsData) setActivityLogs(logsData);
    } catch (err) {
      console.error("Supabase Fetch Exception:", err);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchDataFromSupabase();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = teamState.find(
      (u) => u.userId.trim() === inputUserId.trim() && u.pass === inputPassword
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setInputUserId("");
      setInputPassword("");
      fetchDataFromSupabase();
    } else {
      alert("गलत ID या Password ❌ कृपया सही जानकारी डालें!");
    }
  };

  const handleUpdateCredentials = (id: string, newUserId: string, newPass: string) => {
    setTeamState(prev => prev.map(member => {
      if (member.id === id) {
        return { ...member, userId: newUserId, pass: newPass };
      }
      return member;
    }));
    alert("एक्सेस क्रेडेंशियल्स अपडेट हो गए हैं! ✅");
  };

  const handleUpdateShootStatus = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(item => {
      if (item.id === bookingId) {
        return { ...item, shoot_status: newStatus };
      }
      return item;
    }));
    alert(`Booking #${bookingId} Status Updated to '${newStatus.toUpperCase()}' ✅`);
  };

  const handleMarkCashPaid = (bookingId: string) => {
    setBookings(prev => prev.map(item => {
      if (item.id === bookingId) {
        return {
          ...item,
          advance_paid: item.total_amount,
          remaining_amount: 0,
          payment_status: "100_full"
        };
      }
      return item;
    }));
    alert(`Booking #${bookingId} Remaining Amount Marked Paid via Cash/QR! 🎉`);
  };

  const handleMarkRefunded = (bookingId: string) => {
    setBookings(prev => prev.map(item => {
      if (item.id === bookingId) {
        return { ...item, is_refunded: true };
      }
      return item;
    }));
    alert(`Refund for Booking #${bookingId} marked as SENT! 💸`);
  };

  // 📝 REVIEW SAVE AND LOCK HANDLER
  const handleSaveContactReview = async (contactId: string, customerName: string, reviewNotes: string) => {
    if (!reviewNotes.trim()) {
      alert("Please enter review/call notes!");
      return;
    }

    const reviewerName = currentUser?.name || currentUser?.userId || "Admin";

    // 1. Update State Locally immediately
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          admin_notes: reviewNotes,
          status: "Reviewed",
          reviewed_by: reviewerName,
          reviewed_at: new Date().toISOString(),
          is_reviewed: true
        };
      }
      return c;
    }));

    // 2. Sync to Supabase
    try {
      await supabase
        .from("contacts")
        .update({
          admin_notes: reviewNotes,
          status: "Reviewed",
          reviewed_by: reviewerName,
          reviewed_at: new Date().toISOString(),
          is_reviewed: true
        })
        .eq("id", contactId);

      await supabase.from("activity_logs").insert([
        {
          member_name: reviewerName,
          action: "Reviewed Inquiry & Locked Entry",
          customer_name: customerName,
          notes: reviewNotes
        }
      ]);
    } catch (err) {
      console.error("Supabase Review Save Error:", err);
    }

    alert("🎉 Review saved & entry permanently locked!");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
        <form onSubmit={handleLogin} className="bg-[#111] p-10 rounded-2xl shadow-2xl border border-zinc-800 text-center w-full max-w-md">
          <h2 className="text-3xl font-black text-white mb-2">Instaclick</h2>
          <p className="text-gray-400 mb-8">Admin / Member Login Panel 🔒</p>

          <div className="text-left mb-4">
            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">ADMIN / MEMBER ID</label>
            <input
              type="text"
              placeholder="e.g. owner_instaclick or team_rohan"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full bg-black text-white border border-zinc-700 p-3.5 rounded-xl text-base focus:outline-none focus:border-[#00E5FF] transition-colors"
              required
            />
          </div>

          <div className="text-left mb-6">
            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">PASSWORD</label>
            <input
              type="password"
              placeholder="Enter password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full bg-black text-white border border-zinc-700 p-3.5 rounded-xl text-base focus:outline-none focus:border-[#00E5FF] transition-colors"
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#00E5FF] text-black font-bold text-lg py-4 rounded-xl hover:bg-cyan-400 transition-transform active:scale-95">
            Login to Panel
          </button>
        </form>
      </div>
    );
  }

  const activeBookings = bookings.filter(b => b.shoot_status !== "cancelled");
  const cancelledBookings = bookings.filter(b => b.shoot_status === "cancelled");
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.shoot_status !== 'cancelled' ? b.advance_paid : 0), 0);

  const displayTabs = currentUser.role === "super_admin" ? OWNER_TABS : MEMBER_TABS;

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      
      {/* Sidebar */}
      <div className="w-72 bg-[#0a0a0a] border-r border-zinc-800 p-6 flex flex-col h-screen sticky top-0">
        <div>
          <h2 className="text-3xl font-black text-[#00E5FF] mb-1 tracking-wider flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#00E5FF]"></span> instaclick
          </h2>
          <div className="mb-6 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 mt-4">
            <p className="text-xs text-gray-400">User:</p>
            <p className="text-sm font-bold text-white">{currentUser.userId}</p>
            <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${currentUser.role === 'super_admin' ? 'bg-cyan-500/20 text-[#00E5FF]' : 'bg-purple-500/20 text-purple-300'}`}>
              {currentUser.role === 'super_admin' ? '👑 SUPER ADMIN' : '👤 MEMBER'}
            </span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {displayTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                fetchDataFromSupabase();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-xs font-bold tracking-wide flex justify-between items-center ${
                activeTab === tab.id 
                  ? "bg-cyan-950/60 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.15)]" 
                  : "text-gray-300 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span>{tab.name}</span>
              {tab.id === "cancelled" && cancelledBookings.length > 0 && (
                <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {cancelledBookings.length}
                </span>
              )}
              {tab.id === "contact_reviews" && (
                <span className="text-[10px] bg-[#00E5FF] text-black px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {contacts.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setCurrentUser(null)} 
          className="mt-auto flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 py-3 rounded-xl font-bold transition-colors text-xs border border-red-500/20"
        >
          🔒 Lock Panel
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-black overflow-y-auto h-screen space-y-6">
        
        {/* Universal Search Bar */}
        <div className="w-full bg-[#0d0d0d] border border-zinc-800 rounded-xl p-3 text-xs text-gray-400 flex items-center justify-between">
          <span>🔍 Universal Search: Type Mobile No., Client Name, Address or ID...</span>
          <span className="text-xs font-mono font-bold text-gray-400 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
            Total Revenue: <strong className="text-emerald-400">₹{totalRevenue.toLocaleString()}</strong>
          </span>
        </div>

        {/* 📩 CONTACT FORMS & CALL REVIEW TAB */}
        {activeTab === "contact_reviews" && (
          <InquiriesTab
            inquiries={contacts}
            currentUserId={currentUser.userId}
            onUpdateInquiry={handleSaveContactReview}
            onRefresh={fetchDataFromSupabase}
            isLoading={isLoadingContacts}
          />
        )}

        {/* 📅 ACTIVE BOOKINGS & DUES TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-white border-b border-zinc-800 pb-4">
              📅 Active Bookings & Dues
            </h1>
            
            <div className="grid grid-cols-1 gap-4">
              {activeBookings.map((b) => (
                <div key={b.id} className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-2xl space-y-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-xs font-mono text-[#00E5FF] font-bold">{b.id}</span>
                      <h3 className="text-lg font-bold text-white">{b.package_name}</h3>
                      <p className="text-xs text-gray-400">
                        Customer: <strong className="text-white">{b.customer_name}</strong> | Phone: <strong className="text-cyan-400 font-mono">{b.customer_phone}</strong>
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-xs text-gray-400 block font-mono">Event Date: {b.event_date}</span>
                      <span className="text-xs text-gray-500 block">Address: {b.address}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 gap-3">
                    <div>
                      <div className="text-xs font-mono text-gray-400 space-x-3">
                        <span>Total: <strong>₹{b.total_amount.toLocaleString()}</strong></span>
                        <span>Advance Paid: <strong className="text-emerald-400">₹{b.advance_paid.toLocaleString()}</strong></span>
                      </div>

                      <div className="mt-1">
                        {b.remaining_amount === 0 || b.payment_status === "100_full" ? (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                            ✓ 100% FULL PAYMENT COMPLETED (NO DUES)
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                            ⚠️ REMAINING DUES: ₹{b.remaining_amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {b.remaining_amount > 0 && (
                      <button
                        onClick={() => handleMarkCashPaid(b.id)}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all"
                      >
                        💵 Mark Cash/QR Paid (Clear Dues)
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs font-mono text-gray-400 font-bold">Update Live Tracker:</span>
                    <div className="flex flex-wrap gap-2">
                      {["booked", "dispatch", "location", "completed"].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateShootStatus(b.id, st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                            b.shoot_status === st
                              ? "bg-[#00E5FF] text-black shadow-[0_0_10px_#00E5FF]"
                              : "bg-zinc-900 text-gray-400 border border-zinc-800 hover:text-white"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ❌ CANCELLED BOOKINGS & REFUNDS TAB */}
        {activeTab === "cancelled" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-white border-b border-zinc-800 pb-4">
              ❌ Cancelled Orders & Refunds
            </h1>

            {cancelledBookings.length === 0 ? (
              <div className="text-center py-16 bg-[#0a0a0a] border border-zinc-800 rounded-2xl text-gray-500">
                No cancelled bookings right now. 🎉
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cancelledBookings.map((b) => (
                  <div key={b.id} className="bg-[#0a0a0a] border border-rose-500/30 p-6 rounded-2xl space-y-4 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                      <div>
                        <span className="text-xs font-mono text-rose-400 font-bold">{b.id} (CANCELLED)</span>
                        <h3 className="text-lg font-bold text-white">{b.package_name}</h3>
                        <p className="text-xs text-gray-400">Customer: {b.customer_name} | Phone: {b.customer_phone}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                        ADVANCE TO REFUND: ₹{b.advance_paid.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div>
                        <span className="text-[10px] text-gray-500 font-mono block uppercase">Cancellation Reason:</span>
                        <span className="text-xs font-bold text-amber-300">{b.cancellation_reason || "Reason not specified"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-mono block uppercase">Customer Refund Credentials (UPI / Bank):</span>
                        <span className="text-xs font-bold text-cyan-400 font-mono">{b.refund_details || "No details submitted"}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-400 font-mono">
                        Status: {b.is_refunded ? <strong className="text-emerald-400">✓ REFUND SENT</strong> : <strong className="text-amber-400">⌛ REFUND PENDING</strong>}
                      </span>

                      {!b.is_refunded ? (
                        <button
                          onClick={() => handleMarkRefunded(b.id)}
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all"
                        >
                          ✓ Mark Refund Processed
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 📜 ACTIVITY LOGS TAB */}
        {activeTab === "logs" && currentUser.role === "super_admin" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-white border-b border-zinc-800 pb-4">
              📜 View Member Activity Log
            </h1>

            {activityLogs.length === 0 ? (
              <div className="text-center py-16 bg-[#0a0a0a] border border-zinc-800 rounded-2xl text-gray-500">
                No activity logs recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#00E5FF]">{log.member_name}</span>
                        <span className="text-xs text-gray-400">{log.action} for customer</span>
                        <span className="text-xs font-bold text-white font-mono">{log.customer_name}</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1 italic">"{log.notes}"</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🔐 ACCESS & PASSWORDS TAB */}
        {activeTab === "team" && currentUser.role === "super_admin" && (
          <div className="max-w-2xl space-y-4">
            <h1 className="text-2xl font-black text-[#00E5FF] border-b border-zinc-800 pb-4">
              🔐 Manage Team Access & Passwords
            </h1>
            
            <div className="space-y-4">
              {teamState.map((m) => (
                <div key={m.id} className="p-5 bg-[#0a0a0a] rounded-2xl border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-lg text-white">{m.name}</span>
                    <span className="text-xs bg-zinc-800 text-gray-300 px-3 py-1 rounded-md uppercase font-bold">{m.role}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">User ID</label>
                      <input 
                        type="text" 
                        defaultValue={m.userId}
                        id={`id-${m.id}`}
                        className="w-full bg-zinc-900 border border-zinc-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Password</label>
                      <input 
                        type="text" 
                        defaultValue={m.pass}
                        id={`pass-${m.id}`}
                        className="w-full bg-zinc-900 border border-zinc-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      const newId = (document.getElementById(`id-${m.id}`) as HTMLInputElement).value;
                      const newPass = (document.getElementById(`pass-${m.id}`) as HTMLInputElement).value;
                      handleUpdateCredentials(m.id, newId, newPass);
                    }}
                    className="mt-4 bg-zinc-800 hover:bg-[#00E5FF] hover:text-black text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTHER TABS PLACEHOLDER */}
        {activeTab !== "contact_reviews" && activeTab !== "bookings" && activeTab !== "cancelled" && activeTab !== "logs" && activeTab !== "team" && (
          <div className="bg-[#0a0a0a] border border-zinc-800 p-12 rounded-2xl text-center text-gray-400 space-y-2">
            <h2 className="text-xl font-bold text-white">{displayTabs.find(t => t.id === activeTab)?.name}</h2>
            <p className="text-xs">Logged in as <strong className="text-[#00E5FF]">{currentUser.userId}</strong>.</p>
          </div>
        )}

      </div>

    </div>
  );
}