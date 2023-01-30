import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import {Neo4jProvider, createDriver} from 'use-neo4j'
import { AuthContextProvider } from './context/authContext';
const driver = createDriver('neo4j+s', '2db082e7.databases.neo4j.io', 7687, 'neo4j', 'seowcsneo4j')

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Neo4jProvider driver={driver}>
    <ChakraProvider>
     <AuthContextProvider>
     <App />
     </AuthContextProvider> 
    </ChakraProvider>
    </Neo4jProvider>

  </React.StrictMode>
);

