"use client";
import React, { useState } from "react";

export default function Portfolio() {
  const [portfolioTab, setPortfolioTab] = useState<"All" | "Weddings" | "Events" | "Products" | "Drone">("All");

  const portfolioItems = [
    { title: "Royal Heritage Wedding", tag: "Weddings", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" },
    { title: "Commercial Matte Watch Series", tag: "Products", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
    { title: "Live Concert Night Wave", tag: "Events", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80" },
    { title: "Aerial Mountain Estate Reel", tag: "Drone", img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80" },
    { title: "Golden Hour Couple Cinematic", tag: "Weddings", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80" },
    { title: "Automotive Studio Showcase", tag: "Products", img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-mono font-bold text-[#00E5FF] tracking-[0.25em] uppercase">
          Curated Visual Gallery
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Moments We've Captured
        </h2>
        <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto">
          Explore authentic wedding films, commercial product sets, brand narratives, and cinematic drone coverage captured by verified instaclick professionals.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          {(["All", "Weddings", "Events", "Products", "Drone"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setPortfolioTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                portfolioTab === tab
                  ? "bg-[#00E5FF] text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems
          .filter((item) => portfolioTab === "All" || item.tag === portfolioTab)
          .map((item, idx) => (
            <div 
              key={idx} 
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 aspect-[4/3] cursor-pointer"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                  {item.tag}
                </span>
                <p className="text-white font-bold text-sm mt-1.5 drop-shadow-md">{item.title}</p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}