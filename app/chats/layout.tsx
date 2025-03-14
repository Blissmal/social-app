'use client';

import ChatNav from "@/components/chatComponents/ChatNav";
import { ReactNode } from "react";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    
    <div>
      <header>
        <ChatNav />
      </header>
      <div>
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
