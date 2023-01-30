import React,{useContext} from 'react'
import {Flex,Text,Link, Icon} from '@chakra-ui/react'
import { AuthContext } from '../context/authContext'
import { useNavigate } from "react-router";
import {FaUserCircle, FaUser} from 'react-icons/fa'
const Navbar = ({position}:any) => {
  const {currentUser, logout} = useContext(AuthContext)

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    const toHome =()=> navigate('/')
    setTimeout(toHome,500);
  }

  return (
    <Flex className='navbar' w='95%' bg='rgba(0 , 0, 0, 0.5 )' boxShadow='0 8px 32px 0 rgba( 31, 38, 135, 0.37 );'
      blur='10.5px' borderRadius='10px' border='1px solid rgba( 255, 255, 255, 0.18 )'
      mt='5' py='3' px='5' justify='space-between' zIndex='2' position={position}>
        <Flex>
          <Text  fontWeight='600'  color='hsl(285, 100%, 70%)' >GraphNet</Text>
        </Flex>
        {!currentUser &&
        <Flex w='40%' justify='space-between'>  
        <Link href='/'><Text fontWeight='500' color='whitesmoke'  _hover={{color:'lightgray'}}>Home</Text></Link>
        <Link href='/community'><Text fontWeight='500' color='whitesmoke'  _hover={{color:'lightgray'}}>Community</Text></Link>
        <Link href='/register'><Text fontWeight='500' color='whitesmoke'  _hover={{color:'lightgray'}}>Register</Text></Link>
        <Link href='/login'><Text fontWeight='500' color='whitesmoke' _hover={{color:'lightgray'}}>Login</Text></Link>
        </Flex>
        }
        {currentUser &&
                <Flex w='40%' justify='space-between'>  
                <Link href='/'><Text fontWeight='500' color='whitesmoke'  _hover={{color:'lightgray'}}>Home</Text></Link>
                <Link href='/graphs'><Text fontWeight='500' color='whitesmoke'  _hover={{color:'lightgray'}}>Graphs</Text></Link>
                <Link href='/community'><Text fontWeight='500' color='whitesmoke'  _hover={{color:'lightgray'}}>Community</Text></Link>
                <Text cursor='pointer' fontWeight='500' color='whitesmoke' _hover={{color:'lightgray'}} onClick={handleLogout}>Logout</Text>
                <Flex align='center'><Icon as={FaUser} boxSize={4} mr={2} color='whitesmoke'/><Text color='hsl(285, 100%, 70%)'>{currentUser}</Text></Flex>
                </Flex>
        }

        
        
      </Flex>
  )
}

export default Navbar