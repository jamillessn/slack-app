import React, { useState } from 'react';
import { toast } from 'react-toastify';
import  ChatAppLogo  from '../assets/chatapplogo.svg';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Stack
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';


function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conf_password, setConfPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfPasswordChange = (e) => setConfPassword(e.target.value);

  const handleFormSubmit = (e) => {
    if(password != conf_password)
    {
      toast.error("Passwords do not match.", {
        position: toast.POSITION.TOP_CENTER,
      })
    } else {
      e.preventDefault();
      handleSubmit(email, password);
    }
    
  }

  const handleSubmit = async (email, password) => {

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
        body: JSON.stringify({ email: email, password: password })
      });
  
     localStorage.setItem("access-token", res.headers.get("access-token"))
  
      const responseData = await res.json();
  
      if(responseData.status === "success"){
        toast.success('Registration successful.', {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/")
      }
      else if(responseData.status === "error"){
        throw responseData
      }
  
    } catch (error) {
        toast.error(error.errors.full_messages[0], {
          position: toast.POSITION.TOP_CENTER,
        });
    }
  };
  

  return (
    <>
    <Stack spacing={6} w={'full'} maxW={'md'}>
    <Flex
      align="center"
      justify="center"
      height="100vh"
      bgColor="#0101FE"
      minW={'100vw'}
      p={4}
      
    >
      <Box
        p={8}
        width={{ base: '90%', sm: '80%', md: '35%' }}
        bg="white"
        boxShadow="lg"
        borderRadius="md"
      >
      <FormControl isRequired>
        <Flex justifyContent="center" alignItems="center">
          <img src={ChatAppLogo} alt="Logo" width={100} align="center" id="logo"/>
          <Heading fontSize={'2xl'}>Create an account</Heading>
        </Flex>
      
        <FormLabel>Email address</FormLabel>
         <Input
          type='email'
          placeholder='Email'
          id= 'email'
          name = 'email'
          value={email}
          onChange={handleEmailChange}
        />

        <FormLabel>Password</FormLabel>
        <Input 
        type='password' 
        placeholder='Password' 
        value={password}
        onChange={handlePasswordChange}
         id='password' />

        <FormLabel>Confirm Password</FormLabel>
        <Input 
        type='password' 
        placeholder='Confirm Password' 
        value={conf_password} 
        id='conf_password' 
        onChange={handleConfPasswordChange }/>

        <Stack
          direction={{base: 'column', sm: 'row'}}
          align = {'center'}
          justify={'space-between'}
          >
            <Link to='/'>
                <Text color={'blue.500'}> Back to Login </Text>
            </Link>

            <Button
              mt={4}
              colorScheme='blue'
              onClick={handleFormSubmit}
              type='submit'
              bgColor='#0101FE'
            >
              Submit
            </Button>

        </Stack>
      </FormControl>
      </Box>
      </Flex>
    </Stack>
    </>
  );
}

export default Register;
