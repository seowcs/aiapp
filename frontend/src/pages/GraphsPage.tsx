import React,{useState} from 'react'
import {
  Flex,
  Heading,
  SimpleGrid,
  VStack,
  StackDivider,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Button,
  Link,
  Select,
  Box,
  HStack
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";
import background from '../assets/images/newbg.svg'
import Navbar from '../components/Navbar';
import ConceptCard from '../components/ConceptCard';
const GraphsPage = () => {
  const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState('')
  const lastIndex = currentPage * postsPerPage
  const firstIndex = lastIndex - postsPerPage
  // fix this aft connecting to backend
  // const searchedArr = arr.filter(c=>c.name.toLowerCase().includes(searchTerm))
  const pageArr = arr.slice(firstIndex, lastIndex)

  let pages = []
  for(let i=1; i<=Math.ceil(arr.length/postsPerPage) ; i++) {
    pages.push(i)
  }
  console.log(pageArr)
  return (
    <Flex className="app" flexDir='column' align='center' minHeight='100vh' width='100%' bgImg={background} bgPosition="center"
    bgRepeat="no-repeat"
    bgSize="cover">
      <Navbar/>
      <Flex width='90%' justify='space-between' mt={8} align='center'>
        <Heading color='	hsl(285, 100%, 70%)'><span style={{color:'whitesmoke'}}>Concept</span> Graphs</Heading> 
        <Input placeholder='Concept Name' width='50%' variant='filled' color='whitesmoke' bgColor='whitesmoke' onChange={(e)=>setSearchTerm(e.target.value)}/>
        <Link href='/graphs/all' textDecoration='none' _hover={{textDecoration:'none'}}><Button color='whitesmoke'  bgColor='blue'             border="2px"
              borderColor="#1F51FF">User Graph</Button></Link>
      </Flex>
      <SimpleGrid mt={8} columns={4} spacing={10}>
        {
          //convert privacy from bool in neo4j to string
          pageArr.map((c:number)=><ConceptCard id={c} name={`Concept ${c}`} privacy='true'/>)
        }
      
      
      </SimpleGrid>

      <HStack position='absolute' bottom={6}>
        {pages.map((page,index)=>{
          return(
            <Button key={index} _active={{bgColor:'royalblue'}} className={page==currentPage ? 'active' : ''}  onClick={()=>setCurrentPage(page)}>{page}</Button>
          )
            
        })}
        </HStack>
      
    </Flex>
    
  )
}

export default GraphsPage