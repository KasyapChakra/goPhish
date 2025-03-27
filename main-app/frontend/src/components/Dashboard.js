import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Text, Grid, Paper, Button, Modal } from '@mantine/core';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import CreateCampaignModal from './CreateCampaignModal.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [username, setUsername] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub);
    }
  }, [navigate]);

  const clickThroughData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Time Spent on Fake Site (s)',
        data: [35, 30, 25, 20, 15, 10],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const openRateData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Open Rate (%)',
        data: [50, 45, 40, 35, 30, 25],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const replyRateData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Reply Rate (%)',
        data: [80, 45, 25, 15, 8, 5],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const resourceExtractionData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Resource Extraction Rate (%)',
        data: [10, 7, 5, 3, 2, 1],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Data over time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: '#634FA2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          height: '60px',
        }}
      >
        <Text size="xl" weight={700} style={{ color: 'white', fontSize: '24px' }}>
          GoPhish
        </Text>
        <Text size="xl" weight={700} style={{ color: 'white', fontSize: '15px' }}>
          Welcome, {username}
        </Text>
      </div>

      {/* Main Content Container */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          style={{
            width: '250px',
            backgroundColor: '#634FA2',
            flexShrink: 0,
          }}
        >
          {['Home', 'Analytics', 'Settings'].map((tab) => (
            <Paper
              key={tab}
              withBorder
              shadow={0}
              style={{
                padding: '10px 0',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                backgroundColor: tab === 'Home'? '#483973' : 'transparent',
                borderRadius: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#483973')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => {
                if (tab === 'Analytics') {
                  navigate('/analytics');
                } else if (tab === 'Home') {
                  navigate('/dashboard');
                }
              }}
            >
              <Text size="md" align="left" style={{ paddingLeft: '20px', color: 'white' }}>
                {tab}
              </Text>
            </Paper>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '20px', overflow: 'auto', backgroundColor: '#f8f9fa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="xl" weight={700} style={{ color: 'black', fontSize: '24px' }}>
              Campaigns Overview
            </Text>
            <Button
            fullWidth
            size="md"
            type="submit"
            onClick={() => setModalOpened(true)}
            color='violet'
            style={{
              height: '42px', // Make the button taller
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '15px', // Slightly larger font size for readability
              color: 'white', // Make text white
              border: 'none', // Remove border around button
              transition: 'background-color 0.2s ease',
              width: '20%', // Make the button full width
            }}
          >
            + New Campaign
          </Button>
        
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <Paper withBorder shadow="sm" p="md">
              <Text size="lg" weight={500} align="center" mb="md">
                Time Spent on Fake Site
              </Text>
              <Bar data={clickThroughData} options={options} />
            </Paper>

            <Paper withBorder shadow="sm" p="md">
              <Text size="lg" weight={500} align="center" mb="md">
                Phishing Open Rates
              </Text>
              <Bar data={openRateData} options={options} />
            </Paper>

            <Paper withBorder shadow="sm" p="md">
              <Text size="lg" weight={500} align="center" mb="md">
                Reply Rates
              </Text>
              <Bar data={replyRateData} options={options} />
            </Paper>

            <Paper withBorder shadow="sm" p="md">
              <Text size="lg" weight={500} align="center" mb="md">
                Resource Extraction Rates
              </Text>
              <Bar data={resourceExtractionData} options={options} />
            </Paper>
          </div>
        </div>
      </div>

      <CreateCampaignModal opened={modalOpened} onClose={() => setModalOpened(false)} />
    </div>
  );
}

export default Dashboard;
