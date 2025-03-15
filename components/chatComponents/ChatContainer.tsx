import { prisma } from "@/lib/prisma";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { getUserIdByUsername, readChats } from "@/actions/chat.action";
import { auth } from "@clerk/nextjs/server";
import { CheckCheck } from "lucide-react";

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

  const recId = await getUserIdByUsername(username);
  if (!recId) return <div className="p-4">User not found.</div>;

  const sender = await prisma.user.findFirst({
    where: { clerkId: userId },
    select: { id: true, image: true },
  });
  if (!sender) return <div className="p-4">User not found.</div>;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: sender.id, receiverId: recId },
        { senderId: recId, receiverId: sender.id },
      ],
    },
    include: { sender: true, receiver: true },
    orderBy: { createdAt: "asc" },
  });

  const unreadMessages = messages.filter(
    (message) => message.receiverId === sender.id && message.status !== "READ"
  );
  if (unreadMessages.length > 0) {
    const unreadIds = unreadMessages.map((msg) => msg.id);
    await readChats(unreadIds, chatPath);
  }


  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader username={username} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet.</div>
        ) : (
          messages.map((message) => {
            const isSender = message.senderId === sender.id;
            return (
              <div key={message.id} className={`flex ${isSender ? "justify-end" : "justify-start"} items-end space-x-2`}>
                {!isSender && (
                  <img
                    src={message.sender.image || "/avatar.png"}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                )}
                <div className={`flex flex-col p-3 rounded-lg max-w-xs shadow ${isSender ? "bg-emerald-500" : "bg-gray-200 dark:text-gray-900"}`}>
                  <div className="text-xs text-gray-500 self-end mb-1">{formatMessageTime(new Date(message.createdAt))}</div>
                  {message.image && (
                    <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
                  )}
                  <p>{message.text}</p>
                  {isSender && (
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
                      <CheckCheck className={`w-4 h-4 ${message.status === "READ" ? "text-blue-500" : "text-gray-400"}`} />
                      {message.status === "READ" ? "Seen" : "Delivered"}
                    </div>
                  )}
                </div>
                {isSender && (
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

      <MessageInput recId={recId} />
    </div>
  );
};

export default ChatContainer;
