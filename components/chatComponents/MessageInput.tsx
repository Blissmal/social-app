import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";

const MessageInput = () => {
  return (
    <div className="p-4 w-full">
      {/* Message Form */}
      <form className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Message Input */}
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Type a message..."
            value="any"
          />

          {/* File Input (Hidden) */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
          />

          {/* Image Upload Button */}
          <button
            type="button"
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition"
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
