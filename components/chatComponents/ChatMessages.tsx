"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { useReply } from "@/hooks/useReply"; // Import the custom hook
import ImageContainer from "./ChatImageContainer";
import MessageText from "./MessageText";

const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const ChatMessages = ({
  messages,
  senderId,
  isGroupChat,
}: {
  messages: any[];
  senderId: string;
  isGroupChat: boolean;
}) => {
  const { replyTo, setReply, clearReply } = useReply(); // Using the custom hook
  console.log("Current replyTo state:", replyTo); // Debugging the state

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet.</div>
      ) : (
        <AnimatePresence>
          {messages.map((message) => {
            const isSender = message.senderId === senderId;
            const repliedMessage = message.replyToId
              ? messages.find((msg) => msg.id === message.replyToId)
              : null;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  isSender ? "justify-end" : ""
                } items-start gap-2.5`}
              >
                {!isSender && (
                  <img
                    src={message.sender.image || "/avatar.png"}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                )}

                <div className="grid w-max max-w-[75%]">
                  <div
                    className={`p-3 ${
                      isSender
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    } rounded-3xl ${
                      isSender ? "rounded-tr-none" : "rounded-tl-none"
                    } shadow-md flex flex-col cursor-pointer`}
                    onClick={() => {
                      console.log("Clicked message:", message); // Debugging the click
                      setReply(message); // Trigger setReply when clicked
                    }}
                  >
                    {repliedMessage && (
                      <div className="text-xs text-gray-600 mb-1 border-l-2 pl-2 border-blue-500">
                        Replying to: {repliedMessage.text || "[Image]"}
                      </div>
                    )}

                    <ImageContainer message={{ image: message.image }} />

                    <MessageText text={message.text} />
                  </div>

                  <div className="flex items-center justify-end text-xs text-gray-500 gap-1 mt-1">
                    <span>
                      {formatMessageTime(new Date(message.createdAt))}
                    </span>
                    {isSender && (
                      <>
                        {message.status === "SENT" && (
                          <Check className="w-4 h-4 text-gray-400" />
                        )}
                        {message.status === "DELIVERED" && (
                          <CheckCheck className="w-4 h-4 text-gray-400" />
                        )}
                        {message.status === "READ" && (
                          <CheckCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {isSender && (
                  <img
                    src={message.sender.image || "/avatar.png"}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChatMessages;
