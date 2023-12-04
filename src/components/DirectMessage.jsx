import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Box, Flex, Input, Button, Text, Avatar, Heading, Spinner } from '@chakra-ui/react';
import { AiOutlineUser } from 'react-icons/ai';
import { useLoaderData } from 'react-router-dom';
import { SlOptions } from "react-icons/sl";
import { getAllUsers } from '../utils/getAllUsers';
import { getHeaders } from '../utils/getHeaders';
import { format } from 'date-fns';
import { BiSend } from "react-icons/bi";

export const DirectMessage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const headers = getHeaders();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 
  const { receiver_id } = useLoaderData();
  const scrollRef = useRef(null);
  
 const getMessages = (receiver_id, headers) => {
  setLoadingMessages(true);

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
      .finally(() => {
        setLoadingMessages(false);
      });
setSelectedUser(localStorage.getItem("selectedUser"));
}

useEffect(() => {
  clearMessages();
  getMessages(receiver_id, headers);
  getAllUsers();
}, [receiver_id]);

const chatMessages = Object.keys(messages).map(msgId => {
  
  const msg = messages[msgId];
  const isCurrentUser = msg.sender === headers.uid;

  const senderName = isCurrentUser ? 'You' : msg.sender.split('@')[0];
  const formattedDate = format(new Date(msg.created_at), 'M/dd/yyyy h:mm a');
  
  if(!messages){
    console.log('No Messages');
  }
    if(!isCurrentUser){
      return (
        <div key={msgId} style={{ textAlign: isCurrentUser ? 'right' : 'left', marginTop: 12 }}>
          <Flex key={msgId} style={{ marginTop: 12 }} justify={isCurrentUser ? 'flex-end' : 'flex-start'}>
  {!isCurrentUser && (
    <Avatar bg="black" icon={<AiOutlineUser fontSize="1.5rem" />} mr={2} />
  )}
  <Box>
    <Flex align={isCurrentUser ? 'flex-end' : 'flex-start'} alignItems="center">
    <Text color='black' fontSize={15} fontWeight={700} mb={1}>
        {senderName}  &nbsp;
      </Text>
      <Text color='gray' fontSize={11}> {formattedDate} </Text>
    </Flex>

    <Flex direction="column" >
     
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
    </Flex>
  </Box>
</Flex>
        </div>
      );
    }

    else { 
      return (
      <div key={msgId} style={{ textAlign: isCurrentUser ? 'right' : 'left', marginTop: 12 }}>
        <Text 
          p={2} 
          borderRadius="md" 
          display="inline-block" 
          maxWidth="70%"
          bgColor={isCurrentUser ? '#0101FE' : 'gray.200'}
          color={isCurrentUser ? 'white' : 'black'}
        >
         
          <Text textAlign="left">
          {msg.body}
            </Text>
        </Text>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text color='gray' fontSize={11}> {formattedDate} </Text>
         </Flex>
      </div>
    );}
   
});

useLayoutEffect(() => {
  scrollToBottom();
}, [chatMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearMessages = () => {
    setMessages([]);
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
                    receiver: receiver_id, 
                    body: dm.body, 
                    created_at: dm.created_at
                }

                setMessages({...messages, ...filteredMessage});
            } else {
                toast.error("There is an error sending message.");
            }
        })
}
  
return (
  <>
    {/* Main Container */}
    <Box height="90vh" display="flex" flexDirection="column">
      <Box p={3} borderBottom="1px solid #ccc" textAlign="left" position="relative">
        {/* Conversation Header */}
        <Flex alignItems="center">
          <Avatar bg="black" icon={<AiOutlineUser fontSize="1.5rem" />} mr={2} />
          <Text fontWeight="bold" fontSize="lg">
            {selectedUser}
          </Text>
        </Flex>
      </Box>
      {/* Content Container */}
      <Box overflowY="auto" flex="1">
        {/* Chat Messages */}
        <Box minWidth="80vw" paddingRight={7} paddingLeft={7} position="relative">
          {loadingMessages ? (
            <Flex justify="center" align="center" height="100vh">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Flex direction="column">
              {chatMessages}
              <div ref={scrollRef} />
            </Flex>
          )}
        </Box>
      </Box>
      {/* Message Box and Send Button */}
      <Flex
        p={6}
        bgColor="white"
        position="sticky"
        bottom="0"
        justifyContent="space-between"
        style={{ width: '100%', zIndex: 1 }}
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          mr={5}
          onKeyDown={handleEnter}
        />
        <Button onClick={handleSendClick} bgColor="#0101FE" colorScheme="blue" borderRadius="%">
          <BiSend />
        </Button>
      </Flex>
    </Box>
  </>
);
};