import { NextResponse } from "next/server";
import Pusher from "pusher";
import { prisma } from "@/lib/prisma";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  const { userId, isOnline } = await req.json();

  if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

  await prisma.user.update({
    where: { id: userId },
    data: { online: isOnline, lastSeen: isOnline ? null : new Date() },
  });

  // Broadcast event to update all clients
  await pusher.trigger("presence-chat", "user-status", {
    userId,
    isOnline,
  });

  return NextResponse.json({ success: true });
}
