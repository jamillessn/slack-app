import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Spinner,
  Avatar,
  AvatarGroup
} from '@chakra-ui/react';
import { useLoaderData } from 'react-router-dom';
import { getHeaders } from '../utils/getHeaders';
import { BiSend } from "react-icons/bi";
import { getChannelsList } from '../utils/getChannelsList';
import { getAllUsers } from '../utils/getAllUsers';

export const ChannelChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelData, setChannelData] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);
  const headers = getHeaders();
  const { id, resData } = useLoaderData();
  const [chattingWithText, setChattingWithText] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const usersList = getAllUsers();

 // Use the getChannelsList function
 useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const channels = await getChannelsList(headers);
      setChannelList(channels);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

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


return (
  <>
    {/* Main Container */}
    <Box height="90vh" display="flex" flexDirection="column">
    <Box p={3} borderBottom="1px solid #ccc" textAlign="left" position="relative">
          
          {/* Conversation Header */}
          <Box p={4} textAlign="center" position="relative">
          <Text fontWeight="bold" fontSize="lg">
            {selectedChannel}
          </Text>
        </Box>

            
    </Box>
      {/* Content Container */}
      <Box overflowY="auto" flex="1">

        {/* Chat Messages */}
        <Box minWidth="80vw" paddingRight={7} paddingLeft={7} position="relative">
          <Flex direction="column">
            {/* {chatMessages} */}
            <div ref={scrollRef} />
          </Flex>
        </Box>
      </Box>

      {/* Modal for creating a channel */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Channel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            {/* <Select
              placeholder="Add members"
              mt={4}
              isMulti
              options={usersList.map((user) => ({
                value: user.user_id,
                label: user.email,
              }))}
              value={channelMembers.map((memberId) => ({
                value: memberId,
                label: usersList.find((user) => user.user_id === memberId)?.email || '',
              }))}
              onChange={(selectedMembers) => setChannelMembers(selectedMembers.map((member) => member.value))}
              components={{
                Option: CustomOption,
                MultiValue: CustomMultiValue,
              }}
            /> */}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" bgColor="black" mr={3} 
            // onClick={handleSubmit}
            >
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


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
        <Button onClick={handleSendClick} bgColor="#0101FE" colorScheme="blue" borderRadius="%"
         icon={<BiSend fontSize="1.5rem" />}>
        <BiSend />
        </Button>
      </Flex>
    </Box>
  </>
);
  
}