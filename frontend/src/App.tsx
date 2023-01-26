import './App.css';
import Home from './pages/Home'
import Graph from './pages/Graph'
import Register from './pages/Register'
import Login from './pages/Login';
import UserGraph from './pages/UserGraph';
import GraphsPage from './pages/GraphsPage';
import Community from './pages/Community';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
  // import ReactFlow, { Background, Controls } from 'reactflow';

const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
  {
    path:'/register',
    element: <Register/>
  },
  {
    path:'/login',
    element: <Login/>
  },
  {path:'/graphs',
  element: <GraphsPage/>},
  {
    path:'/graphs/all',
    element: <UserGraph/>
  },
  {
    path:"/graphs/:concept",
    element:<Graph/>,
  },
  {
    path:'/community',
    element: <Community/>
  }
  ]);


const App = () => {
  return (
    <div>
        <RouterProvider router={router}/>
    </div>
  )
}

export default App