import { GroupIcon, MessageCircle, Plus, User, Users } from "lucide-react";
import { getUsersForSidebar } from "@/actions/chat.action";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "@/actions/user.action";
import CreateGroupModal from "./CreateGroupModal";
import Image from "next/image";

const Sidebar = async () => {
  const users = await getUsersForSidebar();
  const userId = await getDbUserId();
  if (!userId) throw new Error("Not authenticated");

  const groups = await prisma.groupChat.findMany({
    where: { members: { some: { userId } } },
    select: { id: true, name: true },
  });

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-6" />
          <span className="font-medium hidden lg:block">Chats</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
      <div className="text-center flex space-x-4 text-zinc-500 py-4">
          <User />
          <p>User Chats</p>
        </div>
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/chats/${user.username}`}
            className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.image || "/avatar.png"}
                className="size-12 object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-sm text-zinc-400">Online</div>
            </div>
          </Link>
        ))}

        {/* Create Group Modal Trigger */}
        {/* <CreateGroupModal users={users} /> */}

        <div className="text-center flex justify-between items-center pr-2 text-zinc-500 py-4">
          <div className="flex space-x-4">
          <GroupIcon />
          <p>Groups</p>
          </div>
          <CreateGroupModal users={users} />
        </div>

        {groups.map((group) => (
          <Link href={`/chats/${group.id}`} key={group.id} className="flex space-x-4 justify-start items-center rounded-md p-3 bg-gray-300 hover:bg-gray-200">
            <Image src="/group.png" alt="group image" width={32} height={32}/>
            <p>{group.name}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
