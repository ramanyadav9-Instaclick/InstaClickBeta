"use client";
import React, { useState } from "react";

// डिफॉल्ट मेंबर्स और उनके कस्टम आईडी/पासवर्ड्स (बाद में Supabase 'admin_users' टेबल से लिंक होंगे)
const INITIAL_TEAM = [
  { id: "owner_admin", name: "Client (Owner)", userId: "owner_instaclick", pass: "Owner#Pass2026", role: "super_admin" },
  { id: "member_1", name: "Team Member 1", userId: "team_rohan", pass: "Rohan@123", role: "member" },
  { id: "member_2", name: "Team Member 2", pass: "Amit@456", userId: "team_amit", role: "member" },
];

const TABS = [
  { id: "dashboard", name: "📊 Dashboard" },
  { id: "signups", name: "👥 Signups / Registered Users" },
  { id: "bookings", name: "📅 Bookings" },
  { id: "payments", name: "💳 Payments" },
  { id: "services", name: "📷 Services" },
  { id: "messages", name: "📩 Messages" },
  { id: "team", name: "🔐 Access & Passwords (Owner Only)" },
];

export default function AdminPanel() {
  const [inputUserId, setInputUserId] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // टीम का लोकल स्टेट (जिसे ऑनर एडिट कर सकता है)
  const [teamState, setTeamState] = useState(INITIAL_TEAM);

  // लॉगिन वेरिफिकेशन
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // यूज़र ID और पासवर्ड दोनों मैच करना
    const foundUser = teamState.find(
      (u) => u.userId.trim() === inputUserId.trim() && u.pass === inputPassword
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setInputUserId("");
      setInputPassword("");
    } else {
      alert("गलत ID या Password ❌ कृपया सही जानकारी डालें!");
    }
  };

  // ऑनर द्वारा नया पासवर्ड/आईडी अपडेट करना
  const handleUpdateCredentials = (id: string, newUserId: string, newPass: string) => {
    setTeamState(prev => prev.map(member => {
      if (member.id === id) {
        return { ...member, userId: newUserId, pass: newPass };
      }
      return member;
    }));
    alert("एक्सेस क्रेडेंशियल्स अपडेट हो गए हैं! ✅");
  };

  // 1. Login Screen (Alphanumeric Support)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
        <form onSubmit={handleLogin} className="bg-[#111] p-10 rounded-2xl shadow-2xl border border-zinc-800 text-center w-full max-w-md">
          <h2 className="text-3xl font-black text-white mb-2">Instaclick</h2>
          <p className="text-gray-400 mb-8">Admin Login Panel 🔒</p>

          {/* ID Input */}
          <div className="text-left mb-4">
            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">ADMIN / MEMBER ID</label>
            <input
              type="text"
              placeholder="e.g. owner_instaclick"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full bg-black text-white border border-zinc-700 p-3.5 rounded-xl text-base focus:outline-none focus:border-[#00E5FF] transition-colors"
              required
            />
          </div>

          {/* Password Input */}
          <div className="text-left mb-6">
            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">PASSWORD</label>
            <input
              type="password"
              placeholder="e.g. Owner#Pass2026"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full bg-black text-white border border-zinc-700 p-3.5 rounded-xl text-base focus:outline-none focus:border-[#00E5FF] transition-colors"
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#00E5FF] text-black font-bold text-lg py-4 rounded-xl hover:bg-cyan-400 transition-transform active:scale-95">
            Login to Admin Panel
          </button>
        </form>
      </div>
    );
  }

  // 2. Main Admin Dashboard
  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      
      {/* Sidebar */}
      <div className="w-72 bg-[#0a0a0a] border-r border-zinc-800 p-6 flex flex-col h-screen sticky top-0">
        <div>
          <h2 className="text-3xl font-black text-[#00E5FF] mb-1 tracking-wider">ADMIN.</h2>
          <div className="mb-8 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
            <p className="text-xs text-gray-400">Logged in as:</p>
            <p className="text-sm font-bold text-white">{currentUser.name}</p>
            <p className="text-[11px] text-gray-500 font-mono">ID: {currentUser.userId}</p>
            <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${currentUser.role === 'super_admin' ? 'bg-cyan-500/20 text-[#00E5FF]' : 'bg-gray-800 text-gray-300'}`}>
              {currentUser.role === 'super_admin' ? '👑 Owner' : '👨‍💼 Member'}
            </span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {TABS.map((tab) => {
            if (tab.id === "team" && currentUser.role !== "super_admin") return null;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold tracking-wide ${
                  activeTab === tab.id 
                    ? "bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]" 
                    : "text-gray-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>

        <button 
          onClick={() => setCurrentUser(null)} 
          className="mt-auto flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 py-3 rounded-xl font-bold transition-colors text-sm border border-red-500/20"
        >
          🚪 Lock Panel
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-black overflow-y-auto h-screen">
        <h1 className="text-3xl font-black text-white mb-8 border-b border-zinc-800 pb-6">
          {TABS.find(t => t.id === activeTab)?.name}
        </h1>

        {/* Access & Passwords Tab (Owner Only) */}
        {activeTab === "team" && (
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-[#00E5FF] mb-2">🔐 Manage Team Access & Passwords</h3>
            <p className="text-sm text-gray-400 mb-6">यहाँ से आप किसी भी मेंबर की ID और Alphabetic/Symbolic Password चेंज कर सकते हैं।</p>
            
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

        {activeTab !== "team" && (
          <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-2xl text-center text-gray-400">
            आप <strong className="text-[#00E5FF]">{currentUser.name}</strong> के रूप में सुरक्षित तरीके से लॉगिन हैं।
          </div>
        )}
      </div>

    </div>
  );
}