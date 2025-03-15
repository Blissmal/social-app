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
    select: { id: true, image: true, username: true },
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

  // Mark unread messages as "READ"
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet.</div>
        ) : (
          messages.map((message) => {
            const isSender = message.senderId === sender.id;

            return (
              <div key={message.id} className={`flex ${isSender ? "justify-end" : "justify-start"} items-start gap-2.5`}>
                {/* Profile Image (Receiver only) */}
                {!isSender && (
                  <img
                    src={message.sender.image || "/avatar.png"}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                )}

                <div className="grid w-max max-w-[75%]">
                  <h5 className="text-gray-900 text-sm font-semibold pb-1">
                    {isSender ? "You" : message.sender.username}
                  </h5>
                  
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2 ${
                      isSender ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-900"
                    } rounded-3xl ${
                      isSender ? "rounded-tr-none" : "rounded-tl-none"
                    } shadow-md`}
                  >
                    {message.image && (
                      <img src={message.image} alt="Attachment" className="w-40 rounded-lg mb-1" />
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>

                  {/* Timestamp & Read Indicator */}
                  <div className="flex items-center justify-end text-xs text-gray-500 gap-1 mt-1">
                    <span>{formatMessageTime(new Date(message.createdAt))}</span>
                    {isSender && (
                      <CheckCheck
                        className={`w-4 h-4 ${
                          message.status === "READ" ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Profile Image (Sender only) */}
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
