// hooks/useLastSeenText.ts
import { useEffect, useMemo, useState } from "react";

export function useLastSeenText(lastSeen: Date | null, online: boolean) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (online) return;

    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60 * 1000); // update every minute

    return () => clearInterval(interval);
  }, [online]);

  const lastSeenText = useMemo(() => {
    if (!lastSeen) return "Offline";

    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Last seen just now";
    if (diffMinutes < 60) return `Last seen ${diffMinutes} min ago`;
    if (diffHours < 24) return `Last seen ${diffHours} hrs ago`;

    if (diffDays === 1) {
      return `Last seen yesterday at ${lastSeenDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    return `Last seen on ${lastSeenDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })} at ${lastSeenDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }, [lastSeen, tick, online]);

  return lastSeenText;
}
