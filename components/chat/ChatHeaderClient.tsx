// components/ChatHeaderClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePusher } from "@/hooks/usePusher";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { getChatId } from "@/utils/chat";

export default function ChatHeaderClient({
  username,
  userId,
  image,
  initialOnline,
  initialLastSeen,
  currentUserId,
  currentUsername,
}: {
  username: string;
  userId: string;
  image: string | null;
  initialOnline: boolean;
  initialLastSeen: Date | null;
  currentUserId: string;
  currentUsername: string;
}) {
  const [online, setOnline] = useState(initialOnline);
  const [lastSeen, setLastSeen] = useState<Date | null>(initialLastSeen);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (online) return; // no need to update if user is online

    // Update every minute
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [online]);

  const getLastSeenText = (lastSeen: Date | null): string => {
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
};


  const handleUserStatusChange = useCallback(
    (data: { userId: string; isOnline: boolean }) => {
      if (data.userId === userId) {
        setOnline(data.isOnline);
        if (!data.isOnline) setLastSeen(new Date());
      }
    },
    [userId]
  );

  usePusher(handleUserStatusChange);

  const chatId = getChatId(currentUserId, userId);
  const { typingUser } = useTypingIndicator({ chatId, currentUsername });

  console.log(typingUser, "Typing user in ChatHeaderClient");

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full relative">
              <img src={image || "/avatar.png"} alt={username} />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{username}</h3>
            <p className="text-sm text-base-content/70">
              {typingUser
                ? `${typingUser} is typing...`
                : online
                ? "Online"
                : getLastSeenText(lastSeen)}
            </p>
          </div>
        </div>
        <Link href="/chats">
          <X />
        </Link>
      </div>
    </div>
  );
}