// hooks/usePusher.ts
"use client";

import Pusher from "pusher-js";
import { useEffect } from "react";

export const usePusher = (onUserStatusChange: (data: {
  clerkId: string;
  userId: string;
  isOnline: boolean;
}) => void) => {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth", // if you use presence/private channels
    });

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
      pusher.disconnect();
    };
  }, [onUserStatusChange]);
};
