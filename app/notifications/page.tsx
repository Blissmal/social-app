"use client";

import { useEffect, useState, useCallback } from "react";
import { getNotifications, markNotificationsAsRead } from "@/actions/notification.action";
import { useAuth } from "@clerk/nextjs";
import { NotificationsSkeleton } from "@/components/user/NotificationSkeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationsPusher } from "@/hooks/useNotificationsPusher";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

const getNotificationIcon = (type: string, isGroupMessage: boolean) => {
  if (type === "MESSAGE") {
    return isGroupMessage ? (
      <MessageCircleIcon className="size-4 text-purple-500" />
    ) : (
      <MessageCircleIcon className="size-4 text-blue-500" />
    );
  }

  switch (type) {
    case "LIKE":
      return <HeartIcon className="size-4 text-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="size-4 text-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="size-4 text-green-500" />;
    default:
      return null;
  }
};

const NotificationsPage = () => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds);
      } catch {
        toast.error("Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) return prev;
      return [notification, ...prev];
    });
  }, []);

  useNotificationsPusher(userId || "", handleNewNotification);

  if (isLoading) return <NotificationsSkeleton />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <span className="text-sm text-muted-foreground">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <AnimatePresence>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
                ) : (
                  notifications.map((notification, index) => {
                    const isGroupMessage = Boolean(notification.message?.groupId);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                          !notification.read ? "bg-muted/50" : ""
                        }`}
                      >
                        <Avatar className="mt-1">
                          <AvatarImage src={notification.creator.image ?? "/avatar.png"} />
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type, isGroupMessage)}
                            <span>
                              <span className="font-medium">
                                {notification.creator.name ?? notification.creator.username}
                              </span>{" "}
                              {isGroupMessage
                                ? `sent a message in ${notification.message?.group?.name}`
                                : notification.type === "FOLLOW"
                                ? "started following you"
                                : notification.type === "LIKE"
                                ? "liked your post"
                                : notification.type === "COMMENT"
                                ? "commented on your post"
                                : "sent you a message"}
                            </span>
                          </div>
                          {notification.type === "MESSAGE" && notification.message && (
                            <div className="pl-6 space-y-2">
                              <div
                                className={`text-sm text-muted-foreground rounded-md p-2 ${
                                  isGroupMessage ? "bg-purple-200" : "bg-muted/30"
                                } mt-2`}
                              >
                                <p>{notification.message.text}</p>
                                {notification.message.image && (
                                  <img
                                    src={notification.message.image}
                                    alt="Message content"
                                    className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground pl-6">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </motion.div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
