// components/chat/SidebarClient.tsx
"use client";

import { useEffect, useState } from "react";
import { usePusher } from "@/hooks/usePusher";
import Link from "next/link";
import Image from "next/image";
import { GroupIcon, User } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";
import { ScrollArea } from "../ui/scroll-area";
// multiple users typing indicators
import { useTypingIndicatorsMap } from "@/hooks/useTypingIndicatorsMap";

type SidebarClientProps = {
  initialUsers: {
    id: string;
    username: string;
    image: string | null;
    online: boolean;
  }[];
  groups: {
    id: string;
    name: string;
  }[];
  username: string; // new prop for current user's username
  currentUid: string;// new prop for current user's ID
};

export default function SidebarClient({ initialUsers, groups, username, currentUid }: SidebarClientProps) {
  const [users, setUsers] = useState(initialUsers);

  const typingMap = useTypingIndicatorsMap({
    currentUserId: currentUid,
  currentUsername: username,
  users: initialUsers,
}); // custom hook to manage typing indicators

console.log(typingMap, "Typing Map"); // new test log

  usePusher((data) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === data.userId ? { ...user, online: data.isOnline } : user
      )
    );
  });

  return (
    <>
      <ScrollArea className="overflow-y-auto w-full py-3">
        <div className="text-center flex space-x-4 text-zinc-500 py-4 px-2 lg:px-0">
          <User />
          <p className="block">User Chats</p>
        </div>

        {users.map((user) => (
          <Link
            key={user.id}
            href={`/chats/${user.username}`}
            className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
          >
            <div className="relative mx-0">
              <img
                src={user.image || "/avatar.png"}
                width={48}
                height={48}
                className="rounded-full"
                alt="User avatar"
              />
              <span
                className={`absolute bottom-0 right-0 size-3 ${
                  user.online ? "bg-green-500" : "bg-orange-500"
                } rounded-full ring-2 ring-zinc-900`}
              />
            </div>
            <div className="block text-left min-w-0">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-sm text-zinc-400">
                {typingMap[user.id]
    ? `${typingMap[user.id]} is typing...`
    : user.online
    ? "Online"
    : "Offline"}
              </div>
            </div>
          </Link>
        ))}

        <div className="text-center flex justify-between items-center lg:pl-0 pl-2 pr-2 text-zinc-500 py-4">
          <div className="flex space-x-4">
            <GroupIcon />
            <p className="block">Groups</p>
          </div>
          <CreateGroupModal users={initialUsers} />
        </div>

        {groups.map((group) => (
          <Link
            href={`/chats/${group.id}`}
            key={group.id}
            className="flex space-x-4 justify-start items-center rounded-md p-3 dark:hover:bg-gray-800 hover:bg-gray-100"
          >
            <Image
              src="/group.png"
              alt="group image"
              width={32}
              height={32}
              className="rounded-full"
            />
            <p className="block">{group.name}</p>
          </Link>
        ))}
      </ScrollArea>
    </>
  );
}
