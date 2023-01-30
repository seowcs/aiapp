import { useState, useEffect, useContext } from 'react';
import {useReadCypher} from 'use-neo4j'
import { ForceGraph3D } from "react-force-graph";
import SpriteText from "three-spritetext";
import {Flex, Button, Text, Heading, IconButton, Box, Input, ListItem, List, ListIcon} from "@chakra-ui/react";
import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import Navbar from "../components/Navbar";
import Draggable from 'react-draggable';
import { AuthContext } from "../context/authContext";
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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

const CommunityGraph = () => {
  const navigate = useNavigate()
  const params = useParams()
  
  const [mousePos, setMousePos] = useState({x:0,y:0});
  const [offsetPos, setOffsetPos] = useState({x:0,y:0});
  const [showOptions, setShowOptions] = useState(false)
  const [option, setOption] = useState('text')
  const [optionsConceptsArr, setOptionsConceptsArr] = useState([''])
  const [graphSearchTerm, setGraphSearchTerm] = useState('')
  const [conceptText, setConceptText] = useState('')
  const [nodeName, setNodeName] = useState('')
  const filteredConceptsArr = optionsConceptsArr.filter((c)=>
    c.toLowerCase().includes(graphSearchTerm))

  const user = params.user
  const concept = params.concept

  const nodesQuery = `MATCH (e:ENTITY) -[:EC]->(c:CONCEPT{name:"${user}-${concept}"}) RETURN (e)`
  const edgesQuery = `MATCH (e1:ENTITY) -[:EC]->(c:CONCEPT{name:"${user}-${concept}"})<-[:EC]-(e2:ENTITY) MATCH (e1)-[r:EE]->(e2) return r`
  const conceptQuery = `MATCH (c:CONCEPT{name:"${user}-${concept}"}) RETURN c`
  const nodes = useReadCypher(nodesQuery).records
  const edges = useReadCypher(edgesQuery).records
  const conceptObj = useReadCypher(conceptQuery)

  useEffect(() => {
    if (conceptObj.records){
    setConceptText(conceptObj.records[0].get(0).properties.text)}
  
  }, [conceptObj])

  
 
  let nodesArr:NodeObj[] = []
  if (nodes) {
    for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].get(0)
    const fullConcepts = node.properties.concepts
    const userConcepts = fullConcepts.filter((c:any)=>{
      const cArray = c.split('-')
      return cArray[0] == user
    })
    let conceptNames = userConcepts.map((c:any)=>c.split('-')[1])
    
    const node_obj = {id:node.identity.low, name:node.properties.name, group:node.labels[0], concepts: conceptNames}
    nodesArr.push(node_obj)
  }
  }

  let edgesArr:EdgeObj[] = []
  if (edges) {
    for (let i = 0; i < edges.length; i++){
      const edge = edges[i].get(0)
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
  
      <Flex align='center' borderBottom='2px blue solid' justify='center'>
        <Button id='text' width='50%' _hover={{bgColor:'blue',color:'whitesmoke'}}  borderLeftRadius='0' borderRightRadius='0'  onClick={(e)=>{setOption('text');
      }}>Text</Button>
        <Button id='concepts' width='50%' _hover={{bgColor:'blue',color:'whitesmoke'}}  borderRightRadius='0' borderLeftRadius='0'  borderLeft='2px solid blue' onClick={(e)=>{setOption('concepts');}}>Concepts</Button>
      </Flex>
      <Box display='block' overflowY='scroll' py={2} pl={3}>
  
        {option === 'text' && <Flex id='text-option'>
          <Text>{conceptText}</Text>
        </Flex>}
  
        {option === 'concepts' && 
        <Flex flexDir='column' >
          <Input size='sm' placeholder={`Search ${user} concepts`} width='95%' mb={3} onChange={(e)=>setGraphSearchTerm(e.target.value)}/>
        <List spacing={2}>
          {filteredConceptsArr.map((c:any, index)=>(<ListItem key={index} color='blue'><ListIcon as={ExternalLinkIcon} color='blue'/><Link to={`/community/${user}/${c}`} onClick={window.location.reload}>{c}</Link></ListItem>))}
        </List>
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
      setOptionsConceptsArr((node as graphNode).concepts.filter(c => c !== concept))
      setShowOptions(true)
      setNodeName((node as graphNode).name)
    }}
    
    
  />
  </Flex>
  )
}

export default CommunityGraph