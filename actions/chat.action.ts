"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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


export async function sendMessage(receiverId: string, text?: string, image?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // let imageUrl: string | null = null;
    // if (image) {
    //   imageUrl = await uploadToCloudinary(image); // Convert base64 image to URL
    // }

    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        text,
        // image: imageUrl,
      },
    });

    // Optional: Revalidate chat page to show new message
    revalidatePath(`/chat/${receiverId}`);

    // TODO: Implement WebSocket or Pusher to send real-time messages

    return newMessage;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw new Error("Failed to send message");
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
