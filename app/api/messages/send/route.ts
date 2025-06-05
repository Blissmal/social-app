import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "@/actions/user.action";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const {
      receiverId,
      groupId,
      replyToId,
      text,
      image,
    }: {
      receiverId?: string;
      groupId?: string;
      replyToId?: string;
      text?: string;
      image?: string;
    } = await req.json();

    let status: "SENT" | "DELIVERED" | "SEEN" = "SENT";

    if (receiverId) {
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { online: true },
      });

      status = receiver?.online ? "DELIVERED" : "SENT";
    }

    const senderId = await getDbUserId();
    if (!senderId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (receiverId && groupId) {
      return NextResponse.json({ success: false, error: "Cannot send to both user and group" }, { status: 400 });
    }

    if (!receiverId && !groupId) {
      return NextResponse.json({ success: false, error: "Receiver or group required" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId: receiverId || null,
        groupId: groupId || null,
        replyToId: replyToId || null,
        text,
        image,
        status,
      },
      include: {
        sender: true,
      },
    });

    // Notifications
    if (receiverId) {
      await prisma.notification.create({
        data: {
          type: "MESSAGE",
          userId: receiverId,
          creatorId: senderId,
          messageId: message.id,
        },
      });
    } else if (groupId) {
      const groupMembers = await prisma.groupMember.findMany({
        where: { groupId },
        select: { userId: true },
      });

      const memberIds = groupMembers
        .map((m) => m.userId)
        .filter((id) => id !== senderId);

      if (memberIds.length > 0) {
        await prisma.notification.createMany({
          data: memberIds.map((userId) => ({
            type: "MESSAGE",
            userId,
            creatorId: senderId,
            messageId: message.id,
          })),
        });
      }
    }

    // Realtime broadcast
    const channel = groupId
  ? `presence-chat-group-${groupId}`
  : `presence-chat-user-${receiverId}`;

    await pusherServer.trigger(channel, "new-message", message);

    revalidatePath("/");

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
