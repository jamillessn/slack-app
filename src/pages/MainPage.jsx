import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLoaderData } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Avatar, Input, Button, CSSReset, extendTheme, theme, Text } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import ChatAppLogo from '../assets/chatapplogo.svg';

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
  const navigate = useNavigate();

  getAllUsers();

  useEffect(() => {
    const emailFromLocalStorage = localStorage.getItem('uid');
    setUserEmail(emailFromLocalStorage);
    setCurrentUser(emailFromLocalStorage);
  }, []);

  async function getAllUsers() {
    try {
      const res = await fetch("http://206.189.91.54/api/v1/users",{
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
  
      if (data.status === 401) {
      localStorage.clear();
      }
  
    } catch(error) {
      console.log(error);
    }
  }

  async function retrieveMessages() {

    try {
      const res = await fetch("http://206.189.91.54/api/v1/messages", {
      method: 'POST',
      headers: {
          "access-token": localStorage.getItem("access-token") || "",
          "uid": localStorage.getItem("uid") || "",
          "client": localStorage.getItem("client") || "",
          "expiry": localStorage.getItem("expiry") || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      });

      const newMessage = {
        receiver_id: localStorage.getItem("uid")
        // receiver_class: "User",
        // body: messageBody,
      };
  
      const data = await res.json();
      console.log(data)
  
      if (data.status === 401) {
      localStorage.clear();
      }
  
    } catch(error) {
      console.log(error);
    }
  }
  
  const users = [
    { id: 1, name: 'John Doe', avatar: 'https://placekitten.com/50/50' },
    { id: 2, name: 'Jane Doe', avatar: 'https://placekitten.com/51/51' },
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  const handleSendClick = () => {
    if (message.trim() !== '') {
      setConversation([...conversation, { user: currentUser, message }]);
      setMessage('');
    }
  };

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

  const joinChannel = (channel) => {
    setSelectedUser(channel);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Avatar size="sm" src="https://placekitten.com/53/53" />
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
            filteredUsers={filteredUsers}
            handleUserClick={handleUserClick}
            handleChannelClick = {handleChannelClick}
            searchTerm={searchTerm}
            createChannel={createChannel}
            channels={channels}
          />

          <Outlet />

          {/* Conversation Panel */}
          <Box w="70vw" p={4} overflowY="auto">
            {selectedUser ? (
              <Flex direction="column" align="center">
                <Avatar size="lg" src={selectedUser.avatar} />
                <Text mt={4} fontSize="xl">
                  {selectedUser.name}
                </Text>
                <Box mt={4} mb={4} w="100%" flex="1" display="flex" flexDirection="column">
                  {selectedUser.messages &&
                    selectedUser.messages.map((item, index) => (
                      <Box key={index} mb={2}>
                        <Text fontWeight="bold">{item.user.name}:</Text>
                        <Text>{item.message}</Text>
                      </Box>
                    ))}
                </Box>

              {/* {searchFocused ? (
                <>
                  {searchData?.data.map((user:IUser) => (
                    <UserNavLink
                      key = {user.id}
                      path = {user.id}
                      firstLetter = {user.username.split('')[0]}
                      username = {user.username}
                    />
                  ))}
                </>
              ): (

              )} */}
                {/* Message Box and Send Button */}
                <Flex w="100%">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    mr={2}
                  />
                  <Button onClick={handleSendClick} colorScheme="teal">
                    Send
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <Text>Please select a user or channel to start a conversation.</Text>
            )}
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default App;
