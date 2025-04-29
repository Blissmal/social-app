import { prisma } from "@/lib/prisma";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { getUserIdByUsername, readChats } from "@/actions/chat.action";
import { auth } from "@clerk/nextjs/server";
import { Check, CheckCheck } from "lucide-react";
import ImageContainer from "./ChatImageContainer";
import ChatMessages from "./ChatMessages";

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
        <ChatMessages
          messages={messages}
          senderId={sender.id}
          isGroupChat={isGroupChat}
        />
      </div>

      <MessageInput
        recId={isGroupChat ? undefined : recId}
        groupId={isGroupChat ? groupChat?.id : undefined}
      />
    </div>
  );
};

export default ChatContainer;
