import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  const [searchedUser, setSearchedUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  

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
      const dataLength = data.data.length
      let dataLengthless = dataLength - 100;

      console.log(data)
  
      setUsersList(data.data.slice(dataLengthless, dataLength).map(user => ({ user_id: user.id, email: user.email })));
      
    } catch(error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    // Filter users based on the search input
    setFilteredUsers(
      usersList.filter((user) =>
        user.email.toLowerCase().includes(searchedUser.toLowerCase())
      )
    );
  }, [searchedUser, usersList]);
  
  return (
    <Box w="25vw" bg="gray.200" p={4} height="100vh">
      {/* Search Bar */}
      <Input
        mb={4}
        type="text"
        placeholder="Search users..."
        value={searchedUser}
        onChange={(e) => setSearchedUser(e.target.value)}
      />

      {/* Display Filtered Users as Styled Entries */}
      <Flex direction="column">
        {filteredUsers.map((user) => (
          <Link to={`/app/c/${user.user_id}`} key={user.user_id}>
            <Flex align="center" mb={2}>
              <Avatar size="sm" marginRight={2}></Avatar>
              <Text>{user.email}</Text>
            </Flex>
          </Link>
        ))}
      </Flex>

    </Box>
  );
};

export default Sidebar
