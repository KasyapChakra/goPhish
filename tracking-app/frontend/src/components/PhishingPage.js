import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  useToast,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  useDisclosure,
  Divider,
  Link,
} from '@chakra-ui/react';
import axios from 'axios';

const PhishingPage = () => {
  const toast = useToast();
  const [pageViewId, setPageViewId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [credentials, setCredentials] = useState({
    pennkey: '',
    password: '',
  });

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/track/pageview`, {
          campaign_id: "upenn-tech-bundle-12-01-2024",
          page_type: "upenn",
          user_email: "unknown",
          ip_address: "127.0.0.1",
          timestamp: new Date().toISOString(),
        });
        setPageViewId(response.data.id);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };
    trackPageView();
  }, []);

  const handlePurchase = async () => {
    // Track purchase button click
    if (pageViewId) {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/track/pageview/${pageViewId}/purchase-click`);
      } catch (error) {
        console.error('Error tracking purchase click:', error);
      }
    }
    onOpen();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Track password entered
    if (pageViewId) {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/track/pageview/${pageViewId}/password-entered`);
      } catch (error) {
        console.error('Error tracking password entry:', error);
      }
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      toast({
        title: "Phishing Test Complete",
        description: "This was a simulated phishing test. Never enter your PennKey credentials on unofficial sites.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }, 1500);
  };

  const handlePennKeyChange = async (e) => {
    const pennkey = e.target.value;
    setCredentials({ ...credentials, pennkey });

    // Track email entered if there's a value
    if (pennkey && pageViewId) {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/track/pageview/${pageViewId}/email-entered`, null, {
          params: { pennkey }
        });
      } catch (error) {
        console.error('Error tracking email entry:', error);
      }
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box bg="#011F5B" py={4}>
        <Container maxW="container.xl">
          <HStack spacing={4} color="white">
            <Image
              src="/Penn Logo.svg"
              alt="UPenn Logo"
              h="40px"
            />
            <Heading size="md" color="white" fontStyle="italic" fontFamily="Times New Roman" fontWeight="normal">Student Life</Heading>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="xl" color="#011F5B" mb={4}>
              Special Access: Student Technology Bundle
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Exclusive offer for Penn students! Get your essential academic software bundle at a discounted rate.
            </Text>
          </Box>

          <Box bg="gray.50" p={6} borderRadius="md" shadow="md">
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="#011F5B">
                Premium Student Package
              </Heading>
              <Text>✓ Microsoft Office Professional Plus</Text>
              <Text>✓ Adobe Creative Cloud Complete</Text>
              <Text>✓ MATLAB Student Edition</Text>
              <Text>✓ Anti-virus Protection</Text>
              <Text fontWeight="bold" fontSize="xl" color="#011F5B">
                Special Price: $49.99
              </Text>
              <Button
                size="lg"
                bg="#990000"
                color="white"
                _hover={{ bg: '#7B0000' }}
                onClick={handlePurchase}
              >
                Purchase Now
              </Button>
              <Text fontSize="sm" color="gray.500">
                *Limited time offer. Login with your PennKey required at checkout.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* PennKey Login Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Image
                src="/Penn Logo.svg"
                alt="UPenn Logo"
                h="30px"
              />
              <Text>PennKey Login</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleLogin}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>PennKey</FormLabel>
                  <Input
                    placeholder="Enter your PennKey"
                    value={credentials.pennkey}
                    onChange={handlePennKeyChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                  </InputGroup>
                </FormControl>

                <Divider />

                <Button
                  width="100%"
                  bg="#011F5B"
                  color="white"
                  _hover={{ bg: '#011F5B' }}
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Verifying..."
                >
                  Login to Continue
                </Button>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  By logging in, you agree to the terms of service and privacy policy.
                </Text>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Footer */}
      <Box bg="#011F5B" color="white" py={4} mt={8}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Text fontSize="sm">© <Link href="https://www.upenn.edu/" color="white">University of Pennsylvania</Link></Text>
            <HStack spacing={4} fontSize="sm">
              <Text><Link href="https://www.upenn.edu/privacy" color="white">Privacy Policy</Link></Text>
              <Text><Link href="https://www.upenn.edu/about/disclaimer" color="white">Terms of Use</Link></Text>
              <Text><Link href="https://www.upenn.edu/about/contact" color="white">Contact</Link></Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default PhishingPage; 