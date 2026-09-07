"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function InactivityHandler({ onLogout }: { onLogout?: () => void }) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 60 मिनट की इनएक्टिविटी लिमिट
  const INACTIVITY_LIMIT = 60 * 60 * 1000;

  const performLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_logged_in");
    
    if (onLogout) {
      onLogout();
    } else {
      router.push("/admin");
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(performLogout, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return null;
}