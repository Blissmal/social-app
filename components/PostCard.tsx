"use client";
import { createComment, getPosts, toggleLike } from '@/actions/post.action';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]

const PostCard = ({post, dbUserId}: {
    post: Post; 
    dbUserId: string | null}
) => {
    const { user } = useUser();
    const [newComment, setNewComment] = useState("")
    const [isCommenting, setIsCommenting] = useState(false)
    const [isLiking, setIsLiking] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId))
    const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes)

    const handleLike = async () => {
        if (isLiking) return

        try {
            setIsLiking(true)
            setHasLiked(prev => !prev)
            setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1))
            await toggleLike(post.id)
        } catch (error) {
            setOptimisticLikes(post._count.likes)
            setHasLiked(post.likes.some(like => like.userId === dbUserId))
        } finally {
            setIsLiking(false)
        }
    }
    const handleAddComment = async () => {
        if (!newComment.trim() || isCommenting) return;

        try {
            setIsCommenting(true);
            const result = await createComment(post.id, newComment);
            if (result?.success) {
                toast.success("Comment posted successfully")
                setNewComment("");
            }
        } catch (error) {
            toast.error("Failed to add comment");
        } finally {
            setIsCommenting(false)
        }
    }
    const deletePost = async () => {

    }
  return (
    <div>
      
    </div>
  )
}

export default PostCard
