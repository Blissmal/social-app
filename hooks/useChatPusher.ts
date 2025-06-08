// hooks/usePusher.ts
"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { getPusherClient } from "@/lib/pusherClient";

type UsePusherProps = {
  channelKey: string;
  onNewMessage: (message: any) => void;
};

export function useChatPusher({ channelKey, onNewMessage }: UsePusherProps) {
  useEffect(() => {
    Pusher.logToConsole = process.env.NODE_ENV === "development";

    console.log(`[Pusher] Initializing with channelKey: ${channelKey}`);

    const pusher = getPusherClient();

    const channel = pusher.subscribe(channelKey);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log(`[Pusher] Subscription succeeded for channel: ${channelKey}`);
    });

    channel.bind("new-message", (message: any) => {
      console.log(`[Pusher] Received "new-message" event on ${channelKey}:`, message);
      onNewMessage(message);
    });

    // Debug: log any events arriving on this channel
    channel.bind_global((eventName: string, data: any) => {
      console.log(`[Pusher] Global event on ${channelKey}:`, eventName, data);
    });

    return () => {
      console.log(`[Pusher] Unsubscribing from channel: ${channelKey}`);
      channel.unbind_all();
      pusher.unsubscribe(channelKey);
      // Don't disconnect unless you want to kill the whole connection
    };
  }, [channelKey, onNewMessage]);
}
