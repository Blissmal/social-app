import { prisma } from "@/lib/prisma";
import { X } from "lucide-react";
import Link from "next/link";

const ChatHeader = async ({ username }: { username: string }) => {
  const user = await prisma.user.findFirst({
    where: { username },
    select: { image: true, online: true, lastSeen: true },
  });

  const getLastSeenText = (lastSeen: Date | null): string => {
    if (!lastSeen) return "Offline";

    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Last seen just now";
    if (diffMinutes < 60) return `Last seen ${diffMinutes} min ago`;
    if (diffHours < 24) return `Last seen ${diffHours} hrs ago`;

    if (diffDays === 1) {
      return `Last seen yesterday at ${lastSeenDate.toLocaleTimeString(
        "en-US",
        { hour: "2-digit", minute: "2-digit", hour12: false }
      )}`;
    }

    return `Last seen on ${lastSeenDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })} at ${lastSeenDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={user?.image || "/avatar.png"} alt={username} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{username}</h3>
            <p className="text-sm text-base-content/70">
              {user?.online
                ? "Online"
                : getLastSeenText(user?.lastSeen || null)}
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
