import React,{useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
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
import {useReadCypher} from 'use-neo4j'
import { SearchIcon } from "@chakra-ui/icons";
import background from '../assets/images/newbg.svg'
import Navbar from '../components/Navbar';
import ConceptCard from '../components/ConceptCard';
const GraphsPage = () => {
  const {currentUser} = useContext(AuthContext)
  const navigate = useNavigate()
  const user = currentUser
  const conceptsQuery = `MATCH (c:CONCEPT)-[:CU]->(u:USER{name:'${user}'}) RETURN c`
  const conceptsRecords = useReadCypher(conceptsQuery).records
  const conceptsArr = conceptsRecords?.map((r)=>{return {name:r.get(0).properties.name,private:r.get(0).properties.private, id:r.get(0).identity.low
    }})
  
  

  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState('')
  const lastIndex = currentPage * postsPerPage
  const firstIndex = lastIndex - postsPerPage
  const searchedArr = conceptsArr?.filter(c=> c.name.split('-')[1].toLowerCase().includes(searchTerm))
  console.log(searchedArr)
  const pageArr = searchedArr?.slice(firstIndex, lastIndex)

  let pages = []
  if (searchedArr) {
  for(let i=1; i<=Math.ceil(searchedArr?.length /postsPerPage) ; i++) {
    pages.push(i)
  } }
  
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
          pageArr?.map((c:any)=><ConceptCard id={c.id} name={c.name.split('-')[1]} privacy={c.private.toString()}
          onClick={()=>navigate(`/graphs/${c.name.split('-')[1]}`)}/>)
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