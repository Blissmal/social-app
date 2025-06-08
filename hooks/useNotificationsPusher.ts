import { useEffect } from "react";
import Pusher from "pusher-js";
import { getPusherClient } from "@/lib/pusherClient";

export function useNotificationsPusher(
  userId: string,
  onNewNotification: (notification: any) => void
) {
  useEffect(() => {
    if (!userId) return;

    const pusher = getPusherClient();

    const channel = pusher.subscribe(`private-user-notifications-${userId}`);

    channel.bind("new-notification", (data: any) => {
      onNewNotification(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId, onNewNotification]);
}
