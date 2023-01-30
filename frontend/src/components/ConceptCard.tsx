import React from 'react'
import {Card, CardHeader, CardBody, CardFooter,Text, VStack, Heading, StackDivider} from '@chakra-ui/react'

interface ConceptCardProps {
    name: string,
    id:number,
    privacy: string,
    onClick: () => void
}

const ConceptCard = ({name, id, privacy, onClick }: ConceptCardProps) => {
  return (
    <Card bgColor='whitesmoke' width='240px' variant='elevated' 
     _hover={{bgColor:'lightgray', cursor:'pointer'}}
     onClick={onClick}>
          <CardHeader pb={0}> <Heading size='md'>{name}</Heading> </CardHeader>
          <CardBody><VStack divider={<StackDivider bgColor='black'/>} align='flex-start'>
            <Text><strong>ID:</strong> {id}</Text>
            <Text> <strong>Private:</strong> {privacy}</Text>
          </VStack>
          </CardBody>
        </Card>
  )
}

export default ConceptCard