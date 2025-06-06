import Pusher from "pusher-js";
import { useEffect, useState, useRef, useCallback } from "react";

type UseTypingIndicatorProps = {
  chatId: string;
  currentUsername: string;
};

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  authEndpoint: "/api/pusher/auth",
  forceTLS: true,
});

export const useTypingIndicator = ({
  chatId,
  currentUsername,
}: UseTypingIndicatorProps) => {
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypingEvent = useCallback(
    (data: { username: string }) => {
      const incoming = data.username?.trim().toLowerCase();
      const current = currentUsername.trim().toLowerCase();

      console.log("[TypingEvent] received username:", incoming);
      console.log("[TypingEvent] currentUsername:", current);

      if (incoming === current) {
        console.log("[TypingEvent] Ignored self typing event");
        return;
      }

      console.log("[TypingEvent] Showing typing for:", data.username);
      setTypingUser(data.username);

      // Clear previous timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Reset typing after 3 seconds
      timeoutRef.current = setTimeout(() => {
        console.log("[TypingEvent] Clearing typing for:", data.username);
        setTypingUser(null);
      }, 3000);
    },
    [currentUsername]
  );

  useEffect(() => {
    const channelName = `private-chat-typing-${chatId}`;
    const channel = pusherClient.subscribe(channelName);

    console.log("[Pusher] Subscribed to:", channelName);

    channel.bind("typing", handleTypingEvent);

    return () => {
      console.log("[Pusher] Unsubscribed from:", channelName);
      channel.unbind("typing", handleTypingEvent);
      pusherClient.unsubscribe(channelName);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [chatId, handleTypingEvent]);

  return { typingUser };
};
