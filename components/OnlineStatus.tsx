"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { debounce } from "lodash";

const OnlineStatus = () => {
  const { userId } = useAuth(); // Get Clerk ID
  const [isOnline, setIsOnline] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    if (!userId) return; // Ensure user is logged in

    const updateOnlineStatus = async (status: boolean) => {
      try {
        await fetch("/api/socket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: userId, isOnline: status }),
        });
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
      updateOnlineStatus(false); // Ensure the last call marks user offline
    };

    // Set user online on mount
    updateOnlineStatus(true);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      if (!isMounted.current) return;
      updateOnlineStatus(false);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
      isMounted.current = false;
    };
  }, [userId]);

  return <span className="hidden" />;
};

export default OnlineStatus;
