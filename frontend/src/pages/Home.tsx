import React, { useState, useEffect, useCallback, useRef, useContext} from 'react';

import axios from 'axios';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.bubble.css'; 
import { Flex, Text, Button,FormLabel, Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay, useDisclosure, Checkbox,  Heading, Spinner  } from '@chakra-ui/react'
import {FocusableElement} from '@chakra-ui/utils'
import { RiUpload2Fill } from "react-icons/ri";
import background from '../assets/images/newbg.svg'
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { AuthContext } from "../context/authContext";
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const {currentUser, token} = useContext(AuthContext)
  const [file, setFile] = useState<File | null>(null)
  const [parsedText, setParsedText] = useState(null)
  const [concept, setConcept] = useState<string|null>(null)
  const [privacy, setPrivacy] = useState(false)
  const [uploadValue, setUploadValue] = useState(<Text size={["xs", "md", "lg", "xl", "2xl"]}>
           
  Upload

</Text>)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement|FocusableElement>(null)
  const navigate = useNavigate()
 
  const theme = 'bubble';

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
    ],
  };

  const placeholder = 'Text goes here...';

  const formats = ['bold', 'italic', 'underline', 'strike'];

  const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder });

  const makeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files) return;
    const file = e.target.files[0];
    setFile(file);
    console.log(file);
  }

  const uploadFile = async (e:React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (file != null) {
      const data = new FormData();
      data.append('file_from_react', file);
      console.log(data);
      try {
        const response = await axios.post('http://localhost:5000/image', data);
        setParsedText(response.data.text);
        console.log(parsedText)
        return response 
      } catch (err) {
        console.log(err)
        return err
    }
  }
  else 
  onOpen();
  };

  useEffect(() => {
    if (parsedText && quill) {
      quill.clipboard.dangerouslyPasteHTML(`<p>${parsedText}</p>`);
    }
  }, [quill, parsedText]);
  
  const config = {
    headers: {'Authorization': `Bearer ${token}`}
  }

  const sendText = async () =>{
    const newText = quill.getText();
    console.log(newText);
    setUploadValue(<Spinner/>)
    try {
      await axios.post('http://localhost:5000/extract',
      {'text':newText,
      'concept':concept,
      'private': privacy}, config)
    } catch (error) {
      console.log(error)
    }
    
    navigate(`/graphs/${concept}`)
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      
    },
    []
  );

  return (
    <Flex className="app" flexDir='column' align='center' minHeight='100vh' width='100%' bgImg={background} bgPosition="center"
    bgRepeat="no-repeat"
    bgSize="cover">
              <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              "particles": {
                "number": {
                  "value": 200,
                  "density": {
                    "enable": true,
                    "value_area": 868.0624057955
                  }
                },
                "color": {
                  "value": "#aaaaaa"
                },
                "shape": {
                  "type": "circle",
                  "stroke": {
                    "width": 1,
                    "color": "#ffffff"
                  },
                },
                "opacity": {
                  "value": 0.2,
                  "random": false,
                  "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.05,
                    "sync": false
                  }
                },
                "size": {
                  "value": 3,
                  "random": true,
                  "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                  }
                },
                "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#ffffff",
                  "opacity": 0.1,
                  "width": 1
                },
                "move": {
                  "enable": true,
                  "speed": 1,
                  "direction": "none",
                  "random": false,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                  }
                }
              },
              "interactivity": {
                "detect_on": "canvas",
                "events": {
                  "onhover": {
                    "enable": true,
                    "mode": "repulse"
                  },
                  "onclick": {
                    "enable": true,
                    "mode": "push"
                  },
                  "resize": true
                },
                "modes": {
                  "grab": {
                    "distance": 400,
                    "line_linked": {
                      "opacity": 1
                    }
                  },
                  "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                  },
                  "repulse": {
                    "distance": 200,
                    "duration": 0.4
                  },
                  "push": {
                    "particles_nb": 4
                  },
                  "remove": {
                    "particles_nb": 2
                  }
                }
              },
              "retina_detect": true
            }}
        />
      

      <Navbar/>
      
      
      
      {currentUser != null && 
      <>
      <Heading mt={6} size='2xl' color='whitesmoke'><span style={{color:'hsl(285, 100%, 70%)'}}>G</span>raph<span style={{color:'hsl(285, 100%, 70%)'}}>N</span>et</Heading>
      <Flex align='flex-start' mt='60px' w='90%' justifyContent='center'>

        <Flex justify='center' mr='75px'>
      <Flex className='button-grp' flexDir='column' w='30%' align='center'>
      <Button
              _hover={{
                bg: "whitesmoke",
                borderColor: "black",
                color: "black",
              }}
              justifyContent="center"
              alignSelf="center"
              variant="outline"
              color="whitesmoke"
              border="2px"
              borderColor="whitesmoke"
              textAlign="center"
              size="2xl"
              px={[6, 6, 6, 8]}
              py={[2, 3, 4]}
              rightIcon={<RiUpload2Fill />}
              mb='5'
            >
              <FormLabel
                cursor="pointer"
                htmlFor="textfile"
                textAlign="center"
                m="0"
              >
                <Text size={["xs", "md", "lg", "xl", "2xl"]}>Choose Image</Text>
              </FormLabel>
            </Button>
    <input
    hidden 
    name="textdoc"
    id="textfile"
      type="file"
      onChange={makeFile}
      >
    </input>

    <Button    
    justifyContent="center"
    alignSelf="center"
              bg="blue"
              color="whitesmoke"
              variant="solid"
              size="2xl"
              px={[4, 6, 6, 10]}
              py={[1, 1, 2]}
              mx="0"
              border="2px"
              borderColor="#1F51FF"
              mb='5'
            >
              <Text size={["xs", "md", "lg", "xl", "2xl"]}>
                <FormLabel htmlFor="submit" m="2">
                  Convert to Text
                </FormLabel>
              </Text>
    <input hidden id='submit' type="submit" onClick={uploadFile} />
    </Button>
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Field Empty
            </AlertDialogHeader>

            <AlertDialogBody>
            Please upload a file.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme='red' onClick={onClose} ml={3}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>  
    </Flex>
    
    </Flex>
    

      <Flex className='textbox' flexDir='column'>
      <Input placeholder='Concept Title' mb={5} variant='flushed' _placeholder={{color:'whitesmoke', fontWeight:500}} 
      onChange={(e)=>setConcept(e.target.value)} color='whitesmoke'/>
      <div style={{ width: 650, height: '500px', background:'white', borderRadius:'2%'}}>
      <div ref={quillRef} />
      
    </div>
    <Checkbox size='lg' color='whitesmoke' onChange={(e)=>setPrivacy(e.target.checked)} mt={5}>Private</Checkbox>
    
    <Button    
    justifyContent="center"
    alignSelf="center"
              bg="green"
              color="whitesmoke"
              variant="solid"
              size="2xl"
              px={[6, 6, 6, 10]}
              py={[2, 3, 4]}
              mx="0"
              mt='5'
              mb={8}
              border="2px"
              borderColor="#39FF14"
              onClick={sendText}

            >              {uploadValue}</Button>     
    
      </Flex>
      
    </Flex>
    </>}

    {currentUser == null && 
    <Flex  flexDir='column'  align='center' justify='center' >
    <Heading mt='100px' size='3xl' color='whitesmoke'><span style={{color:'hsl(285, 100%, 70%)'}}>G</span>raph<span style={{color:'hsl(285, 100%, 70%)'}}>N</span>et</Heading>
    <Flex flexDir='column' align='center'>
      <Heading my={8} size='xl' color='whitesmoke' opacity='0.9' textShadow='-2px 2px hsl(285, 100%, 70%)' >Discover the connections you never knew</Heading>
      <Link to='/register' ><Button    
    justifyContent="center"
    alignSelf="center"
              bg="blue"
              color="whitesmoke"
              variant="solid"
              size="2xl"
              px={[6, 6, 6, 10]}
              py={[2, 3, 4]}
              mx="0"
              mt={4}
              mb={4}
              border="2px"
              borderColor="#1F51FF"
              
            >              <Text size={["xs", "md", "lg", "xl", "2xl"]}>
           
              Register
           
          </Text></Button> </Link>

          <Link to='/login'>
          <Button    
    justifyContent="center"
    alignSelf="center"
              bg="green"
              color="whitesmoke"
              variant="solid"
              size="2xl"
              px={[6, 6, 6, 10]}
              py={[2, 3, 4]}
              mx="0"
              mt={4}
              mb={8}
              border="2px"
              borderColor="#39FF14"
              
            >              <Text size={["xs", "md", "lg", "xl", "2xl"]}>
           
              Login
           
          </Text></Button>
          </Link> 
    </Flex>
    </Flex>
    }

  </Flex>
    
  );
  
}
    

export default Home;
