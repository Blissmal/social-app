import { NextResponse } from "next/server";
import Pusher from "pusher";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const { isOnline } = await req.json();
    const { userId: clerkId } = await auth(); // Clerk ID

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the database user ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, clerkId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update online status
    await prisma.user.update({
      where: { id: user.id },
      data: { online: isOnline, lastSeen: new Date() },
    });

    // Broadcast event
    await pusher.trigger("presence-chat", "user-status", {
      userId: user.clerkId,
      isOnline,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/socket:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
