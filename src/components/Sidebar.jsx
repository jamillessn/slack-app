// Sidebar.jsx
import React from 'react';
import { Box, Avatar, Flex, Input, Text } from '@chakra-ui/react';

const Sidebar = ({ filteredUsers, handleUserClick, searchTerm }) => {
  return (
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
          }}
        >
          <Avatar size="sm" src={user.avatar} />
          <Text ml={2}>{user.name}</Text>
        </Flex>
      ))}
    </Box>
  );
};

export default Sidebar;
