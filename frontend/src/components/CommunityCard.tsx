import React from 'react'
import {Card, CardHeader,CardFooter,CardBody, Heading, VStack, StackDivider, Text} from '@chakra-ui/react'

const CommunityCard = () => {
  return (
    <Card bgColor='whitesmoke' width='240px'>
        <VStack divider={<StackDivider m={0} />} align='flex-start'>
        <CardHeader pb={2}><Heading size='md' >Concept1</Heading></CardHeader>
        <CardFooter pt={1} ><Text size='sm'><strong>User: </strong>User1</Text></CardFooter>
        </VStack>
        
    </Card>
  )
}

export default CommunityCard