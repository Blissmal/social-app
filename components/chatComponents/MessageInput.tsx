// components/MessageInput.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImageIcon, Send, Loader2 } from "lucide-react";
import ImageUpload from "../ImageUpload";
import { useReply } from "@/hooks/useReply";
import { Button } from "../ui/button";
import { getChatId } from "@/utils/chat";

interface MessageInputProps {
  recId?: string;
  groupId?: string;
  chatPath: string;
  currentUserId: string;
  currentUsername: string;
}

const MessageInput = ({
  recId,
  groupId,
  chatPath,
  currentUserId,
  currentUsername,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const { replyTo, clearReply } = useReply();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emitTyping = useCallback(() => {
    if (typingTimeoutRef.current) return;

    const chatId = groupId || getChatId(currentUserId, recId!);

    console.log("Emitting typing event for chat:", chatId, "by user:", currentUsername);

    fetch("/api/messages/typing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        username: currentUsername,
      }),
    });

    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 3000);
  }, [recId, groupId, currentUserId, currentUsername]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageUrl) return toast.error("Enter message");
    setLoading(true);
    try {
      const body = {
        receiverId: recId,
        groupId,
        text: message.trim() || undefined,
        image: imageUrl || undefined,
        replyToId: replyTo?.id,
        chatPath,
      };
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok || !result.success) toast.error(result.error);
      else {
        setMessage("");
        setImageUrl("");
        clearReply();
        setShowImageUpload(false);
      }
    } catch (err) {
      toast.error("Send error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            emitTyping();
          }}
          placeholder="Type a message..."
        />
        <Button type="submit" disabled={loading || (!recId && !groupId)}>
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;