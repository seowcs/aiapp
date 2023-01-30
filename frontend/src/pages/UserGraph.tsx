import { useState, useEffect, useContext } from 'react';
import {useReadCypher} from 'use-neo4j'
import { ForceGraph3D } from "react-force-graph";
import SpriteText from "three-spritetext";
import {Flex, Button, Text, Heading, IconButton, Box, Input, ListItem, List, ListIcon} from "@chakra-ui/react";
import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import Navbar from "../components/Navbar";
import Draggable from 'react-draggable';
import { AuthContext } from "../context/authContext";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface NodeObj {
  id: number,
  name:string,
  concepts:string[]
}

interface EdgeObj {
  
    source: number,
    target:number,
    name: string,
    color:string
}
interface graphNode  {
  "id": number,
  "name": string,
  "concepts": string[],
  "color": string,
  "index": number,
  "x":  number,
  "y":  number,
  "z":  number,
  "vx":  number,
  "vy":  number,
  "vz": number
}


const UserGraph = () => {
  const {currentUser, token, currentConcept, setCurrentConcept,setSearchTerm} = useContext(AuthContext)

  const navigate = useNavigate()
  const [mousePos, setMousePos] = useState({x:0,y:0});
  const [offsetPos, setOffsetPos] = useState({x:0,y:0});
  const [showOptions, setShowOptions] = useState(false)
  const [option, setOption] = useState('text')
  const [optionsConceptsArr, setOptionsConceptsArr] = useState([''])
  const [graphSearchTerm, setGraphSearchTerm] = useState('')
  const [nodeName, setNodeName] = useState('')
  const filteredConceptsArr = optionsConceptsArr.filter((c)=>
    c.toLowerCase().includes(graphSearchTerm))

  const user = currentUser

  const nodesQuery = `MATCH (e:ENTITY)-[:EU]->(u:USER{name:"${user}"}) RETURN (e)`
  const edgesQuery = `MATCH (e1:ENTITY)-[:EU]->(u:USER{name:"${user}"})<-[:EU]-(e2:ENTITY) MATCH (e1)-[r:EE]->(e2) RETURN r`
  const nodesRecords = useReadCypher(nodesQuery).records
  const edgesRecords = useReadCypher(edgesQuery).records


  let nodesArr:NodeObj[] = []
  if (nodesRecords) {
    for (let i = 0; i < nodesRecords.length; i++) {
      const n = nodesRecords[i].get(0)
      const fullConcepts = n.properties.concepts
      const userConcepts = fullConcepts.filter((c:any)=>{
        const cArray = c.split('-')
        //dont hardcode this
        return cArray[0] == user
      })
      let conceptNames = userConcepts.map((c:any)=>c.split('-')[1])
      const node_obj = {id:n.identity.low, name:n.properties.name, concepts: conceptNames}
    nodesArr.push(node_obj)
    }

}


let edgesArr:EdgeObj[] = []
if (edgesRecords) {
  for (let i = 0; i < edgesRecords.length; i++){
    const edge = edgesRecords[i].get(0)
    const edge_obj = {source:edge.start.low, target:edge.end.low, name:edge.properties.name, color:'#39FF14'}
    edgesArr.push(edge_obj)
  }
}


  const graphData = {
    nodes: nodesArr,
    links: edgesArr
  }

  console.log(graphData)

  return (
    <Flex flexDirection='column' align='center'>
      <Navbar position='absolute'/>
      
      <Draggable onStop={((e,data)=>setOffsetPos({x:data.x, y:data.y}))}>
  <Flex flexDirection='column' position='absolute' width='250px' height='350px' bgColor='whitesmoke' 
  left={`${mousePos.x-125}px`} top={`${mousePos.y}px`} zIndex='1'
  borderRadius='10px' border='2px solid blue' transition="opacity .25s ease" opacity={showOptions ? 1 : 0} >

    <Flex align='center' borderBottom='2px blue solid'>
      <Flex width='90%' justify='center'><Heading size='md'>{nodeName}</Heading></Flex>
    <IconButton aria-label='close' size='md' icon={<CloseIcon />} borderLeft='2px solid blue'  bgColor='red' color='whitesmoke' onClick={()=>setShowOptions(false)} borderTopLeftRadius='0px' borderBottomRadius='0px'/>
    </Flex>

    <Flex align='center' justify='center' borderBottom='2px blue solid'>

      <Button w='50%' id='concepts' _hover={{bgColor:'blue',color:'whitesmoke'}}  borderRightRadius='0' borderLeftRadius='0'  onClick={(e)=>{setOption('concepts');}}>Concepts</Button>
      <Button w='50%' id='community' _hover={{bgColor:'blue',color:'whitesmoke'}}  borderLeftRadius='0' borderRightRadius='0'  borderLeft='2px solid blue' onClick={()=>{setOption('community');}}>Community</Button>
    </Flex>
    <Box display='block' overflowY='scroll' py={2} pl={3}>

      {option === 'concepts' && 
      <Flex flexDir='column' >
        <Input size='sm' placeholder='Search concepts' width='95%' mb={3} onChange={(e)=>setGraphSearchTerm(e.target.value)}/>
      <List spacing={2}>
        {filteredConceptsArr.map((c:any, index)=>(<ListItem key={index} color='blue'><ListIcon as={ExternalLinkIcon} color='blue'/><Link to='#'>{c}</Link></ListItem>))}
      </List>
    </Flex>}

      {option === 'community' &&
      <Flex flexDir='column' justify='center' align='center'>
        <Text textAlign='center' mt={6} mb={3}>Find other users that have {nodeName} in their graphs!</Text>
        <Button colorScheme='green' rightIcon={<ExternalLinkIcon/>} onClick={()=>{
          sessionStorage.setItem('communitySearchTerm', nodeName)
          setSearchTerm(nodeName)
          navigate('/community')}
          }>Community</Button>
        </Flex>}
      
    </Box>
  </Flex>
  </Draggable>



      <ForceGraph3D
    controlType='trackball'
    graphData={graphData}
    nodeLabel={'id'}
    nodeAutoColorBy={'concepts'}
    nodeRelSize={4}
    linkDirectionalArrowLength={4}
    linkDirectionalArrowRelPos={0.5}
    linkCurvature={0.4}
    linkWidth={0.25}
    linkOpacity={0.75}
    nodeOpacity={0}
    nodeThreeObject={(node:any)=> {
      const sprite = new SpriteText(node.name);
      sprite.color = 'whitesmoke';
      sprite.backgroundColor = 'rgba(0,0,0,0.9)'
      sprite.borderWidth = 1;
      sprite.padding = 2;
      sprite.borderColor = 'whitesmoke';
      sprite.borderRadius = 4
      sprite.textHeight = 2;
      return sprite;
    }}
    nodeThreeObjectExtend={true}
    onNodeClick={(node,e)=>{
      setMousePos({'x':e.clientX-offsetPos.x,'y':e.clientY-offsetPos.y})
      setOptionsConceptsArr((node as graphNode).concepts)
      setShowOptions(true)
      setNodeName((node as graphNode).name)
    }}
    
    
  />
    </Flex>
  )
}

export default UserGraph