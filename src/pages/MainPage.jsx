import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLoaderData } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Avatar, Input, Button, CSSReset, extendTheme, theme, Text } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import ChatAppLogo from '../assets/chatapplogo.svg';
import { ConversationPanel } from '../components/ConversationPanel';

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: 'body',
      },
    },
  },
});

const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversation, setConversation] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [channels, setChannels] = useState([]);
  
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // console.log("Selected user:" + user.email)
  };

  const navigate = useNavigate();

  useEffect(() => {
    const emailFromLocalStorage = localStorage.getItem('uid');
    setUserEmail(emailFromLocalStorage);
    setCurrentUser(emailFromLocalStorage);
  }, []);

  const handleSignOut = () => {
    setCurrentUser(null);
    setSelectedUser(null);
    setConversation([]);
    localStorage.clear();
    navigate('/');
  };

  const createChannel = (channelName) => {
    setChannels([...channels, { name: channelName, members: [currentUser], messages: [] }]);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Box>
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          p={4}
          borderBottom="1px"
          borderColor="gray.200"
        >
          <img src={ChatAppLogo} alt="Logo" width={60} /> 

          {userEmail && (
            <Flex align="center">
              <Text mr={2}>{userEmail}</Text>
              <Avatar size="sm"  />
              <Button ml={4} onClick={handleSignOut} backgroundColor="#0101FE" colorScheme='blue'>
                Sign Out
              </Button>
            </Flex>
          )}
        </Flex>

        {/* Main Content */}
        <Flex height="100vh">

          {/* Sidebar */}
          <Sidebar
            handleUserClick={handleUserClick}
            handleChannelClick = {handleChannelClick}
            searchTerm={searchTerm}
            createChannel={createChannel}
            channels={channels}
            onSelectUser={handleSelectUser}
          />

          {/* Conversation Panel */}
          <Outlet 
          selectedUser={selectedUser}
          />

        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default App;
