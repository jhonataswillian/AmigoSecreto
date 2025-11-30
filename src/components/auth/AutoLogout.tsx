import React, { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../lib/supabase";

interface AutoLogoutProps {
  children: React.ReactNode;
  timeoutMinutes?: number;
}

export const AutoLogout: React.FC<AutoLogoutProps> = ({
  children,
  timeoutMinutes = 30,
}) => {
  const { user, logout } = useAuthStore();
  // const { addNotification } = useNotificationStore(); // Assuming this exists or we'll use a toast

  // Use refs to avoid re-attaching listeners constantly
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(0);

  const handleLogout = useCallback(() => {
    if (!user) return;

    logout();
    // Optional: Show a message after logout
    // Since we are logged out, we might want to use a toast or just let the login page handle it.
    // For now, we just logout.
    window.location.href = "/login?reason=inactivity";
  }, [user, logout]);

  const resetTimer = useCallback(() => {
    if (!user) return;

    lastActivityRef.current = Date.now();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(handleLogout, timeoutMinutes * 60 * 1000);
  }, [user, timeoutMinutes, handleLogout]);

  useEffect(() => {
    if (!user) return;

    // Check if session is older than 24 hours
    const checkSessionAge = async () => {
      // We can use user.last_sign_in_at directly from store if available,
      // but getting fresh session is safer.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.last_sign_in_at) {
        const lastSignIn = new Date(session.user.last_sign_in_at).getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (Date.now() - lastSignIn > twentyFourHours) {
          handleLogout();
        }
      }
    };

    checkSessionAge();
    // Run check every minute
    const sessionCheckInterval = setInterval(checkSessionAge, 60 * 1000);

    // Initial timer
    resetTimer();

    // Events to listen for
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // Throttle the event listener to avoid performance issues
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleActivity = () => {
      if (!throttleTimer) {
        resetTimer();
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
        }, 1000); // Throttle to 1 second
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(sessionCheckInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (throttleTimer) clearTimeout(throttleTimer);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, resetTimer, handleLogout]);

  return <>{children}</>;
};
