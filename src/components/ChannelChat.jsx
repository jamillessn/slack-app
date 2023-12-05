import React, { useState, useEffect, useRef, useLayoutEffect} from 'react'
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  Spinner,
  useDisclosure,
  Heading
} from '@chakra-ui/react';
import { useLoaderData } from 'react-router-dom';
import { getHeaders } from '../utils/getHeaders';
import { BiSend } from "react-icons/bi";
import { getChannelsList } from '../utils/getChannelsList';
import { getAllUsers } from '../utils/getAllUsers';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export const ChannelChat = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelData, setChannelData] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const [curChannel, setCurChannel] = useState('');
  const [channelMembersId, setChannelMembersId] = useState([]);
  const [channelMembersList, setChannelMembersList] = useState([]);
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


     async function getChannelData() {
      try {
        const res = await fetch("http://206.189.91.54/api/v1/channels/" + chan_id , {
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
        
        // takes channel_members value from data and stores in ChannelMembersId array
        setChannelMembersId(data.data.channel_members.map(index => index.user_id)) 

      } catch (error) {
        return [];
      }
      
    }

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
            <Text fontWeight="bold" fontSize="lg">
              Channel Members: {channelMembersId}
            </Text>
          </Box>
        </Box>
        {/* Content Container */}
        <Box overflowY="auto" flex="1">
          {/* Display Spinner while loading */}
          {isLoading ? (
            <Flex justifyContent="center" alignItems="center" height="100%" minWidth="80vw">
              <Spinner size="xl" />
            </Flex>
          ) : (
            /* Display Messages or "No conversation yet" text */
            <Box minWidth="80vw" paddingRight={7} paddingLeft={7} position="relative">
              {channelMessages.length > 0 ? (
                // Display Messages
                channelMessages.map((messageObject, index) => (
                  <Box
                    key={index}
                    p={2}
                    borderRadius="8px"
                    bg={messageObject.sender === "senderId" ? "blue.500" : "gray.300"}
                    color={messageObject.sender === "senderId" ? "white" : "black"}
                  >
                    <Text>{messageObject.sender}</Text>
                    <Text>{messageObject.message}</Text>
                    <Text>{messageObject.date.toString()}</Text>
                  </Box>
                ))
              ) : (
                // Display "No conversation yet" text
                <Flex justifyContent="center" alignItems="center">
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