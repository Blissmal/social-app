import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/actions/profile.action';
import { notFound } from 'next/navigation';
import React from 'react'

export async function generateMetadata({ params }: {params: {username: string}}) {
  const user = await getProfileByUsername(params.username);
  if (!user) return;
  return {
    title: `${user.username ?? user.name}`,
    description: user.bio  || `Check out ${user.username}'s profile`,
  };
}

const ProfilePage = async ({params}: {params: { username: string }}) => {

    const user = await getProfileByUsername(params.username);
    if (!user) return notFound();

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id),
    ]); 

    return (
    <div>
      
    </div>
  )
}

export default ProfilePage;
