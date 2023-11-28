import React from 'react'
import {Flex,Text } from '@chakra-ui/react';

export const None = () => {
  
  return (
         <Flex justifyContent="center" alignItems="center" width="100vw">
        <Text fontWeight="bold" fontSize="lg">
          Please select a user to start a conversation.
        </Text>
        </Flex>
  )
  
}