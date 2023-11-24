import React, { useState, useEffect } from 'react'
import { Box, Flex, Avatar, Input, Button, Text } from '@chakra-ui/react';
import { useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify';
import { getAllUsers } from '../utils/api';

export const ConversationPanel = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Maintain a list of messages
  const { receiver_id } = useLoaderData()

  async function getMessages() {
    try {
      const res = await fetch("http://206.189.91.54/api/v1/messages", {
        method: 'GET',
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          "uid": localStorage.getItem("uid") || "",
          "client": localStorage.getItem("client") || "",
          "expiry": localStorage.getItem("expiry") || "",
          "Content-Type": "application/json"
        },
      });

      console.log(messages)
  
    } catch (error) {
      console.log(error);
    }
  }
  

  useEffect(() => {
    getAllUsers();
    getMessages();
  }, []);
  

  const handleSendClick = () => {
    sendMessageFunc();

    setMessages((prevMessages) => [...prevMessages, { sender: 'You', message }]); //Update messages adding the new message
    
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendClick();
    }
  };

  async function sendMessageFunc(){
    try {
    const res = await fetch("http://206.189.91.54/api/v1/messages", {
        method: 'POST',
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          "uid": localStorage.getItem("uid") || "",
          "client": localStorage.getItem("client") || "",
          "expiry": localStorage.getItem("expiry") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "receiver_id": receiver_id,
          "receiver_class": "User",
          "body": message })
      }) ;
        
      const responseData  = await res.json();
      console.log(responseData);

    }catch(error) {
      console.log(error)
      toast.error(error.message || "An error occurred", {
        position: toast.POSITION.TOP_CENTER
      });
    }
          
  }
  
  return (
    <div>
      {/* <Text>Please select a user or channel to start a conversation.</Text> */}
      
      <Box w="60vw" maxWidth="100vw" p={7} overflowY="auto">
        <Flex direction ="column">
          {messages.map((msg,index) =>  (
            <Flex key={index} justify={msg.sender === 'You' ? 'flex-end' : 'flex-start'} mb ={2}>
              <Text 
                p={2} 
                borderRadius="md" 
                bgColor={msg.sender === "You" ? 'blue.500' : 'gray.200'}
                color = {msg.sender === "You" ? 'white' : 'black'}>
                  {msg.message}
              </Text>
            </Flex>
          ))}
        </Flex>

      <span> Receiver: {receiver_id} </span>
      {/* Message Box and Send Button */}
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            mr={5}
            onKeyDown={handleKeyDown}
          />
          <Button 
            onClick={handleSendClick} 
            colorScheme="blue">
            Send
          </Button>
      </Box>
    </div>
  )
}