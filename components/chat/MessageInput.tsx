// components/MessageInput.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImageIcon, Send, Loader2 } from "lucide-react";
import ImageUpload from "../h-utils/ImageUpload";
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
      toast.success("Message sent successfully");
    } catch (err) {
      toast.error("Send error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full bg-white border-t border-gray-200">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex flex-col gap-2">
          {/* Reply preview */}
          {replyTo && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-t-md border-b border-blue-300 flex justify-between items-center text-sm">
              <span>
                Replying to: {replyTo.text || "[Image]"}
              </span>
              <button
                type="button"
                onClick={clearReply}
                className="text-red-600 hover:underline"
                aria-label="Cancel reply"
              >
                ✕
              </button>
            </div>
          )}

          {/* Text input */}
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-sm sm:text-base"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              emitTyping();
            }}
            disabled={loading || (!recId && !groupId)}
            aria-label="Message input"
          />

          {/* Image upload UI */}
          {showImageUpload && (
            <div className="border border-gray-300 rounded-md p-3">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url || "");
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-emerald-600"
            onClick={() => setShowImageUpload((v) => !v)}
            aria-label="Toggle image upload"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="hidden md:inline ml-1">Photo</span>
          </Button>

          <button
            type="submit"
            disabled={
              loading || (!recId && !groupId) || (!message.trim() && !imageUrl)
            }
            className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;