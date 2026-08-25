"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, X, Send, User, Sparkles, MessageCircle, LogOut, Bot } from "lucide-react";

interface FloatingWidgetsProps {
  cartCount: number;
  showToastBubble: boolean;
  setShowToastBubble: (show: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
}

interface ChatOption {
  label: string;
  action: string;
}

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
  options?: ChatOption[];
  showWhatsApp?: boolean;
}

export default function FloatingWidgets({
  cartCount,
  showToastBubble,
  setShowToastBubble,
  setIsCartOpen,
}: FloatingWidgetsProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // States for Language, Name & Step Tracking
  const [language, setLanguage] = useState<"hi" | "en" | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Initial Language Selection Message
  const getInitialMessage = (): ChatMessage => ({
    sender: "bot",
    text: "Hello! This is Subhi, 👋 Welcome to instaclick.\nBefore we proceed, please select your preferred language:\n\nआगे बढ़ने से पहले कृपया अपनी पसंदीदा भाषा चुनें:",
    options: [
      { label: "🇮🇳 हिंदी (Hindi)", action: "lang_hi" },
      { label: "🇬🇧 English", action: "lang_en" },
    ],
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);

  // 📜 Auto-Scroll to Bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 🔄 Reset Chat Function
  const resetChat = () => {
    setLanguage(null);
    setUserName(null);
    setMessages([getInitialMessage()]);
    setInputMsg("");
    setIsLoading(false);
  };

  // ⏱️ 90-Seconds Inactivity Timer Engine
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      resetChat();
    }, 90000); // 90 Seconds
  };

  useEffect(() => {
    if (isChatOpen) {
      resetInactivityTimer();
    } else {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isChatOpen, messages]);

  // Auto-hide toast bubble
  useEffect(() => {
    if (showToastBubble) {
      const timer = setTimeout(() => setShowToastBubble(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToastBubble, setShowToastBubble]);

  // 📋 Main Categories Generator based on Language
  const getMainCategoryOptions = (lang: "hi" | "en"): ChatOption[] => {
    if (lang === "hi") {
      return [
        { label: "📸 फोटोग्राफी कार्ड (Photography)", action: "card_photo" },
        { label: "🎥 वीडियोग्राफी कार्ड (Videography)", action: "card_video" },
        { label: "🚁 ड्रोन कवरेज कार्ड (Drone)", action: "card_drone" },
        { label: "🎉 इवेंट्स कवरेज कार्ड (Events)", action: "card_events" },
        { label: "💳 20% एडवांस बुकिंग नियम", action: "card_advance" },
        { label: "⚠️ कैंसिलेशन पॉलिसी (12 घंटे)", action: "card_cancel" },
        { label: "📍 लाइव शूट ट्रैकर कैसे देखें?", action: "card_tracker" },
      ];
    }
    return [
      { label: "📸 Photography ", action: "card_photo" },
      { label: "🎥 Videography ", action: "card_video" },
      { label: "🚁 Drone Coverage ", action: "card_drone" },
      { label: "🎉 Events Coverage ", action: "card_events" },
     
      { label: "⚠️ Cancellation Policy", action: "card_cancel" },
      { label: "📍 Live Shoot Tracking Info", action: "card_tracker" },
    ];
  };

  // 🤖 Trigger AI Query Call
  const triggerAiResponse = async (userQuery: string, currentChatList: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${language === "hi" ? "[Respond in Hindi] " : "[Respond in English] "}${userQuery}`,
          history: currentChatList.slice(-6),
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply, showWhatsApp: true }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: language === "hi"
              ? "माफ़ कीजिए, सर्वर कनेक्ट नहीं हो पा रहा है। कृपया व्हाट्सएप पर संपर्क करें।"
              : "I am having trouble connecting right now. Please reach out via WhatsApp.",
            showWhatsApp: true,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: language === "hi"
            ? "कनेक्शन एरर। कृपया दोबारा प्रयास करें या व्हाट्सएप पर संपर्क करें।"
            : "Connection error. Please try again or chat with us on WhatsApp.",
          showWhatsApp: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🎮 User Interaction Handler (Steps + Cards + AI)
  const handleUserInteraction = async (text: string, customAction?: string) => {
    resetInactivityTimer();
    if (!text.trim()) return;

    const action = customAction || "";

    // STEP 1: LANGUAGE SELECTION
    if (!language) {
      if (action === "lang_hi" || text.includes("हिंदी")) {
        setLanguage("hi");
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: "🇮🇳 हिंदी" },
          { sender: "bot", text: "नमस्ते! 🙏 instaclick में आपका स्वागत है।\nआगे बढ़ने से पहले कृपया अपना शुभ नाम बताइए?" },
        ]);
      } else {
        setLanguage("en");
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: "🇬🇧 English" },
          { sender: "bot", text: "Great! Welcome to instaclick.\nBefore we proceed, could you please tell me your name?" },
        ]);
      }
      return;
    }

    // STEP 2: NAME CAPTURE
    if (!userName) {
      setUserName(text);
      const isHi = language === "hi";
      const welcomeText = isHi
        ? `नमस्ते ${text} जी! 🙏\nआप नीचे दिए गए विकल्पों में से चुन सकते हैं या कुछ भी टाइप करके पूछ सकते हैं:`
        : `Hi ${text}! 👋\nYou can explore our service cards below or type any custom query:`;

      setMessages((prev) => [
        ...prev,
        { sender: "user", text },
        {
          sender: "bot",
          text: welcomeText,
          options: getMainCategoryOptions(language),
        },
      ]);
      return;
    }

    // If User Clicked an Action/Card Button
    if (action) {
      const newMessagesList: ChatMessage[] = [...messages, { sender: "user", text }];
      setMessages(newMessagesList);

      // CATEGORY CARDS
      if (action === "card_photo") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: language === "hi" ? "📸 फोटोग्राफी के अंतर्गत सब-पैकेजेस:" : "📸 Sub-Packages under Photography:",
            options: [
              { label: "👶 Baby Shoot", action: "pkg_photo_baby" },
              { label: "💍 Wedding Shoot", action: "pkg_photo_wedding" },
              { label: "👩‍❤️‍👨 Pre Wedding", action: "pkg_photo_prewedding" },
              { label: "🤰 Maternity", action: "pkg_photo_maternity" },
              { label: "💃 Fashion Portfolio", action: "pkg_photo_fashion" },
              { label: "📦 Product Shoot", action: "pkg_photo_product" },
              { label: "💍 Engagement Cover", action: "pkg_photo_engagement" },
              { label: "🎬 Outdoor Cinematic", action: "pkg_photo_outdoor" },
            ],
          },
        ]);
      } else if (action === "card_video") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: language === "hi" ? "🎥 वीडियोग्राफी के अंतर्गत सब-पैकेजेस:" : "🎥 Sub-Packages under Videography:",
            options: [
              { label: "🎬 Wedding Film", action: "pkg_video_wedding" },
              { label: "📹 Cinematic Video", action: "pkg_video_cinematic" },
              { label: "🏢 Corporate Film", action: "pkg_video_corporate" },
              { label: "📱 Reel Shoot", action: "pkg_video_reel" },
              { label: "🎵 Music Video", action: "pkg_video_music" },
            ],
          },
        ]);
      } else if (action === "card_drone") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: language === "hi" ? "🚁 ड्रोन कवरेज के अंतर्गत सब-पैकेजेस:" : "🚁 Sub-Packages under Drone Coverage:",
            options: [
              { label: "🚁 Wedding Drone", action: "pkg_drone_wedding" },
              { label: "🏨 Resort Feature", action: "pkg_drone_resort" },
              { label: "🏢 Real Estate Drone", action: "pkg_drone_realestate" },
              { label: "🚜 Farm Shoot", action: "pkg_drone_farm" },
              { label: "🏗️ Construction Cam", action: "pkg_drone_construction" },
            ],
          },
        ]);
      } else if (action === "card_events") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: language === "hi" ? "🎉 इवेंट्स कवरेज के अंतर्गत सब-पैकेजेस:" : "🎉 Sub-Packages under Events Coverage:",
            options: [
              { label: "🎓 Annual Function", action: "pkg_events_annual" },
              { label: "🎂 Birthday Bash", action: "pkg_events_birthday" },
              { label: "🥂 Anniversary Cover", action: "pkg_events_anniversary" },
              { label: "💼 Corporate Summit", action: "pkg_events_summit" },
              { label: "🎸 Live Concert Festival", action: "pkg_events_concert" },
            ],
          },
        ]);
      } else if (action === "card_advance") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: language === "hi"
              ? "💳 **20% एडवांस बुकिंग नियम:**\n\n• ₹2,000 या उससे कम के पैकेज पर 100% टोकन लगता है।\n• ₹2,000 से ऊपर के पैकेज पर केवल 20% एडवांस देकर स्लॉट बुक किया जा सकता है।\n\nबाकी पेमेंट शूट के दिन की जा सकती है।"
              : "💳 **20% Advance Payment Rule:**\n\n• Bookings ≤ ₹2,000 require 100% token.\n• Bookings > ₹2,000 require only 20% advance to lock your date!\n\nBalance is payable on shoot day.",
            showWhatsApp: true,
          },
        ]);
      } else if (action === "card_cancel") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: language === "hi"
              ? "⚠️ **कैंसिलेशन पॉलिसी:**\n\nबुकिंग के 12 घंटे के भीतर और टीम डिस्पैच होने से पहले कैंसिलेशन 100% फ्री है। ट्रैकिंग पेज से 1-क्लिक में कैंसिल कर सकते हैं।"
              : "⚠️ **Cancellation Policy:**\n\nFree cancellation is strictly available within 12 hours of booking and before team dispatch directly from your live tracking page.",
            showWhatsApp: true,
          },
        ]);
      } else if (action === "card_tracker") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: language === "hi"
              ? "📍 **लाइव शूट ट्रैकर:**\n\nलॉगिन करने के बाद नेवबार में 'Live Shoot Tracking' पर क्लिक करें। आपका शूट 5 स्टेजेस में लाइव ट्रैक होता है:\n1. Booked ➔ 2. Dispatched ➔ 3. On Location ➔ 4. Completed ➔ 5. Delivered"
              : "📍 **Live Shoot Tracker:**\n\nLogin and click 'Live Shoot Tracking' in Navbar. Your shoot is tracked across 5 real-time stages:\n1. Booked ➔ 2. Dispatched ➔ 3. On Location ➔ 4. Completed ➔ 5. Delivered",
            showWhatsApp: true,
          },
        ]);
      } else if (action.startsWith("pkg_")) {
        triggerAiResponse(`Give brief info and booking token cost for package: ${text}`, newMessagesList);
      }
      return;
    }

    // STEP 3: CUSTOM TYPED QUERY -> SEND TO REAL GEMINI AI
    const updatedMessages: ChatMessage[] = [...messages, { sender: "user", text }];
    setMessages(updatedMessages);
    setInputMsg("");
    triggerAiResponse(text, updatedMessages);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[220] flex flex-col items-end space-y-4 pointer-events-none font-sans">
      
      {/* 🟢 Cyber Toast Capsule */}
      {showToastBubble && cartCount > 0 && (
        <div className="pointer-events-auto flex items-center justify-between bg-black/90 border border-[#00E5FF]/40 px-5 py-3 rounded-full shadow-[0_0_30px_rgba(0,229,255,0.3)] animate-bounce text-xs font-mono max-w-sm w-72">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <p className="text-white font-bold">
              <span className="text-[#00E5FF]">{cartCount} Item</span> added to cart
            </p>
          </div>
          <button 
            onClick={() => {
              setIsCartOpen(true);
              setShowToastBubble(false);
            }}
            className="flex items-center space-x-1 text-[#00E5FF] hover:text-white transition-colors font-black uppercase tracking-wider text-[10px]"
          >
            <span>View Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 🤖 AI CHATBOT MODAL WINDOW */}
      {isChatOpen && (
        <div className="pointer-events-auto w-80 sm:w-96 bg-[#0a0a0a] border border-[#00E5FF]/30 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col h-[520px] transition-all animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header - Fixed Name Alignment without space */}
          <div className="bg-zinc-900/90 border-b border-zinc-800 p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 p-0.5 shadow-[0_0_12px_rgba(0,229,255,0.5)] shrink-0">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center tracking-tight">
                  <span className="text-[#00E5FF]">i</span>nstaclick AI
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] ml-1" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Assistant (90s Inactivity)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Reset Chat"
                className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-black/60 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`flex items-start gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  
                  {/* Bot Logo Icon on Left */}
                  {m.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 p-0.5 shrink-0 mt-0.5">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                      m.sender === "user"
                        ? "bg-[#00E5FF] text-black font-semibold rounded-tr-none"
                        : "bg-zinc-900 border border-zinc-800 text-gray-200 rounded-tl-none shadow-md"
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* User Icon on Right */}
                  {m.sender === "user" && (
                    <div className="w-6 h-6 rounded-full bg-zinc-800 text-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Sub-Card & Action Options */}
                {m.options && m.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-8 max-w-[85%]">
                    {m.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleUserInteraction(opt.label, opt.action)}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-[#00E5FF] hover:text-black text-[#00E5FF] border border-[#00E5FF]/30 text-[11px] font-bold rounded-xl transition-all shadow-sm active:scale-95 text-left cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* WhatsApp Help Button if Bot answers custom/booking query */}
                {m.showWhatsApp && (
                  <div className="mt-2 ml-8">
                    <a
                      href="https://wa.me/7982776458?text=Hey%2C%20I%20have%20a%20query%20about%20instaclick%20shoots!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[11px] rounded-xl inline-flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(37,211,102,0.3)]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      Chat on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ))}

            {/* AI Typing Animation */}
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-gray-400 font-mono text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserInteraction(inputMsg);
            }}
            className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={
                !language
                  ? "Select language above..."
                  : !userName
                  ? "Enter your name..."
                  : language === "hi"
                  ? "शूट्स, प्राइस या बुकिंग के बारे में पूछें..."
                  : "Ask anything about shoots, prices, booking..."
              }
              disabled={isLoading}
              className="flex-1 bg-black text-white text-xs border border-zinc-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#00E5FF] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMsg.trim()}
              className="p-2.5 bg-[#00E5FF] text-black font-bold rounded-xl hover:bg-cyan-300 disabled:opacity-40 transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 💬 Floating Action Bubbles Container */}
      <div className="flex flex-col space-y-3 pointer-events-auto">
        
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/7982776458?text=Hey%2C%20I%20have%20a%20query%20about%20packages!" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-transform hover:scale-110 cursor-pointer"
          title="Chat on WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {/* 🤖 Real Robot AI Assistant Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-transform hover:scale-110 cursor-pointer"
          title="instaclick AI Support"
        >
          <Bot className="w-6 h-6 text-black" />
        </button>

      </div>

    </div>
  );
}