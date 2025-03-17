import { prisma } from "@/lib/prisma";
import { X } from "lucide-react";
import Link from "next/link";

const ChatHeader = async ({username} : {username: string}) => {

  const user = await prisma.user.findFirst({
    where: {
      username: username
    }
  })


  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {user ? <img src={user?.image || "/avatar.png"} /> : <img src="/group.png" />}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{username}</h3>
            <p className="text-sm text-base-content/70">
              {user?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <Link href="/chats">
          <X />
        </Link>
      </div>
    </div>
  );
};
export default ChatHeader;
