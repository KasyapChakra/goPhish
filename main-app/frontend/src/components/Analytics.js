import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Paper,
  Button,
  Grid,
  Group,
  Badge,
  Box,
  Accordion,
  Table,
  ScrollArea,
  Notification,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

function Analytics() {
  const [pageViews, setPageViews] = useState([]);
  const [stats, setStats] = useState({});
  const [campaigns, setCampaigns] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/track/pageview`);
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/track/campaign/${campaignId}`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error resetting campaign:', error);
    }
  };

  return (
    <Container size="xl" mt="md">
      <Paper p="xl" radius="md" bg="#634FA2" mb="xl">
        <Title order={1} c="white">Phishing Campaign Metrics</Title>
        <Text c="white" mt="xs">Real-time tracking dashboard</Text>
      </Paper>

      <Grid>
        {Object.entries(stats).map(([key, value]) => (
          <Grid.Col key={key} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Paper p="md" radius="md" withBorder>
              <Stack>
                <Text size="lg" tt="capitalize" fw={500}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text size="xl" fw={700}>
                  {key.includes('Rate') ? `${value}%` : value}
                </Text>
                <Text size="sm" c="dimmed">Last 30 days</Text>
              </Stack>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <Accordion mt="xl" variant="separated">
        {Object.entries(campaigns).map(([campaignId, campaign]) => (
          <Accordion.Item key={campaignId} value={campaignId}>
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap">
                <Box>
                  <Text fw={500}>{campaignId}</Text>
                  <Group gap="xs" mt="xs">
                    <Badge color="blue">Views: {campaign.totalViews}</Badge>
                    <Badge color="yellow">Clicks: {campaign.purchaseClicks}</Badge>
                    <Badge color="green">Emails: {campaign.emailEntries}</Badge>
                    <Badge color="red">Passwords: {campaign.passwordEntries}</Badge>
                    <Badge color="grape">Conversion: {campaign.conversionRate}%</Badge>
                  </Group>
                </Box>
                <Button 
                  color="red" 
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetCampaign(campaignId);
                  }}
                >
                  Reset Campaign
                </Button>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <ScrollArea h={300}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Timestamp</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Clicked Purchase</Table.Th>
                      <Table.Th>Entered Email</Table.Th>
                      <Table.Th>Entered Password</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {campaign.views.map((view) => (
                      <Table.Tr key={view.id}>
                        <Table.Td>{new Date(view.timestamp).toLocaleString()}</Table.Td>
                        <Table.Td>{view.captured_pennkey || '-'}</Table.Td>
                        <Table.Td>
                          <Badge color={view.clicked_purchase ? "green" : "red"}>
                            {view.clicked_purchase ? "Yes" : "No"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={view.entered_email ? "green" : "red"}>
                            {view.entered_email ? "Yes" : "No"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={view.entered_password ? "green" : "red"}>
                            {view.entered_password ? "Yes" : "No"}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}

export default Analytics; 