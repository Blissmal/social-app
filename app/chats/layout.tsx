'use client';

import { ReactNode } from "react";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
        <body>
        <div>{children}</div>
        </body>
    </html>
  );
};

export default ChatLayout;
