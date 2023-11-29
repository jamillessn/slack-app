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
  const [userEmail, setUserEmail] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
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

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Box w="100vw" minHeight="100vh">
        {/* Main Content */}
        <Flex flexDirection="column">
          {/* Header */}
          <Flex
            as="header"
            align="center"
            justify="space-between"
            maxHeight= "20%"
            padding={2}
            paddingRight={7}
            paddingLeft={7}
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
            <Flex flexDirection="row" height="90vh">
               <Sidebar/>

              {/* Conversation Panel */}
              <Outlet selectedUser={selectedUser} />
            </Flex>
          {/* Sidebar */}
          
          
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default App;
