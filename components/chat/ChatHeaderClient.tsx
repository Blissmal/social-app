// components/ChatHeaderClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePusher } from "@/hooks/usePusher";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { getChatId } from "@/utils/chat";
import { useOnlineUsers } from "@/store/onlineUsers";
import { useLastSeenText } from "@/hooks/useLastSeenText";

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
const online = useOnlineUsers((state) => state.onlineUsers[userId] ?? initialOnline);
  const [lastSeen, setLastSeen] = useState<Date | null>(initialLastSeen);
  const lastSeenText = useLastSeenText(lastSeen, online);
  const setOnline = useOnlineUsers((s) => s.setOnline);
  const setLastSeenInStore = useOnlineUsers((s) => s.setLastSeen);

  const handleUserStatusChange = useCallback(
  (data: { userId: string; isOnline: boolean }) => {
    if (data.userId === userId) {
      setOnline(data.userId, data.isOnline);
      if (!data.isOnline) {
        setLastSeenInStore(data.userId, new Date()); // ✅ Zustand update
      }
    }
  },
  [userId, setOnline, setLastSeenInStore]
);

  
  usePusher();

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
                : lastSeenText}
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