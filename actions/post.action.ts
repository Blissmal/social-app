'use server'

import { prisma } from "@/lib/prisma"
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache"

export const createPost = async (content: string, image: string) => {
    try {
        const userId = await getDbUserId()

        if (!userId) return;

        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId
            }
        })

        revalidatePath("/")
        return {success: true, post}
    } catch (error) {
        console.log("Failed to create post", error)
        return {success: false, error: "Failed to create post"};
    }
}

export const getPosts = async () => {
  try {
    const posts = prisma.post.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            author: {
                select: {
                    name: true,
                    image: true,
                    username: true
                }
            },
            comments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "asc"
                }
            },
            likes: {
                select: {
                    userId: true
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true
                }
            }
        },
    })

    return posts
  } catch (error) {
    console.log("Error in getPosts", error)
    throw new Error("Failed to fetch posts")
  }
}