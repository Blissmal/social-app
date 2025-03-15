"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export async function getUsersForSidebar() {
  const {userId} = await auth()
  if (!userId) throw new Error("Unauthorized");

  try {
    return await prisma.user.findMany({
      where: { clerkId: { not: userId } },
      select: {
        id: true,
        username: true,
        image: true,
        name: true,
      },
    });
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);
    throw new Error("Failed to fetch users");
  }
}


export async function getMessages(userToChatId: string) {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized");
  
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: user.id },
          ],
        },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          text: true,
          image: true,
          createdAt: true,
        },
      });
  
      return messages || []; // Always return an array for consistency
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new Error("Failed to fetch messages");
    }
  }


export const sendMessage = async (receiverId: string, text?: string, image?: string) => {
    try {
        const userId = await getDbUserId()

        if (!userId) return;

        const message = await prisma.message.create({
            data: {
                senderId: userId,
                text,
                receiverId,
                image
            }
        })

        await prisma.notification.create({
          data: {
            type: "MESSAGE",
            userId: receiverId, // Recipient of the message
            creatorId: userId, // Sender
            messageId: message.id,
          },
        });

        revalidatePath("/")
        return {success: true, message}
    } catch (error) {
        console.log("Failed to create message", error)
        return {success: false, error: "Failed to create message"};
    }
}

export const getUserIdByUsername = async (username: string) => {
    if (!username) return null;
  
    try {
      const user = await prisma.user.findUnique({
        where: { username: username.trim() },
        select: { id: true },
      });
  
      return user?.id || null;
    } catch (error) {
      console.error("Error fetching user ID by username:", error);
      return null;
    }
  };
