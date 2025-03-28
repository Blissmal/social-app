import { NextResponse } from "next/server";
import Pusher from "pusher";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Ensure required env variables exist
if (
  !process.env.PUSHER_APP_ID ||
  !process.env.PUSHER_KEY ||
  !process.env.PUSHER_SECRET ||
  !process.env.PUSHER_CLUSTER
) {
  throw new Error("Missing Pusher environment variables.");
}

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const { isOnline } = await req.json();
    if (typeof isOnline !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, clerkId: true, online: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only update DB if status actually changes
    if (user.online !== isOnline) {
      await prisma.user.update({
        where: { id: user.id },
        data: { online: isOnline, lastSeen: new Date() },
      });

      console.log(
        `🔵 ${user.id} (Clerk: ${user.clerkId}) is now ${
          isOnline ? "ONLINE" : "OFFLINE"
        }`
      );

      // Send both Clerk ID and Database ID
      await pusher.trigger("presence-chat", "user-status", {
        clerkId: user.clerkId,
        userId: user.id, // Send DB ID as well
        isOnline,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error in /api/socket:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
