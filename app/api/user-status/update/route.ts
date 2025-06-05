import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const { username, online } = await req.json();

    if (typeof username !== "string" || typeof online !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Update user online status and lastSeen (if going offline)
    const user = await prisma.user.update({
      where: { username },
      data: {
        online,
        lastSeen: online ? undefined : new Date(),
      },
      select: { id: true },
    });

    // Trigger Pusher event for realtime status update
    await pusher.trigger("presence-chat", "user-status", {
      userId: user.id,
      isOnline: online,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
