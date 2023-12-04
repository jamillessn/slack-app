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
  Avatar,
  AvatarGroup
} from '@chakra-ui/react';
import { IconContext } from "react-icons";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { FaUserGroup } from "react-icons/fa6";
import { X } from 'react-feather';
import { AiOutlineUser } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../utils/getAllUsers';
import { getHeaders } from '../utils/getHeaders';
import { getChannelsList } from '../utils/getChannelsList';

const Sidebar = () => {
  const [userId, setUserId] = useState([]);
  const [searchedUser, setSearchedUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [usersList, setUsersList] = useState([]); // array that contains all fetched users from API

  const [channelList, setChannelList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [channelName, setChannelName] = useState('');
  const [channelMembers, setChannelMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelData, setChannelData] = useState([]);
  const [addedChannelMembers, setAddedChannelMembers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);


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
    localStorage.setItem("selectedUser", user.email);
    setSelectedUser(user.email);
  };

  // Create Channel button "Create"
  const handleCreateChannel = async () => {
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
        body: JSON.stringify({
          name: channelName,
          user_ids: addedChannelMembers
        })
      });
  
      const responseData = await res.json();
  
      console.log(responseData)
      if (!responseData.errors[0]) {
        toast.success('Channel created!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else {
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
  
  //fetch members to be added on Create Channel Modal
  const fetchUserOptions = async (searchTerm) => {
    try {
      setIsLoading(true); // Set loading state to true
      const users = await getAllUsers();
  
      // Filter users based on the search term and check if they are not in addedChannelMembers
      const filteredOptions = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !addedChannelMembers.includes(user.user_id)
      );
  
      setUserOptions(filteredOptions);
    } catch (error) {
      console.error('Error fetching user options:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  const openModal = () => {
    onOpen();
  };

  const handleSelectChannel = (channelId) => {
    try {
      const selectedChannel = channelData.find((channel) => channel.id === channelId);
      
      if (selectedChannel) {
        localStorage.setItem('selectedChannel', selectedChannel.channel_name);
      }
    } catch (error) {
      console.error('Error selecting channel:', error);
    }
  };
  
  const handleSubmit = () => {
    const userIDs = [selectedMembers];
    onClose();
    handleCreateChannel(channelName, userIDs);
    fetchData();
  };


  const CustomOption = ({ innerProps, label }) => (
    <div {...innerProps}>
      <Avatar bg="black" icon={<AiOutlineUser fontSize="1.5rem" />} mr={2} />
      {label}
    </div>
  );

  const displayChannels = channelList.map(channel => 
    (
   
    <Link key={channel.id} to={`/app/channels/${channel.id}`} 
    >
      <Box
        _hover={{ bgColor: 'gray.300', cursor: 'pointer' }}
        mb={2}
        pb={2}
        borderRadius="md"
      >
        <Flex align="center" mb={2} >
          <IconContext.Provider
            value={{ color: 'white', size: '20px' }}
          >
          <AvatarGroup size="md" max={2} mr={2}>
          <Avatar bg='black' icon={<AiOutlineUser fontSize='1.5rem' />} mr={4} />
          <Avatar bg='blue' icon={<AiOutlineUser fontSize='1.5rem' />} mr={4} />
          </AvatarGroup>
          </IconContext.Provider>
          <Text
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "700"}}
          >
            {channel.channel_name}
          </Text>
        </Flex>
      </Box>
    </Link>
  ));
  
  const CustomMultiValue = ({ data, innerProps, removeProps }) => (
    <Flex align="center" {...innerProps} bgColor="#f0f0f0" minWidth="10px" borderRadius="50px" paddingRight="5px" paddingLeft="5px">
      <Avatar size="2" bg="black" icon={<AiOutlineUser fontSize="1rem" />} mr={2} />
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
          setIsLoading(false); 
        }, 5000);
  
        try {
          setFilteredUsers(
            usersList.filter((user) =>
              user.email.toLowerCase().startsWith(searchedUser.toLowerCase())
            )
          );
        } finally {
          clearTimeout(timeoutId);
  
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
  
    handleSearch(); // Initial search without delay
  
    return () => {
      clearTimeout(timeoutId); // Clear the timeout on component unmount or when the search changes
      setIsLoading(false); // Set loading state to false when the component unmounts
    };
  }, [searchedUser, usersList]);

  
  return (
    <Box minWidth="20vw" minHeight="30vh" bg="gray.200" p={4} overflowX="hidden" height="90vh" position="sticky">

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
              required
            />

          <Input
            placeholder="Add members.."
            mt={4}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              fetchUserOptions(e.target.value);
            }}
          />

          {isLoading ? ( // Display spinner while loading
            <Box textAlign="center" mt={2}>
              <Spinner size="sm" color="blue.500" />
            </Box>
          ) : (
            userOptions.length > 0 && (
                  <Box mt={2} maxHeight="150px" overflowY="auto">
                  {userOptions.map((user) => (
                    <Box
                      key={user.user_id}
                      p={2}
                      _hover={{ bgColor: 'gray.200', cursor: 'pointer' }}
                      onClick={() => {
                        setAddedChannelMembers((prevMembers) => [...prevMembers, user.user_id]);
                        setSearchTerm('');
                        setUserOptions([]);
                      }}
                    >
                      {user.email}
                    </Box>
                ))}
              </Box>
            ))}

           {/* Display selected users as tags */}
{addedChannelMembers.map((memberId) => (
  <Flex
    key={memberId}
    align="center"
    bgColor="#f0f0f0"
    minWidth="10px"
    borderRadius="50px"
    paddingRight="5px"
    paddingLeft="5px"
    mt={2}
  >
    <Avatar size="2" bg="black" icon={<AiOutlineUser fontSize="1rem" />} mr={2} />
    {usersList.find((user) => user.user_id === memberId)?.email || ''}
    <X
      size={16}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        setAddedChannelMembers((prevMembers) => prevMembers.filter((member) => member !== memberId));
      }}
    />
  </Flex>
))}


            {/* Display selected users as tags */}
            {selectedMembers.map((memberId) => (
              <Flex
                key={memberId}
                align="center"
                bgColor="#f0f0f0"
                minWidth="10px"
                borderRadius="50px"
                paddingRight="5px"
                paddingLeft="5px"
                mt={2}
              >
                <Avatar size="2" bg="black" icon={<AiOutlineUser fontSize="1rem" />} mr={2} />
                {usersList.find((user) => user.user_id === memberId)?.email || ''}
                <X
                  size={16}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedMembers((prevMembers) => prevMembers.filter((member) => member !== memberId));
                  }}
                />
              </Flex>
            ))}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" bgColor="black" mr={3} onClick={handleSubmit}>
              Create
            </Button>
            <Button onClick={() => {
                      setSearchTerm('');
                      setChannelName('');
                      setUserOptions([]);
                      setSelectedMembers([]);
                      onClose();
                    }}
            >Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>


  );
};

export default Sidebar;