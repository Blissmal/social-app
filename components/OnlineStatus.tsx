"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const OnlineStatus = () => {
  const { userId } = useAuth(); // Get Clerk ID

  useEffect(() => {
    if (!userId) return; // Ensure user is logged in

    const setOnlineStatus = (isOnline: boolean) => {
      fetch("/api/socket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: userId, isOnline }),
      });
    };

    setOnlineStatus(true); // Mark user online

    const handleUnload = () => setOnlineStatus(false); // Mark user offline on tab close

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      setOnlineStatus(false); // Ensure offline update
    };
  }, [userId]);

  return <span className="hidden" />;
};

export default OnlineStatus;
