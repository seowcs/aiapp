import React, { useState, useEffect, useCallback, useRef, useContext} from 'react';

import axios from 'axios';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.bubble.css'; 
import { Flex, Spacer, Text, Button, ButtonGroup, FormLabel, Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay, useDisclosure, Checkbox, useCheckbox  } from '@chakra-ui/react'
import {FocusableElement} from '@chakra-ui/utils'
import { RiUpload2Fill } from "react-icons/ri";
import background from '../assets/images/newbg.svg'
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { AuthContext } from "../context/authContext";
import Navbar from '../components/Navbar';

const Home = () => {
  const {currentUser, token, currentConcept, setCurrentConcept} = useContext(AuthContext)
  const [file, setFile] = useState<File | null>(null)
  const [parsedText, setParsedText] = useState(null)
  const [concept, setConcept] = useState<string|null>(null)
  const [privacy, setPrivacy] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement|FocusableElement>(null)

 
  const theme = 'bubble';

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
    ],
  };

  const placeholder = 'Parsed text goes here...';

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
    try {
      await axios.post('http://localhost:5000/extract',
      {'text':newText,
      'concept':concept,
      'private': privacy}, config)
    } catch (error) {
      console.log(error)
    }
    setCurrentConcept(concept)
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );



  console.log('user: ', currentUser)
  console.log('token: ', token)

  return (
    <Flex className="app" flexDir='column' align='center' width='100%' bgImg={background} bgPosition="center"
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
                <Text size={["xs", "md", "lg", "xl", "2xl"]}>Choose File</Text>
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
            >              <Text size={["xs", "md", "lg", "xl", "2xl"]}>
           
              Upload
           
          </Text></Button>     
    
      </Flex>
      
    </Flex>

  </Flex>
    
  );
  
}
    

export default Home;
