"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs"; // If using Clerk for authentication

const OnlineStatus = () => {
  const { userId } = useAuth(); // Get the logged-in user ID

  useEffect(() => {
    if (!userId) return; // Ensure user is authenticated

    const updateUserStatus = async (isOnline: boolean) => {
      try {
        await fetch("/api/socket", {
          method: "POST",
          body: JSON.stringify({ userId, isOnline }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Failed to update online status:", error);
      }
    };

    // Set user as online when the component mounts
    updateUserStatus(true);

    // Set user as offline when the tab is closed or page is unloaded
    const handleBeforeUnload = () => updateUserStatus(false);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Listen for tab visibility change
    const handleVisibilityChange = () => {
      updateUserStatus(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      updateUserStatus(false); // Set offline when component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId]);

  return null; // This component doesn’t render anything
};

export default OnlineStatus;
