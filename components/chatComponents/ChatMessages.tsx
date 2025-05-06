"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check, CheckCheck, Reply } from "lucide-react";
import { useReply } from "@/hooks/useReply";
import ImageContainer from "./ChatImageContainer";
import MessageText from "./MessageText";

const formatMessageTime = (date: Date): string =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const ChatMessages = ({
  messages,
  senderId,
  isGroupChat,
}: {
  messages: any[];
  senderId: string;
  isGroupChat: boolean;
}) => {
  const { setReply } = useReply();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet.</div>
      ) : (
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isSender = message.senderId === senderId;
            const repliedMessage = message.replyToId
              ? messages.find((msg) => msg.id === message.replyToId)
              : null;

            return (
              <SwipeableMessage
                key={message.id}
                message={message}
                isSender={isSender}
                repliedMessage={repliedMessage}
                onReply={() => setReply(message)}
              />
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChatMessages;

function SwipeableMessage({
  message,
  isSender,
  repliedMessage,
  onReply,
}: {
  message: any;
  isSender: boolean;
  repliedMessage: any;
  onReply: () => void;
}) {
  const x = useMotionValue(0);
  const iconOpacity = useTransform(x, [-60, 0, 60], [1, 0, 1]); // Make it fully visible on drag
  const iconX = useTransform(x, [-60, 0, 60], [-10, 0, 10]); // Move the icon based on drag

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 40;
    if (isSender && info.offset.x < -threshold) {
      onReply();
    } else if (!isSender && info.offset.x > threshold) {
      onReply();
    }
  };

  return (
    <motion.div
      drag="x"
      dragElastic={0.2}
      dragConstraints={{ left: 0, right: isSender ? 60 : 0 }} // Set constraints for senders and receivers
      onDragEnd={handleDragEnd}
      style={{ x }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={`flex ${
        isSender ? "justify-end" : ""
      } items-start gap-2.5 relative overflow-x-visible`}
    >
      {/* Reply icon (always visible when swiped) */}
      <motion.div
        style={{
          opacity: iconOpacity,
          x: iconX,
          left: isSender ? "auto" : "-30px",
          right: isSender ? "-30px" : "auto",
        }}
        className="absolute top-1/2 transform -translate-y-1/2 text-blue-500"
      >
        <Reply className="w-4 h-4" />
      </motion.div>

      {/* Avatar left */}
      {!isSender && (
        <img
          src={message.sender.image || "/avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full border object-cover"
        />
      )}

      <div className="grid w-max max-w-[75%]">
        <div
          className={`p-3 ${
            isSender ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
          } rounded-3xl ${
            isSender ? "rounded-tr-none" : "rounded-tl-none"
          } shadow-md flex flex-col cursor-pointer`}
          onClick={onReply}
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
          <span>{formatMessageTime(new Date(message.createdAt))}</span>
          {isSender &&
            ({
              SENT: <Check className="w-4 h-4 text-gray-400" />,
              DELIVERED: <CheckCheck className="w-4 h-4 text-gray-400" />,
              READ: <CheckCheck className="w-4 h-4 text-blue-500" />,
            }[message.status as "SENT" | "DELIVERED" | "READ"])}
        </div>
      </div>

      {/* Avatar right */}
      {isSender && (
        <img
          src={message.sender.image || "/avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full border object-cover"
        />
      )}
    </motion.div>
  );
}
