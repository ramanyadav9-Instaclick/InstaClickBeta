import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Portfolio from "../components/Portfolio";

export const metadata = {
  title: "Featured Portfolio | instaclick",
  description: "Explore curated wedding, event, product, and aerial cinematography work.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#00E5FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>
      </div>
      <Portfolio />
    </main>
  );
}