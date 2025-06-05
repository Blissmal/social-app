// components/ChatHeaderServer.tsx
import { prisma } from "@/lib/prisma";
import ChatHeaderClient from "./ChatHeaderClient";

export default async function ChatHeader({ username }: { username: string }) {
  const user = await prisma.user.findFirst({
    where: { username },
    select: { id: true, image: true, online: true, lastSeen: true },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <ChatHeaderClient
      username={username}
      userId={user.id}
      image={user.image}
      initialOnline={user.online}
      initialLastSeen={user.lastSeen}
    />
  );
}
