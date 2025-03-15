import { GroupIcon, Plus, Users, X } from "lucide-react";
import { getUsersForSidebar } from "@/actions/chat.action";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "@/actions/user.action";

const Sidebar = async () => {
  const users = await getUsersForSidebar();

  const userId = await getDbUserId();

  if (!userId) {
    throw new Error("not auth");
  }

  const groups = await prisma.groupChat.findMany({
    where: { members: { some: { userId } } },
    select: { id: true, name: true },
  });

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Users</span>
        </div>
        {/* TODO: Online filter toggle */}
        {/* <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked
              //   onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">10 online)</span>
        </div> */}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
          <Link
          key={user.id}
          href={`/chats/${user.username}`}
            // onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.image || "/avatar.png"}
                className="size-12 object-cover rounded-full"
              />
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
              />
            </div>

            {/* User info - only visible on larger screens */}

            <div key={user.id} className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-sm text-zinc-400">online</div>
            </div>
          </Link>
        ))}

        <div className="flex space-x-3 cursor-pointer">
          <Plus />create group
        </div>

        <div className="text-center flex space-x-4 text-zinc-500 py-4">
          <GroupIcon />
          <p>Groups</p>
        </div>
        {groups.map((group) => (
          <Link href={`/chats/${group.id}`} key={group.id}>
            <p >{group.name}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;
