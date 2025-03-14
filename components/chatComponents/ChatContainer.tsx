import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = ({username}: {username: string}) => {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader username={username}/>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-end items-end space-x-2">
          

          {/* Message Content */}
          <div className="flex flex-col dark:bg-gray-100 p-3 rounded-lg max-w-xs shadow">
            {/* Timestamp */}
            <div className="text-xs text-gray-500 self-end mb-1">11:04 pm</div>

            {/* Message Text */}
            <p className="text-gray-800">Lorem ipsum dolor sit.</p>
          </div>
          {/* Profile Image */}
          <div className="w-10 h-10 rounded-full border overflow-hidden">
            <img
              src="/avatar.png"
              alt="profile pic"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex justify-start items-end space-x-2">
          {/* Profile Image */}
          <div className="w-10 h-10 rounded-full border overflow-hidden">
            <img
              src="/avatar.png"
              alt="profile pic"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Message Content */}
          <div className="flex flex-col dark:bg-gray-100 p-3 rounded-lg max-w-xs shadow">
            {/* Timestamp */}
            <div className="text-xs text-gray-500 self-end mb-1">11:04 pm</div>

            {/* Message Text */}
            <p className="text-gray-800">Lorem ipsum dolor sit.</p>
          </div>
        </div>
        <div className="flex justify-start items-end space-x-2">
          {/* Profile Image */}
          <div className="w-10 h-10 rounded-full border overflow-hidden">
            <img
              src="/avatar.png"
              alt="profile pic"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Message Content */}
          <div className="flex flex-col dark:bg-gray-100 p-3 rounded-lg max-w-xs shadow">
            {/* Timestamp */}
            <div className="text-xs text-gray-500 self-end mb-1">11:04 pm</div>

            {/* Message Text */}
            <p className="text-gray-800">Lorem ipsum dolor sit.</p>
          </div>
        </div>
        <div className="flex justify-end items-end space-x-2">
          

          {/* Message Content */}
          <div className="flex flex-col dark:bg-gray-100 p-3 rounded-lg max-w-xs shadow">
            {/* Timestamp */}
            <div className="text-xs text-gray-500 self-end mb-1">11:04 pm</div>

            {/* Message Text */}
            <p className="text-gray-800">Lorem ipsum dolor sit.</p>
          </div>
          {/* Profile Image */}
          <div className="w-10 h-10 rounded-full border overflow-hidden">
            <img
              src="/avatar.png"
              alt="profile pic"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex justify-end items-end space-x-2">
          

          {/* Message Content */}
          <div className="flex flex-col dark:bg-gray-100 p-3 rounded-lg max-w-xs shadow">
            {/* Timestamp */}
            <div className="text-xs text-gray-500 self-end mb-1">11:04 pm</div>

            {/* Message Text */}
            <p className="text-gray-800">Lorem ipsum dolor sit.</p>
          </div>
          {/* Profile Image */}
          <div className="w-10 h-10 rounded-full border overflow-hidden">
            <img
              src="/avatar.png"
              alt="profile pic"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
