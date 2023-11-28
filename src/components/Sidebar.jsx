import React, { useState, useEffect, useRef } from 'react';
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
  useDisclosure
} from '@chakra-ui/react';
// import { getHeaders } from '../utils/getHeaders';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../utils/api';


const Sidebar = () => {
  const [user_id, setUserId] = useState([]);
  const [searchedUser, setSearchedUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [channelName, setChannelName] = useState('');
  // const [ headers, setHeaders ] = useState({});
  
  localStorage.setItem("selectedUser", selectedUser)
  
  const handleSelectUser = (user) => {
    setSelectedUser(user.email);
  };

  const openModal = () => {
    onOpen();
  };

  // const handleCreateChannel = () => {
  //   console.log('Channel created:', channelName);
  //   onClose();

  //   const channelBody = {
  //     name: channelName,
  //     user_id: [data.owner.id]
  //   }

  //   console.log(channelBody.name, channelBody.user_id)

  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'access-token': headers.accessToken,
  //       'client' : headers.client,
  //       'expiry' : headers.expiry,
  //       'uid' : headers.uid
  //     }
  //   }

  //   const url = 'http://206.189.91.54/api/v1/channels'

  //   fetch(url, options)
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(data => {
  //       console.log(data)
  //       if(data.errors){
  //         console.log(data)
  //       } else {
  //         setChannelList([...channelList, data.data])
  //       }

  //     })
  // };

  // const handleCreateChannel = () => {
  //   onOpen();
  // };

  const handleSubmit = async (channelName, userId) => {

    try {
      const res = await fetch("http://206.189.91.54/api/v1/auth/", {
        method: "POST",
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          "uid": localStorage.getItem("uid") || "",
          "client": localStorage.getItem("client") || "",
          "expiry": localStorage.getItem("expiry") || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ channelName: channelName, userId: userId })
      });
  
    //  localStorage.setItem("access-token", res.headers.get("access-token"))
  
      const responseData = await res.json();
  
      if(responseData.status === "success"){
        toast.success('Channel created!', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      else if(responseData.status === "error"){
        throw responseData
      }
  
    } catch (error) {
        toast.error(error.error[0], {
          position: toast.POSITION.TOP_CENTER,
        });
    }
  };

  const channelListDisplay = () => {
    channelList.map( chan => {
      return <Link 
            // to={`/app/c/${user.user_id}`} 
            key={chan.id}
            // onClick={() => handleSelectUser(user)}
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
                  C
                </Text>
              </Box>
              <Text>{chan.name}</Text>
            </Flex>
          </Link>
    });
  }

    
  //Populate the sidebar with users
  useEffect(() => {
    async function fetchData() {
      const users = await getAllUsers();
      setUsersList(users);
    }
    channelListDisplay();
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

      {/* "Create Channel" button */}
      <Button colorScheme="blue" bgColor="black" mb={4} onClick={openModal}>
        Create Channel
      </Button>

      <Divider my={2} borderColor="gray.400" />

      {/* Display channel and filtered users */}
      <Flex direction="column" style={{overflow: "hidden"}}>
      <Heading fontSize={'2xl'}>Channels:</Heading>
        <Box style={{overflow:"hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
        {channelListDisplay()}

      <Divider my={2} borderColor="gray.400" />

        {filteredUsers.map((user) => (
          <Link 
            to={`/app/c/${user.user_id}`} 
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
                style={{overflow:"hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
              >
                <Text fontSize="sm" fontWeight="bold">
                  {user.email.charAt(0).toUpperCase()}
                </Text>
              </Box>
              <Text>{user.email}</Text>
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

export default Sidebar