"use client";

import Pusher, { Channel } from "pusher-js";
import { useEffect } from "react";

type UserStatusPayload = {
  clerkId: string;
  userId: string;
  isOnline: boolean;
};

type MessagePayload = any; // Define your message shape here for better typing

type UsePusherParams = {
  userId?: string;
  groupId?: string;
  onUserStatusChange?: (data: UserStatusPayload) => void;
  onNewMessage?: (message: MessagePayload) => void;
};

export const usePusher = ({
  userId,
  groupId,
  onUserStatusChange,
  onNewMessage,
}: UsePusherParams) => {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });

    const subscriptions: Channel[] = [];

    // Subscribe to presence channel for user status updates
    if (onUserStatusChange) {
      const statusChannel = pusher.subscribe("presence-chat");
      statusChannel.bind("user-status", onUserStatusChange);
      subscriptions.push(statusChannel);
    }

    // Subscribe to chat channel for new messages
    const channelName = groupId
      ? `chat-group-${groupId}`
      : userId
      ? `chat-user-${userId}`
      : null;

    if (channelName && onNewMessage) {
      const chatChannel = pusher.subscribe(channelName);
      chatChannel.bind("new-message", onNewMessage);
      subscriptions.push(chatChannel);
    }

    return () => {
      subscriptions.forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
      pusher.disconnect();
    };
  }, [userId, groupId, onUserStatusChange, onNewMessage]);
};
