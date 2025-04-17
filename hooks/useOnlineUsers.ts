"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusherClient";

type StatusPayload = {
  clerkId: string;
  userId: string;
  isOnline: boolean;
};

export const useOnlineUsers = () => {
  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const channel = pusherClient.subscribe("presence-chat");

    const handleStatus = ({ userId, isOnline }: StatusPayload) => {
      setOnlineMap((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    };

    channel.bind("user-status", handleStatus);

    return () => {
      channel.unbind("user-status", handleStatus);
      pusherClient.unsubscribe("presence-chat");
    };
  }, []);

  return onlineMap;
};
