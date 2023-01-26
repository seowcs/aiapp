import { ChangeEvent, useState, useContext } from "react";
import background from "../assets/images/newbg.svg";
import {
  Flex,
  VStack,
  Center,
  Heading,
  Input,
  Link,
  Text,
  Button,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/authContext";

const Register = () => {
  const [input, setInput] = useState({
    username: '',
    password: '',
  });
  const [ error, setError ] = useState<string|null>(null);

  const navigate = useNavigate();
  const {currentUser, token, login} = useContext(AuthContext)
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
 
  const handleClick = async (e: any) => {
    if (input.username === ''){
      setError("Username is required");
    }
    else if (input.password === ''){
      setError("Password is required");
    }

    else {
      e.preventDefault();
    try {
      login(input)
      console.log(currentUser,token)
      const toHome =()=> navigate('/')
      setTimeout(toHome,500);
    } catch (error) {
      console.log(error);
    }
    }
    
  };

  console.log(input);

  return (
    <Center
      bgImage={background}
      width="100%"
      height="100vh"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      <Flex
        direction="column"
        bgColor="rgba( 0, 0, 0, 0.3 )"
        alignSelf="center"
        boxShadow="0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"
        backdropBlur="6px"
        borderRadius="10px"
        border="1px solid rgba( 255, 255, 255, 0.18 )"
        width={["70%", "60%", "50%", "42%", "35%"]}
        px="45px"
        py="100px"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Link href="/">
          <ArrowBackIcon color='lightgray' boxSize={6} position="absolute" top="4%" left="3%" />
        </Link>
        <Heading color='whitesmoke' mb={6}>Login</Heading>
        <VStack spacing="15px">
          <Input
          bgColor='whitesmoke'
            variant="solid"
            minWidth="120%"
            onChange={handleChange}
            placeholder="Username"
            name="username"
          />
          <Input
          bgColor='whitesmoke'
            type="password"
            variant="solid"
            width="120%"
            name="password"
            onChange={handleChange}
            placeholder="Password"
          />


          <Text color='lightgray' fontSize={["xs", "sm"]}>
            Don't have an account?{" "}
            <Link color="royalblue" href="/register">
              Sign Up
            </Link>
          </Text>
          {error && <Text color='red' fontSize={["xs", "sm"]}>{error}</Text>}

          <Button
            
            bgColor="green"
            color="whitesmoke"
            border='2px solid #39FF14'
            onClick={handleClick}
          >
            Log In
          </Button>
        </VStack>
      </Flex>
    </Center>
  );
};

export default Register;