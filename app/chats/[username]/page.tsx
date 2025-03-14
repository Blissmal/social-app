import ChatContainer from '@/components/chatComponents/ChatContainer'
import React from 'react'

const page = ({params}: {params: {username: string}}) => {
    const username = params.username
  return (
    <ChatContainer username={username}/>
  )
}

export default page
