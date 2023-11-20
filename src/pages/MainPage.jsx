import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  Flex,
  Avatar,
  Input,
  Button,
  CSSReset,
  extendTheme,
  theme,
  Text,
} from '@chakra-ui/react';

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
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversation, setConversation] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // Added state for user email
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user email from localStorage when the component mounts
    const emailFromLocalStorage = localStorage.getItem('uid');
    setUserEmail(emailFromLocalStorage);
  }, []);

  const users = [
    { id: 1, name: 'John Doe', avatar: 'https://placekitten.com/50/50' },
    { id: 2, name: 'Jane Doe', avatar: 'https://placekitten.com/51/51' },
    { id: 3, name: 'Keith Smith', avatar: 'https://placekitten.com/52/52' },
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
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
    localStorage.clear(); // Clear all localStorage data
    navigate('/');
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
          <Text fontSize="lg">ChatApp</Text>
          {userEmail && (
            <Flex align="center">
              <Text mr={2}>{userEmail}</Text>
              <Avatar size="sm" src="https://placekitten.com/53/53" />
              <Button ml={4} onClick={handleSignOut} backgroundColor="#0101FE" color="white" colorScheme='blue'>
                Sign Out
              </Button>
            </Flex>
          )}
        </Flex>

        {/* Main Content */}
        <Flex height="100vh">
          {/* Sidebar */}
          <Box w="25vw" bg="gray.200" p={4}>
            {/* Search Bar */}
            <Input
              mb={4}
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* User List */}
            {filteredUsers.map((user) => (
              <Flex
                key={user.id}
                align="center"
                p={2}
                cursor="pointer"
                _hover={{ bg: 'gray.300' }}
                onClick={() => {
                  handleUserClick(user);
                  setCurrentUser(user);
                }}
              >
                <Avatar size="sm" src={user.avatar} />
                <Text ml={2}>{user.name}</Text>
              </Flex>
            ))}

          </Box>

          {/* Conversation Panel */}
          <Box w="70vw" p={4} overflowY="auto">
            {selectedUser ? (
              <Flex direction="column" align="center">
                <Avatar size="lg" src={selectedUser.avatar} />
                <Text mt={4} fontSize="xl">
                  Conversation with {selectedUser.name}
                </Text>
                <Box mt={4} mb={4} w="100%" flex="1" display="flex" flexDirection="column">
                  {conversation.map((item, index) => (
                    <Box key={index} mb={2}>
                      <Text fontWeight="bold">{item.user.name}:</Text>
                      <Text>{item.message}</Text>
                    </Box>
                  ))}
                </Box>
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
              <Text>Please select a user to start a conversation.</Text>
            )}
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default App;
