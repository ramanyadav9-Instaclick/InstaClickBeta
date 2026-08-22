"use client";
import React from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Calendar, Zap, Clock, ShieldCheck, Camera, MapPin } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";

interface HeroProps {
  slides: Array<{ id: number; title: string; tagline: string; category: string; image: string }>;
  currentSlide: number;
  direction: number;
  handlePrev: () => void;
  handleNext: () => void;
  setIsGalleryOpen: (open: boolean) => void;
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
    { main: "Book Instantly", withText: "With ", glowLetter: "i", restText: "nstaclick" },
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

      {/* End-to-End Corner Photo Background */}
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

      {/* Text Container */}
      <div className="w-full h-full flex items-center z-20 relative px-6 pl-20 md:pl-24 pt-16">
        <div className="max-w-xl flex flex-col justify-center space-y-5 text-left">
          
          <span className="text-[10px] uppercase font-black text-[#00E5FF] tracking-[0.3em] font-mono block">
            {slides[currentSlide]?.category || "GALLERY"}
          </span>
          
          {/* Main Heading with only 'i' Glowing */}
          <h1 className="text-5xl md:text-[68px] text-white font-black leading-[1.1] tracking-tight">
            {currentTitleData.main} <br />
            {currentSlide === 0 ? (
              <span className="font-serif italic font-normal text-white">
                {(currentTitleData as any).withText}
                <span className="text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.8)] font-bold not-italic">
                  {(currentTitleData as any).glowLetter}
                </span>
                {(currentTitleData as any).restText}
              </span>
            ) : (
              <span className="text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.5)] font-serif italic font-normal">
                {(currentTitleData as any).glow}
              </span>
            )}
          </h1>

          <p className="text-xs md:text-sm text-gray-400 max-w-sm leading-relaxed font-medium">
            {currentSlide === 0 ? (
              <>Book in <span className="text-[#00E5FF] font-bold">1 minute</span>.<br />We reach your location within <span className="text-[#00E5FF] font-bold">1 hour</span>.</>
            ) : (
              slides[currentSlide]?.tagline || ""
            )}
          </p>

          {/* ⚡ 4 Feature Cards */}
          {currentSlide === 0 && (
            <div className="grid grid-cols-4 gap-2 pt-1 max-w-md">
              <div className="p-2 rounded-xl bg-black/60 border border-[#00E5FF]/20 flex flex-col items-center text-center">
                <Zap className="w-4 h-4 text-[#00E5FF] mb-1" />
                <span className="text-[11px] font-bold text-white leading-tight">1 Minute</span>
                <span className="text-[8px] text-gray-400">Instant Booking</span>
              </div>
              <div className="p-2 rounded-xl bg-black/60 border border-[#00E5FF]/20 flex flex-col items-center text-center">
                <Clock className="w-4 h-4 text-[#00E5FF] mb-1" />
                <span className="text-[11px] font-bold text-white leading-tight">1 Hour</span>
                <span className="text-[8px] text-gray-400">Reach at Location</span>
              </div>
              <div className="p-2 rounded-xl bg-black/60 border border-[#00E5FF]/20 flex flex-col items-center text-center">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF] mb-1" />
                <span className="text-[11px] font-bold text-white leading-tight">Verified</span>
                <span className="text-[8px] text-gray-400">Trusted Pros</span>
              </div>
              <div className="p-2 rounded-xl bg-black/60 border border-[#00E5FF]/20 flex flex-col items-center text-center">
                <Camera className="w-4 h-4 text-[#00E5FF] mb-1" />
                <span className="text-[11px] font-bold text-white leading-tight">Pro Quality</span>
                <span className="text-[8px] text-gray-400">Top Results</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-6">
            <button 
              onClick={scrollToServices} 
              className="px-8 py-3.5 bg-[#00E5FF] text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-102 transition-all flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </button>
            
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

      {/* 📍 Location Pill */}
      {currentSlide === 0 && (
        <div className="absolute bottom-8 right-24 z-30 hidden lg:flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-black/80 border border-[#00E5FF]/20 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/30">
            <MapPin className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <span className="text-xs text-white">
            Wherever you are, we’re just <strong className="text-[#00E5FF] font-bold">1 hour</strong> away!
          </span>
        </div>
      )}

    </section>
  );
}