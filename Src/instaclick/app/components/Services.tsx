"use client";
import React from "react";
import { X, ArrowRight, Camera, Video, Plane, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const iconsMap: any = { photography: Camera, videography: Video, drone: Plane, events: Sparkles };

export default function Services({ mainServices, subPackages, activeCategory, setActiveCategory, handleSoftAddToCart }: any) {
  return (
    <div className="bg-[#050505] w-full py-24 min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        <div className="text-center mb-16 space-y-2">
          <span className="text-[#00E5FF] text-xs font-black tracking-widest uppercase">Our Services</span>
          <h2 className="text-5xl font-black text-white">What We <span className="text-[#00E5FF]">Offer</span></h2>
        </div>

        {/* Four Main Service Cards Grid with 100% Fixed Visible Backdrop Textures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {mainServices.map((srv: any) => {
            const Icon = iconsMap[srv.id];
            return (
              <div 
                key={srv.id} 
                className="group relative h-[400px] border border-white/5 rounded-[32px] overflow-hidden transition-all duration-500 hover:border-[#00E5FF]/50 bg-neutral-900/20 flex flex-col justify-end p-6 shadow-2xl"
              >
                {/* 📸 Raw HTML Image Element Layer */}
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                  <img 
                    src={srv.img} 
                    alt={srv.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                
                {/* Deep Cyber Matte overlay mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/10 z-10 w-full h-full pointer-events-none" />
                
                {/* Foreground interactive items */}
                <div className="relative z-20 space-y-3">
                  <div className="w-11 h-11 rounded-full border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] bg-black/60 shadow-[0_0_15px_rgba(0,229,255,0.3)] group-hover:bg-[#00E5FF] group-hover:text-black transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-white">{srv.title}</h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-1 line-clamp-2">{srv.desc}</p>
                  </div>
                  
                  <button 
                    onClick={() => setActiveCategory(srv.id)} 
                    className="text-[#00E5FF] text-xs font-black flex items-center space-x-1.5 pt-2 group-hover:space-x-3 transition-all"
                  >
                    <span>Explore Pack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
      
      {/* Sub-Packages Glass Overlay */}
      <AnimatePresence>
        {activeCategory && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0D0D] border border-white/10 p-6 md:p-8 rounded-[40px] max-w-5xl w-full"
            >
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                    {activeCategory} <span className="text-[#00E5FF]">Packages</span>
                  </h3>
                  <button onClick={() => setActiveCategory(null)} className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="flex space-x-5 overflow-x-auto pb-4 max-h-[480px] scrollbar-thin">
                  {subPackages[activeCategory]?.map((pkg: any, idx: number) => (
                    <div key={idx} className="min-w-[260px] bg-neutral-900/40 border border-white/5 p-4 rounded-2xl hover:border-[#00E5FF]/30 transition-all flex flex-col justify-between shadow-lg">
                       <div>
                         <div className="w-full h-36 rounded-xl overflow-hidden mb-3 border border-white/5">
                           <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover" />
                         </div>
                         <h4 className="text-white text-sm font-bold">{pkg.name}</h4>
                         <span className="text-[10px] text-cyan-400 font-mono">★ {pkg.rating} premium rating</span>
                       </div>
                       
                       <div className="flex justify-between items-center mt-6 pt-3 border-t border-white/5">
                          <span className="text-[#00E5FF] text-sm font-black">₹{pkg.price.toLocaleString()}</span>
                          <button 
                            onClick={() => handleSoftAddToCart(pkg)} 
                            className="px-4 py-1.5 bg-[#00E5FF] text-black font-black rounded-lg text-[11px] hover:scale-105 transition-transform"
                          >
                            Add Slot
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}