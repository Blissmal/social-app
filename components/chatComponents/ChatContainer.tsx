import { Suspense } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { getChatData } from "@/actions/chat.action";
import ChatMessages from "./ChatMessages";

interface ChatContainerProps {
  username: string;
}

const ChatContainer = async ({ username }: ChatContainerProps) => {
  const chatPath = `/chat/${username}`;
  const result = await getChatData(username, chatPath);

  if (result.error === "unauthorized") {
    return <div className="p-4">Unauthorized</div>;
  }

  if (result.error === "sender_not_found" || result.error === "receiver_not_found") {
    return <div className="p-4">User not found.</div>;
  }

  const { sender, groupChat, messages, recId, isGroupChat } = result;

  if (!sender?.id) {
    console.error("Sender ID is missing from getChatData result.");
    return <div className="p-4">Something went wrong.</div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader username={groupChat ? groupChat.name : username} />

      {/* altered this line to add padding */}

      <div className="flex-1 overflow-y-auto md:p-4 space-y-4">
        <ChatMessages
          messages={messages || []}
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
