import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaClick | Premium Photography Platform",
  description: "Capture Every Beautiful Moment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts link directly in HTML head to avoid CSS import issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}