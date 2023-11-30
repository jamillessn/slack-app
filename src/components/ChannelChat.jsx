import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Box, Flex, Input, Button, Text } from '@chakra-ui/react';
import { useLoaderData } from 'react-router-dom'
import { getHeaders } from '../utils/getHeaders';
import { format } from 'date-fns';

export const ChannelChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);
  const headers = getHeaders();
  const { id, resData } = useLoaderData();
  // const currentChannelName 
  
//   const getChannelData = () => {
//     const options = {
//       method: 'GET',
//       headers: {
//         'access-token': headers.accessToken,
//         'client' : headers.client,
//         'expiry' : headers.expiry,
//         'uid' : headers.uid
//       }
//     }

//     // const url = "http://206.189.91.54/api/v1//messages?receiver_id=" + receiver_id + "&receiver_class=User";

//     fetch(resData, options)
//     .then(response => {
//         return response.json();
//     })
//     .then(data => {
//         const channelData = data.data; 
//         const currentChannelName ="";
//         const channelMessages = {};

//         for(const item of channelData) {
//           channelMessages[item.id] = {
//                 id: item.sender.email, 
//                 name: item.receiver.email, 
//             }
            
//         }
//         console.log(currentChannelName)
//         setChannelData({...channelData});
//       })

// }


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
  // useEffect(()=> {
  //   getChannelData(id,name);
  // })

  return (
    <>
    <Flex flexDirection="column"  minHeight="100vh" maxHeight="100vh" flex={1}>
        {/* Header */}
       <Box p={4} borderBottom="1px solid #ccc" textAlign="center" maxWidth= "100vw">
        <Text fontWeight="bold" fontSize="lg">
          {id}
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