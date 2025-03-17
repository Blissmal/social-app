"use client";

import { useEffect } from "react";

const OnlineStatus = () => {
  useEffect(() => {
    // Send online status to server
    fetch("/api/socket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOnline: true }),
    });

    return () => {
      // Set user offline when component unmounts
      fetch("/api/socket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline: false }),
      });
    };
  }, []);

  return <span className="hidden" />;
};

export default OnlineStatus;
