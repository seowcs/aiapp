import React from 'react'
import { Flex,Heading, InputGroup, InputRightElement, Input, IconButton, Select, SimpleGrid } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import Navbar from '../components/Navbar'
import CommunityCard from '../components/CommunityCard'
import background from '../assets/images/newbg.svg'
const Community = () => {
  return (
    <Flex className="app" flexDir='column' align='center' minHeight='100vh' width='100%' bgImg={background} bgPosition="center"
    bgRepeat="no-repeat"
    bgSize="cover">
      <Navbar/>

      < Heading my={6} color='whitesmoke' size='2xl'><span style={{fontSize:'56px',color:'hsl(285, 100%, 70%)', letterSpacing:'2px'}}>C</span>ommunity</Heading>

      <Flex width='50%' justify='space-between' mb={8}>
      <InputGroup width='75%'  >
      <Input placeholder='Search by...' bgColor='whitesmoke'/>
      <InputRightElement>
      <IconButton colorScheme='blue' borderLeftRadius='0' m={1} aria-label='search' icon={<SearchIcon/>}/>
      </InputRightElement></InputGroup>
        <Select width='20%' variant='filled' bgColor='whitesmoke' _focus={{bgColor:'whitesmoke'}}>
          <option value="Entity">Entity</option>
          <option value="User">User</option>
        </Select>
      </Flex>
      <SimpleGrid spacing={10} columns={4}>
      <CommunityCard/>
      <CommunityCard/>
      <CommunityCard/>
      <CommunityCard/>
      <CommunityCard/>
      <CommunityCard/>
      <CommunityCard/>
      <CommunityCard/>
      </SimpleGrid>
      

      
    </Flex>
  )
}

export default Community