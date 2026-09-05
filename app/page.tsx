"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Menu,
  ShoppingCart,
  User,
  X,
  LogOut,
  Phone,
  Mail,
} from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  phone: string;
  email?: string;
};

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const SERVICES: Service[] = [
  {
    id: 1,
    name: "Photography",
    description: "Professional photography for your special moments.",
    price: 5000,
  },
  {
    id: 2,
    name: "Videography",
    description: "Cinematic video coverage with professional equipment.",
    price: 8000,
  },
  {
    id: 3,
    name: "Pre-Wedding Shoot",
    description: "Creative outdoor and indoor pre-wedding photography.",
    price: 12000,
  },
  {
    id: 4,
    name: "Event Coverage",
    description: "Complete photography and video coverage for events.",
    price: 15000,
  },
];

const SESSION_EXPIRY_MS = 60 * 60 * 1000;

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cart, setCart] = useState<Service[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] =
    useState<"login" | "signup">("login");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupAddress, setSignupAddress] = useState("");

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const loginTime = localStorage.getItem("user_login_time");

      if (!savedUser || !loginTime) return;

      const elapsed =
        Date.now() - Number.parseInt(loginTime, 10);

      if (elapsed > SESSION_EXPIRY_MS) {
        localStorage.removeItem("user");
        localStorage.removeItem("user_login_time");
        return;
      }

      const parsed = JSON.parse(savedUser);

      if (parsed?.phone) {
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("user_login_time");
    }
  }, []);

  const openLogin = () => {
    setAuthMode("login");
    setAuthError("");
    setOtp("");
    setOtpSent(false);
    setVerificationId("");
    setAuthOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setAuthError("");
    setOtp("");
    setOtpSent(false);
    setVerificationId("");
    setAuthOpen(true);
  };

  const closeAuth = () => {
    if (authLoading) return;

    setAuthOpen(false);
    setAuthError("");
    setOtp("");
    setOtpSent(false);
    setVerificationId("");
  };

  const cleanPhone = phone
    .replace(/\D/g, "")
    .slice(-10);

  const sendOtp = async () => {
    setAuthError("");

    if (cleanPhone.length !== 10) {
      setAuthError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (
      authMode === "signup" &&
      (!signupName.trim() ||
        !signupEmail.trim() ||
        !signupAddress.trim())
    ) {
      setAuthError(
        "Please fill in all signup details."
      );
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: cleanPhone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setAuthError(
          result.error || "Unable to send OTP."
        );
        return;
      }

      setVerificationId(
        result.verificationId || ""
      );
      setOtpSent(true);
    } catch {
      setAuthError(
        "Unable to connect to the server."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyOtp = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setAuthError("");

    if (!otp.trim()) {
      setAuthError("Please enter the OTP.");
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch(
        "/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: cleanPhone,
            otp,
            verificationId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setAuthError(
          result.error || "Invalid OTP."
        );
        return;
      }

      /*
       * The OTP has been verified.
       *
       * Your original application stored the user in
       * Supabase from the browser. This new page intentionally
       * does not do that during build/prerendering.
       *
       * The returned user is used when your API provides it.
       * Otherwise we create a local profile from the entered
       * information.
       */
      const loggedUser: UserProfile = {
        id:
          result.user?.id ||
          crypto.randomUUID(),
        name:
          result.user?.name ||
          signupName ||
          "Customer",
        phone:
          result.user?.phone ||
          cleanPhone,
        email:
          result.user?.email ||
          signupEmail ||
          undefined,
      };

      setUser(loggedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(loggedUser)
      );

      localStorage.setItem(
        "user_login_time",
        Date.now().toString()
      );

      setAuthOpen(false);
      setOtp("");
      setOtpSent(false);
      setVerificationId("");
      setAuthError("");

      if (authMode === "signup") {
        setSignupName("");
        setSignupEmail("");
        setSignupAddress("");
      }
    } catch {
      setAuthError(
        "Unable to verify OTP with the server."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_login_time");

    setUser(null);
    setProfileOpen(false);
  };

  const addToCart = (service: Service) => {
    setCart((previous) => {
      if (
        previous.some(
          (item) => item.id === service.id
        )
      ) {
        return previous;
      }

      return [...previous, service];
    });

    setCartOpen(true);
  };

  const removeFromCart = (serviceId: number) => {
    setCart((previous) =>
      previous.filter(
        (item) => item.id !== serviceId
      )
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  const scrollToServices = () => {
    document
      .getElementById("services")
      ?.scrollIntoView({
        behavior: "smooth",
      });

    setMobileMenu(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button
            onClick={() => window.scrollTo({
              top: 0,
              behavior: "smooth",
            })}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
              <Camera size={24} />
            </div>

            <div className="text-left">
              <div className="text-xl font-bold tracking-wide">
                InstaClick
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                Capture The Moment
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="text-sm text-white/80 transition hover:text-white"
            >
              Home
            </button>

            <button
              onClick={scrollToServices}
              className="text-sm text-white/80 transition hover:text-white"
            >
              Services
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="text-sm text-white/80 transition hover:text-white"
            >
              About
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="text-sm text-white/80 transition hover:text-white"
            >
              Contact
            </button>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-xl border border-white/10 p-3 transition hover:bg-white/10"
            >
              <ShoppingCart size={20} />

              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 transition hover:bg-white/10"
                >
                  <User size={17} />
                  <span className="max-w-24 truncate text-sm">
                    {user.name}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 w-64 rounded-2xl border border-white/10 bg-[#111] p-4 shadow-2xl">
                    <div className="mb-4">
                      <p className="font-semibold">
                        {user.name}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        {user.phone}
                      </p>
                    </div>

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-300 transition hover:bg-white/10"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/80"
              >
                Login
              </button>
            )}
          </div>

          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="rounded-xl border border-white/10 p-3 md:hidden"
          >
            {mobileMenu ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-white/10 bg-black px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  setMobileMenu(false);
                }}
                className="text-left text-white/80"
              >
                Home
              </button>

              <button
                onClick={scrollToServices}
                className="text-left text-white/80"
              >
                Services
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById("about")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                  setMobileMenu(false);
                }}
                className="text-left text-white/80"
              >
                About
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                  setMobileMenu(false);
                }}
                className="text-left text-white/80"
              >
                Contact
              </button>

              <button
                onClick={() => {
                  setCartOpen(true);
                  setMobileMenu(false);
                }}
                className="flex items-center gap-2 text-left text-white/80"
              >
                <ShoppingCart size={17} />
                Cart ({cart.length})
              </button>

              {!user && (
                <button
                  onClick={() => {
                    openLogin();
                    setMobileMenu(false);
                  }}
                  className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.10),transparent_45%)]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <CheckCircle2 size={15} />
              Professional Photography Services
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your Moments.
              <br />
              <span className="text-white/40">
                Our Click.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/60">
              Professional photography and
              videography services for weddings,
              events, pre-wedding shoots and every
              moment worth remembering.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={scrollToServices}
                className="rounded-2xl bg-white px-7 py-4 font-bold text-black transition hover:bg-white/80"
              >
                Explore Services
              </button>

              <button
                onClick={user ? () => setCartOpen(true) : openLogin}
                className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-semibold transition hover:bg-white/10"
              >
                {user
                  ? "View My Cart"
                  : "Book a Shoot"}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/15 via-white/5 to-transparent shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center p-10 text-center">
                <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Camera size={48} />
                </div>

                <h2 className="text-3xl font-bold">
                  Capture What Matters
                </h2>

                <p className="mt-4 max-w-sm text-white/50">
                  From intimate celebrations to
                  large-scale events, we turn real
                  moments into lasting memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="border-t border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              What We Do
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Our Services
            </h2>

            <p className="mt-5 text-white/50">
              Choose the photography package that
              fits your occasion.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <article
                key={service.id}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                  <Camera size={22} />
                </div>

                <h3 className="mt-7 text-xl font-bold">
                  {service.name}
                </h3>

                <p className="mt-3 min-h-16 text-sm leading-6 text-white/50">
                  {service.description}
                </p>

                <div className="mt-7 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/40">
                      Starting from
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      ₹{service.price.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      addToCart(service)
                    }
                    className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white/80"
                  >
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section
        id="about"
        className="border-t border-white/10 bg-white/[0.02] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                Why InstaClick
              </p>

              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
                Memories deserve
                <br />
                more than a camera roll.
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-white/50">
                We focus on genuine moments,
                professional quality and an easy
                booking experience from start to finish.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 p-6">
                <Clock size={24} />
                <h3 className="mt-6 font-bold">
                  Reliable Service
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Clear schedules and professional
                  coordination.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 p-6">
                <Camera size={24} />
                <h3 className="mt-6 font-bold">
                  Professional Quality
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Quality photography designed to
                  preserve every detail.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 p-6">
                <MapPin size={24} />
                <h3 className="mt-6 font-bold">
                  Flexible Locations
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  We come to your event and location.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 p-6">
                <CheckCircle2 size={24} />
                <h3 className="mt-6 font-bold">
                  Simple Booking
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Select your service and get started
                  quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="border-t border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              Get In Touch
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Ready to capture your moment?
            </h2>

            <p className="mt-4 max-w-xl text-white/50">
              Select a service and start planning
              your shoot with InstaClick.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={scrollToServices}
                className="rounded-2xl bg-white px-6 py-3.5 font-bold text-black"
              >
                Choose a Service
              </button>

              {!user && (
                <button
                  onClick={openLogin}
                  className="rounded-2xl border border-white/15 px-6 py-3.5 font-semibold"
                >
                  Login / Signup
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            © {new Date().getFullYear()} InstaClick.
            All rights reserved.
          </div>

          <div className="flex gap-5">
            <span>Photography</span>
            <span>Videography</span>
            <span>Events</span>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0b0b0b] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Your Cart
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  {cart.length} service
                  {cart.length === 1 ? "" : "s"}
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="rounded-xl border border-white/10 p-2"
              >
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <ShoppingCart
                  size={45}
                  className="text-white/20"
                />

                <h3 className="mt-5 text-xl font-bold">
                  Your cart is empty
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  Add a photography service to
                  continue.
                </p>

                <button
                  onClick={() => {
                    setCartOpen(false);
                    scrollToServices();
                  }}
                  className="mt-6 rounded-xl bg-white px-5 py-3 font-bold text-black"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <>
                <div className="mt-8 space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-white/40">
                            ₹
                            {item.price.toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="text-white/40 hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">
                      Total
                    </span>

                    <span className="text-2xl font-bold">
                      ₹
                      {cartTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (!user) {
                        setCartOpen(false);
                        openLogin();
                        return;
                      }

                      alert(
                        "Please connect your existing booking/payment flow to complete this booking."
                      );
                    }}
                    className="mt-6 w-full rounded-2xl bg-white py-4 font-bold text-black"
                  >
                    {user
                      ? "Continue Booking"
                      : "Login to Continue"}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* AUTH MODAL */}
      {authOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#101010] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {authMode === "login"
                    ? "Welcome Back"
                    : "Create Account"}
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  {authMode === "login"
                    ? "Login using your mobile number."
                    : "Create your InstaClick account."}
                </p>
              </div>

              <button
                onClick={closeAuth}
                className="rounded-xl border border-white/10 p-2"
              >
                <X size={19} />
              </button>
            </div>

            {authError && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {authError}
              </div>
            )}

            {!otpSent ? (
              <div className="mt-7 space-y-4">
                {authMode === "signup" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm text-white/60">
                        Full Name
                      </label>

                      <div className="relative">
                        <User
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                        />

                        <input
                          value={signupName}
                          onChange={(e) =>
                            setSignupName(
                              e.target.value
                            )
                          }
                          placeholder="Your name"
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 outline-none transition focus:border-white/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/60">
                        Email
                      </label>

                      <div className="relative">
                        <Mail
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                        />

                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) =>
                            setSignupEmail(
                              e.target.value
                            )
                          }
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 outline-none transition focus:border-white/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/60">
                        Address
                      </label>

                      <div className="relative">
                        <MapPin
                          size={17}
                          className="absolute left-4 top-4 text-white/30"
                        />

                        <textarea
                          value={signupAddress}
                          onChange={(e) =>
                            setSignupAddress(
                              e.target.value
                            )
                          }
                          placeholder="Your address"
                          rows={3}
                          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 outline-none transition focus:border-white/30"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Mobile Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="10-digit mobile number"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 outline-none transition focus:border-white/30"
                    />
                  </div>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={authLoading}
                  className="w-full rounded-xl bg-white py-4 font-bold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {authLoading
                    ? "Sending OTP..."
                    : "Send OTP"}
                </button>

                <button
                  onClick={() => {
                    setAuthMode(
                      authMode === "login"
                        ? "signup"
                        : "login"
                    );
                    setAuthError("");
                  }}
                  className="w-full py-2 text-sm text-white/50 hover:text-white"
                >
                  {authMode === "login"
                    ? "New user? Create an account"
                    : "Already have an account? Login"}
                </button>
              </div>
            ) : (
              <form
                onSubmit={verifyOtp}
                className="mt-7"
              >
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                  <Phone
                    size={25}
                    className="mx-auto text-white/50"
                  />

                  <p className="mt-4 text-sm text-white/50">
                    OTP sent to
                  </p>

                  <p className="mt-1 font-semibold">
                    +91 {cleanPhone}
                  </p>
                </div>

                <label className="mb-2 mt-6 block text-sm text-white/60">
                  Enter OTP
                </label>

                <input
                  autoFocus
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-white/30"
                />

                <button
                  type="submit"
                  disabled={authLoading}
                  className="mt-5 w-full rounded-xl bg-white py-4 font-bold text-black disabled:opacity-50"
                >
                  {authLoading
                    ? "Verifying..."
                    : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setVerificationId("");
                    setAuthError("");
                  }}
                  className="mt-4 w-full py-2 text-sm text-white/50 hover:text-white"
                >
                  Change mobile number
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
