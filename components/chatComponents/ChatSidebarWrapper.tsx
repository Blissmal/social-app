"use client";

import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import SidebarContent from "./SidebarContent";

const SidebarWrapper = ({ serverUsers, groups }: any) => {
  const onlineUsers = useOnlineUsers();

  const mergedUsers = serverUsers.map((user: any) => ({
    ...user,
    online: onlineUsers[user.id] ?? user.online, // fallback to initial
  }));

  return <SidebarContent users={mergedUsers} groups={groups} />;
};

export default SidebarWrapper;
