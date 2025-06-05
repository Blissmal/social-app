// components/chat/Sidebar.tsx
import { getUsersForSidebar } from "@/actions/chat.action";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "@/actions/user.action";
import SidebarToggle from "./ChatSidebarToggle";
import { MessageCircle } from "lucide-react";
import OnlineStatus from "../OnlineStatus";
import { SearchUserDialog } from "./SearchUserDialog";
import SidebarClient from "./ChatSidebarClient";

const Sidebar = async () => {
  const users = await getUsersForSidebar();
  const userId = await getDbUserId();
  if (!userId) throw new Error("Not authenticated");

  const groups = await prisma.groupChat.findMany({
    where: { members: { some: { userId } } },
    select: { id: true, name: true },
  });

  return (
    <>
      <SidebarToggle />
      <aside
        id="sidebar"
        className="h-full border-r border-base-300 flex flex-col transition-all duration-200 fixed lg:relative top-0 left-0 w-64 lg:w-72 transform lg:translate-x-0 -translate-x-full sm:dark:bg-black sm:bg-white dark:bg-black bg-white lg:z-0 z-50"
      >
        <div className="border-b flex items-center justify-between border-base-300 w-full p-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-6" />
            <span className="font-medium hidden lg:block">Chats</span>
            <OnlineStatus />
          </div>
          <SearchUserDialog />
        </div>

        {/* Client Part */}
        <SidebarClient initialUsers={users} groups={groups} />
      </aside>
    </>
  );
};

export default Sidebar;
