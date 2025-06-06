import { useEffect } from "react";
import Pusher from "pusher-js";

export function useNotificationsPusher(
  userId: string,
  onNewNotification: (notification: any) => void
) {
  useEffect(() => {
    if (!userId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
      // For secure private channels
      auth: {
        headers: {
          // Optional: add auth headers if needed, e.g. authorization token
        },
      },
    });

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
