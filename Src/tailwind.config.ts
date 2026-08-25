import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FDFBF7", // Soft Premium Cream
        luxuryText: "#1A1A1A", // Deep Charcoal
        accent: {
          DEFAULT: "#C5A880",  // Muted Royal Gold/Bronze
          hover: "#AF9168",    // Deeper Gold
          light: "#F5EFE6",    // Very Soft Sand/Cream
        },
      },
      fontFamily: {
        // Aesthetic Serif vibe for headings
        serif: ["Playfair Display", "Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;