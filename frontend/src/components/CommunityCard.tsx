import React from 'react'
import {Card, CardHeader,CardFooter,CardBody, Heading, VStack, StackDivider, Text, Icon, Flex} from '@chakra-ui/react'
import {FaUserCircle} from 'react-icons/fa'
interface CommunityCardProps {
  name: string,
  user: string
}

const CommunityCard = ({name,user}: CommunityCardProps) => {
  return (
    <Card bgColor='whitesmoke' width='240px'>
        <VStack divider={<StackDivider m={0} />} align='flex-start'>
        <CardHeader pb={2}><Heading size='md' >{name}</Heading></CardHeader>
        <CardFooter pt={1} >
          <Flex align='center'>
          <Icon as={FaUserCircle} boxSize={5} mr={2} color='#000080'/> 
          <Text size='sm'>{user}</Text>
          </Flex>
            </CardFooter>
        </VStack>
        
    </Card>
  )
}

export default CommunityCard