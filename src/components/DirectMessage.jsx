import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Box, Flex, Input, Button, Text, Avatar, Heading } from '@chakra-ui/react';
import { AiOutlineUser } from 'react-icons/ai';
import { useLoaderData } from 'react-router-dom';
import { getAllUsers } from '../utils/getAllUsers';
import { getHeaders } from '../utils/getHeaders';
import { format } from 'date-fns';

export const DirectMessage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const headers = getHeaders();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 
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

useEffect(() => {
  clearMessages();
  setSelectedUser(localStorage.getItem("selectedUser"))
  getMessages(receiver_id, headers);
  getAllUsers();
  
  
},[receiver_id]);

const chatMessages = Object.keys(messages).map(msgId => {
  
  const msg = messages[msgId];
  const isCurrentUser = msg.sender === headers.uid;

  const senderName = isCurrentUser ? 'You' : msg.sender.split('@')[0];
  const formattedDate = format(new Date(msg.created_at), 'M/dd/yyyy h:mm a');

    if(!isCurrentUser){
      return (
        <div key={msgId} style={{ textAlign: isCurrentUser ? 'right' : 'left', marginTop: 12 }}>
          
          <Flex>
          <Avatar bg="black" icon={<AiOutlineUser fontSize="1.5rem" />} mr={2}/>
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
          <Flex alignItems="center">
          <Text color='black' fontSize={11} fontWeight={700}> {senderName},  </Text>
          <Text color='gray' fontSize={11}> {formattedDate} </Text>
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
          {msg.body}
        </Text>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text color='black' fontSize={13} fontWeight={700}> {senderName},  </Text>
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
  setSelectedUser(null);
  localStorage.setItem('selectedUser', "");
}

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
    <Box>
    <Flex flexDirection="column"  maxHeight="100vh">
      {/* Header */}
       <Box p={4} borderBottom="1px solid #ccc" textAlign="center">
        <Text fontWeight="bold" fontSize="lg">
          Chatting with: {selectedUser}
        </Text>
      </Box>

      {/* Chat Messages */}
      <Box minWidth="80vw" p={7} minHeight="100vh" maxHeight="100vh" overflowY="auto" >
          <Flex direction="column">
            
            {chatMessages}
            <div ref={scrollRef} />
          </Flex>
      </Box>

         {/* Message Box and Send Button */}
         <Flex p={5} paddingTop={8} position="sticky" bottom="0" bgColor="white">
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
          
    </Flex>
      

    </Box>
    
    </>
     
  )
  
}