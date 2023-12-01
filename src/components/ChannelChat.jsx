import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Box, Flex, Input, Button, Text } from '@chakra-ui/react';
import { useLoaderData } from 'react-router-dom'
import { getHeaders } from '../utils/getHeaders';
import { getChannelsList } from '../utils/getChannelsList';
import { format } from 'date-fns';

export const ChannelChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [channelData, setChannelData] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);
  const headers = getHeaders();
  const { id, resData } = useLoaderData();
  // const { id, channel_name } = getChannelsList();

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

const getSelectedChannelName = (selectedChannelId, channelData) => {
  const selectedChannel = channelData.find(channel => channel.id === selectedChannelId);
  return selectedChannel ? selectedChannel.channel_name : '';
};


//Retrives id and channel_name from getChannelsList
useEffect(()=> {
  const getChannelData = async() => {
    try {
      const channelsData = await getChannelsList(headers);

      //use ChannelsList 
      setChannelData(channelsData);
      console.log(channelData)
      
    } catch (error) {
      console.log('Error fetching channels', error);
    }
  };

  getChannelData();
}, []);


  return (
    <>
    <Flex flexDirection="column"  minHeight="100vh" maxHeight="100vh" flex={1}>
        {/* Header */}
       <Box p={4} borderBottom="1px solid #ccc" textAlign="center" maxWidth= "100vw">
        <Text fontWeight="bold" fontSize="lg">
          {getSelectedChannelName(selectedUser, channelData)}
        </Text>
      </Box>

      {/* Chat Messages */}
      <Box p={7} minHeight="100vh" maxHeight="100vh" overflowY="auto" >
      
          <Flex direction="column">
            {/* {chatMessages} */}
            <div ref={scrollRef} />
          </Flex>
        

      {/* Message Box and Send Button */}
      <Flex p={5} paddingTop={8} position="sticky" bottom="0">
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
    </Flex>
      
    </>
     
  )
  
}