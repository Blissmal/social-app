import ChatContainer from '@/components/chatComponents/ChatContainer'
import MessageSkeleton from '@/components/ui/skeletons/MessageSkeleton'
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import React, { Suspense } from 'react'

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const usernameOrGroupId = params.username;

  const groupChat = await prisma.groupChat.findFirst({
    where: { id: usernameOrGroupId },
    select: { name: true },
  });

  if (groupChat) {
    return {
      title: `Group Chat: ${groupChat.name} | socially`,
      description: `Join the conversation in the group "${groupChat.name}"`,
    };
  }

  return {
    title: `Chat with ${usernameOrGroupId} | socially`,
    description: `Start a conversation with ${usernameOrGroupId}`,
  };
}

const page = ({params}: {params: {username: string}}) => {
    const username = params.username
  return (
    <Suspense fallback={<MessageSkeleton />}>
      <ChatContainer username={username}/>
    </Suspense>
  )
}

export default page
