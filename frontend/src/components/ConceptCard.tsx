import React from 'react'
import {Card, CardHeader, CardBody, CardFooter,Text, VStack, Heading, StackDivider} from '@chakra-ui/react'

interface ConceptCardProps {
    name: string,
    id:number,
    privacy: string
}

const ConceptCard = ({name, id, privacy }: ConceptCardProps) => {
  return (
    <Card bgColor='whitesmoke' width='240px'>
          <CardHeader pb={0}> <Heading size='md'>{name}</Heading> </CardHeader>
          <CardBody><VStack divider={<StackDivider/>} align='flex-start'>
            <Text><strong>ID:</strong> {id}</Text>
            <Text> <strong>Private:</strong> {privacy}</Text>
          </VStack>
          </CardBody>
        </Card>
  )
}

export default ConceptCard