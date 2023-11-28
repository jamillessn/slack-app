import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Avatar, Button, CSSReset, extendTheme, Text } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import { getHeaders } from '../utils/getHeaders';
import ChatAppLogo from '../assets/chatapplogo.svg';
import { toast } from 'react-toastify';

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
  const [conversations, setConversation] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const emailFromLocalStorage = localStorage.getItem('uid');
    setUserEmail(emailFromLocalStorage);
    setCurrentUser(emailFromLocalStorage);

    const { accessToken } = getHeaders();
    
    if(accessToken != null) {
        // console.log("Authorized")
    } else {
      if (!toast.isActive("loginError")) {
        toast.error("Please login first.", { toastId: "loginError", position: toast.POSITION.TOP_CENTER});
      }
      navigate('/')
    }
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

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Box w="100vw" maxHeight="100vh">
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          padding={6}
          borderBottom="1px"
          borderColor="gray.200"
          minW="100vw"
        >
          <Link to='/app'>
          <img src={ChatAppLogo} alt="Logo" width={60} /> 
          </Link>
          

          {userEmail && (
            <Flex align="center" justify="space-between">
              <Text mr={2}>{userEmail}</Text>
              <Avatar size="sm"/>
              <Button ml={6} onClick={handleSignOut} backgroundColor="#0101FE" colorScheme='blue'>
                Sign Out
              </Button>
            </Flex>
          )}
        </Flex>

        {/* Main Content */}
        <Flex height="100vh">

          {/* Sidebar */}
          <Sidebar conversations={conversations}
           />

          {/* Conversation Panel */}
          <Outlet selectedUser={selectedUser} />
          
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default App;
