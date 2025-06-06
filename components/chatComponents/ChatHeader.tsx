// components/ChatHeaderServer.tsx
import { prisma } from "@/lib/prisma";
import ChatHeaderClient from "./ChatHeaderClient";
import { getUserIdByUsername } from "@/actions/chat.action";
import { getDbUserId } from "@/actions/user.action";
import { getProfileByUsername } from "@/actions/profile.action";

export default async function ChatHeader({ username }: { username: string }) {
  const user = await prisma.user.findFirst({
    where: { username },
    select: { id: true, image: true, online: true, lastSeen: true },
  });

  if (!user) {
    return <div>User not found</div>;
  }
  const uid = await getDbUserId();
 const dbUsername = await prisma.user.findUnique({
    where: { id: uid || "" },
    select: { username: true },
  });
  

  
  return (
    <ChatHeaderClient
      currentUserId={uid || ""} 
      currentUsername={dbUsername?.username || ""}
      username={username}
      userId={user.id}
      image={user.image}
      initialOnline={user.online}
      initialLastSeen={user.lastSeen}
    />
  );
}
