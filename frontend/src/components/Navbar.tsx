import React,{useContext} from 'react'
import {Flex,Text,Link} from '@chakra-ui/react'
import { AuthContext } from '../context/authContext'
import { useNavigate } from "react-router";

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
          <Text color='whitesmoke'>GraphNet</Text>
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
                </Flex>
        }

        
        
      </Flex>
  )
}

export default Navbar