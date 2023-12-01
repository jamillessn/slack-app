import React, { useState, useEffect } from 'react';
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
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Spinner,
  Avatar
} from '@chakra-ui/react';
import { IconContext } from "react-icons";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { FaUserGroup } from "react-icons/fa6";

import Select from 'react-select';
import { X } from 'react-feather';

import { AiOutlineUser } from 'react-icons/ai';
import { getHeaders } from '../utils/getHeaders';
import { getChannelsList } from '../utils/getChannelsList';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../utils/getAllUsers';

const Sidebar = () => {
  const [userId, setUserId] = useState([]);
  const [searchedUser, setSearchedUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Updated state for all users
  const [channelList, setChannelList] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [channelName, setChannelName] = useState('');
  const [channelMembers, setChannelMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const headers = getHeaders();
 
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
    setUserId(headers.uid);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user.email);
    localStorage.setItem("selectedUser", user.email)
  };

  const openModal = () => {
    onOpen();
  };


  // Create Channel button "Create"
  const handleCreateChannel = async (channelName, channelMembers) => {
    try {
      const res = await fetch("http://206.189.91.54/api/v1/channels/", {
        method: "POST",
        mode: 'cors',
        headers: {
          'access-token': headers.accessToken || "",
          'client': headers.client || "",
          'expiry': headers.expiry || "",
          'uid': headers.uid || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: channelName, user_ids: channelMembers })
      });

      toast.success('Channel created!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

      const responseData = await res.json();

      if (responseData.errors[0]) {
        toast.error(responseData.errors[0], {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(error.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleSubmit = () => {
    const userIDs = [selectedUser];
    handleCreateChannel(channelName, userIDs);
    onClose();
  };

  const CustomOption = ({ innerProps, label }) => (
    <div {...innerProps}>
      <Avatar bg="black" icon={<AiOutlineUser fontSize="1.5rem" />} mr={2} />
      {label}
    </div>
  );

  const displayChannels = channelList.map(channel => (
    <Link key={channel.id} to={`/app/channels/${channel.id}`}>
      <Box
        _hover={{ bgColor: 'gray.300', cursor: 'pointer' }}
        mb={2}
        p={2}
        borderRadius="md"
      >
        <Flex align="center" mb={2} flexDirection="column">
          <IconContext.Provider
            value={{ color: 'blue', size: '20px' }}
          >
            <FaUserGroup />
          </IconContext.Provider>
          <Text
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {channel.channel_name}
          </Text>
        </Flex>
      </Box>
    </Link>
  ));
  
  const CustomMultiValue = ({ data, innerProps, removeProps }) => (
    <Flex align="center" {...innerProps}>
      <Avatar bg="black" icon={<AiOutlineUser fontSize="1.5rem" />} mr={2} />
      {data.label}
      <X
        size={16}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          removeProps.onClick(e);
          setChannelMembers(channelMembers.filter((member) => member !== data.value));
        }}
      />
    </Flex>
  );

  async function fetchData() {
    try {
      setIsLoading(true);
      const users = await getAllUsers();
      setUsersList(users);
      setAllUsers(users); // Update allUsers state
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Populate the sidebar with users
  useEffect(() => {
    getChannelsList();

    fetchData();
    setUserId(headers.uid);
  }, []);

useEffect(() => {
  let timeoutId;

  // Filter users when typing on the search bar
  const handleSearch = async () => {
    clearTimeout(timeoutId);

    // Show loading only if there's a change in the search bar value
    if (searchedUser.trim() !== '') {
      setIsLoading(true);

      // Show loading after 5 seconds
      timeoutId = setTimeout(() => {
        setIsLoading(true);
      }, 5000);

      setFilteredUsers(
        usersList.filter((user) =>
          user.email.toLowerCase().startsWith(searchedUser.toLowerCase())
        )
      );

      try {
        await fetchData();
      } finally {
        clearTimeout(timeoutId);

        // Reset loading state to false when both search and user data fetching are done
        if (usersList.length > 0) {
          setIsLoading(false);
        }
      }
    } else {
      // Reset loading state to false when the search bar is empty
      setIsLoading(false);
    }
  };

  handleSearch(); // Initial search without delay

  return () => {
    clearTimeout(timeoutId); // Clear the timeout on component unmount or when the search changes
  };
}, [searchedUser, usersList]);

  
  return (
    <Box minWidth="20vw" minHeight="30vh" bg="gray.200" p={4} overflowX="hidden" height="95vh" position="sticky">

      <Tabs isFitted variant='enclosed'>
        <TabList mb='1em'>
          <IconContext.Provider value={{ color: "blue", className: "global-class-name", size: "30px" }}>
            <Tab><FaUserGroup /></Tab>
            <Tab><HiChatBubbleLeftEllipsis /></Tab>
          </IconContext.Provider>
        </TabList>
        <TabPanels>
          <TabPanel>
            {/* CHANNELS Tab */}
            {/* "Create Channel" button */}
            <Button colorScheme="blue" bgColor="black" mb={4} onClick={openModal}>
              Create Channel
            </Button>
            {displayChannels}
          </TabPanel>

          {/* USERS Tab */}
          <TabPanel>
            {/* Search Bar */}
            <Input
              mb={4}
              type="text"
              placeholder="Search users..."
              value={searchedUser}
              bgColor="white"
              onChange={(e) => setSearchedUser(e.target.value)}
            />

            {searchedUser.trim() !== '' && filteredUsers.map((user) => (
              <Link
                to={`/app/m/${user.user_id}`}
                key={user.user_id}
                onClick={() => handleSelectUser(user)}
              >
                <Box
                  _hover={{ bgColor: 'gray.300', cursor: 'pointer' }}
                  mb={2}
                  p={2}
                  borderRadius="md"
                >
                  <Flex align="center" mb={2}>
                    <Avatar bg='black' icon={<AiOutlineUser fontSize='1.5rem' />} mr={4} />
                    <Text
                      style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {user.email.split('@')[0]}
                    </Text>
                  </Flex>
                </Box>
              </Link>
            ))}

            {/* Display loading animation while fetching data */}
            {isLoading && (
              <Box textAlign="center" mt={4}>
                <Spinner size="xl" color="blue.500" />
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal for creating a channel */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Channel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />

            <Select
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
            />

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" bgColor="black" mr={3} onClick={handleSubmit}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>


  );
};

export default Sidebar;