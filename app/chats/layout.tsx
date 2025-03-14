'use client';

import ChatNav from "@/components/chatComponents/ChatNav";
import { ReactNode } from "react";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
        <body>
          <ChatNav />
        <div>{children}</div>
        </body>
    </html>
  );
};

export default ChatLayout;
