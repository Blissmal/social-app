import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { getChatData } from "@/actions/chat.action";
import ChatMessages from "./ChatMessages";

const ChatContainer = async ({ username }: { username: string }) => {
  const chatPath = `/chat/${username}`;
  const result = await getChatData(username, chatPath);

  if (result.error === "unauthorized") return <div className="p-4">Unauthorized</div>;
  if (result.error === "sender_not_found" || result.error === "receiver_not_found") {
    return <div className="p-4">User not found.</div>;
  }

  const { sender, groupChat, messages, recId, isGroupChat } = result;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader username={groupChat ? groupChat.name : username} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatMessages
          messages={messages || []}
          senderId={sender?.id || ""}
          isGroupChat={isGroupChat ?? false}
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
