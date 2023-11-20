import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button
} from '@chakra-ui/react';

function PasswordInput({ show, handleClick, onChange }) {
  return (
    <InputGroup size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Enter password'
        onChange={onChange}
        name='password'
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordClick = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res2 = await fetch("http://206.189.91.54/api/v1/sign_in", {
        method: "POST",
        headers: {
          "access-token": localStorage.getItem("access-token"),
          "uid": localStorage.getItem("uid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const accessToken = res2.headers.get('access-token');
      localStorage.setItem("accessToken", accessToken);
      console.log(res2.headers.get('access-token'));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input type='email' placeholder='Email' name='email' onChange={handleChange} />

        <FormLabel>Password</FormLabel>
        <PasswordInput show={showPassword} handleClick={handlePasswordClick} onChange={handleChange} />

        <Button
          mt={4}
          colorScheme='teal'
          type='submit'
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </FormControl>
    </>
  );
}

export default Login;
