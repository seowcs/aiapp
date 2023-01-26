import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import {Neo4jProvider, createDriver} from 'use-neo4j'
import { AuthContextProvider } from './context/authContext';
const driver = createDriver('bolt', '54.173.227.28', 7687, 'neo4j', 'purpose-accessories-crowds')

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

