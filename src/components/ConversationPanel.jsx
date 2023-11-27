import React, { useState, useEffect, useRef } from 'react'
import { Box, Flex, Avatar, Input, Button, Text } from '@chakra-ui/react';
import { useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify';
import { getAllUsers } from '../utils/api';
import { getHeaders } from '../utils/getHeaders';

export const ConversationPanel = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  // const [conversationsList, setList] = useState([])
  const headers = getHeaders();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Maintain a list of messages
  const { receiver_id } = useLoaderData();
  const scrollRef = useRef(null);

 const getMessages = (receiver_id, headers) => {
    const options = {
      method: 'GET',
      headers: {
        'access-token': headers.accessToken,
        'client' : headers.client,
        'expiry' : headers.expiry,
        'uid' : headers.uid
      }
    }

    const url = "http://206.189.91.54/api/v1//messages?receiver_id=" + receiver_id + "&receiver_class=User";

    fetch(url, options)
    .then(response => {
        return response.json();
    })
    .then(data => {
        const dm = data.data; 
        const filteredMessages = {};

        for(const item of dm) {
            filteredMessages[item.id] = {
                sender: item.sender.email, 
                receiver: item.receiver.email, 
                body: item.body,
                created_at: item.receiver.created_at
            }
            
        }
        setMessages({...filteredMessages});
      })

}

const clearMessages = () => {
  setMessages([]);
  setSelectedUser(null);
}

useEffect(() => {
  clearMessages();
  getMessages(receiver_id, headers);
  setSelectedUser(localStorage.getItem("selectedUser"))
  getAllUsers();
  scrollToBottom();
},[]);

const chatMessages = Object.keys(messages).map(msgId => {
  const msg = messages[msgId];
  const isCurrentUser = msg.sender === headers.uid;

  return (
    <div key={msgId} style={{ textAlign: isCurrentUser ? 'left' : 'right' }}>
      <Text color='black' fontWeight='700'> {msg.sender} </Text>
      <Text> {msg.created_at} </Text>
      <Text 
        p={2} 
        borderRadius="md" 
        display="inline-block" 
        maxWidth="70%"
        bgColor={isCurrentUser ? '#0101FE' : 'gray.200'}
        color={isCurrentUser ? 'white' : 'black'}
      >
        {msg.body}
      </Text>
    </div>
  );
});

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendClick = () => {
    sendMessage({message, receiver_id, headers});
    setMessage('');
  };

  const handleEnter = (e) => {
    if(e.key === 'Enter') {
        e.preventDefault();
        console.log(message);
        const message = e.target.value;
        sendMessage({message, receiver_id, headers});

        e.target.value = '';
        setMessage('');
    }
}

  const sendMessage = ({message, receiver_id, headers}) => {

    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            'access-token' : headers.accessToken, 
            'client' : headers.client, 
            'expiry' : headers.expiry, 
            'uid' : headers.uid
        },
        body: JSON.stringify({
            receiver_id: receiver_id, 
            receiver_class: "User", 
            body: message 
        })
    }

    const url = `http://206.189.91.54/api/v1/messages`;
    
    
    fetch(url, options) 
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(!data.errors) {
                const dm = data.data;
                const filteredMessage = {};

                filteredMessage[dm.id] = {
                    sender: headers.uid,
                    receiver: '', 
                    body: dm.body, 
                    created_at: dm.created_at
                }

                setMessages({...messages, ...filteredMessage});
            } else {
                console.log("There is an error sending message.");
            }
        })
}
  
  return (
    <div> 
      {/* Header */}
      <Box p={4} borderBottom="1px solid #ccc" textAlign="center">
        <Text fontWeight="bold" fontSize="lg">
          Chatting with: {selectedUser}
        </Text>
      </Box>

      {/* Chat Messages */}
      <Box minWidth="80vw" p={7} maxHeight="100vh" overflowY="auto">
        <Flex direction ="column">
          {chatMessages}
          
          <div ref={scrollRef} /> 
        </Flex>

      {/* Message Box and Send Button */}
      <Flex p={5} paddingTop={8}>
          <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                mr={5}
                onKeyDown={handleEnter}
              />
              <Button 
                onClick={handleSendClick} 
                bgColor="#0101FE" 
                colorScheme="blue">
                Send
              </Button>
        </Flex>
          
      </Box>
    </div>
  )
  
}