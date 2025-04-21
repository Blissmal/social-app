"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { debounce } from "lodash";

const OnlineStatus = () => {
  const { isLoaded, userId } = useAuth(); // Get Clerk ID and auth state
  const [isOnline, setIsOnline] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    if (!isLoaded || !userId) return; // Ensure Clerk is ready and user is logged in

    const updateOnlineStatus = async (status: boolean) => {
      try {
        const res = await fetch("/api/socket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: userId, isOnline: status }),
        });

        if (!res.ok) {
          console.error("Server failed to update status");
        }
      } catch (error) {
        console.error("Failed to update online status:", error);
      }
    };

    const debouncedUpdateStatus = debounce(updateOnlineStatus, 1000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsOnline(false);
        debouncedUpdateStatus(false);
      } else {
        setIsOnline(true);
        debouncedUpdateStatus(true);
      }
    };

    const handleUnload = () => {
      debouncedUpdateStatus.cancel(); // Cancel any pending updates

      const payload = JSON.stringify({ clerkId: userId, isOnline: false });

      // Use navigator.sendBeacon if available
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/socket", new Blob([payload], { type: "application/json" }));
      } else {
        // Fallback if sendBeacon isn't available
        updateOnlineStatus(false);
      }
    };

    // Set user online on mount
    updateOnlineStatus(true);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      if (!isMounted.current) return;
      debouncedUpdateStatus.cancel();
      updateOnlineStatus(false);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
      isMounted.current = false;
    };
  }, [isLoaded, userId]);

  return <span className="hidden" />;
};

export default OnlineStatus;
