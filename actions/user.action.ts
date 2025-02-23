"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const syncUser = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!user || !userId) return;

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        image: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return dbUser;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getUserByClerdId = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: { followers: true, following: true, posts: true },
      },
    },
  });
};

export const getDbUserId = async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await getUserByClerdId(clerkId);

  if (!user) throw new Error("User not found");
  return user.id;
};

export const getRandomUsers = async () => {
  try {
    const userId = await getDbUserId();
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: userId,
            },
          },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });
    return randomUsers;
  } catch (error) {
    console.log("Error fetching random users: ", error);
    return [];
  }
};

export const toggleFollow = async (targetUserId: string) => {
  try {
    const userId = await getDbUserId();

    if (userId === targetUserId) throw new Error("You cannot follow yourself");
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId
        }
      }
    })

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId
          }
        }
      })
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId
          }
        }),
        prisma.notification.create({
          data: {
            userId: targetUserId,
            type: "FOLLOW",
            creatorId: userId
          }
        })
      ]);
    }
    revalidatePath("/")
    return { success: true };
  } catch (error) {
    console.log("Error toggling follow: ", error);
    return { success: false, error: "Error toggling follow" };
  }
};
