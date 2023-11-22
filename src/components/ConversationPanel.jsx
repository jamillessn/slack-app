import React from 'react'
import { useLoaderData } from 'react-router-dom'


export const ConversationPanel = () => {
  const user_id = useLoaderData()
  const messages = useLoaderData()
  return (
    <div>
      <span> {user_id} </span>
      {/* Map through the messages */}
      {/* messages.data.map(() => {

      }) */}
    </div>
  )
}