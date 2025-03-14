import ChatContainer from '@/components/chatComponents/ChatContainer'
import MessageSkeleton from '@/components/ui/skeletons/MessageSkeleton'
import React, { Suspense } from 'react'

const page = ({params}: {params: {username: string}}) => {
    const username = params.username
  return (
    <Suspense fallback={<MessageSkeleton />}>
      <ChatContainer username={username}/>
    </Suspense>
  )
}

export default page
