import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

ReactDOM.render(
  <MantineProvider>
    <App />
  </MantineProvider>,
  document.getElementById('root')
);