import { useEffect, useState } from "react";
import Pusher from "pusher-js";

// Utility to generate consistent chat ID from two user IDs
const getChatId = (id1: string, id2: string) =>
  id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;

type Options = {
  currentUserId: string;
  currentUsername: string;
  users: { id: string; username: string }[];
};

export function useTypingIndicatorsMap({
  currentUserId,
  currentUsername,
  users,
}: Options) {
  const [typingMap, setTypingMap] = useState<Record<string, string | null>>({});

  useEffect(() => {
    console.log("[TypingIndicators] Initializing Pusher with:", {
      currentUserId,
      currentUsername,
      usersCount: users.length,
    });

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
      authEndpoint: "/api/pusher/auth",
      auth: {
        headers: {
          // Add auth headers if needed
        },
      },
    });

    const channels = users.map((user) => {
      const chatId = getChatId(currentUserId, user.id);
      const channelName = `private-chat-typing-${chatId}`;
      console.log(`[TypingIndicators] Subscribing to channel: ${channelName}`);

      const channel = pusher.subscribe(channelName);

      channel.bind("typing", (data: { username: string }) => {
        console.log(`[TypingIndicators] Received typing event on ${channelName}`, data);
        if (data.username !== currentUsername) {
          setTypingMap((prev) => ({ ...prev, [user.id]: data.username }));
          setTimeout(() => {
            console.log(`[TypingIndicators] Clearing typing indicator for userId: ${user.id}`);
            setTypingMap((prev) => ({ ...prev, [user.id]: null }));
          }, 3000);
        }
      });

      return channel;
    });

    return () => {
      console.log("[TypingIndicators] Cleaning up Pusher subscriptions");
      channels.forEach((channel) => {
        console.log(`[TypingIndicators] Unsubscribing from channel: ${channel.name}`);
        pusher.unsubscribe(channel.name);
      });
      pusher.disconnect();
    };
  }, [users, currentUserId, currentUsername]);

  return typingMap;
}
