import { prisma } from "@/lib/prisma";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { getUserIdByUsername, readChats } from "@/actions/chat.action";
import { auth } from "@clerk/nextjs/server";
import { Check, CheckCheck } from "lucide-react";
import ImageContainer from "./ChatImageContainer";

const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const ChatContainer = async ({ username }: { username: string }) => {
  const chatPath = `/chat/${username}`;
  const { userId } = await auth();
  if (!userId) return <div className="p-4">Unauthorized</div>;

  const sender = await prisma.user.findFirst({
    where: { clerkId: userId },
    select: { id: true, image: true, username: true },
  });

  if (!sender) return <div className="p-4">User not found.</div>;

  // Check if it's a group chat or a private chat
  const groupChat = await prisma.groupChat.findFirst({
    where: { id: username }, // Since groups use `id` as the unique identifier
    include: { members: { select: { userId: true } } },
  });

  let messages = [];
  let isGroupChat = false;

  let recId;

  if (groupChat) {
    isGroupChat = true;

    // Fetch messages for the group
    messages = await prisma.message.findMany({
      where: { groupId: groupChat.id },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    });

    // Mark unread group messages as "READ"
    const unreadMessages = messages.filter(
      (message) => message.senderId !== sender.id && message.status !== "READ"
    );
    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map((msg) => msg.id);
      await readChats(unreadIds, chatPath);
    }
  } else {
    // Handle one-on-one chat
    recId = await getUserIdByUsername(username);
    if (!recId) return <div className="p-4">User not found.</div>;

    messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: sender.id, receiverId: recId },
          { senderId: recId, receiverId: sender.id },
        ],
      },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: "asc" },
    });

    // Mark unread messages as "READ"
    const unreadMessages = messages.filter(
      (message) => message.receiverId === sender.id && message.status !== "READ"
    );
    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map((msg) => msg.id);
      await readChats(unreadIds, chatPath);
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader username={groupChat ? groupChat.name : username} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet.</div>
        ) : (
          messages.map((message, index) => {
            const isSender = message.senderId === sender.id;
            const previousMessage = messages[index - 1];
            const showProfileImage =
              !previousMessage || previousMessage.senderId !== message.senderId;

            return (
              <div
                key={message.id}
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
                        ? message.sender.username // Show sender in group chat
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

                    <p className="text-sm leading-snug">{message.text}</p>
                  </div>

                  <div className="flex items-center justify-end text-xs text-gray-500 gap-1 mt-1">
                    <span>
                      {formatMessageTime(new Date(message.createdAt))}
                    </span>
                    {isSender && (
                      <>
                        {message.status === "SENT" && (
                          <Check className="w-4 h-4 text-gray-400" /> // Single check for SENT
                        )}

                        {message.status === "DELIVERED" && (
                          <CheckCheck className="w-4 h-4 text-gray-400" /> // Two gray checks for DELIVERED
                        )}

                        {message.status === "READ" && (
                          <CheckCheck className="w-4 h-4 text-blue-500" /> // Two blue checks for READ
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
              </div>
            );
          })
        )}
      </div>

      <MessageInput
        recId={isGroupChat ? undefined : recId}
        groupId={isGroupChat ? groupChat?.id : undefined}
      />
    </div>
  );
};

export default ChatContainer;
