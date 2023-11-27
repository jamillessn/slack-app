import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../utils/api';


const Sidebar = () => {
  const [searchedUser, setSearchedUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  localStorage.setItem("selectedUser", selectedUser)
  
  const handleSelectUser = (user) => {
    setSelectedUser(user.email);
  };

  useEffect(() => {
    async function fetchData() {
      const users = await getAllUsers();
      setUsersList(users);
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Filter users when typing on search bar
    setFilteredUsers(
      usersList.filter((user) =>
        user.email.toLowerCase().includes(searchedUser.toLowerCase())
      )
    );
  }, [searchedUser, usersList]);
  
  return (
    <Box w="30vw" bg="gray.200" p={4} overflowY="scroll">
      {/* Search Bar */}
      <Input
        mb={4}
        type="text"
        placeholder="Search users..."
        value={searchedUser}
        bgColor= "white"
        onChange={(e) => setSearchedUser(e.target.value)}
      />

      {/* Display filtered users */}
      <Flex direction="column">
        {filteredUsers.map((user) => (
          <Link 
            to={`/app/c/${user.user_id}`} 
            key={user.user_id}
            onClick={() => handleSelectUser(user)}
            >
            <Flex align="center" mb={2}>

              <Box
                w={8}
                h={8}
                rounded="full"
                bg="black"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                marginRight={2}
              >
                <Text fontSize="sm" fontWeight="bold">
                  {user.email.charAt(0).toUpperCase()}
                </Text>
              </Box>
              <Text>{user.email}</Text>
            </Flex>
          </Link>
        ))}
      </Flex>

    </Box>
  );
};

export default Sidebar
