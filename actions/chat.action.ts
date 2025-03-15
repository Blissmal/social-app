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


  export const sendMessage = async ({
    receiverId,
    groupId,
    text,
    image,
  }: {
    receiverId?: string;
    groupId?: string;
    text?: string;
    image?: string;
  }) => {
    try {
      const senderId = await getDbUserId();
      if (!senderId) return { success: false, error: "Unauthorized" };
  
      if (receiverId && groupId) {
        throw new Error("Cannot send a message to both a user and a group");
      }
  
      if (!receiverId && !groupId) {
        throw new Error("A recipient or group must be specified");
      }
  
      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId: receiverId || null,
          groupId: groupId || null,
          text,
          image,
        },
      });
  
      // Handle notifications
      if (receiverId) {
        // Private message notification
        await prisma.notification.create({
          data: {
            type: "MESSAGE",
            userId: receiverId,
            creatorId: senderId,
            messageId: message.id,
          },
        });
      } else if (groupId) {
        // Notify all group members except the sender
        const groupMembers = await prisma.groupMember.findMany({
          where: { groupId },
          select: { userId: true },
        });
  
        const memberIds = groupMembers
          .map((m) => m.userId)
          .filter((id) => id !== senderId); // Exclude sender
  
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
  
      revalidatePath("/");
      return { success: true, message };
    } catch (error) {
      console.error("Failed to send message:", error);
      return { success: false, error: "Failed to send message" };
    }
  };
  


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

  export async function readChats(chatIds: string[], chatPath: string) {
      try {
        await prisma.message.updateMany({
          where: {
            id: {
              in: chatIds,
            },
          },
          data: {
            status: "READ"
          },
        });
    
        revalidatePath(chatPath);
        return { success: true };
      } catch (error) {
        console.error("Error reading chats", error);
        return { success: false };
      }
    }

    // group chat experimental

    export const createGroupChat = async ({ name, userIds, description }: { name: string; userIds: string[], description: string }) => {
      const { userId } = await auth();
      if (!userId) return { error: "Unauthorized" };
    
      const creator = await prisma.user.findFirst({
        where: { clerkId: userId },
        select: { id: true },
      });
    
      if (!creator) return { error: "User not found" };
    
      // Ensure the creator is in the group
      const uniqueUserIds = Array.from(new Set([...userIds, creator.id]));
    
      try {
        const group = await prisma.groupChat.create({
          data: {
            name,
            description,
            creatorId: creator.id,
            members: { create: uniqueUserIds.map((id) => ({ userId: id })) }, // Include creator
          },
        });
        return group;
      } catch (error) {
        console.error("Failed to create group:", error);
        return null;
      }
    };
    

    export async function getUserGroups() {
      const { userId } = await auth();
      if (!userId) return { error: "Unauthorized" };
    
      const user = await prisma.user.findFirst({
        where: { clerkId: userId },
        select: { id: true },
      });
    
      if (!user) return { error: "User not found" };
    
      const groups = await prisma.groupChat.findMany({
        where: {
          members: { some: { userId: user.id } },
        },
        include: {
          members: { include: { user: true } },
          messages: { take: 1, orderBy: { createdAt: "desc" } },
        },
      });
    
      return { groups };
    }

    export async function sendGroupMessage(groupId: string, text: string) {
      const { userId } = await auth();
      if (!userId) return { error: "Unauthorized" };
    
      const sender = await prisma.user.findFirst({
        where: { clerkId: userId },
        select: { id: true },
      });
    
      if (!sender) return { error: "User not found" };
    
      const message = await prisma.message.create({
        data: {
          senderId: sender.id,
          groupId,
          text,
          status: "SENT",
        },
      });
    
      return { success: true, message };
    }

    export async function getGroupMessages(groupId: string) {
      const messages = await prisma.message.findMany({
        where: { groupId },
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      });
    
      return { messages };
    }

    export async function markGroupMessagesRead(groupId: string) {
      const { userId } = await auth();
      if (!userId) return { error: "Unauthorized" };
    
      const user = await prisma.user.findFirst({
        where: { clerkId: userId },
        select: { id: true },
      });
    
      if (!user) return { error: "User not found" };
    
      await prisma.message.updateMany({
        where: {
          groupId,
          status: "SENT",
        },
        data: {
          status: "READ",
        },
      });
    
      return { success: true };
    }


  export async function addUsersToGroup(groupId: string, userIds: string[]) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const creator = await prisma.groupChat.findFirst({
      where: { id: groupId, creator: { clerkId: userId } },
      select: { id: true },
    });

    if (!creator) return { error: "Only the group creator can add members" };

    const existingMembers = await prisma.groupMember.findMany({
      where: {
        groupId,
        userId: { in: userIds },
      },
      select: { userId: true },
    });

    const existingUserIds = new Set(existingMembers.map((member) => member.userId));
    const newUsers = userIds.filter((id) => !existingUserIds.has(id));

    if (newUsers.length === 0) return { error: "Users are already in the group" };

    await prisma.groupMember.createMany({
      data: newUsers.map((userId) => ({ groupId, userId })),
    });

    return { success: true, addedUsers: newUsers };
  }

    