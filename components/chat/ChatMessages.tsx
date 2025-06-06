"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useReply } from "@/hooks/useReply";
import SwipeableMessage from "./SwipeableMessage";
import { usePusher } from "@/hooks/usePusher";
import { useChatPusher } from "@/hooks/useChatPusher";

const getDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ChatMessages({
  initialMessages,
  senderId,
  isGroupChat,
  groupId,
  userId,
}: {
  initialMessages: any[];
  senderId: string;
  isGroupChat: boolean;
  groupId?: string;
  userId?: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const { setReply } = useReply();

  const handleNewMessage = useCallback((message: any) => {
  console.log("Received new message:", message);
  setMessages((prev) => [...prev, message]);
}, []);



  useChatPusher({
  channelKey: isGroupChat
    ? `presence-chat-group-${groupId}`
    : `presence-chat-user-${userId}`,
  onNewMessage: handleNewMessage,
});

console.log("ChatMessages mounted with channelKey:", isGroupChat
  ? `presence-chat-group-${groupId}` : `presence-chat-user-${userId}`);



  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet.</div>
      ) : (
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isSender = message.senderId === senderId;
            const repliedMessage = message.replyToId
              ? messages.find((msg) => msg.id === message.replyToId)
              : null;

            const prevMessage = messages[index - 1];
            const showAvatar =
              !prevMessage || prevMessage.senderId !== message.senderId;

            const currentDate = new Date(message.createdAt);
            const prevDate = prevMessage ? new Date(prevMessage.createdAt) : null;
            const showDateLabel =
              !prevDate || currentDate.toDateString() !== prevDate.toDateString();

            return (
              <div key={message.id}>
                {showDateLabel && (
                  <div className="text-center text-xs text-gray-500 mb-2">
                    {getDateLabel(currentDate)}
                  </div>
                )}

                <SwipeableMessage
                  message={message}
                  isSender={isSender}
                  repliedMessage={repliedMessage}
                  onReply={() => setReply(message)}
                  showAvatar={showAvatar}
                />
              </div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
