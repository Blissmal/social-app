"use client";

import { useState } from "react";
import { sendMessage } from "@/actions/chat.action";
import { ImageIcon, Send, X, Loader2 } from "lucide-react";
import ImageUpload from "../ImageUpload";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const MessageInput = ({ recId, groupId }: { recId?: string; groupId?: string }) => {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageUrl) {
      toast.error("No message input or image to send");
      return;
    }

    setLoading(true);
    try {
      // Send message to either a user (private chat) or a group
      await sendMessage({ 
        receiverId: recId, 
        groupId, 
        text: message, 
        image: imageUrl 
      });

      setMessage("");
      setImageUrl("");
      setShowImageUpload(false);

      toast.success("Message sent");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex flex-col gap-2">
          {/* Message Input */}
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!recId && !groupId} // Disable input if no valid recipient
          />

          {/* Image Upload Section */}
          {showImageUpload && (
            <div className="border rounded-lg p-4">
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
            onClick={() => setShowImageUpload(!showImageUpload)}
          >
            <ImageIcon className="size-4 mr-2" />
            Photo
          </Button>

          <button
            type="submit"
            disabled={loading || (!recId && !groupId)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              <Send size={22} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
