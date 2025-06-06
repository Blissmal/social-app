// /app/api/pusher/typing/route.ts

import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const body = await req.json();
  const { chatId, username } = body;

  await pusherServer.trigger(`private-chat-typing-${chatId}`, "typing", {
    username,
  });

  return NextResponse.json({ success: true });
}
