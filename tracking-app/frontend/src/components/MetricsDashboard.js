import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Badge,
  Hide,
  Show,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import axios from 'axios';

function MetricsDashboard() {
  const [pageViews, setPageViews] = useState([]);
  const [stats, setStats] = useState({});
  const [campaigns, setCampaigns] = useState({});
  const toast = useToast();

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('blue.600', 'blue.300');
  const statBg = useColorModeValue('blue.50', 'blue.900');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/track/pageview');
      const data = response.data;
      setPageViews(data);

      // Group data by campaign
      const campaignData = data.reduce((acc, view) => {
        if (!acc[view.campaign_id]) {
          acc[view.campaign_id] = {
            views: [],
            totalViews: 0,
            purchaseClicks: 0,
            emailEntries: 0,
            passwordEntries: 0,
            conversionRate: 0,
          };
        }
        acc[view.campaign_id].views.push(view);
        acc[view.campaign_id].totalViews++;
        if (view.clicked_purchase) acc[view.campaign_id].purchaseClicks++;
        if (view.entered_email) acc[view.campaign_id].emailEntries++;
        if (view.entered_password) acc[view.campaign_id].passwordEntries++;
        
        // Calculate conversion rate based on full funnel completion (password entered)
        acc[view.campaign_id].conversionRate = 
          ((acc[view.campaign_id].passwordEntries / acc[view.campaign_id].totalViews) * 100).toFixed(2);
        
        return acc;
      }, {});

      setCampaigns(campaignData);

      // Calculate overall stats
      const totalViews = data.length;
      const totalPurchaseClicks = data.filter(view => view.clicked_purchase).length;
      const totalEmailEntries = data.filter(view => view.entered_email).length;
      const totalPasswordEntries = data.filter(view => view.entered_password).length;
      const overallConversion = totalViews > 0 ? (totalPasswordEntries / totalViews) * 100 : 0;

      setStats({
        totalViews,
        purchaseClicks: totalPurchaseClicks,
        emailEntries: totalEmailEntries,
        passwordEntries: totalPasswordEntries,
        conversionRate: overallConversion.toFixed(2),
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleResetCampaign = async (campaignId) => {
    try {
      await axios.delete(`http://localhost:8000/track/campaign/${campaignId}`);
      toast({
        title: "Campaign Reset",
        description: `Successfully reset tracking data for campaign: ${campaignId}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset campaign tracking data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} p={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box bg={headerBg} p={6} borderRadius="lg" color="white">
            <Heading size="xl">Phishing Campaign Metrics</Heading>
            <Text mt={2}>Real-time tracking dashboard</Text>
          </Box>

          <Grid templateColumns={{
            base: "1fr",
            base: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)", 
            lg: "repeat(5, 1fr)", 
            xl: "repeat(6, 1fr)" 
          }} gap={4}>
            {Object.entries(stats).map(([key, value]) => (
              <GridItem key={key}>
                <Box bg={statBg} p={4} borderRadius="md" boxShadow="sm" height="100%">
                  <Stat>
                    <StatLabel fontSize="lg" textTransform="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </StatLabel>
                    <StatNumber fontSize="3xl">
                      {key.includes('Rate') ? `${value}%` : value}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      Last 30 days
                    </StatHelpText>
                  </Stat>
                </Box>
              </GridItem>
            ))}
          </Grid>

          <Accordion allowMultiple>
            {Object.entries(campaigns).map(([campaignId, campaign]) => (
              <AccordionItem key={campaignId} border="1px" borderColor={borderColor} borderRadius="md" mb={4}>
                <AccordionButton bg={bgColor} p={4}>
                  <Box flex="1">
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Heading size="md">{campaignId}</Heading>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetCampaign(campaignId);
                          }}
                        >
                          <Hide below="sm">Reset Campaign</Hide>
                          <Show below="sm">Reset</Show>
                        </Button>
                      </HStack>
                      <HStack justify="space-between" align="center">
                        <Box overflowX="auto">
                          <HStack spacing={4} wrap="wrap" gap={2}>
                            <Badge colorScheme="blue">Views: {campaign.totalViews}</Badge>
                            <Badge colorScheme="yellow">Clicks: {campaign.purchaseClicks}</Badge>
                            <Badge colorScheme="green">Emails: {campaign.emailEntries}</Badge>
                            <Badge colorScheme="red">Passwords: {campaign.passwordEntries}</Badge>
                            <Badge colorScheme="purple">Conversion: {campaign.conversionRate}%</Badge>
                          </HStack>
                        </Box>
                        <AccordionIcon />
                      </HStack>
                    </VStack>
                  </Box>
                </AccordionButton>
                <AccordionPanel bg={bgColor}>
                  <Box 
                    overflowX="auto" 
                    maxH="50vh" 
                    overflowY="auto" 
                    position="relative"
                    sx={{
                      '&::-webkit-scrollbar': {
                        width: '8px',
                        borderRadius: '8px',
                        backgroundColor: `rgba(0, 0, 0, 0.05)`,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: `rgba(0, 0, 0, 0.1)`,
                        borderRadius: '8px',
                      },
                    }}
                  >
                    <Table variant="simple" size="sm">
                      <Thead position="sticky" top={0} bg={bgColor} zIndex={1}>
                        <Tr>
                          <Th>Timestamp</Th>
                          <Th>Email</Th>
                          <Th>Clicked Purchase</Th>
                          <Th>Entered Email</Th>
                          <Th>Entered Password</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {campaign.views.map((view) => (
                          <Tr key={view.id}>
                            <Td>{new Date(view.timestamp).toLocaleString()}</Td>
                            <Td>{view.captured_pennkey || '-'}</Td>
                            <Td>
                              <Badge colorScheme={view.clicked_purchase ? "green" : "red"}>
                                {view.clicked_purchase ? "Yes" : "No"}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme={view.entered_email ? "green" : "red"}>
                                {view.entered_email ? "Yes" : "No"}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme={view.entered_password ? "green" : "red"}>
                                {view.entered_password ? "Yes" : "No"}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      </Container>
    </Box>
  );
}

export default MetricsDashboard; 