import React,{useState, useContext, useEffect} from 'react'
import { Flex,Heading, InputGroup, InputRightElement, Input, IconButton, Select, SimpleGrid,
HStack,Button } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import Navbar from '../components/Navbar'
import CommunityCard from '../components/CommunityCard'
import background from '../assets/images/newbg.svg'
import {useReadCypher} from 'use-neo4j'
import { AuthContext } from '../context/authContext'
import { session } from 'neo4j-driver'
import { useNavigate } from 'react-router-dom'

const Community = () => {
  const navigate = useNavigate()
  const {conceptsQuery, setConceptsQuery, searchTerm, setSearchTerm} = useContext(AuthContext)
  
  setConceptsQuery(sessionStorage.getItem('conceptsQuery'))
  console.log('concepts query:', conceptsQuery)
  const conceptsRecords = useReadCypher(conceptsQuery).records
  const conceptsArr = conceptsRecords?.map((r)=>{return {name:r.get(0).properties.name.split('-')[1], user:r.get(0).properties.user
  }})
  console.log(conceptsArr)
  const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(8)
  
  const [choice, setChoice] = useState(sessionStorage.getItem('communityChoice')||'Entity')
  
  
  const lastIndex = currentPage * postsPerPage
  const firstIndex = lastIndex - postsPerPage
  const pageArr = conceptsArr?.slice(firstIndex,lastIndex)
  let pages:any[] = []

  if (conceptsArr) {
  for(let i=1; i<=Math.ceil(conceptsArr?.length /postsPerPage) ; i++) {
    pages.push(i)
  }}

  const handleClick = () => {
    if (choice === 'Entity') {
      sessionStorage.setItem('conceptsQuery',`MATCH (e:ENTITY{name:'${searchTerm}'})-[:EC]->(c:CONCEPT) RETURN (c)`)
    }
    else if (choice === 'User') { 
      sessionStorage.setItem('conceptsQuery',`MATCH (c:CONCEPT)-[:CU]->(u:USER{name:'${searchTerm}'}) RETURN (c)`)
    }
    sessionStorage.setItem('communitySearchTerm',searchTerm)
    sessionStorage.setItem('communityChoice', choice)
    window.location.reload()
  }

  
  
  return (
    <Flex className="app" flexDir='column' align='center' minHeight='100vh' width='100%' bgImg={background} bgPosition="center"
    bgRepeat="no-repeat"
    bgSize="cover">
      <Navbar/>

      < Heading my={6} color='whitesmoke' size='2xl'><span style={{fontSize:'56px',color:'hsl(285, 100%, 70%)', letterSpacing:'2px'}}>C</span>ommunity</Heading>

      <Flex width='50%' justify='space-between' mb={8}>
      <InputGroup width='75%'  >
      <Input placeholder='Search by...' bgColor='whitesmoke' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
      <InputRightElement>
      <IconButton onClick={handleClick} colorScheme='blue' borderLeftRadius='0' m={1} aria-label='search' icon={<SearchIcon/>}/>
      </InputRightElement></InputGroup>
        <Select width='20%' variant='filled' bgColor='whitesmoke' value={choice} _focus={{bgColor:'whitesmoke'}} onChange={(e)=>setChoice(e.target.value)}>
          <option value="Entity">Entity</option>
          <option value="User">User</option>
        </Select>
      </Flex>
      <SimpleGrid spacing={10} columns={4}>
      {pageArr?.map(c=> <CommunityCard name={c.name} user={c.user}
      onClick={()=>navigate(`/community/${c.user}/${c.name}`)}/>)
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

export default Community