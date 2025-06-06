
import ChatContainer from "@/components/chat/ChatContainer";
import ChatNav from "@/components/chat/ChatNav";
import Sidebar from "@/components/chat/ChatSideBar";
import NoChatSelected from "@/components/chat/NoChatSelected";
import SidebarSkeleton from "@/components/ui/skeletons/SidebarSkeleton";
import { ReactNode, Suspense } from "react";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    
    <div className="h-screen bg-base-200">
      {/* altered this line to add padding */}
      <div className="flex items-center justify-center md:px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar />
            </Suspense>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
