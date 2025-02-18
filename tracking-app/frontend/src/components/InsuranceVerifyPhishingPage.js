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
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Divider,
  Link,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import axios from 'axios';

function InsuranceVerifyPhishingPage() {
  const toast = useToast();
  const [pageViewId, setPageViewId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  // Track pageview on mount
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const response = await axios.post('http://localhost:8000/track/pageview', {
          campaign_id: "upenn-insurance-12-01-2024",
          page_type: "insurance",
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

  // Track "password entered" when user logs in
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (pageViewId) {
      try {
        await axios.put(`http://localhost:8000/track/pageview/${pageViewId}/password-entered`);
      } catch (error) {
        console.error('Error tracking password entry:', error);
      }
    }
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Phishing Test Complete",
        description: "This was a simulated phishing test. Never enter your credentials on unofficial sites.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }, 1500);
  };

  // Track "email entered" when user types username
  const handleUsernameChange = async (e) => {
    const username = e.target.value;
    setCredentials({ ...credentials, username });
    if (username && pageViewId) {
      try {
        await axios.put(`http://localhost:8000/track/pageview/${pageViewId}/email-entered`, null, {
          params: { pennkey: username }
        });
      } catch (error) {
        console.error('Error tracking email entry:', error);
      }
    }
  };

  return (
    <Box 
      bg="#e8f0fa" // Light background similar to MyChart’s overall look
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      {/* Header Bar */}
      <Box py={4} px={6} bg="#fff" boxShadow="sm">
        <HStack spacing={4}>
          <Image
            src="/Penn_Medicine_and_University_of_Pennsylvania_Health_System_logo.svg.png" 
            alt="Penn Medicine"
            h="40px"
          />
        </HStack>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" flex="1" py={8}>
        <Grid 
          templateColumns={["1fr", "1fr", "1fr 1fr"]}
          gap={8}
          bg="white"
          p={[4, 8]}
          borderRadius="md"
          boxShadow="md"
        >
          {/* Left side: Info text & bullet points */}
          <GridItem>
            <VStack align="start" spacing={5}>
              <Image
                src="/MyChartPennlogo.png" 
                alt="MyChart Logo"
                h="100px"
                ml="-7"
              />
              <Text fontSize="md" color="gray.700">
                MyChart by myPennMedicine is a simple, secure way to manage your health care and access your medical 
                information from your personal computer or mobile device.
              </Text>
              <VStack align="start" spacing={2} fontSize="sm" color="gray.700">
                <Text>• Manage appointments</Text>
                <Text>• Access medical information</Text>
                <Text>• Contact your providers</Text>
                <Text>• Renew your prescriptions</Text>
                <Text>• Pay your bill</Text>
                <Text>• Share your record</Text>
              </VStack>
              <Text fontSize="sm" color="gray.500" mt="10">
                Want to learn more? Go to{" "}
                <Link color="#00538B" href="https://www.mypennmedicine.org">
                  myPennMedicine.org
                </Link>.
              </Text>
            </VStack>
          </GridItem>

          {/* Right side: Login form in a style closer to the screenshot */}
          <GridItem>
            <Box
              bg="#f9f9f9"
              p={[4, 6]}
              borderRadius="md"
              boxShadow="sm"
              border="1px solid #ccc"
            >
              <form onSubmit={handleLogin}>
                <VStack spacing={4} align="stretch">
                  {/* The label "MyChart by myPennMedicine Username" from screenshot */}
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.700"
                      mb={1}
                    >
                      MyChart by myPennMedicine Username
                    </FormLabel>
                    <Input
                      placeholder="Enter your username"
                      value={credentials.username}
                      onChange={handleUsernameChange}
                      bg="white"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.700"
                      mb={1}
                    >
                      Password
                    </FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                      }
                      bg="white"
                    />
                  </FormControl>

                  {/* Green Sign In button */}
                  <Button
                    type="submit"
                    colorScheme="green"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign in
                  </Button>

                  {/* Forgot links in small text */}
                  <HStack justify="space-between" fontSize="sm" color="#00538B">
                    <Link href="https://www.mypennmedicine.org">
                      Forgot username?
                    </Link>
                    <Link href="https://www.mypennmedicine.org">
                      Forgot password?
                    </Link>
                  </HStack>

                  <Divider my={3} />

                  {/* New user? Activate an account */}
                  <HStack justify="space-between" fontSize="sm" color="gray.700">
                    <Text>New user?</Text>
                    <Button
                      as={Link}
                      href="https://www.mypennmedicine.org"
                      variant="outline"
                      colorScheme="blue"
                      size="sm"
                    >
                      Activate an account
                    </Button>
                  </HStack>
                </VStack>
              </form>

              <Divider my={5} />

              {/* Insurance notice */}
              <Box fontSize="sm" color="gray.600">
                <Text fontWeight="semibold">Insurance Verification</Text>
                <Text>
                  Please sign in to confirm your student insurance plan. Your coverage must be 
                  verified to ensure no interruptions in benefits.
                </Text>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Container>

      {/* Footer */}
      <Box bg="white" py={4} borderTop="1px solid #ccc">
        <Container maxW="container.xl">
          <Flex 
            justify="space-between" 
            align="center" 
            fontSize="sm" 
            color="gray.600"
            wrap="wrap"
          >
            <HStack spacing={3} mb={[2, 0]}>
              <Link href="https://www.mypennmedicine.org">
                Frequently Asked Questions
              </Link>
              <Text>|</Text>
              <Link href="https://www.mypennmedicine.org">
                Contact Us
              </Link>
              <Text>|</Text>
              <Link href="https://www.mypennmedicine.org">
                Terms & Conditions
              </Link>
              <Text>|</Text>
              <Link href="https://www.mypennmedicine.org">
                Privacy Policy
              </Link>
            </HStack>
            <Text>© 2025 Penn Medicine. All rights reserved.</Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default InsuranceVerifyPhishingPage;
