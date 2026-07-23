"use client";
import React from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Calendar } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";

interface HeroProps {
  slides: Array<{ id: number; title: string; tagline: string; category: string; image: string }>;
  currentSlide: number;
  direction: number;
  handlePrev: () => void;
  handleNext: () => void;
  setIsGalleryOpen: (open: boolean) => void; // State function trigger
  scrollToServices: () => void;
}

export default function Hero({
  slides, currentSlide, direction, handlePrev, handleNext, setIsGalleryOpen, scrollToServices
}: HeroProps) {

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    })
  };

  const titles = [
    { main: "Capture Every", glow: "Beautiful Moment" },
    { main: "Cinematic Stories", glow: "In Motion" },
    { main: "The Aerial", glow: "Perspective" },
    { main: "Every Event", glow: "Covered Perfectly" }
  ];

  const currentTitleData = titles[currentSlide] || titles[0];

  return (
    <section className="h-screen w-full relative flex items-center bg-[#050505] overflow-hidden select-none">
      
      {/* Viewport Edge Slide Trigger Controls */}
      <button 
        onClick={handlePrev} 
        className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-[#00E5FF] hover:text-black hover:border-[#00E5FF] transition-all shadow-xl"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button 
        onClick={handleNext} 
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-[#00E5FF] hover:text-black hover:border-[#00E5FF] transition-all shadow-xl"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* End-to-End Corner Photo Background with left face gradient blur mask */}
      <div className="absolute right-0 top-0 h-full w-[55%] z-10 overflow-hidden hidden md:block">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div 
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide]?.image || ""})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent w-full h-full" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text Container aligned near the left trigger arrow node */}
      <div className="w-full h-full flex items-center z-20 relative px-6 pl-20 md:pl-24 pt-16">
        <div className="max-w-xl flex flex-col justify-center space-y-5 text-left">
          
          <span className="text-[10px] uppercase font-black text-[#00E5FF] tracking-[0.3em] font-mono block">
            {slides[currentSlide]?.category || "GALLERY"}
          </span>
          
          <h1 className="text-5xl md:text-[68px] text-white font-black leading-[1.1] tracking-tight">
            {currentTitleData.main} <br />
            <span className="text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.5)] font-serif italic font-normal">
              {currentTitleData.glow}
            </span>
          </h1>

          <p className="text-xs md:text-sm text-gray-400 max-w-sm leading-relaxed font-medium">
            {slides[currentSlide]?.tagline || ""}
          </p>

          <div className="flex items-center space-x-4 pt-3">
            <button 
              onClick={scrollToServices} 
              className="px-8 py-3.5 bg-[#00E5FF] text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-102 transition-all flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </button>
            
            {/* 🚀 FIXED EVENT HANDLER: Triggers full screen portfolio overlay state nodes properly */}
            <button 
              onClick={() => setIsGalleryOpen(true)} 
              className="px-8 py-3.5 border border-white/10 bg-neutral-900/40 text-white rounded-xl text-xs font-bold flex items-center space-x-2 hover:border-[#00E5FF] hover:bg-black/80 transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
              <span>Watch Gallery</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}