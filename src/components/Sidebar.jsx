import React, { useState } from 'react';
import { Box, Flex, Input, Button, Avatar, Text } from '@chakra-ui/react';

// function UserNavLink ({
//   firstLetter,
//   username,
//   path
// }: {
//   firstLetter: string;
//   username: string;
//   path: number
// }) {
//   return ( 
//     <Flex
//           key={user.id}
//           align="center"
//           p={2}
//           cursor="pointer"
//           _hover={{ bg: 'gray.300' }}
//           onClick={() => {
//             handleUserClick(user);
//           }}
//         >
//           <Avatar size="sm" src={user.avatar} />
//           <Text ml={2}>{user.name}</Text>
//         </Flex>
//   );
// }
const Sidebar = ({ filteredUsers, handleUserClick, createChannel, channels, handleChannelClick }) => {
  const [channelName, setChannelName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateChannel = () => {
    if (channelName.trim() !== '') {
      createChannel(channelName);
      setChannelName('');
    }
  };

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

      {/* Create Channel Button and Input */}
      <Flex mb={4}>
        <Input
          placeholder="Channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          mr={2}
        />
        <Button onClick={handleCreateChannel} colorScheme="blue" backgroundColor={'#0101FE'}>
          Create Channel
        </Button>
      </Flex>

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

      {/* Channels */}
      <Text fontWeight="bold" mb={2}>
        Channels
      </Text>
      {channels.map((channel) => (
        <Flex
          key={channel.name}
          align="center"
          p={2}
          cursor="pointer"
          _hover={{ bg: 'gray.300' }}
          onClick={() => {
            handleChannelClick(channel);
          }}
        >
          <Avatar size="sm" src="https://placekitten.com/50/50" />
          <Text ml={2}>{channel.name}</Text>
        </Flex>
      ))}
    </Box>
  );
};

export default Sidebar;
