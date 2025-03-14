import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { auth } from "@clerk/nextjs/server";
import { getMessages, getUserIdByUsername } from "@/actions/chat.action";

const ChatContainer = async ({ username }: { username: string }) => {
  const { userId } = await auth();
  if (!userId) return;
  const recId = await getUserIdByUsername(username);
  const formatMessageTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  
  
  if (!recId) return;
  const messages = await getMessages(recId);
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader username={username} />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div className="flex justify-end items-end space-x-2">
            <div className="flex flex-col dark:bg-gray-100 p-3 rounded-lg max-w-xs shadow">
              <div className="text-xs text-gray-500 self-end mb-1">
                {formatMessageTime(message.createdAt)}
              </div>
              <span className="flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}</span>
            </div>
            <div className="w-10 h-10 rounded-full border overflow-hidden">
              <img
                src="/avatar.png"
                alt="profile pic"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
