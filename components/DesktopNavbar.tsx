"use client";

import { BellIcon, HomeIcon, MessageCircle, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { useEffect, useState } from "react";
import { getNotifications } from "@/actions/notification.action";
import toast from "react-hot-toast";

function DesktopNavbar() {
  type Notification = {
    post: { id: string; image: string | null; content: string | null } | null;
    comment: { id: string; createdAt: Date; content: string } | null;
    message: { id: string; image: string | null; createdAt: Date; text: string | null; sender: { id: string; name: string | null } } | null;
    creator: { id: string; name: string | null };
    read: boolean;
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      } catch (error) {
        toast.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Refresh every 10s
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <Button variant="ghost" className="relative flex items-center gap-2" asChild>
        <Link href="/notifications">
          <BellIcon className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/chats">
          <MessageCircle className="w-4 h-4" />
          <span className="hidden lg:inline">Chats</span>
        </Link>
      </Button>

      <UserButton />
    </div>
  );
}

export default DesktopNavbar;
