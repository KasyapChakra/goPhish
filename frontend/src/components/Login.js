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

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(''); // Error state for username
  const [passwordError, setPasswordError] = useState(''); // Error state for password
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("HERE")

    // Reset error messages
    setUsernameError('');
    setPasswordError('');

    try {
        console.log("HERE")
      const response = await axios.post('http://localhost:8000/auth/login', {
        username,
        password,
      });
      console.log("RESP ", response)
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
        console.log("HERE1")
      if (error.response && error.response.status === 400) {
        console.log("HERE")
        // Handle error response based on the error fields
        setPasswordError('Invalid username or password');
      }
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
          Sign in to GoPhish
        </Title>
        <br />

        <form
          onSubmit={handleSubmit}
          style={{
            textAlign: 'center',
          }}
        >
          <TextInput
            label="Username"
            placeholder="Enter your username"
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
                marginBottom: '10px',
                color: '#334155',
                textAlign: 'left', // Align the label to the left
              },
              input: {
                fontFamily: 'Inter, sans-serif', // Set the font to Inter
                border: 'none',
                borderBottom: '2px solid #e2e8f0', // Only bottom border
                borderRadius: 0,
                marginTop: '10px',
                width: '80%',
                transition: 'border-color 0.3s ease',
                '&:focus': {
                  borderBottomColor: '#3b82f6', // Highlight bottom border on focus
                  boxShadow: 'none',
                },
              },
            }}
          />
          {usernameError && (
            <Text color="red" size="sm" style={{ marginTop: '5px' }}>
              {usernameError}
            </Text>
          )}
          <br />
          <TextInput
            label="Password"
            placeholder="Enter your password"
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
                fontFamily: 'Inter, sans-serif', // Set the font to Inter
                border: 'none',
                borderBottom: '2px solid #e2e8f0', // Only bottom border
                borderRadius: 0,
                marginTop: '10px',
                width: '80%', // Make the input field take the full width
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
          {passwordError && (
            <Text size="sm" style={{ marginTop: '5px', color: 'red',}}>
              {passwordError}
            </Text>
          )}
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
              width: '80%', // Make the button full width
            }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: '#634FA2',
                },
              },
            }}
          >
            Sign in
          </Button>
        </form>

        <Text align="center" mt={24} size="sm" style={{ color: '#64748b' }}>
          Don't have an account?{' '}
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate('/create-account')}
            style={{
              color: '#3b82f6',
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Create an account
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}

export default Login;
