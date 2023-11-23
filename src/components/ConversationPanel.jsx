import React from 'react'
import { useLoaderData } from 'react-router-dom'


export const ConversationPanel = () => {
  const {user_id,data} = useLoaderData()
  // const messages = useLoaderData()
  return (
    <div>
      <span> {user_id} </span>
      <span> {data} </span>
      {/* {data.data.map.messages} */}
      {/* Map through the messages */}
      {/* messages.data.map(() => {

      }) */}
    </div>
  )
}