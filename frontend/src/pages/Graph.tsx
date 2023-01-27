import { useState, useEffect } from 'react';
import {useReadCypher} from 'use-neo4j'
import { types } from 'neo4j-driver'
import { ForceGraph3D } from "react-force-graph";
import { nodeModuleNameResolver } from "typescript";
import { CSS2DObject,CSS2DRenderer } from 'three-css2drenderer'
import SpriteText from "three-spritetext";
import { Divider, Flex , SlideFade, useDisclosure, Button, Text, Heading, IconButton, Box} from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons'
import Navbar from "../components/Navbar";
import Draggable from 'react-draggable';

interface NodeObj {
  id: number,
  name:string,
  group:string
}

interface EdgeObj {
  
    source: number,
    target:number,
    name: string,
    color:string
}

function Graph() {
  const [mousePos, setMousePos] = useState({x:0,y:0});
  const [offsetPos, setOffsetPos] = useState({x:0,y:0});
  const [showOptions, setShowOptions] = useState(false)
  const { isOpen, onToggle } = useDisclosure()
  
  const query1 = `MATCH (e:ENTITY) -[:EC]->(c:CONCEPT{name:'User 1-Concept 1'}) RETURN (e)`
  const query2 = `MATCH (e1:ENTITY) -[:EC]->(c:CONCEPT{name:'User 1-Concept 1'})<-[:EC]-(e2:ENTITY) MATCH (e1)-[r:EE]->(e2) return r`
  const nodes = useReadCypher(query1).records
  const edges = useReadCypher(query2).records
 
  let nodes_arr:NodeObj[] = []
  if (nodes) {
    for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].get(0)
    const node_obj = {id:node.identity.low, name:node.properties.name, group:node.labels[0]}
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
  console.log(mousePos)
  return (

  <Flex flexDirection='column' align='center'>
  <Navbar position='absolute'/>

  <Draggable onStop={((e,data)=>setOffsetPos({x:data.x, y:data.y}))}>
  <Flex flexDirection='column' position='absolute' width='250px' height='350px' bgColor='whitesmoke' 
  left={`${mousePos.x-125}px`} top={`${mousePos.y}px`} zIndex='1'
  borderRadius='10px' border='2px solid blue' transition="opacity .25s ease" opacity={showOptions ? 1 : 0} >

    <Flex align='center' borderBottom='2px blue solid'>
      <Flex width='90%' justify='center'><Heading size='md'>Name</Heading></Flex>
    <IconButton aria-label='close' size='md' icon={<CloseIcon />} borderLeft='2px solid blue'  bgColor='red' color='whitesmoke' onClick={()=>setShowOptions(false)} borderTopLeftRadius='0px' borderBottomRadius='0px'/>
    </Flex>

    <Flex align='center' borderBottom='2px blue solid'>
      <Button borderRightRadius='0'  >Text</Button>
      <Button borderRightRadius='0' borderLeftRadius='0'  borderLeft='2px solid blue'>Concepts</Button>
      <Button borderLeftRadius='0' borderLeft='2px solid blue'>Community</Button>
    </Flex>
    <Box display='block' overflowY='scroll' py={2} pl={2}>
      <Flex>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea nobis, soluta
      quasi sapiente ullam ex aut quod at corporis pariatur voluptatem. Et nobis
      dignissimos quidem sapiente in doloribus ad suscipit? Dolorum ea atque,
      aliquam quae impedit architecto cupiditate, ullam illum, aliquid hic
      debitis doloremque laudantium? Molestiae ipsa nobis voluptates accusantium
      odit aliquid molestias! Quo, odit numquam officia sunt at assumenda? Illo
      obcaecati facere ipsum eveniet, dicta, harum consequatur perspiciatis
      accusamus voluptatum, incidunt vero blanditiis amet aliquid dignissimos
      distinctio vitae corrupti ad magnam debitis nobis esse. Pariatur ducimus
      alias quo at? Necessitatibus nisi odit cupiditate neque saepe! A animi
      sunt dignissimos rerum atque similique, et accusantium, dolor pariatur
      unde nostrum saepe doloribus illo at eos suscipit neque dicta? Debitis,
      officia doloremque. Harum quaerat fugiat ullam minima quisquam unde
      reprehenderit? Ducimus, asperiores ea iure vitae officia eos, modi eius
      excepturi amet sapiente magnam! Velit id animi fuga at magnam omnis fugiat
      explicabo? Expedita fuga inventore provident! Voluptates aliquid nihil a
      quas quibusdam, tempora quis natus, reiciendis, incidunt earum in quos
      minima sit? Sed dicta nostrum itaque voluptas recusandae sit facere vero
      culpa. Quia temporibus odit et dolorem facilis pariatur voluptate quo
      itaque unde esse. Totam cumque, sapiente deleniti distinctio perferendis
      minima cum illum reprehenderit unde, perspiciatis facere ratione
      laboriosam suscipit, odio enim? Voluptates ratione numquam aperiam,
      possimus beatae odio obcaecati modi veniam repellendus doloribus
      assumenda, laborum velit dolor officiis illo dolorum mollitia eum iusto
      ipsam harum accusamus quis molestias ipsum! Assumenda, libero! Repellat,
      quam? Accusantium consequuntur facere dignissimos ratione quibusdam
      corporis? Nostrum deserunt cupiditate vitae rem laborum enim quis. Neque
      possimus perspiciatis similique sint consequatur sequi dolor, voluptate
      nobis quos ex. Ex. Illo iusto consectetur nostrum porro! Cum consectetur
      quae eaque velit. Laudantium nesciunt dignissimos cum quam eligendi
      voluptates, blanditiis assumenda eum aliquid consequatur mollitia modi
      praesentium minima nulla tenetur, repudiandae facilis.
      </Flex>
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
    console.log(node,mousePos)
    setShowOptions(true)
  }}
  
  
/>
</Flex>
  );
}

export default Graph;