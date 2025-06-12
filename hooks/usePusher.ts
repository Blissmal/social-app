"use client";

import { useEffect } from "react";
import { getPusherClient } from "@/lib/pusherClient";
import { useOnlineUsers } from "@/store/onlineUsers";

export const usePusher = () => {
  const setOnline = useOnlineUsers((state) => state.setOnline);
  const setLastSeen = useOnlineUsers((state) => state.setLastSeen);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("presence-chat");

    channel.bind("user-status", (data: { userId: string; isOnline: boolean }) => {
      setOnline(data.userId, data.isOnline);
      if (!data.isOnline) {
        setLastSeen(data.userId, new Date());
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [setOnline, setLastSeen]);
};
