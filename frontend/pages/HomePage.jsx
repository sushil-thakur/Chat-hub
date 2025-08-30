import { UserButton } from '@clerk/clerk-react'
import React from 'react'
import { useStreamChat } from '../hooks/useStreamChat'

const HomePage = () => {
  // const{chatClient, error, isLoading} = useStreamChat()
  return (
    <div >
      <UserButton/>
      Home page
    </div>
  )
}

export default HomePage
