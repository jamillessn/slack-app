import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  Divider,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar
} from '@chakra-ui/react';

import Select from 'react-select';
import { X } from 'react-feather';

import { AiOutlineUser } from 'react-icons/ai';
import { getHeaders } from '../utils/getHeaders';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../utils/getAllUsers';

const Sidebar = () => {
  const [userId, setUserId] = useState([]);
  const [searchedUser, setSearchedUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [addedMember, setAddedMembers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [channelName, setChannelName] = useState('');
  const [channelMembers, setChannelMembers] = useState([]);
  const headers = getHeaders();
  
  const handleSelectUser = (user) => {
    setSelectedUser(user.email);
  };

  const openModal = () => {
    onOpen();
  };


  //Retrieve channels
  async function getChannelsList() {

    try {
      const res = await fetch("http://206.189.91.54/api/v1/channels/", {
        method: "GET",
        headers: {
          'access-token': headers.accessToken || "",
          'client' : headers.client || "",
          'expiry' : headers.expiry || "",
          'uid' : headers.uid || "",
          "Content-Type": "application/json"
        },
        
      });
      
      const responseData = await res.json();
     
      if(Array.isArray(responseData.data)) {
        setChannelList(responseData.data.map(chan => chan.name));
      }
      // else {
      //   toast.error("Invalid structure API response",{position: toast.POSITION.TOP_CENTER})
      // }
    } catch (error) {
        toast.error(error.error, {
          position: toast.POSITION.TOP_CENTER,
        });
    }
  };

  //Create channel
  const handleSubmit = async (channelName, channelMembers) => {

    try {
      const res = await fetch("http://206.189.91.54/api/v1/channels/", {
        method: "POST",
        mode: 'cors',
        headers: {
          'access-token': headers.accessToken || "",
          'client' : headers.client || "",
          'expiry' : headers.expiry || "",
          'uid' : headers.uid || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: channelName, user_ids: channelMembers })
        
      });
      
      console.log(channelName, channelMembers)

      toast.success('Channel created!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
  
      const responseData = await res.json();
      console.log(responseData)
    
      if(responseData.errors[0]){
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

  const handleCreateChannel = () => {
    const userIDs = [selectedUser];
    handleSubmit(channelName, userIDs);
    onClose();
  };

  const CustomOption = ({ innerProps, label }) => (
    <div {...innerProps}>
      <Avatar bg="black" icon={<AiOutlineUser fontSize="1.5rem" />} mr={2} />
      {label}
    </div>
  );
  
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
    
  //Populate the sidebar with users
  useEffect(() => {
    async function fetchData() {
      const users = await getAllUsers();
      setUsersList(users);
    }
    getChannelsList();
    fetchData();
    setUserId(headers.uid)
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
    <Box w="30vw" bg="gray.200" p={4} overflowY="scroll" maxHeight="100%">
      {/* Search Bar */}
      <Input
        mb={4}
        type="text"
        placeholder="Search users..."
        value={searchedUser}
        bgColor= "white"
        onChange={(e) => setSearchedUser(e.target.value)}
      />

      {/* "Create Channel" button */}
      <Button colorScheme="blue" bgColor="black" mb={4} onClick={openModal}>
        Create Channel
      </Button>

      <Divider my={2} borderColor="gray.400" />

      
      <Flex direction="column" style={{overflow: "hidden"}}>
      <Heading fontSize={'2xl'}>Channels:</Heading>
        <Box style={{overflow:"hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>

    {/* Display channel */}
      {channelList.map((chan) => (
            <Link 
              // to={`/app/channels/${chan.id}`} 
              key={chan.id}
              // onClick={() => handleSelectUser(user)}
              >
                <Box
                _hover={{ bgColor: 'gray.300', cursor: 'pointer' }}
                mb={2}
                p={2}
                borderRadius="md"
                  > 
              <Flex align="center" mb={2}>
                <Text
                  style={{overflow:"hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                      {chan}
                </Text>
              </Flex>
              </Box>
              
            </Link>
          ))}
     

      <Divider my={2} borderColor="gray.400" />

    {/* Display users */}
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
       
        </Box>
      </Flex>

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
            <Button colorScheme="blue" bgColor="black" mr={3} onClick={handleCreateChannel}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default Sidebar