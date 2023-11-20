import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
} from '@chakra-ui/react'
import { toast } from 'react-toastify';
import { redirect } from 'react-router-dom';

const handleSubmit = async (email, password, navigate) => {
 
console.log(email, password)
  try {
    const res = await fetch("http://206.189.91.54/api/v1/auth/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email, password: password })
    });

   localStorage.setItem("access-token", res.headers.get("access-token"))
   localStorage.setItem("uid", res.headers.get("uid"))
   localStorage.setItem("expiry", res.headers.get("expiry"))
   localStorage.setItem("client", res.headers.get("client"))

    const responseData = await res.json();
    console.log(responseData)

    if(responseData.data){
      navigate("/app");
      
    }else {
      throw responseData
    }

  } catch (error) {
      console.log(error)
      toast.error(error.errors[0], {
        position: toast.POSITION.TOP_CENTER
      });
  }
};

export default function Login() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  
//   setUserInfo((curState)=> {
// console.log(curState)
//     return {...curState, email: "new email"}
//   })

async function getAllUsers() {
  try {
    const res = await fetch("http://206.189.91.54/api/v1/users", {
      headers: {
        "access-token": localStorage.getItem("access-token") || "",
        "uid": localStorage.getItem("uid") || "",
        "client": localStorage.getItem("client") || "",
        "expiry": localStorage.getItem("expiry") || "",
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    console.log(data)

    if (data.status === 401) {
      localStorage.clear();
    }

    

  } catch(error) {
    console.log(error);
  }
}


  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Sign in to your account</Heading>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input 
              type="email"
              id = "email"
              value = {userInfo.email}
              onChange = {(e)=> setUserInfo(curState => ({...curState, email: e.target.value}))}
             />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input 
            type="password" 
            id = "password"
            value = {userInfo.password}
            onChange = {(e) => setUserInfo(curState => ({...curState, password: e.target.value}))}/>
          </FormControl>
          <Stack spacing={6}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
              <Checkbox>Remember me</Checkbox>
              <Text color={'blue.500'}>Forgot password?</Text>
            </Stack>
            <Button colorScheme={'blue'} variant={'solid'} onClick={() => handleSubmit(userInfo.email,userInfo.password,navigate)}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  )
}