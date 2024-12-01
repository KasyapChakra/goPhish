import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Text,
  Anchor,
  Paper,
} from '@mantine/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/auth/register', {
        username,
        password,
      });
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <Container
      fluid
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '20px',
      }}
    >
      <Paper
        withBorder
        shadow="sm"
        p={40}
        radius="md"
        style={{
          width: '100%',
          maxWidth: 500, // Increase max width of the form container
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
        }}
      >
        <Title
          order={1}
          align="center"
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1b1e',
            marginBottom: '8px',
          }}
        >
          Create Account - GoPhish
        </Title>
        <br />

        <form
          onSubmit={handleSubmit}
          style={{
            textAlign: 'left',
          }}
        >
          <TextInput
            label="Username"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            required
            size="md"
            style={{
              width: '100%', // Make the input field take the full width
            }}
            styles={{
              label: {
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '6px',
                color: '#334155',
                textAlign: 'left', // Align the label to the left
              },
              input: {
                border: 'none',
                borderBottom: '2px solid #e2e8f0', // Only bottom border
                borderRadius: 0,
                width: '100%',
                transition: 'border-color 0.3s ease',
                '&:focus': {
                  borderBottomColor: '#3b82f6', // Highlight bottom border on focus
                  boxShadow: 'none',
                },
              },
            }}
          />
          <br />
          <TextInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            size="md"
            styles={{
              label: {
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '6px',
                color: '#334155',
                textAlign: 'left', // Align the label to the left
              },
              input: {
                border: 'none',
                borderBottom: '2px solid #e2e8f0', // Only bottom border
                borderRadius: 0,
                width: '100%', // Make the input field take the full width
                transition: 'border-color 0.3s ease',
                '&:focus': {
                  borderBottomColor: '#3b82f6', // Highlight bottom border on focus
                  boxShadow: 'none',
                },
              },
              innerInput: {
                height: '40px',
              },
            }}
          />
          <br />

          <Button
            fullWidth
            size="md"
            type="submit"
            style={{
              backgroundColor: '#634FA2',
              height: '42px', // Make the button taller
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '16px', // Slightly larger font size for readability
              color: 'white', // Make text white
              border: 'none', // Remove border around button
              transition: 'background-color 0.2s ease',
              marginBottom: '16px', // Add more padding below the button
              width: '100%', // Make the button full width
            }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: '#634FA2',
                },
              },
            }}
          >
            Register
          </Button>
        </form>

        <Text align="center" mt={24} size="sm" style={{ color: '#64748b' }}>
          Already have an account?{' '}
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate('/login')}
            style={{
              color: '#3b82f6',
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Back to Login
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}

export default Register;
