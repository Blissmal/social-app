// hooks/usePusher.ts
"use client";

import { getPusherClient } from "@/lib/pusherClient";
import Pusher from "pusher-js";
import { useEffect } from "react";

export const usePusher = (onUserStatusChange: (data: {
  clerkId: string;
  userId: string;
  isOnline: boolean;
}) => void) => {
  useEffect(() => {
    const pusher = getPusherClient();

    const channel = pusher.subscribe("presence-chat");

    channel.bind("user-status", (data: {
      clerkId: string;
      userId: string;
      isOnline: boolean;
    }) => {
      onUserStatusChange(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      // pusher.disconnect();
    };
  }, [onUserStatusChange]);
};
