"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UserInactivityHandler() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1 ghanta = 60 minutes = 3,600,000 ms
  const ONE_HOUR = 60 * 60 * 1000;

  const handleLogout = () => {
    // 1. User ki login/session details clear karo
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_logged_in");
    sessionStorage.clear();

    // 2. Refresh ya login page pe redirect
    router.refresh();
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // 1 ghante baad logout run hoga agar koi activity na ho
    timerRef.current = setTimeout(handleLogout, ONE_HOUR);
  };

  useEffect(() => {
    // Activity events (mouse move, type, click, scroll)
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Pehli baar timer start
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return null;
}