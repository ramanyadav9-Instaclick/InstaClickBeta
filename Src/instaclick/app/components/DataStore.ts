export const slides = [
  { id: 1, title: "Capture Every", tagline: "Book professional photographers for your special moments.", category: "WEDDING PHOTOGRAPHY", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80" },
  { id: 2, title: "Cinematic Stories", tagline: "Every frame crafted like a movie.", category: "CINEMATIC VIDEOGRAPHY", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80" },
  { id: 3, title: "The Aerial", tagline: "High-end drone cinematography that soars above the ordinary.", category: "DRONE SHOOT", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80" },
  { id: 4, title: "Every Event", tagline: "Birthdays, corporate events & concerts covered perfectly.", category: "EVENTS & SHOWS", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80" }
];

export const mainServices = [
  { id: "photography", title: "Photography", desc: "Wedding, portrait, fashion & lifestyle shoots with DSLR & Mirrorless setups.", count: "8 premium packages", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" },
  { id: "videography", title: "Videography", desc: "Cinematic wedding films, corporate commercial videos & high-engagement viral reels.", count: "5 premium packages", img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80" },
  { id: "drone", title: "Drone", desc: "4K Aerial cinematography for grand weddings, luxury resorts & real estate assets.", count: "5 premium packages", img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80" },
  { id: "events", title: "Events", desc: "Birthdays, corporate gala events, stage concerts & custom management shoots.", count: "5 premium packages", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80" }
];

// 🚀 FIXED: Fully Populated 8 High-End Aesthetic Studio Sample Visual Nodes
export const galleryImages = [
  { tag: "Pre-Wedding Pure Glow", url: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=600&q=80" },
  { tag: "Flagship Cinema Rigs", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" },
  { tag: "Luxury Wedding Bliss", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80" },
  { tag: "Studio Product Setup", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
  { tag: "4K Drone Landscape", url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&q=80" },
  { tag: "High-Fashion Runways", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
  { tag: "Grand Concert Stage", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80" },
  { tag: "Maternity Tender Shoot", url: "https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=600&q=80" }
];

export const subPackages: Record<string, Array<{name: string, price: number, displayPrice: string, rating: number, img: string}>> = {
  photography: [
    { name: "Baby Shoot", price: 1499, displayPrice: "Starting ₹1499", rating: 4.9, img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80" },
    { name: "Wedding Shoot", price: 3499, displayPrice: "Starting ₹3499", rating: 4.9, img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80" },
    { name: "Pre Wedding", price: 3499, displayPrice: "Starting ₹3499", rating: 4.8, img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80" },
    { name: "Maternity", price: 2999, displayPrice: "Starting ₹2999", rating: 4.9, img: "https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=400&q=80" },
    { name: "Fashion Portfolio", price: 2499, displayPrice: "Starting ₹2499", rating: 4.7, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80" },
    { name: "Product Shoot", price: 1999, displayPrice: "Starting ₹1999", rating: 4.8, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" },
    { name: "Engagement Cover", price: 1999, displayPrice: "Starting ₹1999", rating: 4.9, img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80" },
    { name: "Outdoor Cinematic", price: 2999, displayPrice: "Starting ₹2999", rating: 4.8, img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80" }
  ],
  videography: [
    { name: "Wedding Film", price: 3499, displayPrice: "Starting ₹3499", rating: 4.9, img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80" },
    { name: "Cinematic Video", price: 2999, displayPrice: "Starting ₹2999", rating: 4.8, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80" },
    { name: "Corporate Film", price: 3999, displayPrice: "Starting ₹3999", rating: 4.7, img: "https://images.unsplash.com/photo-1485686531765-ba63b07845a7?auto=format&fit=crop&w=400&q=80" },
    { name: "Reel Shoot", price: 499, displayPrice: "Starting ₹499", rating: 4.9, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80" },
    { name: "Music Video", price: 9999, displayPrice: "Starting ₹9999", rating: 4.8, img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" }
  ],
  drone: [
    { name: "Wedding Drone", price: 2499, displayPrice: "Starting ₹2499", rating: 4.9, img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80" },
    { name: "Resort Feature", price: 1999, displayPrice: "Starting ₹1999", rating: 4.8, img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80" },
    { name: "Real Estate Drone", price: 1999, displayPrice: "Starting ₹1999", rating: 4.7, img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=400&q=80" },
    { name: "Farm Shoot", price: 2999, displayPrice: "Starting ₹2999", rating: 4.6, img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80" },
    { name: "Construction Cam", price: 2499, displayPrice: "Starting ₹2499", rating: 4.8, img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80" }
  ],
  events: [
    { name: "Annual Function", price: 1999, displayPrice: "Starting ₹1999", rating: 4.8, img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80" },
    { name: "Birthday Bash", price: 1499, displayPrice: "Starting ₹1499", rating: 4.8, img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80" },
    { name: "Anniversary Cover", price: 2999, displayPrice: "Starting ₹2999", rating: 4.9, img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80" },
    { name: "Corporate Summit", price: 2999, displayPrice: "Starting ₹2999", rating: 4.7, img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80" },
    { name: "Live Concert Festival", price: 2499, displayPrice: "Starting ₹2499", rating: 4.9, img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80" }
  ]
};

export const registeredUsers = ["0000000000", "1111111111"];
export interface Member {
  id: string;
  username: string;
  password: string;
  role: 'super_admin' | 'member';
  mobileNumber: string;
  gmail: string;
}

export interface CustomerPayment {
  id: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  assetStatus: 'Pending' | 'In Transit' | 'Delivered';
  trackerStatus: 'Order Placed' | 'Dispatched' | 'On the Way' | 'Delivered';
}