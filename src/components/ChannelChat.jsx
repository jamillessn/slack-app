import React, { useState, useEffect, useRef, useLayoutEffect} from 'react'
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  Spinner,
  useDisclosure,
  Avatar,

} from '@chakra-ui/react';
import { AiOutlineUser } from 'react-icons/ai';
import { useLoaderData } from 'react-router-dom';
import { getHeaders } from '../utils/getHeaders';
import { BiSend } from "react-icons/bi";
import { getChannelsList } from '../utils/getChannelsList';
import { getAllUsers } from '../utils/getAllUsers';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export const ChannelChat = () => {
  const [channelData, setChannelData] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const [channelMembersId, setChannelMembersId] = useState([]);
  const [channelMembersList, setChannelMembersList] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [channelMessages, setChannelMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { chan_id } = useLoaderData();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const usersList = getAllUsers();

  const scrollRef = useRef(null);
  const headers = getHeaders();
  const currentDate = new Date();
  

  useEffect(() => {
    fetchData();
    getChannelData();
    // Load channelMessages from localStorage on component mount
    const storedChannelMessages = JSON.parse(localStorage.getItem(chan_id)) || [];
    setChannelMessages(storedChannelMessages);
    getChannelMessages();
  }, [chan_id]);

  // Function to get messages from local storage
  const getChannelMessages = () => {
    return channelMessages;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const channels = await getChannelsList(headers);
      setChannelList(channels);
    } finally {
      setIsLoading(false);
    }
  };


  const getChannelData = async () => {
    try {
      const res = await fetch("http://206.189.91.54/api/v1/channels/" + chan_id, {
        method: 'GET',
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          "uid": localStorage.getItem("uid") || "",
          "client": localStorage.getItem("client") || "",
          "expiry": localStorage.getItem("expiry") || "",
          "Content-Type": "application/json"
        }
      });
  
      const data = await res.json();
      
      console.log(data)

      setChannelName(data.name)

      console.log(data.name)
      // takes channel_members value from data and stores in ChannelMembersId array
      setChannelMembersId(data.data.channel_members.map(index => index.user_id));

    } catch (error) {
      console.error(error);
    }
  };
  

 useEffect(() => {
  fetchData();
  getChannelData();
}, [chan_id]);

  //Message box handling input
  const handleSendClick = () => {
    setMessage('');
  };

  const handleEnter = (e) => {
    if(e.key === 'Enter') {
        e.preventDefault();
        console.log(message);
        const message = e.target.value;

        e.target.value = '';
        setMessage('');
    }
}


const handleSendChannelMessage = () => {
  const uid = localStorage.getItem("uid");
  const formattedDate = format(new Date(currentDate), 'M/dd/yyyy h:mm a');

  // Trim whitespace from the message and check if it's blank
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    // Show an alert or perform any other desired behavior for an empty message
    toast.error("Please enter a message.", {
        position: toast.POSITION.TOP_CENTER
      });
    return;
  }

  if (uid) {
    const newMessageObject = {
      sender: uid,
      message: trimmedMessage,
      date: formattedDate,
    };

    // Use a local variable to get the latest state
    const updatedChannelMessages = [...channelMessages, newMessageObject];

    // Update the state
    setChannelMessages(updatedChannelMessages);

    // Save the updated channelMessages array in localStorage with chan_id as the key
    localStorage.setItem(chan_id, JSON.stringify(updatedChannelMessages));
  }

  // Clear the message input
  setMessage('');
};

const channelChatMessages = Object.keys(channelMessages).map(index => {
  
  const msg = channelMessages[index];
  const isCurrentUser = msg.sender === headers.uid;

  const senderName = isCurrentUser ? 'You' : msg.sender.split('@')[0];
  const formattedDate = format(new Date(msg.date), 'M/dd/yyyy h:mm a');
  
    if(!isCurrentUser){
      return (
        <div key={index} style={{ textAlign: isCurrentUser ? 'right' : 'left', marginTop: 12 }}>
          <Flex key={index} style={{ marginTop: 12 }} justify={isCurrentUser ? 'flex-end' : 'flex-start'}>
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
        {msg.message}
      </Text>
    </Flex>
  </Box>
</Flex>
        </div>
      );
    }

    else { 
      return (
      <div key={index} style={{ textAlign: isCurrentUser ? 'right' : 'left', marginTop: 12 }}>
        <Text 
          p={2} 
          borderRadius="md" 
          display="inline-block" 
          maxWidth="70%"
          bgColor={isCurrentUser ? '#0101FE' : 'gray.200'}
          color={isCurrentUser ? 'white' : 'black'}
        >
         
          <Text textAlign="left">
          {msg.message}
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
}, [channelMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <>
    {/* Main Container */}
    <Box height="90vh" display="flex" flexDirection="column">
        <Box p={3} borderBottom="1px solid #ccc" textAlign="left" position="relative">
          {/* Conversation Header */}
          <Box p={4} textAlign="center" position="relative">
            {/* Use the updated channelName state here */}
            <Text fontWeight="bold" fontSize="lg">
              Channel Name: {channelName}
            </Text>
          </Box>
        </Box>

        {/* Messages container*/}
        <Box overflowY="auto" flex="1">
          {/* Display Spinner while loading */}
          {isLoading ? (
            <Flex justifyContent="center" alignItems="center" height="100%" minWidth="80vw">
              <Spinner size="xl" />
            </Flex>
          ) : (
            /* Display Messages or "No conversation yet" text */
            <Box minWidth="80vw" paddingRight={7} paddingLeft={7} position="relative">
              {channelChatMessages.length > 0 ? (
                // Display Messages
                channelChatMessages
              ) : (
                // Display "No conversation yet" text
                <Flex justifyContent="center" alignItems="center" paddingTop="25%">
                  <Text fontWeight="bold" fontSize="lg">
                    No conversation yet.
                  </Text>
                </Flex>
              )}
            </Box>
          )}
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
          />
          <Button onClick={handleSendChannelMessage} bgColor="#0101FE" colorScheme="blue" borderRadius="%"
            icon={<BiSend fontSize="1.5rem" />}>
            <BiSend />
          </Button>
        </Flex>
      </Box>
    </>
  );
};