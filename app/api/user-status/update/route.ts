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
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Update user online status and lastSeen
    await prisma.user.update({
      where: { username },
      data: {
        online,
        lastSeen: online ? undefined : new Date(),
      },
    });

    // Broadcast update on Pusher channel (public channel or presence channel)
    await pusher.trigger("user-status", "status-updated", {
      username,
      online,
      lastSeen: online ? null : new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
