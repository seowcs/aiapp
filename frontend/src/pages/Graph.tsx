import { useState, useEffect, useContext } from 'react';
import {useReadCypher} from 'use-neo4j'
import { types } from 'neo4j-driver'
import { ForceGraph3D } from "react-force-graph";
import SpriteText from "three-spritetext";
import {Flex, Button, Text, Heading, IconButton, Box, Input, ListItem, List, ListIcon} from "@chakra-ui/react";
import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import Navbar from "../components/Navbar";
import Draggable from 'react-draggable';
import { AuthContext } from "../context/authContext";
import { Link } from 'react-router-dom';
interface NodeObj {
  id: number,
  name:string,
  group:string,
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
  "group": string,
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

function Graph() {
  const [mousePos, setMousePos] = useState({x:0,y:0});
  const [offsetPos, setOffsetPos] = useState({x:0,y:0});
  const [showOptions, setShowOptions] = useState(false)
  const [option, setOption] = useState('text')
  const [optionsConceptsArr, setOptionsConceptsArr] = useState([''])
  const [searchTerm, setSearchTerm] = useState('')
  const [conceptText, setConceptText] = useState('')
  const [nodeName, setNodeName] = useState('')
  const filteredConceptsArr = optionsConceptsArr.filter((c)=>
    c.toLowerCase().includes(searchTerm))
  //improve code


  const {currentUser, token, currentConcept, setCurrentConcept} = useContext(AuthContext)
  //change the hardcode

  const nodesQuery = `MATCH (e:ENTITY) -[:EC]->(c:CONCEPT{name:'user2-concept1'}) RETURN (e)`
  const edgesQuery = `MATCH (e1:ENTITY) -[:EC]->(c:CONCEPT{name:'user2-concept1'})<-[:EC]-(e2:ENTITY) MATCH (e1)-[r:EE]->(e2) return r`
  const conceptQuery = `MATCH (c:CONCEPT{name:'user2-concept1'}) RETURN c`
  const nodes = useReadCypher(nodesQuery).records
  const edges = useReadCypher(edgesQuery).records
  const conceptObj = useReadCypher(conceptQuery)
  
  useEffect(() => {
    if (conceptObj.records){
    setConceptText(conceptObj.records[0].get(0).properties.text)}
  
  }, [conceptObj])
  

 
  let nodes_arr:NodeObj[] = []
  if (nodes) {
    for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].get(0)
    const fullConcepts = node.properties.concepts
    const userConcepts = fullConcepts.filter((c:any)=>{
      const cArray = c.split('-')
      //dont hardcode this
      return cArray[0] == 'User 1' 
    })
    const conceptNames = userConcepts.map((c:any)=>c.split('-')[1])
    const node_obj = {id:node.identity.low, name:node.properties.name, group:node.labels[0], concepts: conceptNames}
    nodes_arr.push(node_obj)
  }
  }

  let edges_arr:EdgeObj[] = []
  if (edges) {
    for (let i = 0; i < edges.length; i++){
      const edge = edges[i].get(0)
      const edge_obj = {source:edge.start.low, target:edge.end.low, name:edge.properties.name, color:'#39FF14'}
      edges_arr.push(edge_obj)
    }
  }
  
  const graphData = {
    nodes: nodes_arr,
    links: edges_arr
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

    <Flex align='center' borderBottom='2px blue solid'>
      <Button id='text' _hover={{bgColor:'blue',color:'whitesmoke'}}  borderLeftRadius='0' borderRightRadius='0'  onClick={(e)=>{setOption('text');
    }}>Text</Button>
      <Button id='concepts' _hover={{bgColor:'blue',color:'whitesmoke'}}  borderRightRadius='0' borderLeftRadius='0'  borderLeft='2px solid blue' onClick={(e)=>{setOption('concepts');}}>Concepts</Button>
      <Button id='community' _hover={{bgColor:'blue',color:'whitesmoke'}}  borderLeftRadius='0' borderRightRadius='0'  borderLeft='2px solid blue' onClick={()=>{setOption('community');}}>Community</Button>
    </Flex>
    <Box display='block' overflowY='scroll' py={2} pl={3}>

      {option === 'text' && <Flex id='text-option'>
        <Text>{conceptText}</Text>
      </Flex>}

      {option === 'concepts' && 
      <Flex flexDir='column' >
        <Input size='sm' placeholder='Search related concepts' width='95%' mb={3} onChange={(e)=>setSearchTerm(e.target.value)}/>
      <List spacing={2}>
        {filteredConceptsArr.map((c:any, index)=>(<ListItem key={index} color='blue'><ListIcon as={ExternalLinkIcon} color='blue'/><Link to='#'>{c}</Link></ListItem>))}
      </List>
    </Flex>}

      {option === 'community' &&
      <Flex flexDir='column' justify='center' align='center'>
        <Text textAlign='center' mt={6} mb={3}>Find other users that have {nodeName} in their graphs!</Text>
        <Link to='/community'><Button colorScheme='green' rightIcon={<ExternalLinkIcon/>}>Community</Button></Link>
        </Flex>}
      
    </Box>
  </Flex>
  </Draggable>

  
  

  <ForceGraph3D
  controlType='trackball'
  graphData={graphData}
  nodeLabel={'id'}
  nodeAutoColorBy={'concept'}
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
  );
}

export default Graph;