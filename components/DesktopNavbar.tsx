"use client"
import { BellIcon, HomeIcon, InfoIcon, MessageCircle, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { getNotifications } from "@/actions/notification.action";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function DesktopNavbar() {
  const { user, isLoaded } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const data = await getNotifications();
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
        if (unread > unreadCount) {
          toast("New unread notifications!", {
            icon: "🔔",
            style: {
              background: "#3b82f6",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {isLoaded ? (
        user ? (
          <>
            <Button variant="ghost" className="flex items-center gap-2 relative" asChild>
              <Link href="/notifications">
                <BellIcon className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
                <span className="hidden lg:inline">Notifications</span>
              </Link>
            </Button>

            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link
                href={`/profile/${
                  user.username ??
                  user.primaryEmailAddress?.emailAddress.split("@")[0]
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Profile</span>
              </Link>
            </Button>

            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/chats">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden lg:inline">Chats</span>
              </Link>
            </Button>

            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
        )
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}

export default DesktopNavbar;
