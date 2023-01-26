import { useState, useEffect } from 'react';
import {useReadCypher} from 'use-neo4j'
import { types } from 'neo4j-driver'
import { ForceGraph3D } from "react-force-graph";
import { nodeModuleNameResolver } from "typescript";
import { CSS2DObject,CSS2DRenderer } from 'three-css2drenderer'
import SpriteText from "three-spritetext";
import { Divider, Flex , SlideFade, useDisclosure, Button} from "@chakra-ui/react";
import Navbar from "../components/Navbar";


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
  const [showOptions, setShowOptions] = useState(false)
  const { isOpen, onToggle } = useDisclosure()
  
  const {Record} = types
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
  return (

  <Flex flexDirection='column' align='center'>
  <Navbar position='absolute'/>
  
  <Flex position='absolute' width='250px' height='350px' bgColor='whitesmoke' 
  left={`${mousePos.x-125}px`} top={`${mousePos.y}px`} zIndex='1'
  borderRadius='10px' border='2px solid blue' transition="opacity .25s ease" opacity={showOptions ? 1 : 0} >
    <Button onClick={()=>setShowOptions(false)}>X</Button>
  </Flex>
  

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
    setMousePos({'x':e.clientX,'y':e.clientY})
    console.log(node,mousePos)
    setShowOptions(true)
  }}
  
  
/>
</Flex>
  );
}

export default Graph;