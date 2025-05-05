"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import ImageContainer from "./ChatImageContainer";
import { useEffect, useRef, useState } from "react";

const urlRegex = /(https?:\/\/[^\s]+)/g;

const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const parseText = (text: string) => {
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const LinkPreview = ({ url }: { url: string }) => {
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch("/api/link-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        setPreview(data);
      } catch (err) {
        console.error("Failed to fetch preview:", err);
      }
    };

    fetchPreview();
  }, [url]);

  if (!preview) return null;

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-xl p-3 shadow bg-white dark:bg-gray-900 space-y-2 max-w-sm mb-2"
    >
      {preview.images?.[0] && (
        <img
          src={preview.images[0]}
          alt="Preview"
          className="w-full h-32 object-cover rounded-md"
        />
      )}
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">{preview.title}</p>
        <p className="text-sm text-gray-700 dark:text-gray-400">{preview.description}</p>
      </div>
    </a>
  );
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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet.</div>
      ) : (
        <AnimatePresence>
          {messages.map((message, index) => {
            const isSender = message.senderId === senderId;
            const previousMessage = messages[index - 1];
            const showProfileImage =
              !previousMessage || previousMessage.senderId !== message.senderId;

            const urls = message.text?.match(urlRegex);
            const firstUrl = urls?.[0];

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  isSender ? "justify-end" : !showProfileImage ? "pl-12" : ""
                } ${!showProfileImage ? "pr-12" : ""} items-start gap-2.5`}
              >
                {!isSender && showProfileImage && (
                  <img
                    src={message.sender.image || "/avatar.png"}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                )}

                <div className="grid w-max max-w-[75%]">
                  {showProfileImage && (
                    <h5 className="dark:text-gray-300 text-gray-800 text-sm font-semibold pb-1">
                      {isGroupChat
                        ? message.sender.username
                        : isSender
                        ? "You"
                        : message.sender.username}
                    </h5>
                  )}

                  <div
                    className={`p-3 ${
                      isSender
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    } rounded-3xl ${
                      isSender ? "rounded-tr-none" : "rounded-tl-none"
                    } shadow-md flex flex-col`}
                  >
                    <ImageContainer message={{ image: message.image }} />
                    {firstUrl && <LinkPreview url={firstUrl} />}
                    <p className="text-sm leading-snug break-words">
                      {parseText(message.text)}
                    </p>
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

                {isSender && showProfileImage && (
                  <img
                    src={message.sender.image || "/avatar.png"}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                )}
              </motion.div>
            );
          })}
          <div ref={bottomRef} />
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChatMessages;
