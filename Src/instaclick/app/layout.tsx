import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaClick | Premium Photography Platform",
  description: "Capture Every Beautiful Moment",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Force Favicon to use InstaClick Real Logo */}
        <link rel="icon" type="image/png" href="/logo.png?v=2" />
        <link rel="shortcut icon" type="image/png" href="/logo.png?v=2" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />

        {/* Google Fonts link directly in HTML head */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}