import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MetricsDashboard from './components/MetricsDashboard';
import PhishingPage from './components/PhishingPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PhishingPage />,
  },
  {
    path: "/metrics",
    element: <MetricsDashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
