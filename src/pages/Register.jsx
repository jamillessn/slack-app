import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { redirect } from 'react-router-dom';

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

    console.log(res.headers.get("uid"));
    console.log(res.headers.get("access-token"));
    console.log(res.headers.get("expiry"));
    console.log(res.headers.get("client"));

    const responseData = await res.json();
    console.log(responseData)

    if(responseData.status === "success"){
      toast('Registration successful.')
      redirect("login")
    }

    if(responseData.status === "error"){
      throw responseData
    }
    

  } catch (error) {
      console.log(error)
      toast.error(error.errors.full_messages[0], {
        position: toast.POSITION.TOP_RIGHT,
      });
  }
};

function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conf_password, setConfPassword] = useState('');

  const handleNameChange = (e) => setUserName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfPasswordChange = (e) => setConfPassword(e.target.value);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(email, password);
  };

  return (
    <>
     
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input 
        type='text' 
        placeholder='First Name' 
        value={userName} 
        onChange={handleNameChange}
        name='userName' 
        id='userName'/>

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

        <Button
          mt={4}
          colorScheme='teal'
          onClick={handleFormSubmit}
          type='submit'
        >
          Submit
        </Button>
      </FormControl>
    </>
  );
}

export default Register;
