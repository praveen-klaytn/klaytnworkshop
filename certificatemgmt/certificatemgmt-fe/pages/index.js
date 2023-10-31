import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Card, 
  CardHeader,
  CardBody, 
  CardFooter,
  SimpleGrid, 
  Heading, 
  Button,
  Text,
  Input,
  Box,
  Flex,
  useColorModeValue,
  useBreakpointValue,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const BASE_URL = "http://localhost:3001";
const inter = Inter({ subsets: ['latin'] })

const fileTypes = ["PDF"];

function DragDrop(props) {
  const handleChange = (file) => {
    props.setFile(file);
  };
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default function Home() {
  const [certifiedTo, setCertifiedTo] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [score, setScore] = useState('');
  const [certifiedBy, setCertifiedBy] = useState('Klaytn Foundation');

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const [ isRegister, setIsRegister ] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const [resCertifiedTo, setResCertifiedTo] = useState('');
  const [resRollNumber, setResRollNumber] = useState('');
  const [resScore, setResScore] = useState('');
  const [resCertifiedBy, setResCertifiedBy] = useState('');
  const [file, setFile] = useState(null);

  const registerCertificate = async () => {
    setTransactionHash('');
    debugger;
    const rawResponse = await fetch(`${BASE_URL}/api/certificates`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({certifiedTo, rollNumber, score, certifiedBy})
    });
    const content = await rawResponse.json();

    var link = document.createElement('a');
    link.href = `${BASE_URL}/static/${content.data.file}`;
    link.target = '_blank';
    link.download = `${content.data.file}`;
    link.dispatchEvent(new MouseEvent('click'));
    setTransactionHash(content.data.transactionHash || '');
    setIsRegister(true);
    onOpen(true);
    setCertifiedTo('');
    setRollNumber('');
    setScore('');
  }

  const verifyCertificate = async () => {
    debugger;
    console.log(file);
    const reader = new FileReader();

    reader.onload = function (e) {
        const fileData = e.target.result;
        const arrayBuffer = new Uint8Array(fileData);
        crypto.subtle.digest("SHA-256", arrayBuffer).then(async function (hashBuffer) {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            console.log(hashHex)
            const rawResponse = await fetch(`${BASE_URL}/api/certificates/verify`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({certificateHash: hashHex})
            });
            const content = await rawResponse.json();
            setIsRegister(false);
            onOpen(true);
            if(content && content.data && content.data.eventData) {
              setResCertifiedTo(content.data.eventData.certifiedTo);
              setResRollNumber(content.data.eventData.rollNumber);
              setResScore(content.data.eventData.score);
              setResCertifiedBy(content.data.eventData.certifiedBy);
            } else {
              setResCertifiedTo('');
              setResRollNumber('');
              setResScore('');
              setResCertifiedBy('');
            }
            
        });
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <>
      <Head>
        <title>Klaytn Workshop</title>
        <meta name="description" content="Klaytn Workshop" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://metaverse-knowledge-kit.klaytn.foundation/img/klaytn.png" />
      </Head>
      <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Image src='https://metaverse-knowledge-kit.klaytn.foundation/img/klaytn.png' width="6" height="6" alt='Dan Abramov' />
            &nbsp;&nbsp;
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              fontWeight={600}
              color={useColorModeValue('gray.800', 'white')}>
              Klaytn Workshop
            </Text>
            <Text
              style={{marginLeft: 650}}
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              fontWeight={600}
              fontSize={20}
              color={useColorModeValue('gray.800', 'white')}>
              E-Cert
            </Text>
          </Flex>
        </Flex>
      </Box>
      <main className={`${styles.main} ${inter.className}`}>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(1000px, 1fr))'>
        <Card>
          <CardHeader>
            <Heading size='md'>Register Certificate</Heading>
          </CardHeader>
          <CardBody>
            <Input placeholder='Certificate To' value={certifiedTo} onChange={evt => setCertifiedTo(evt.target.value) } style={{marginBottom: 10}}/>
            <Input placeholder='Roll Number' value={rollNumber} onChange={evt => setRollNumber(evt.target.value) } style={{marginBottom: 10}}/>
            <Input placeholder='Score' value={score} onChange={evt => setScore(evt.target.value) } style={{marginBottom: 10}}/>
            <Input placeholder='Certified By' disabled value={certifiedBy} style={{marginBottom: 10}}/>
          </CardBody>
          <CardFooter>
            <Button onClick={registerCertificate}>Register</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size='md'> Verify Certificate</Heading>
          </CardHeader>
          <CardBody>
            <DragDrop setFile={setFile}/>
          </CardBody>
          <CardFooter>
            <Button onClick={verifyCertificate}>Verify</Button>
          </CardFooter>
        </Card>
      </SimpleGrid>
      </main>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Status
            </AlertDialogHeader>

            { 
              isRegister && <AlertDialogBody>
                Registered certificate <a style={{color: 'blue'}} href={`https://baobab.scope.klaytn.com/tx/${transactionHash}`} target="_blank">{transactionHash}</a>
              </AlertDialogBody>
            }
            {
              !isRegister && <AlertDialogBody>
                <Text style={{fontWeight: 600, fontSize: 30}}>
                  { resCertifiedTo ?
                    "Verified ✅":
                    "Not Verified ❌"
                  }
                </Text>
                
                <Text>
                  <b>Certified Holder</b>  : {resCertifiedTo}
                </Text>
                <Text>
                  <b>Roll Number</b> : {resRollNumber}
                </Text>
                <Text>
                  <b>Score</b> : {resScore}
                </Text>
                <Text>
                  <b>Certified By</b> : {resCertifiedBy}
                </Text>
              </AlertDialogBody> 

            }

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}