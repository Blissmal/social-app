import { NextResponse } from "next/server";
import Pusher from "pusher";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
    let body;

    const contentType = req.headers.get("content-type");

    // Support JSON and text/plain (used by navigator.sendBeacon)
    if (contentType?.includes("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      body = JSON.parse(text);
    }

    const { isOnline } = body;
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

      await pusher.trigger("presence-chat", "user-status", {
        clerkId: user.clerkId,
        userId: user.id,
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
